import { app } from 'electron'
import { basename, extname, join } from 'path'
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { getAvenirNextCondensedFontPath, getGentyRegularFontPath, getLoraBoldFontPath } from './fileManager'

export interface FontAsset {
  id: string
  family: string
  source: 'bundled' | 'local' | 'upload' | 'google'
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
  return [...bundledFonts(), ...customFonts()].filter((font) => existsSync(font.path))
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

function writeCatalog(fonts: FontAsset[]): void {
  writeFileSync(catalogPath(), JSON.stringify(fonts, null, 2), 'utf8')
}
