export interface LabelTemplateDefinition {
  id: string
  name: string
  layout: 'front' | 'info' | 'vertical-info' | 'logo-only'
  width: number
  height: number
  shellColor: string
  borderColor: string
  panelColor: string
  topImageColor: string
  textColor: string
  infoPanelColor?: string
}

export const LABEL_WIDTH = 181
export const LABEL_HEIGHT = 289
export const INFO_LABEL_WIDTH = 289
export const INFO_LABEL_HEIGHT = 181

export const LABEL_ZONES = {
  topImage: { x: 10, y: 169, w: 161, h: 104 },
  contentPanel: { x: 10, y: 10, w: 161, h: 145 },
  name: { x: 20, y: 92, w: 141, h: 42 },
  price: { x: 26, y: 54, w: 129, h: 24 },
  barcode: { x: 30, y: 14, w: 121, h: 30 },
} as const

export const INFO_LABEL_ZONES = {
  topImage: { x: 12, y: 84, w: 132, h: 85 },
  leftName: { x: 16, y: 48, w: 124, h: 26 },
  leftPrice: { x: 26, y: 18, w: 104, h: 18 },
  infoPanel: { x: 150, y: 10, w: 126, h: 161 },
  infoText: { x: 156, y: 36, w: 114, h: 126 },
  barcode: { x: 184, y: 12, w: 58, h: 28 },
} as const

export const VERTICAL_INFO_LABEL_ZONES = {
  topImage: { x: 10, y: 166, w: 161, h: 108 },
  contentPanel: { x: 10, y: 10, w: 161, h: 150 },
  title: { x: 20, y: 95, w: 141, h: 44 },
  cookingTitle: { x: 20, y: 66, w: 141, h: 16 },
  cookingBody: { x: 18, y: 28, w: 145, h: 34 },
} as const

export const LOGO_ONLY_LABEL_ZONES = {
  topImage: { x: 18, y: 86, w: 145, h: 120 },
} as const

const BUILT_IN_TEMPLATES: LabelTemplateDefinition[] = [
  {
    id: 'avery5821',
    name: 'Base Label',
    layout: 'front',
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    shellColor: '#f5efdc',
    borderColor: '#efe6c8',
    panelColor: '#ffffff',
    topImageColor: '#ffffff',
    textColor: '#1b2733',
  },
  {
    id: 'soft-sage',
    name: 'Soft Sage',
    layout: 'front',
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    shellColor: '#edf1e7',
    borderColor: '#d9e2d0',
    panelColor: '#ffffff',
    topImageColor: '#ffffff',
    textColor: '#223127',
  },
  {
    id: 'info-card',
    name: 'Info Label',
    layout: 'info',
    width: INFO_LABEL_WIDTH,
    height: INFO_LABEL_HEIGHT,
    shellColor: '#f6f2df',
    borderColor: '#1b2733',
    panelColor: '#f6f2df',
    topImageColor: '#ffffff',
    textColor: '#1b2733',
    infoPanelColor: '#ffffff',
  },
  {
    id: 'vertical-instructions',
    name: 'Vertical Instructions',
    layout: 'vertical-info',
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    shellColor: '#f6f2df',
    borderColor: '#efe6c8',
    panelColor: '#ffffff',
    topImageColor: '#ffffff',
    textColor: '#1b2733',
  },
  {
    id: 'logo-only',
    name: 'Logo Only',
    layout: 'logo-only',
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    shellColor: '#ffffff',
    borderColor: '#ffffff',
    panelColor: '#ffffff',
    topImageColor: '#ffffff',
    textColor: '#1b2733',
  },
]

export function getLabelTemplates(): Array<{ id: string; name: string }> {
  return BUILT_IN_TEMPLATES.map(({ id, name }) => ({ id, name }))
}

export function getLabelTemplate(templateId?: string | null): LabelTemplateDefinition {
  return BUILT_IN_TEMPLATES.find((template) => template.id === templateId) ?? BUILT_IN_TEMPLATES[0]
}

export function toPercentX(value: number, width = LABEL_WIDTH): string {
  return `${(value / width) * 100}%`
}

export function toPercentWidth(value: number, width = LABEL_WIDTH): string {
  return `${(value / width) * 100}%`
}

export function toPercentHeight(value: number, height = LABEL_HEIGHT): string {
  return `${(value / height) * 100}%`
}

export function toPercentTop(y: number, zoneHeight = 0, canvasHeight = LABEL_HEIGHT): string {
  return `${((canvasHeight - y - zoneHeight) / canvasHeight) * 100}%`
}

export function svgYFromBottom(y: number, height = 0, canvasHeight = LABEL_HEIGHT): number {
  return canvasHeight - y - height
}
