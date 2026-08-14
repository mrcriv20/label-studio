---
target: src/renderer/src
total_score: 30
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-08-14T15-20-08Z
slug: src-renderer-src
---
# Tillie Print Renderer Critique

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Strong output and readiness states, but eligibility is usually revealed only after an output action. |
| 2 | Match System / Real World | 4/4 | PLS780, slots, inches, Actual Size, and print-dialog limits align closely with market work. |
| 3 | User Control and Freedom | 3/4 | Guards preserve work, but blocked output lacks a direct edit-and-return path. |
| 4 | Consistency and Standards | 3/4 | Eligibility is consistent technically; output vocabulary and single-versus-sheet feedback vary. |
| 5 | Error Prevention | 3/4 | Every current output route is guarded in renderer and main; the fit classifier remains heuristic and excludes Designer templates. |
| 6 | Recognition Rather Than Recall | 3/4 | Preview and preflight help, but staff must remember where the affected product and field are edited. |
| 7 | Flexibility and Efficiency | 3/4 | Strong shortcuts and sheet tools; no one-click repair or output shortcut in Sheet Builder. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Grounded and coherent, but sheet readiness and final review repeat many of the same facts. |
| 9 | Error Recognition and Recovery | 2/4 | Errors identify product, field, and sometimes slot, but do not navigate, focus, or restore users after repair. |
| 10 | Help and Documentation | 3/4 | Strong print help; eligibility behavior, exemptions, and repair flow are not documented. |
| **Total** | | **30/40** | **Good foundation; recovery is the limiting factor** |

## Design Specificity Verdict

**LLM assessment:** Strongly product-specific. The eight-slot PLS780 model, Actual Size language, calibration offsets, Tillie synchronization, label templates, live physical preview, and Market Workbench shell make the product unmistakably label-production software rather than generic SaaS. The weakest specificity is in error recovery: blocks use product-aware nouns but still behave like generic error banners instead of a workflow-aware repair system.

**Deterministic scan:** One `overused-font` warning at `src/renderer/src/index.css:78` for Inter. This remains a contextual false positive because `DESIGN.md` explicitly requires Inter for compact application chrome and reserves distinctive faces for printed label artwork. Actionable deterministic count: zero.

**Visual overlays:** No reliable user-visible overlay is available. The required in-app mutable JavaScript surface was not exposed. Fresh screenshots and detector injection could not be performed; current source, responsive CSS, and a successful production build were used as fallback evidence.

## Overall Impression

Output safety is now technically consistent. Single PDF, SVG, roll print, sheet PDF, sheet print, Products-row shortcuts, Editor shortcuts, and main IPC all share one eligibility contract. The new highest-value opportunity is to turn a protective block into a short recovery loop: identify, edit, return, and continue without rebuilding the sheet.

### Cognitive Load

Sheet Builder remains the highest-load routine surface. Staff process a six-fact readiness card, optional calibration, repeat-sheet choice, layout mode, product, quantity/start slot or eight manual selectors, output target, then a modal repeating most readiness facts.

Editor exposes Save, Print, PDF, SVG, roll print, a five-row preflight, template choice, and fit repair without connecting the last two. Settings still mixes integration, defaults, font acquisition, output, and calibration in one long column.

## What's Working

1. **Every material output path is guarded twice.** Renderer checks provide immediate feedback; main IPC rechecks before dialogs, files, PDF generation, or printer windows.
2. **Output blocks preserve operational state.** Sheet assignments, all eight nullable positions, product data, and last-sheet history remain intact when output is rejected.
3. **The print workflow is honest and domain-native.** Stock, page, scale, occupied slots, calibration, fit, and the distinction between dialog-opened and paper-printed create real trust.

## Priority Issues

### [P1] Blocked output is not a recoverable workflow

**Why it matters:** Staff can learn which product and field is clipped, but Sheet Builder cannot open that product, focus the affected field, and return to the same eight-slot composition. The safety guard becomes a dead end at the most time-sensitive moment.

**Fix:** Return structured eligibility issues to UI, not only a flat string. Add `Edit [product]` and `Go to [field]` actions. Preserve the complete slot assignment and review target while entering Editor, focus and highlight the field, then provide `Return to sheet` after saving.

**Suggested command:** `$impeccable harden`

### [P1] Fit remains heuristic rather than render-measured

**Why it matters:** Character counts can produce false confidence or false blocks. Designer templates are exempt because they auto-fit, so a regression in minimum-size or maximum-line behavior could pass every eligibility gate.

**Fix:** Move fit truth into the authoritative render pipeline. Fixed templates should use embedded-font measurement; Designer resolution should expose minimum-size and clipped-frame status per bound element. Keep the shared eligibility contract, but feed it render-derived results.

**Suggested command:** `$impeccable harden`

### [P2] Sheet readiness and final review duplicate information

**Why it matters:** Repeating stock, page, scale, occupied slots, calibration, and fit increases procedural anxiety without adding a new decision.

**Fix:** Keep one compact persistent readiness summary. Let the modal contain only output-specific facts, newly changed warnings, and the final action. Keep calibration collapsed unless requested or unresolved.

**Suggested command:** `$impeccable distill`

### [P2] Eligibility should be visible before the user clicks output

**Why it matters:** Products-row Print can lead staff into Sheet Builder before revealing that the label is blocked. Editor and Library output controls remain visually available until invoked.

**Fix:** Add a visible `Not print-ready` or `Content needs attention` state near the label and affected output actions. For sheets, retain per-slot warnings instead of deduplicating repeated products solely by product and field.

**Suggested command:** `$impeccable clarify`

### [P2] Operational hierarchy remains broad

**Why it matters:** Library presents refresh, import, blank or selected sheet, new label, search, filters, sorting, row actions, and selection together. Settings mixes POS integration, label defaults, font installation, output, and calibration in one stack.

**Fix:** Promote the daily path `select → build sheet → review → print`; de-emphasize maintenance actions. Group Settings into POS Integration, Label Defaults, and Output & Calibration with clearer local save context.

**Suggested command:** `$impeccable layout`

## Persona Red Flags

**Morgan, busy counter staff:** Morgan cannot afford a dead-end block after composing eight slots. Repair must be one click and must preserve the physical sheet map.

**Jordan, first-time user:** A flat error saying a field needs a certain number of lines may sound like exact measurement even though the guard is heuristic. Jordan also has to infer where that field lives and how to return to printing.

**Alex, high-throughput operator:** Shared eligibility and repeat-sheet behavior are excellent, but blocked output interrupts throughput because there is no keyboard-accessible repair-and-return loop.

**Sam, keyboard or low-vision user:** Error banners are announced and dismissible, but links to affected fields do not exist. Repeated slot issues can be visually deduplicated, hiding the complete spatial impact.

## Minor Observations

- Repeated products are deduplicated in the visible sheet fit callout, even though the blocking contract retains slot numbers.
- Products-row Print is allowed into Sheet Builder before fit status is surfaced; final output remains safely guarded.
- `custom-*` artwork is assessed using fixed front-label assumptions, which may create false positives when the artwork does not expose the same name and price zones.
- Raw IPC error details still reach some Roll Print, Designer, and Settings states without a tailored recovery action.
- Compact icon-only navigation retains accessible names but reduces visible orientation for touch and low-vision users.
- `PRODUCT.md` says platform `web` even though the product is an Electron macOS application; this can misroute future adaptation guidance.

## Questions to Consider

1. Should blocked output open the exact product field automatically, or show a repair list first?
2. Should sheet assignments persist only during the repair session, or become a named/saved draft sheet?
3. Is final review still necessary when every fact already passes in persistent readiness, or should only direct printing require the modal?
4. Should `Fits` remain a conservative advisory label until render-measured validation is implemented?
