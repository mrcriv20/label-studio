---
target: src/renderer/src
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
timestamp: 2026-08-15T00-29-24Z
slug: src-renderer-src
---
# Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Output and draft states are explicit; automatic POS-sync and sheet-settings failures can still be silent. |
| 2 | Match System / Real World | 4 | PLS780 stock, eight physical slots, Actual Size, drift measurements, and honest print-dialog language match the job closely. |
| 3 | User Control and Freedom | 3 | Undo, dirty guards, repair-return, retry, and draft discard are strong; sync-scope changes save immediately inside an otherwise staged Settings screen. |
| 4 | Consistency and Standards | 3 | The workbench system is coherent, but settings commit models and native/custom confirmations differ. |
| 5 | Error Prevention | 3 | Dual output gates and exact fit checks are strong; failed calibration-settings load may silently fall back to zero offsets. |
| 6 | Recognition Rather Than Recall | 3 | Preflight, slot maps, repair links, and labels are visible; sync inclusion and exception precedence still require careful reading. |
| 7 | Flexibility and Efficiency | 3 | Shortcuts, repeat sheet, bulk selection, fill/manual modes, and direct repair support repeat operators. |
| 8 | Aesthetic and Minimalist Design | 3 | Grounded, flat, restrained workbench; Settings and Designer remain dense and card/control heavy. |
| 9 | Error Recovery | 2 | Output failures recover well, but sync/settings failures are sometimes hidden, raw, or lack Retry. |
| 10 | Help and Documentation | 2 | Print and calibration help is strong; sync freshness, conflict behavior, and offline reconciliation remain underexplained. |
| **Total** | | **29/40** | **Good foundation; remaining trust risk is concentrated in operational-data freshness.** |

# Design Specificity Verdict

**LLM assessment:** Tillie Print feels authored for small-market label production rather than interchangeable SaaS. The navy workbench, compact operational typography, live label preview, fixed PLS780 geometry, eight-position sheet map, calibration measurements, output verification, and explicit distinction between opening a print dialog and physically printing all reflect the real job. Print Sheet is the most distinctive and mature surface. Settings is the least specific: its long stack of integration and configuration cards resembles a conventional administration screen, and the sync mental model is less legible than the physical-print model.

**Deterministic scan:** One warning: `overused-font` at `src/renderer/src/index.css:78` for Inter. This is a contextual false positive. `DESIGN.md` explicitly prescribes Inter for compact application chrome; changing it solely for the detector would violate the established visual system. Actionable detector findings: zero.

**Visual overlays:** No reliable user-visible overlay is available. The required in-app Browser JavaScript control surface was not exposed, so mutation preflight, browser visibility, and injection were skipped. Current source inspection and a successful production build were used as fallback evidence.

# Overall Impression

The output workflow now behaves like dependable shop equipment: it checks, explains, blocks unsafe output, supports repair, preserves the sheet, and states what the system can actually confirm. The single biggest opportunity is to apply that same reliability language to Tillie/POS data. A silent sync failure can leave the interface looking calm while prices are stale, which undercuts the trust earned by the print path.

# What's Working

1. **Rendered-output reliability is now first-class.** Editor and Sheet Builder expose Checking, Verified, and Unavailable states; fail closed; offer Retry; reject stale async results; identify clipped fields; and link directly into repair.
2. **Automatic sheet drafts respect physical truth.** All eight positions survive save/restore, corrupt storage is handled, missing products are reported by slot, timestamps are exposed, and users can retry or discard.
3. **The high-stakes print checkpoint is honest and accessible.** The review dialog traps focus, supports Escape and focus return, preserves empty slots, enforces Actual Size guidance, and avoids claiming that paper printed merely because the system dialog opened.

# Priority Issues

## [P1] Failed sheet-settings load silently uses zero calibration

**Why it matters:** If loading saved settings fails, Sheet Builder continues with plausible-looking zero offsets. The preview and output can therefore be physically misaligned without any visible warning, wasting stock.

**Fix:** Give settings/calibration loading explicit `loading / loaded / unavailable` states. Keep Print and PDF blocked when calibration settings are unknown, show the last-known value only if it is explicitly labeled cached, and provide Retry.

**Suggested command:** `$impeccable harden`

## [P1] Automatic POS-sync failure can make stale prices look current

**Why it matters:** Products auto-sync returns silently on configuration or sync failure. In a market workflow, absence of an error can be interpreted as proof that prices and barcodes are fresh.

**Fix:** Add a persistent freshness contract in Products: `Up to date`, `Offline — using saved data`, `Sync failed · Retry`, and `Never synced`, each with last successful sync time and the affected scope. Printing from stale data should show a clear acknowledgment when freshness cannot be proven.

**Suggested command:** `$impeccable harden`

## [P1] Sync setup has mixed commit semantics and unclear scope precedence

**Why it matters:** Category and product sync controls persist immediately inside a Settings page whose other controls require Save. Clearing a category does not necessarily stop already-linked products, so users must infer exception precedence and downstream consequences.

**Fix:** Separate Connection, What Syncs, and Status/History. Label scope controls as instant-save or stage them behind Review Changes. Show one plain-language scope summary before mutation: categories included, linked exceptions retained, and products excluded.

**Suggested command:** `$impeccable clarify`

## [P2] Mixed sync results are compressed into success-colored prose

**Why it matters:** Created, updated, unchanged, pushed, unreadable-price, and duplicate-barcode outcomes can appear in one green paragraph. Staff must parse success copy to discover skipped records.

**Fix:** Use a structured result summary with separate Updated, Unchanged, and Needs Attention groups. Keep skipped product identifiers reviewable and provide direct remediation or exportable details.

**Suggested command:** `$impeccable distill`

## [P2] Settings and narrow Products views hide operational hierarchy

**Why it matters:** Settings presents sync, label appearance, fonts, barcode, export, calibration, and template details as similarly weighted cards. At narrow widths Products hides Category, Barcode, and Modified without an alternate detail surface.

**Fix:** Group Settings under Data & Sync, Print Setup, and Label Appearance with local navigation or disclosures. On narrow Products views, expose hidden operational fields through an accessible row-details action.

**Suggested command:** `$impeccable adapt`

# Persona Red Flags

**Morgan (busy market staff):** Printing now gives Morgan excellent reassurance, but a failed automatic sync can leave no visible trace. Morgan may print a verified, perfectly aligned label containing a stale price. A quiet header is currently too easy to interpret as “current.”

**Alex (power user):** Shortcuts, bulk selection, repeat sheet, direct repair, and manual slot assignment are efficient. Alex still has to interpret a long mixed sync-result sentence and cannot quickly distinguish current connectivity from the timestamp of the last historical success.

**Jordan (first-timer):** Products and basic label editing are approachable. In Settings, Jordan encounters connection method, database credentials, category scope, linked exceptions, automatic sync, and manual sync in one mental model. Immediate-save checkboxes inside a page with Save Settings make it unclear when changes take effect.

**Sam (keyboard/screen-reader user):** Output dialogs and repair flows have strong focus handling and status semantics. Silent sync/settings failures provide nothing to announce, and narrow icon-only navigation reduces visible orientation for low-vision users even though accessible names remain.

# Minor Observations

- Initial Products load errors are visible but do not offer a direct Retry action.
- Font-list and export-folder picker failures in Settings are ignored or underspecified.
- Selection-limit warnings can remain after the selection returns below eight.
- Category filter chips can grow without a bounded overflow/search pattern.
- `Sync Now` remains available when connection readiness is unclear; diagnostic use is reasonable, but the resulting state should explain readiness.
- Settings' Save action remains visually available when nothing is dirty.
- Native `window.confirm` dialogs feel inconsistent beside the carefully implemented custom print-review dialog.
- Large lazy chunks remain for `DesignLabelSvg` (~1.13 MB) and `bwip-js` (~1.61 MB); measure first-open latency on target Macs.

# Questions to Consider

1. Should printing require acknowledgment whenever POS freshness cannot be proven, or should saved offline data remain silently printable?
2. Should sync-scope changes save instantly with an audit summary, or become a staged Review Changes flow?
3. Should missing/failed calibration settings block all physical output, or allow a clearly labeled cached calibration value?
4. Should database credential setup remain inside everyday Settings, or move behind an administrator-only setup boundary?
