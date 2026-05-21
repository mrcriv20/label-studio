/**
 * Avery 5821 sheet layout constants.
 *
 * Physical reality:
 *   Label template: 181 × 289 pt portrait (2.514" × 4.014")
 *   For 8 labels on US Letter (8.5" × 11"), labels are placed LANDSCAPE:
 *     slot width  = 4" = 288 pt
 *     slot height = 2.5" = 180 pt
 *     2 columns × 4 rows = 8 labels
 *     left margin = 0.25" = 18 pt
 *     top margin  = 0.5"  = 36 pt
 *     no gaps between slots
 *
 * NOTE: The printed label is rotated 90° within each slot.
 * The PDF export handles this rotation; the sheet preview shows
 * landscape thumbnails of the label.
 */

export const AVERY_5821 = {
  pageWidthIn: 8.5,
  pageHeightIn: 11,
  labelWidthIn: 2.5,        // portrait width (or slot height in landscape)
  labelHeightIn: 4,         // portrait height (or slot width in landscape)
  labelsPerSheet: 8,
  columns: 2,
  rows: 4,
  marginTopIn: 0.5,
  marginLeftIn: 0.25,
  horizontalGapIn: 0,
  verticalGapIn: 0,
} as const

/** Returns the (col, row) 0-indexed position for a slot number 1-8. */
export function slotPosition(slot: number): { col: number; row: number } {
  const idx = slot - 1
  return { col: idx % AVERY_5821.columns, row: Math.floor(idx / AVERY_5821.columns) }
}

/** Returns slot numbers 1-8 filled from startSlot for a given count. */
export function fillSlots(
  startSlot: number,
  count: number
): number[] {
  const slots: number[] = []
  for (let i = 0; i < count && slots.length + startSlot - 1 <= 8; i++) {
    const slot = startSlot + i
    if (slot > 8) break
    slots.push(slot)
  }
  return slots
}
