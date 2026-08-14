import type { Product } from '../main/types'
import { getLabelTemplate } from './labelTemplates'

export type ContentFitStatus = 'fits' | 'tight' | 'clipped'

export interface ContentFitIssue {
  field: keyof Product
  label: string
  status: Exclude<ContentFitStatus, 'fits'>
  message: string
}

export interface OutputEligibilityIssue extends ContentFitIssue {
  productId?: string
  productName: string
  slot?: number
}

function wrappedLineCount(value: string, maxChars: number): number {
  const words = value.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return 0
  let lines = 1
  let current = 0
  for (const word of words) {
    const next = current ? current + 1 + word.length : word.length
    if (next <= maxChars) current = next
    else {
      lines += Math.max(1, Math.ceil(word.length / maxChars))
      current = word.length % maxChars
    }
  }
  return lines
}

function lineIssue(
  field: keyof Product,
  label: string,
  value: string,
  maxChars: number,
  maxLines: number,
): ContentFitIssue | null {
  const lines = wrappedLineCount(value, maxChars)
  if (lines > maxLines) {
    return { field, label, status: 'clipped', message: `${label} needs about ${lines} lines; this label prints ${maxLines}.` }
  }
  if (lines === maxLines && value.trim().length > maxChars * (maxLines - 0.35)) {
    return { field, label, status: 'tight', message: `${label} is close to the printable limit.` }
  }
  return null
}

/**
 * Conservative fit guard for the fixed built-in label zones. The limits mirror
 * the fixed export layouts and intentionally warn before text is truncated.
 * Reusable Designer templates auto-fit their own text frames and are reviewed
 * on the Designer canvas instead.
 */
export function assessProductContentFit(product: Partial<Product>): ContentFitIssue[] {
  const template = getLabelTemplate(product.templateId)
  if (product.templateId?.startsWith('design-') || template.layout === 'logo-only') return []

  const issues: Array<ContentFitIssue | null> = []
  const name = product.name?.trim() ?? ''

  if (template.layout === 'front' || product.templateId?.startsWith('custom-')) {
    issues.push(lineIssue('name', 'Product name', name, name.length > 30 ? 24 : 20, 3))
    if (product.showPrice !== false && (product.price?.trim().length ?? 0) > 14) {
      issues.push({ field: 'price', label: 'Price', status: 'clipped', message: 'Price is too long for the printable price line.' })
    } else if (product.showPrice !== false && (product.price?.trim().length ?? 0) > 10) {
      issues.push({ field: 'price', label: 'Price', status: 'tight', message: 'Price is close to the printable limit.' })
    }
  }

  if (template.layout === 'vertical-info') {
    issues.push(lineIssue('name', 'Product name', name, 20, 3))
    if (product.showCookingInstructions !== false) {
      issues.push(lineIssue('cookingInstructions', 'Cooking instructions', product.cookingInstructions ?? '', 34, 4))
    }
    issues.push(lineIssue('customerName', 'Customer name', product.customerName ?? '', 34, 1))
  }

  if (template.layout === 'info') {
    issues.push(lineIssue('name', 'Product name', name, 18, 2))
    const sections = [
      ['Serving and nutrition', [product.servingInfo, product.nutritionInfo].filter(Boolean).join(' | ')],
      ['Cooking instructions', product.showCookingInstructions === false ? '' : product.cookingInstructions ?? ''],
      ['Ingredients', product.ingredients ?? ''],
      ['Allergen statement', product.allergenStatement ?? ''],
    ] as const
    let usedLines = 0
    for (const [label, value] of sections) {
      if (!value.trim()) continue
      usedLines += 1 + wrappedLineCount(value, 34)
      if (usedLines > 15) {
        issues.push({
          field: label === 'Ingredients' ? 'ingredients' : label === 'Allergen statement' ? 'allergenStatement' : label === 'Cooking instructions' ? 'cookingInstructions' : 'nutritionInfo',
          label,
          status: 'clipped',
          message: `${label} extends beyond the shared information panel.`,
        })
        break
      }
    }
    if (usedLines >= 13 && !issues.some((issue) => issue?.status === 'clipped')) {
      issues.push({ field: 'ingredients', label: 'Information panel', status: 'tight', message: 'The information panel is close to its printable limit.' })
    }
  }

  return issues.filter((issue): issue is ContentFitIssue => Boolean(issue))
}

/** One shared eligibility contract for every printable/exportable product path. */
export function assessOutputEligibility(
  entries: Array<{ product: Partial<Product>; slot?: number }>,
): OutputEligibilityIssue[] {
  return entries.flatMap(({ product, slot }) =>
    assessProductContentFit(product)
      .filter((issue) => issue.status === 'clipped')
      .map((issue) => ({
        ...issue,
        productId: product.id,
        productName: product.name?.trim() || (slot ? `Slot ${slot}` : 'Untitled label'),
        slot,
      })),
  )
}

export function outputEligibilityError(
  entries: Array<{ product: Partial<Product>; slot?: number }>,
  action: string,
): string | null {
  const issues = assessOutputEligibility(entries)
  return formatOutputEligibilityIssues(issues, action)
}

export function formatOutputEligibilityIssues(issues: OutputEligibilityIssue[], action: string): string | null {
  if (!issues.length) return null
  const shown = issues.slice(0, 3).map((issue) => {
    const location = issue.slot ? `slot ${issue.slot}, ${issue.productName}` : issue.productName
    return `${location}: ${issue.label.toLowerCase()}`
  })
  const remainder = issues.length > shown.length ? ` and ${issues.length - shown.length} more` : ''
  return `${action} is blocked because printable content will be clipped (${shown.join('; ')}${remainder}). Shorten the flagged content or choose another label template.`
}
