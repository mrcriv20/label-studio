#!/usr/bin/env node
/**
 * Converts label-template.eps to a 300 DPI PNG using Ghostscript.
 * Run once during development setup: npm run convert-template
 * Requires: gs (Ghostscript) to be installed (brew install ghostscript)
 */
const { execSync } = require('child_process')
const { existsSync } = require('fs')
const { join } = require('path')

const epsPath = join(__dirname, '../assets/label-template.eps')
const pngPath = join(__dirname, '../assets/label-template-300dpi.png')

if (!existsSync(epsPath)) {
  console.error('ERROR: label-template.eps not found in assets/')
  process.exit(1)
}

if (existsSync(pngPath)) {
  console.log('Template PNG already exists:', pngPath)
  process.exit(0)
}

try {
  const cmd = [
    'gs',
    '-dBATCH',
    '-dNOPAUSE',
    '-dSAFER',
    '-sDEVICE=png16m',
    '-r300',
    '-dEPSCrop',
    `-sOutputFile=${pngPath}`,
    epsPath,
  ].join(' ')

  console.log('Converting EPS → PNG at 300 DPI…')
  execSync(cmd, { stdio: 'inherit' })
  console.log('✓ Template PNG created:', pngPath)
} catch (err) {
  console.error('Conversion failed. Is Ghostscript installed? (brew install ghostscript)')
  console.error(err.message)
  process.exit(1)
}
