import type { AppSettings, FontAsset } from '../types'

export function installFonts(fonts: FontAsset[]): void {
  document.querySelectorAll('style[data-label-font]').forEach((node) => node.remove())
  for (const font of fonts) {
    const style = document.createElement('style')
    style.dataset.labelFont = font.id
    style.textContent = `@font-face{font-family:"LabelFont-${css(font.id)}";src:url("${font.dataUri}");font-style:normal;font-weight:100 900;font-display:swap}`
    document.head.appendChild(style)
  }
}

export function applyFontSettings(settings: AppSettings): void {
  document.documentElement.style.setProperty('--label-title-font', `"LabelFont-${css(settings.titleFontId)}", Georgia, serif`)
  document.documentElement.style.setProperty('--label-price-font', `"LabelFont-${css(settings.priceFontId)}", Georgia, serif`)
  document.documentElement.style.setProperty('--label-body-font', `"LabelFont-${css(settings.bodyFontId)}", Arial, sans-serif`)
}

export function fontFamilyFor(id: string): string {
  return `"LabelFont-${css(id)}", Arial, sans-serif`
}

function css(value: string): string {
  return value.replace(/[^a-z0-9_-]/gi, '-')
}
