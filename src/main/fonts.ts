import { app } from 'electron'
import { execFileSync } from 'child_process'
import { createHash } from 'crypto'
import { basename, extname, join } from 'path'
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { getAvenirNextCondensedFontPath, getGentyRegularFontPath, getLoraBoldFontPath } from './fileManager'

export interface FontAsset {
  id: string
  family: string
  source: 'bundled' | 'system' | 'local' | 'upload' | 'google'
  path: string
}

const fontDir = (): string => join(app.getPath('userData'), 'fonts')
const catalogPath = (): string => join(fontDir(), 'catalog.json')

function customFonts(): FontAsset[] {
  try {
    return JSON.parse(readFileSync(catalogPath(), 'utf8')) as FontAsset[]
  } catch {
    return []
  }
}

function bundledFonts(): FontAsset[] {
  return [
    { id: 'bundled:lora', family: 'Lora', source: 'bundled', path: getLoraBoldFontPath() },
    { id: 'bundled:genty', family: 'Genty Demo', source: 'bundled', path: getGentyRegularFontPath() },
    { id: 'bundled:avenir', family: 'Avenir Next Condensed', source: 'bundled', path: getAvenirNextCondensedFontPath() },
  ]
}

export function initFonts(): void {
  mkdirSync(fontDir(), { recursive: true })
}

export function listFonts(): FontAsset[] {
  const fonts = [...bundledFonts(), ...systemFonts(), ...customFonts()]
    .filter((font) => existsSync(font.path))
    .sort((a, b) => {
      const sourceOrder = sourceRank(a.source) - sourceRank(b.source)
      return sourceOrder || a.family.localeCompare(b.family)
    })

  const seen = new Set<string>()
  return fonts.filter((font) => {
    const key = `${font.source}:${font.family.toLowerCase()}:${font.path.toLowerCase()}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function getFont(id: string): FontAsset | null {
  return listFonts().find((font) => font.id === id) ?? null
}

export function fontDataUri(id: string): string {
  const font = getFont(id)
  if (!font) return ''
  const extension = extname(font.path).toLowerCase()
  const mime = extension === '.woff2' ? 'font/woff2' : extension === '.woff' ? 'font/woff' : extension === '.otf' ? 'font/otf' : 'font/ttf'
  return `data:${mime};base64,${readFileSync(font.path).toString('base64')}`
}

export function importFont(sourcePath: string, source: 'local' | 'upload' = 'upload'): FontAsset {
  const extension = extname(sourcePath).toLowerCase()
  if (!['.ttf', '.otf', '.woff', '.woff2'].includes(extension)) throw new Error('Choose a TTF, OTF, WOFF, or WOFF2 font file.')
  const family = basename(sourcePath, extension).replace(/[-_]+/g, ' ').replace(/\b(regular|bold|medium|semibold|italic)\b/gi, '').trim()
  const id = `${source}:${Date.now()}`
  const path = join(fontDir(), `${id.replace(':', '-')}${extension}`)
  copyFileSync(sourcePath, path)
  const asset: FontAsset = { id, family, source, path }
  writeCatalog([...customFonts(), asset])
  return asset
}

export async function addGoogleFont(family: string): Promise<FontAsset> {
  const cleanFamily = family.trim()
  if (!cleanFamily) throw new Error('Enter a Google Fonts family name.')
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanFamily).replace(/%20/g, '+')}:wght@400;700`
  const cssResponse = await fetch(cssUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!cssResponse.ok) throw new Error(`Google Fonts returned ${cssResponse.status}. Check the family name and internet connection.`)
  const css = await cssResponse.text()
  const urls = [...css.matchAll(/url\((https:\/\/[^)]+)\)/g)].map((match) => match[1])
  if (!urls.length) throw new Error('Google Fonts did not return a usable font file.')
  const fontResponse = await fetch(urls[urls.length - 1])
  if (!fontResponse.ok) throw new Error(`Could not download the Google font (${fontResponse.status}).`)
  const remoteExtension = extname(new URL(urls[urls.length - 1]).pathname).toLowerCase()
  const extension = ['.ttf', '.otf', '.woff', '.woff2'].includes(remoteExtension) ? remoteExtension : '.woff2'
  const id = `google:${Date.now()}`
  const path = join(fontDir(), `${id.replace(':', '-')}${extension}`)
  writeFileSync(path, Buffer.from(await fontResponse.arrayBuffer()))
  const asset: FontAsset = { id, family: cleanFamily, source: 'google', path }
  writeCatalog([...customFonts(), asset])
  return asset
}

function systemFonts(): FontAsset[] {
  const candidates = new Map<string, FontAsset>()
  for (const dir of systemFontDirs()) {
    for (const fontPath of listFontFiles(dir)) {
      const family = familyFromFilename(fontPath)
      if (!family) continue
      const key = family.toLowerCase()
      const current = candidates.get(key)
      const asset: FontAsset = {
        id: `system:${stableId(fontPath)}`,
        family,
        source: 'system',
        path: fontPath,
      }
      if (!current || scoreSystemFont(fontPath) > scoreSystemFont(current.path)) candidates.set(key, asset)
    }
  }
  return [...candidates.values()]
}

function systemFontDirs(): string[] {
  const dirs = new Set<string>()
  const home = app.getPath('home')
  if (process.platform === 'win32') {
    if (process.env.WINDIR) dirs.add(join(process.env.WINDIR, 'Fonts'))
    if (process.env.LOCALAPPDATA) dirs.add(join(process.env.LOCALAPPDATA, 'Microsoft', 'Windows', 'Fonts'))
  } else if (process.platform === 'darwin') {
    dirs.add('/Library/Fonts')
    dirs.add('/System/Library/Fonts')
    dirs.add(join(home, 'Library', 'Fonts'))
  } else {
    dirs.add('/usr/local/share/fonts')
    dirs.add('/usr/share/fonts')
    dirs.add(join(home, '.local', 'share', 'fonts'))
  }
  return [...dirs].filter((dir) => existsSync(dir))
}

function listFontFiles(dir: string, depth = 0): string[] {
  if (depth > 2) return []
  try {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) return listFontFiles(path, depth + 1)
      const extension = extname(entry.name).toLowerCase()
      return ['.ttf', '.otf', '.woff', '.woff2'].includes(extension) ? [path] : []
    })
  } catch {
    return []
  }
}

function familyFromFilename(fontPath: string): string {
  const registered = process.platform === 'win32'
    ? windowsFontNameMap().get(basename(fontPath).toLowerCase())
    : ''
  if (registered) return registered

  return basename(fontPath, extname(fontPath))
    .replace(/[-_]+/g, ' ')
    .replace(/\b(variable|vf|regular|roman|normal|book|text|display|bold|black|heavy|light|thin|medium|semibold|demibold|extrabold|italic|oblique|condensed|narrow)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

let cachedWindowsFontNameMap: Map<string, string> | null = null

function windowsFontNameMap(): Map<string, string> {
  if (cachedWindowsFontNameMap) return cachedWindowsFontNameMap
  const map = new Map<string, string>()
  for (const hive of ['HKLM', 'HKCU']) {
    try {
      const output = execFileSync('reg', ['query', `${hive}\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts`], {
        encoding: 'utf8',
        windowsHide: true,
      })
      for (const line of output.split(/\r?\n/)) {
        const match = line.match(/^\s*(.+?)\s+REG_\w+\s+(.+?)\s*$/)
        if (!match) continue
        const fileName = basename(match[2].trim()).toLowerCase()
        const family = match[1]
          .replace(/\s*\([^)]*\)\s*$/g, '')
          .replace(/\b(regular|roman|normal|book|text|display|bold|black|heavy|light|thin|medium|semibold|demibold|extrabold|italic|oblique|condensed|narrow)\b/gi, ' ')
          .replace(/\s+/g, ' ')
          .trim()
        if (fileName && family && !map.has(fileName)) map.set(fileName, family)
      }
    } catch {
      // Registry access is best-effort; filename-derived families still work.
    }
  }
  cachedWindowsFontNameMap = map
  return map
}

function scoreSystemFont(fontPath: string): number {
  const name = basename(fontPath).toLowerCase()
  let score = 0
  if (/\bregular\b|(^|[-_\s])r(\.|[-_\s]|$)/i.test(name)) score += 20
  if (!/(bold|black|heavy|light|thin|medium|semi|demi|extra|italic|oblique|condensed|narrow)/i.test(name)) score += 10
  if (extname(name) === '.ttf') score += 4
  if (extname(name) === '.otf') score += 3
  return score
}

function stableId(value: string): string {
  return createHash('sha1').update(value).digest('hex').slice(0, 12)
}

function sourceRank(source: FontAsset['source']): number {
  return source === 'bundled' ? 0 : source === 'system' ? 1 : source === 'google' ? 2 : source === 'local' ? 3 : 4
}

function writeCatalog(fonts: FontAsset[]): void {
  writeFileSync(catalogPath(), JSON.stringify(fonts, null, 2), 'utf8')
}
