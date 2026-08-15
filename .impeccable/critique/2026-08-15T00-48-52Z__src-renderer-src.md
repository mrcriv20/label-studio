---
target: src/renderer/src
total_score: 30
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
timestamp: 2026-08-15T00-48-52Z
slug: src-renderer-src
---
# Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Fresh/stale POS, draft, preflight, calibration source, and structured sync outcomes are unusually explicit. |
| 2 | Match System / Real World | 3 | Physical print language is excellent; database credentials and signed offsets remain technical. |
| 3 | User Control and Freedom | 3 | Retry, discard, repair, undo, and offline continuation are strong; instant-save sync scope lacks undo. |
| 4 | Consistency and Standards | 3 | Strong visual consistency, but Settings combines instant, persistent, preview, and staged save models. |
| 5 | Error Prevention | 3 | Output safeguards are comprehensive, but malformed cached calibration can currently be treated as trusted. |
| 6 | Recognition Rather Than Recall | 3 | Current state is visible; users must still remember which Settings controls save immediately. |
| 7 | Flexibility and Efficiency | 3 | Strong repeat-operator tools; category and product inclusion lists do not scale elegantly. |
| 8 | Aesthetic and Minimalist Design | 2 | The flat workbench is coherent, but Settings and degraded-state messaging remain dense. |
| 9 | Error Recovery | 3 | Most failures now preserve work and offer recovery; rejected configuration promises can leave controls stuck. |
| 10 | Help and Documentation | 3 | Print, calibration, sync, and security help are substantive, though scattered and technically dense. |
| **Total** | | **30/40** | **Good; trust safeguards improved, with one cached-calibration integrity hole.** |

# Design Specificity Verdict

**LLM assessment:** Tillie Print is strongly grounded in market label production. PLS780 stock, eight physical slots, alignment drift, Actual Size, label-content fit, POS field freshness, offline saved data, and automatic sheet recovery would not transfer unchanged to a generic admin product. Recent safeguards deepen that identity. The interaction treatment is less distinctive than the domain model: Settings remains a conventional stack of bordered cards, and exceptional states rely heavily on prose notices rather than compact equipment-like indicators.

**Deterministic scan:** One warning: `overused-font` at `src/renderer/src/index.css:78`. This is a verified contextual false positive because `DESIGN.md` explicitly prescribes Inter for compact application chrome. Actionable detector findings: zero.

**Visual overlays:** No reliable user-visible overlay is available. The required in-app Browser JavaScript-control surface was not exposed, so no fresh tab, mutation preflight, screenshot, console scan, visibility change, or overlay injection was possible. Source inspection and a successful production build were used instead.

# Overall Impression

The product now takes operational truth seriously. POS freshness, cached calibration, rendered-output checks, physical slot integrity, and administrator credential handling all have explicit contracts. The remaining work is less about adding warnings and more about ensuring those warnings are backed by trustworthy state, then reducing the cognitive weight created by multiple overlapping safeguards.

# What's Working

1. **Stale POS data is guarded across output routes.** Linked products require acknowledgment after a failed sync before single PDF, roll, sheet entry, sheet PDF, or direct sheet printing; saved labels remain usable offline.
2. **Synchronization changes and results now expose consequences.** Instant-save audit summaries explain category/product scope, and results separate updated, unchanged, and needs-attention records.
3. **Physical output remains unusually well protected.** Rendered fit validation, eight-slot preservation, calibration provenance, Actual Size review, focus-managed dialogs, direct repair links, and honest completion copy create a credible production workflow.

# Priority Issues

## [P0] Cached calibration is trusted without validation

**Why it matters:** Any string values and timestamp from `localStorage` are accepted as trusted cached calibration. Corrupted values such as `NaN`, out-of-range offsets, or invalid dates can enable Print and PDF while producing invalid geometry.

**Fix:** Parse and validate both offsets as finite values within ±0.500 inches and require a valid timestamp before setting the source to cached. Reject and remove malformed cache data, block output, explain that no trusted calibration is available, and offer Retry.

**Suggested command:** `$impeccable harden`

## [P1] Instant-save configuration is not rejection-safe

**Why it matters:** A rejected IPC promise can leave `configSaving` permanently true. The auto-sync checkbox can also overlap with another configuration write, causing ambiguous final state and misleading audit summaries.

**Fix:** Wrap configuration writes in `try/catch/finally`, disable every scope control during a write, serialize or cancel overlapping changes, and announce the committed server-returned state rather than only the intended patch.

**Suggested command:** `$impeccable harden`

## [P1] Accepted stale-data risk becomes invisible

**Why it matters:** Acknowledgment is global to one failed-sync episode. After accepting once, subsequent outputs bypass the dialog while the underlying outage remains. Staff may forget that linked names, prices, and barcodes are still stale.

**Fix:** Preserve a persistent `Saved POS data accepted for this outage` indicator with failure time, last successful sync, and Retry. Keep it visible in Products and final output review until synchronization succeeds.

**Suggested command:** `$impeccable clarify`

## [P2] Sync exceptions report problems but do not open repair

**Why it matters:** Unreadable prices and duplicate barcodes are listed, but users cannot directly open affected products or a conflict-resolution view.

**Fix:** Render exceptions as actionable rows with product identity, issue type, and `Open product` or `Review conflict`. Announce the detailed result as a live region.

**Suggested command:** `$impeccable clarify`

## [P2] Settings safety information lacks progressive hierarchy

**Why it matters:** Connection, credentials, scope, product exceptions, auto-sync, results, label appearance, fonts, barcode, export, calibration, and template details occupy one long page. Two save models share the same surface.

**Fix:** Group Store Connection, Label Appearance, Print Setup, and Advanced Administration. Mark every section as `Saves immediately`, `Preview only`, or `Save Settings required`. Place credential warnings before the credential input and avoid `role=alert` until there is an actual error.

**Suggested command:** `$impeccable distill`

# Persona Red Flags

**Morgan, busy market staff:** Morgan benefits from the improved freshness and print safeguards. After accepting saved POS data once, however, subsequent output can look routine even though the outage continues. Morgan needs a persistent accepted-risk indicator at review time.

**Alex, power user:** Bulk printing and repeat workflows are efficient, but large category/product inclusion lists lack selected-only filtering or bulk review. A rejected configuration write can also leave Alex unable to continue without navigating away.

**Jordan, first-timer:** The administrator warning is strong, but it appears after the password input. Jordan can paste a powerful credential before learning how it must be handled. Mixed immediate and staged save behavior remains difficult to predict.

**Sam, screen-reader user:** Output dialogs and state announcements are strong. Detailed sync results are not themselves live, so Sam may hear only the generic completion message and miss skipped prices or duplicate barcodes.

# Minor Observations

- Successful notices and audit summaries can appear simultaneously and duplicate confirmation.
- The credential warning uses `role=alert` immediately on disclosure even before an error occurs.
- Product picker borders still contain a hardcoded `#f1f5f9` rather than the established token.
- Persistent `POS data verified` messaging may be too visually prominent during healthy operation.
- Eleven-pixel supporting copy remains demanding at counter distance and macOS display scaling.
- Settings places some errors far from their initiating controls.
- `Sync Now` capitalization differs from sentence-case controls elsewhere.
- “Calibration is saved” appears as a disabled button rather than status text.

# Questions to Consider

1. Should saved-data acknowledgment apply once per outage, once per print review, or once per physical batch?
2. Should malformed calibration cache be deleted automatically, or retained for administrator diagnostics while output stays blocked?
3. Should sync conflicts open the product editor directly, or enter a dedicated conflict-review queue?
4. Should database credentials remain available to every local macOS user, or require an administrator permission boundary?
