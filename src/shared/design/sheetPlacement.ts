/** Preserve authored dimensions (PDF points) and orientation within a sheet slot. */
export function designSheetPlacement(width: number, height: number, slotWidth: number, slotHeight: number) {
  const scale = Math.min(1, slotWidth / width, slotHeight / height)
  const drawWidth = width * scale
  const drawHeight = height * scale
  return { width: drawWidth, height: drawHeight, x: (slotWidth - drawWidth) / 2, y: (slotHeight - drawHeight) / 2 }
}
