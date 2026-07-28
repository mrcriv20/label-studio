// One set of bwip-js options for both processes so the barcode drawn on the
// editor canvas is the same raster that lands in the PDF. Each side supplies
// its own bwip-js entry point (node toBuffer vs browser toCanvas).

export interface BwipOptions {
  bcid: 'code128'
  text: string
  scale: number
  height: number
  includetext: boolean
  textxalign: 'center'
  barcolor: string
  textcolor: string
}

export function designBarcodeOptions(value: string, showText: boolean, colorHex: string): BwipOptions {
  const color = colorHex.replace('#', '') || '000000'
  return {
    bcid: 'code128',
    text: value,
    scale: 3,
    height: 10,
    includetext: showText,
    textxalign: 'center',
    barcolor: color,
    textcolor: color,
  }
}
