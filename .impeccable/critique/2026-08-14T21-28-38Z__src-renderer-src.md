---
target: src/renderer/src
total_score: 30
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
timestamp: 2026-08-14T21-28-38Z
slug: src-renderer-src
---
# Tillie Print Renderer Critique

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Draft and fit states are visible, but successful persistence and authoritative preflight completion are not verified before confident copy appears. |
| 2 | Match System / Real World | 4/4 | PLS780 stock, exact slots, Actual Size, drift measurement, and print-dialog limits closely match counter work. |
| 3 | User Control and Freedom | 3/4 | Repair, return, clear, repeat, and modal controls are strong; automatic drafts lack an explicit discard action. |
| 4 | Consistency and Standards | 3/4 | The Market Workbench remains coherent; persistence and fallback semantics are less consistent than the visible controls imply. |
| 5 | Error Prevention | 3/4 | Authoritative renderer/main fit checks are excellent, but review can appear ready while preflight is pending or unavailable. |
| 6 | Recognition Rather Than Recall | 3/4 | Issue-to-field focus removes hunting; Editor does not retain the originating slot and issue summary. |
| 7 | Flexibility and Efficiency | 3/4 | Automatic drafts, repair return, fill/manual modes, shortcuts, repeat, and duplicate support high-throughput work. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Review is successfully distilled; calibration remains a dense exception path. |
| 9 | Error Recognition and Recovery | 3/4 | Repair is actionable and preserves positions; missing draft products and storage/preflight failures are silent. |
| 10 | Help and Documentation | 2/4 | Existing help covers printing well but not draft lifecycle, repair behavior, or the exact scope of text-fit validation. |
| **Total** | | **30/40** | **Good; trust semantics need hardening** |

## Design Specificity Verdict

**LLM assessment:** Strongly product-authored. The repair workflow now behaves like label-production software rather than a generic validation form: it names physical slot, product, and field; opens the real edit control; preserves the eight-position sheet; and returns the user to production. PLS780 geometry, calibration, Actual Size, and the navy/paper counter aesthetic remain highly specific.

**Deterministic scan:** One `overused-font` warning at `src/renderer/src/index.css:78` for Inter. This remains a contextual false positive because `DESIGN.md` explicitly prescribes Inter for operational chrome and confines distinctive typefaces to label artwork. Actionable deterministic count: zero.

**Visual overlays:** No reliable user-visible overlay is available. The required mutable in-app Browser JavaScript tool was not exposed; browser presentation, screenshots, and detector injection were therefore skipped. Current source and implementation structure were used as fallback evidence.

## Overall Impression

The new repair journey closes the previous dead end. A blocked sheet now offers a real path from issue list to exact field and back to the original eight-slot composition. Render-measured validation is also architecturally credible for fixed and Designer templates. The remaining problems concern whether the interface is honest when persistence or authoritative preflight is uncertain.

### Critical Validation

- **Eight slots:** Preserved through manual/fill composition, automatic drafts, repair navigation, restored product lookup, PDF, printing, and repeat-last-sheet. Empty positions remain explicit null slots.
- **Repair return:** Correct. The sheet is persisted before Editor unmounts, saving refreshes the product record, and Sheet Builder reconstructs the same positions by product ID.
- **Render-measured text fit:** Supported. Fixed templates use output fonts, zones, wrapping, and line caps. Designer templates use the same resolver, measurer, auto-fit floor, and maximum-line behavior as painting.
- **Draft restoration:** Functionally broad but not fully trustworthy. Missing products silently become empty positions, write failures are uncaught, and the stored timestamp is not surfaced.
- **Review simplification:** Successful. The modal now focuses on output target, Actual Size, completion semantics, final action, and repair issues instead of repeating the entire readiness card.

## Cognitive Load

Routine sheet output is now low-to-moderate load. Exception handling is much better because the user no longer hunts through Editor. The main remaining spike is calibration: pattern printing, direction, measured distance, calculated correction, saved versus proposed values, raw signed offsets, and retesting appear in one vertical stack.

The conceptual distinction among current sheet, automatic draft, last printed sheet, and saved product data also needs clearer naming.

## What's Working

1. **Repair is specific and actionable.** Each issue names slot, product, field, and reason, then opens and focuses the exact control—including fields inside collapsed disclosures.
2. **Production context survives repair.** Duplicate products remain in their original physical positions and users return to the same intended Print/PDF workflow.
3. **Validation uses rendering truth.** Main-process output checks share font metrics, wrapping, line limits, and Designer auto-fit behavior with actual output, while IPC rechecks prevent UI bypass.

## Priority Issues

### [P1] Authoritative preflight uncertainty is invisible

**Why it matters:** Editor and Sheet Builder temporarily fall back to heuristic estimates while render-measured IPC preflight is pending. If IPC fails, the failure is silently ignored and the UI can still look ready. Main output remains protected, but users encounter a late block despite earlier confidence.

**Fix:** Add explicit `Checking printable text…`, `Checked`, and `Check unavailable` states. Disable final output while authoritative checking is pending or failed. Provide Retry. Preserve tight and clipped results instead of allowing tight warnings to disappear when the authoritative response arrives.

**Suggested command:** `$impeccable harden`

### [P1] Automatic-draft claims are stronger than storage guarantees

**Why it matters:** `Draft saved automatically` appears without confirming `localStorage.setItem`. Storage failures can throw, missing/deleted products become empty slots silently, and restored calibration state can race with settings loading.

**Fix:** Validate the complete draft schema, catch read/write/remove failures, update the saved indicator only after successful persistence, show last-saved time, and report partial restoration such as `Restored 6 of 8 positions; products for slots 3 and 7 are unavailable`. Add `Discard draft` and resolve settings before applying restored calibration form state.

**Suggested command:** `$impeccable harden`

### [P1] IPC boundaries need runtime validation

**Why it matters:** Output payloads, settings values, and several renderer-supplied file paths are trusted at runtime. The BrowserWindow sandbox is disabled and external URLs lack a scheme allowlist. These are not visual defects, but they affect the trustworthiness of a desktop production tool.

**Fix:** Validate payload shapes and eight-slot bounds in IPC, constrain all file operations to permitted roots, allow only HTTPS external links, and evaluate enabling Electron sandbox with a documented compatibility fallback.

**Suggested command:** `$impeccable audit`

### [P2] Editor loses the originating repair context

**Why it matters:** The correct field receives focus, but staff must remember which slot and error they selected—risky when the same product appears several times.

**Fix:** Carry slot, field label, and issue message into Editor. Show a compact banner such as `Repairing slot 6 · Cooking instructions are clipped` beside the Return to Sheet action.

**Suggested command:** `$impeccable clarify`

### [P2] Calibration remains dense for routine staff

**Why it matters:** The everyday sheet path is now compact, but calibration still exposes a large multi-stage control stack when opened.

**Fix:** Present calibration as three guided steps: print pattern, measure drift, save correction. Keep signed offsets completely under Advanced and focus the first calibration control when opened from review.

**Suggested command:** `$impeccable distill`

## Persona Red Flags

**Morgan, rushed counter staff:** Morgan may trust `Draft saved automatically` or a green readiness state during a failed persistence/preflight operation. The app must fail visibly rather than surface uncertainty only at final output.

**Jordan, first-time user:** The repair path is now understandable, but the distinctions among automatic draft, Repeat Last Sheet, and saved product data remain subtle. Calibration still requires more coordinate reasoning than the main workflow.

**Alex, high-throughput operator:** Repair and return are efficient. Alex needs the draft timestamp, partial-restoration diagnosis, and a compact repair-context banner to work safely across similar repeated products.

**Sam, keyboard or low-vision user:** Field focus and modal behavior are strong. Pending preflight needs an announced busy state, and restoration losses need an alert rather than a generic success notice.

## Minor Observations

- The repair highlight class is added but not explicitly removed; remounting currently clears it incidentally.
- A restored draft can announce success even when zero usable products remain.
- `Adjust calibration` opens the section but does not focus its first control.
- Manual assignments use `#1` while other surfaces use `Slot 1`.
- `Fill all with one product` is inaccurate when quantity or starting position produces a partial sheet.
- Draft `updatedAt` is stored but not displayed or used for conflict handling.
- `Repeat Last Sheet` and automatic draft restoration are adjacent but conceptually different recovery mechanisms.
- Text-fit validation does not claim to verify images, barcodes, printer scaling, or physical calibration; UI copy should keep that boundary explicit.

## Questions to Consider

1. Should a failed authoritative preflight block all output until Retry succeeds, even when the local estimate says content fits?
2. How long should an automatic draft survive, and should a shared market Mac identify which staff shift created it?
3. When restored products are missing, should the app preserve their slots as explicit unavailable placeholders or convert them to empty positions?
4. Should calibration remain a card inside Sheet Builder or become a short dedicated wizard?
