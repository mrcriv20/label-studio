export const PLS_780 = {
  id: 'pls780',
  name: 'Premium Label Supply PLS780',
  pageWidthIn: 8.5,
  pageHeightIn: 11,
  labelWidthIn: 2.5,      // portrait label width / landscape slot height
  labelHeightIn: 4,       // portrait label height / landscape slot width
  labelsPerSheet: 8,
  columns: 2,
  rows: 4,
  marginTopIn: 0.5,
  marginLeftIn: 0.15625,
  horizontalGapIn: 0.1875,
  verticalGapIn: 0,
} as const

export const POINTS_PER_INCH = 72

export function slotPosition(slot: number): { col: number; row: number } {
  const idx = slot - 1
  return { col: idx % PLS_780.columns, row: Math.floor(idx / PLS_780.columns) }
}

export function fillSlots(startSlot: number, count: number): number[] {
  const slots: number[] = []
  for (let i = 0; i < count && slots.length + startSlot - 1 <= PLS_780.labelsPerSheet; i++) {
    const slot = startSlot + i
    if (slot > PLS_780.labelsPerSheet) break
    slots.push(slot)
  }
  return slots
}

export const PLS_780_SLOT_WIDTH_IN = PLS_780.labelHeightIn
export const PLS_780_SLOT_HEIGHT_IN = PLS_780.labelWidthIn

export function toInches(value: string | number | null | undefined): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  const parsed = Number.parseFloat(String(value ?? '').trim())
  return Number.isFinite(parsed) ? parsed : 0
}

export function getSlotBoundsIn(
  slot: number,
  offsetXIn = 0,
  offsetYIn = 0,
): {
  leftIn: number
  topIn: number
  widthIn: number
  heightIn: number
} {
  const { col, row } = slotPosition(slot)
  return {
    leftIn: PLS_780.marginLeftIn + col * (PLS_780_SLOT_WIDTH_IN + PLS_780.horizontalGapIn) + offsetXIn,
    topIn: PLS_780.marginTopIn + row * (PLS_780_SLOT_HEIGHT_IN + PLS_780.verticalGapIn) + offsetYIn,
    widthIn: PLS_780_SLOT_WIDTH_IN,
    heightIn: PLS_780_SLOT_HEIGHT_IN,
  }
}

export function getSheetLayoutPoints(offsetXIn = 0, offsetYIn = 0): {
  pageW: number
  pageH: number
  slotW: number
  slotH: number
  marginLeft: number
  marginTop: number
  gapX: number
  gapY: number
  offsetX: number
  offsetY: number
  cols: number
  rows: number
} {
  return {
    pageW: PLS_780.pageWidthIn * POINTS_PER_INCH,
    pageH: PLS_780.pageHeightIn * POINTS_PER_INCH,
    slotW: PLS_780_SLOT_WIDTH_IN * POINTS_PER_INCH,
    slotH: PLS_780_SLOT_HEIGHT_IN * POINTS_PER_INCH,
    marginLeft: PLS_780.marginLeftIn * POINTS_PER_INCH,
    marginTop: PLS_780.marginTopIn * POINTS_PER_INCH,
    gapX: PLS_780.horizontalGapIn * POINTS_PER_INCH,
    gapY: PLS_780.verticalGapIn * POINTS_PER_INCH,
    offsetX: offsetXIn * POINTS_PER_INCH,
    offsetY: offsetYIn * POINTS_PER_INCH,
    cols: PLS_780.columns,
    rows: PLS_780.rows,
  }
}
