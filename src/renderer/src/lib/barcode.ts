/** Generate a 12-digit internal store barcode value. */
export function generateBarcodeValue(): string {
  const num = Math.floor(Math.random() * 900000000000) + 100000000000
  return String(num)
}

/** Format a barcode value for display (split into groups). */
export function formatBarcodeDisplay(value: string): string {
  if (value.length === 12) {
    return `${value[0]} ${value.slice(1, 6)} ${value.slice(6, 11)} ${value[11]}`
  }
  return value
}
