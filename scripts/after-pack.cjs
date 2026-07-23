const { execFileSync } = require('node:child_process')
const path = require('node:path')

/**
 * Apple Silicon requires every native executable to carry a structurally valid
 * signature. When no Developer ID is installed, electron-builder otherwise
 * leaves the bundle with Electron's partial linker signatures, which Gatekeeper
 * rejects as a damaged/unsafe bundle. A complete ad-hoc signature is sufficient
 * for local and internally transferred builds (but is not notarization).
 */
module.exports = async function afterPack(context) {
  if (context.electronPlatformName !== 'darwin') return

  const appPath = path.join(
    context.appOutDir,
    `${context.packager.appInfo.productFilename}.app`
  )

  execFileSync(
    '/usr/bin/codesign',
    ['--force', '--deep', '--sign', '-', '--timestamp=none', appPath],
    { stdio: 'inherit' }
  )
}
