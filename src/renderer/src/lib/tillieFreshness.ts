import type { Product } from '../types'

const FRESHNESS_KEY = 'tillie:pos-freshness-v1'

export interface TillieFreshness {
  state: 'fresh' | 'stale'
  lastSuccessAt: string | null
  failedAt: string | null
  message: string
  acknowledgedFailureAt: string | null
}

export function readTillieFreshness(): TillieFreshness | null {
  try {
    const value = JSON.parse(localStorage.getItem(FRESHNESS_KEY) || 'null') as Partial<TillieFreshness> | null
    if (!value || (value.state !== 'fresh' && value.state !== 'stale')) return null
    return {
      state: value.state,
      lastSuccessAt: typeof value.lastSuccessAt === 'string' ? value.lastSuccessAt : null,
      failedAt: typeof value.failedAt === 'string' ? value.failedAt : null,
      message: typeof value.message === 'string' ? value.message : '',
      acknowledgedFailureAt: typeof value.acknowledgedFailureAt === 'string' ? value.acknowledgedFailureAt : null,
    }
  } catch {
    return null
  }
}

export function recordTillieSyncSuccess(at = new Date().toISOString()): TillieFreshness {
  const value: TillieFreshness = { state: 'fresh', lastSuccessAt: at, failedAt: null, message: '', acknowledgedFailureAt: null }
  try { localStorage.setItem(FRESHNESS_KEY, JSON.stringify(value)) } catch { /* status remains available for this view */ }
  return value
}

export function recordTillieSyncFailure(message: string): TillieFreshness {
  const previous = readTillieFreshness()
  const failedAt = new Date().toISOString()
  const value: TillieFreshness = {
    state: 'stale',
    lastSuccessAt: previous?.lastSuccessAt ?? null,
    failedAt,
    message,
    acknowledgedFailureAt: null,
  }
  try { localStorage.setItem(FRESHNESS_KEY, JSON.stringify(value)) } catch { /* status remains available for this view */ }
  return value
}

export function confirmUsingSavedTillieData(products: Array<Partial<Product>>): boolean {
  if (!products.some((product) => Boolean(product.tillieProductId))) return true
  const freshness = readTillieFreshness()
  if (!freshness || freshness.state === 'fresh' || freshness.acknowledgedFailureAt === freshness.failedAt) return true
  const lastSuccess = freshness.lastSuccessAt ? new Date(freshness.lastSuccessAt).toLocaleString() : 'unknown'
  const accepted = window.confirm(`Using saved data\n\nTillie Print could not verify current POS data. The last successful sync was ${lastSuccess}.\n\nContinue using the saved names, prices, and barcodes?`)
  if (!accepted) return false
  const acknowledged = { ...freshness, acknowledgedFailureAt: freshness.failedAt }
  try { localStorage.setItem(FRESHNESS_KEY, JSON.stringify(acknowledged)) } catch { /* acknowledgment applies to this action */ }
  return true
}
