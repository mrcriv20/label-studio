---
target: src/renderer/src
total_score: 31
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-08-14T13-44-21Z
slug: src-renderer-src
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Strong loading, dirty, output, and readiness states; final print completion is intentionally unverifiable and transient outcomes disappear. |
| 2 | Match System / Real World | 4 | PLS780 stock, eight positions, orientation, inches, offsets, and Actual Size map exceptionally well to physical label work. |
| 3 | User Control and Freedom | 3 | Back, Escape, focus trapping, clear sheet, undo/redo, and unsaved guards are strong; Export-triggered review restores focus to Print. |
| 4 | Consistency and Standards | 3 | Cohesive tokens and controls; output labels, calibration ownership, and native/custom dialogs still vary. |
| 5 | Error Prevention | 3 | Review gating, fixed slots, bounds, and atomic calibration prevent serious mistakes; review copy describes the wrong target for PDF export. |
| 6 | Recognition Rather Than Recall | 3 | Visible preflight, previews, and guidance help; users still remember which calibration/template/global behaviors apply. |
| 7 | Flexibility and Efficiency | 3 | Shortcuts, repeat sheet, bulk selection, duplicate slot, and Designer history help repeat work. |
| 8 | Aesthetic and Minimalist Design | 3 | Compact and disciplined; Sheet Builder repeats facts and Designer/Settings remain dense. |
| 9 | Error Recovery | 3 | Errors usually preserve work and suggest recovery; some raw IPC errors and non-atomic general Settings save remain. |
| 10 | Help and Documentation | 3 | Task-based How to Use, onboarding, and inline guidance are strong; contextual help remains split and not searchable. |
| **Total** | | **31/40** | **Good — physical-output integrity is strong; remaining problems are refinement and workflow authority.** |

## Design Specificity Verdict

**Authored for Tillie Print, not interchangeable.** The strongest product-specific composition is the physical sheet workbench: named PLS780 stock, eight-position preview, start-slot reuse, occupied-slot map, measured calibration, Actual Size guidance, dedicated alignment pattern, and honest distinction between opening a system dialog and paper actually printing. Navy, paper, and restrained green reinforce a credible market-counter tool.

Library and Settings retain more generic desktop CRUD structure, and Designer resembles a compact vector editor, but product-field bindings, label presets, preview products, and Designer-only reusable-template administration keep the system grounded.

**Deterministic scan:** exactly one `overused-font` warning at `src/renderer/src/index.css:78`. Inter is explicitly mandated by DESIGN.md for operational chrome, making this a contextual false positive. Actionable findings: **0**.

**Visual overlays:** no reliable user-visible overlay is available. A fresh Electron process could launch after removing an inherited `ELECTRON_RUN_AS_NODE`, but OS automation could not reliably foreground or capture it. The in-app browser runtime was unavailable, so no mutable injection or detector overlay is claimed. Findings use current source, responsive contracts, semantics, and build evidence.

## Overall Impression

Tillie Print has crossed from “credible prototype” into a strong specialist desktop workflow. Fixed physical positions are consistent through state, history, IPC, PDF, and printing. Print and PDF share a review gate. Calibration uses a dedicated artifact. Shared-template administration is correctly separated into Designer. Modal mechanics and failure cleanup are materially better.

The remaining work is narrower but still meaningful: the shared review tells an Export user that the target is the macOS print dialog, calibration still has two authorities, focus restoration assumes Print initiated the review, and several dense surfaces need stronger task sequencing.

## What's Working

1. **Print/PDF preflight is meaningfully unified.** Both outputs enter one review and share the same stock, scale, slot, and calibration truth.
2. **Calibration is unusually product-specific.** Directional corrections, bounded atomic offsets, a numbered alignment pattern, and measured re-test guidance connect software to paper.
3. **Template scope is now structurally safer.** Routine editing contains current-label choices and overrides; reusable creation/import/export/deletion lives in Designer.
4. **Physical-slot integrity is excellent.** Empty positions survive through renderer, preload, IPC, PDF placement, direct printing, and Repeat Last Sheet.

## Priority Issues

### [P1] Review content does not adapt to the selected output

**Why it matters:** Opening review from Export PDF still displays `Output target: macOS system print dialog`, while Print and Export remain similarly available. The final confidence gate tells a false story for one of its two entry paths.

**Fix:** Tailor the title, target fact, primary action, and focus restoration to the initiating action. Keep the alternate output as a quiet secondary choice or use an explicit Print/PDF segmented target.

**Suggested command:** `$impeccable clarify`

### [P1] Calibration still has two competing homes

**Why it matters:** Sheet Builder provides the correct operational pattern/measure/save/re-test workflow, while Settings independently exposes offset editing. Staff can bypass the pattern, misunderstand signs, or wonder which surface is authoritative.

**Fix:** Make Print Sheet the sole calibration workflow: print pattern, measure drift with arrows/examples, enter correction, save, re-test. Settings should summarize current calibration and deep-link to Print Sheet instead of editing it independently.

**Suggested command:** `$impeccable shape`

### [P2] Modal accessibility needs initiating-control accuracy

**Why it matters:** Focus is trapped and Escape works, but review always returns focus to Review & Print—even when Export PDF launched it. Covered application content is not made inert, and native details menus do not share the modal/menu lifecycle discipline.

**Fix:** Store the actual invoking element, make the application shell inert while review is open, compute focusable elements dynamically, and standardize Escape/outside-click/focus return for action menus.

**Suggested command:** `$impeccable audit`

### [P2] Designer onboarding remains instructional rather than contextual

**Why it matters:** The four-step strip helps, but the user still confronts design selection, naming, history, five Add types, zoom, file actions, layers, canvas, preview product, and a long Inspector.

**Fix:** Turn the onboarding steps into contextual actions and progressive completion. Default the Inspector to Essentials; keep geometry, visibility, opacity, and layer mechanics advanced; cluster the toolbar around Select/Create, Add, Transform, and Save.

**Suggested command:** `$impeccable onboard`

### [P2] Remaining hardening and consistency gaps

**Why it matters:** General Settings still saves keys sequentially despite an atomic API; print temp cleanup retries only once; transient outcomes may disappear while staff look at the printer; roll printing claims `Sent to printer` more strongly than sheet printing can justify.

**Fix:** Use `settings.setMany` for the entire Settings form, add a startup sweep or cleanup retry for abandoned temp PDFs, keep the most recent print outcome available until replaced/dismissed, and align roll-print certainty with sheet-print language.

**Suggested command:** `$impeccable harden`

## Persona Red Flags

**Jordan — first-time market clerk:** Create Label is a strong entry, but correct physical output still spans Editor, Sheet Builder, review, and the system dialog. Signed decimal calibration is explained textually rather than with a visual drift example.

**Alex — repeat operator:** Bulk selection, fill mode, Repeat Last Sheet, duplicate slot, and shortcuts are valuable. Mandatory review repeats already-visible facts, shortcuts lack a central reference, and recent templates or calibration history are absent.

**Sam — keyboard and screen-reader user:** Dialog trapping, Escape, labels, focus rings, and live regions are strong. Export returns focus to the wrong trigger, covered content is not inert, native confirmations interrupt the custom model, and details menus have weak lifecycle semantics.

## Cognitive Load

Moderate, with three failures:

- **Chunking:** Designer and Settings expose many peer controls.
- **One thing at a time:** Designer combines document management, creation, canvas, layers, transform, preview, and property editing.
- **Minimal choices:** Designer toolbar has roughly thirteen controls; Sheet Builder and review each display six facts plus multiple actions.

Single focus, grouping, hierarchy, working-memory support, and progressive disclosure otherwise pass.

## Emotional Journey

- **Arrival:** trustworthy, grounded, and operational.
- **Building:** preview and fixed slots create confidence.
- **High-stakes peak:** review is reassuring because it names the physical assumptions and system limitation.
- **Calibration valley:** signed decimal corrections and two calibration homes create ambiguity.
- **End:** honest completion language builds trust, but auto-expiring status and stronger roll-print claims make the ending inconsistent.

## Minor Observations

- The review duplicates the six-item inline preflight instead of focusing only on final differences.
- Roll Print initially focuses Close rather than the title or first meaningful field.
- Backdrop click can dismiss a high-stakes review accidentally.
- Settings examples render literal backticks around numeric values.
- `onEdit(undefined as unknown as Product)` obscures the new-label contract.
- Designer onboarding uses `role=status` for a long instructional strip.
- Narrow navigation becomes icon-only at 980px, weakening orientation for non-mouse users.
- Critical layout and semantic styles remain heavily inline, increasing drift risk.

## Questions to Consider

- Should the final review validate one chosen output, or deliberately invite switching between Print and PDF?
- What would calibration look like if staff entered “1/16 inch too far left” instead of signed coordinates?
- Should Repeat Last Sheet restore only physical slots or the entire previous output intent, including target and calibration snapshot?
- Is Designer a routine staff destination or an advanced administrator capability that should be visually separated?
