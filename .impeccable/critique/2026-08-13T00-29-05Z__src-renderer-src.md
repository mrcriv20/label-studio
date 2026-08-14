---
target: src/renderer/src
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-08-13T00-29-05Z
slug: src-renderer-src
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Strong save, output, readiness, and calibration feedback; no durable proof of print completion. |
| 2 | Match System / Real World | 4 | PLS780 stock, US Letter, slots, offsets, barcodes, and Actual Size closely match counter work. |
| 3 | User Control and Freedom | 3 | Undo/redo, discard guards, Back, dismissible notices, and manual/fill modes are strong; no clear-sheet action or deletion undo. |
| 4 | Consistency and Standards | 3 | Cohesive tokens and controls; workspace headings, output hierarchy, native confirmations, and inline styling vary. |
| 5 | Error Prevention | 1 | Manual sheet holes are compacted before output, so preview and printed slot positions can disagree. |
| 6 | Recognition Rather Than Recall | 3 | Visible guidance and contextual preflight help; customization scope and hidden output actions still require interpretation. |
| 7 | Flexibility and Efficiency | 3 | Shortcuts, selection, repeat sheet, undo/redo, and fill/manual modes are useful; shortcut discovery and slot operations are limited. |
| 8 | Aesthetic and Minimalist Design | 3 | Calm and product-specific; Designer and Sheet Builder still expose dense, duplicated control/status clusters. |
| 9 | Error Recovery | 3 | Errors are generally specific and preserve work; wrong-slot output can succeed without diagnosis. |
| 10 | Help and Documentation | 3 | Strong contextual print/calibration help; Designer guidance and final print verification remain limited. |
| **Total** | | **29/40** | **Acceptable — strong product fit, but one production-integrity risk dominates.** |

## Design Specificity Verdict

**Strongly product-specific and not category-interchangeable.** The physical-label preview, template-aware requirements, barcode readiness, PLS780 stock and slot map, calibration offsets, roll printing, and layer-based Designer could not be reused unchanged for generic inventory software. The restrained bordered/pill chrome is conventional, but the workflow language and preview/preflight structures carry a clear Market Workbench identity.

**Deterministic scan:** one raw `overused-font` warning at `src/renderer/src/index.css:78` for Inter. This is a contextual false positive because DESIGN.md explicitly pins Inter for operational application chrome and reserves Lora, Genty, and Avenir for printed artwork. Actionable scan findings: **0**.

**Visual overlays:** no reliable user-visible overlay is available. The browser JavaScript control surface was unavailable, and a fresh native Electron launch terminated before a window appeared with `TypeError: Cannot read properties of undefined (reading 'isPackaged')` inside `@electron-toolkit/utils` under Node 24/Electron 43. Browser findings therefore use current source, responsive CSS, semantics, and exact contrast calculations.

## Overall Impression

Customization and printing now receive appropriate prominence. The Editor is calmer, the preflight is concrete, shortcuts and repeat-sheet behavior improve throughput, and the product is visibly more intentional. However, the print model contains a severe contradiction: manual slot holes appear in the sheet preview but are filtered out before output. The app can therefore present an accurate-looking physical map while producing a different placement.

## What's Working

1. **Preview and preflight make the physical outcome legible.** Dimensions, barcode readiness, stock, scale, calibration, and filled count are visible near action points.
2. **Basic customization is approachable.** Choose Label is separated from advanced design tools, while per-label image overrides and reusable Designer workflows remain available.
3. **Accessibility and repeat-work foundations are thoughtful.** Labeled navigation, live regions, sheet-slot names, focus styles, reduced-motion handling, shortcuts, bulk selection, and Designer undo/redo provide a strong operating baseline.

## Priority Issues

### [P1] Manual sheet preview and output can disagree

**Why it matters:** In manual mode, `resolveSlots()` filters null assignments before PDF or print output. The preview retains all eight positions. Products assigned to slots 1 and 8 can therefore be sent as a compact two-product array and plausibly print in slots 1 and 2. This directly violates the promise of exact sheet alignment.

**Fix:** Make eight physical nullable slots the canonical output model through IPC, PDF, and print generation, or emit contiguous runs with their actual starting indices. Persist the full slot map for Repeat Last Sheet. Add a test comparing preview slot bounds with generated PDF positions.

**Suggested command:** `$impeccable harden`

### [P1] Printing lacks an authoritative final verification contract

**Why it matters:** The interface can say Ready when any one slot is filled, then reports only that the system dialog opened. It does not establish that the chosen printer, page size, orientation, scale, slot map, and calibration were actually used.

**Fix:** Consolidate one final review containing output target, stock, orientation, scale, filled-slot map, calibration, and a test-print path. Distinguish `print dialog opened` from `sent to printer`; never imply completion the app cannot verify.

**Suggested command:** `$impeccable harden`

### [P2] Customization still mixes overlapping scopes

**Why it matters:** Template selection, imported full-background artwork, per-label image overrides, and reusable Designer edits appear under one generic customization disclosure. Occasional staff cannot quickly tell whether a change affects this label or every product using the template.

**Fix:** Name the paths by effect: `Use a template`, `Customize this label only`, and `Edit reusable template`. Explain scope before navigation and default reusable-template edits to creating a copy when destructive reach is unclear.

**Suggested command:** `$impeccable clarify`

### [P2] Designer’s first viewport exceeds working-memory limits

**Why it matters:** Design choice, name, undo, redo, Add, Layers, Inspector, zoom, Fit, overflow, and Save compete before the canvas becomes the focus.

**Fix:** Anchor the toolbar around design selection, Add, and Save. Combine history and zoom into compact clusters; move import/export/delete into overflow; show a contextual empty/new-design prompt; reveal inspector controls only after selection.

**Suggested command:** `$impeccable distill`

### [P2] Sheet Builder repeats readiness instead of advancing the task

**Why it matters:** A print-readiness preflight is followed by a second colored Ready/Not Ready card and a separate Actual Size warning. This increases anxiety and makes three surfaces compete to own the same truth.

**Fix:** Collapse these into one live preflight with pass/warning rows and one next action. Keep calibration collapsed until alignment is requested or flagged.

**Suggested command:** `$impeccable distill`

## Persona Red Flags

**Jordan — occasional label maker:** Basic Editor entry is approachable, but `Import label design`, `New design`, and per-label overrides do not clearly communicate whether changes affect one product or a reusable template. Designer has no obvious first move within five seconds.

**Alex — repeat operator:** Shortcuts, bulk selection, Repeat Last Sheet, and undo/redo are meaningful gains. Manual gaps cannot reliably survive output, Repeat Last Sheet loses those empty positions, and there is no clear-sheet or duplicate-slot accelerator.

**Sam — keyboard and VoiceOver user:** Navigation, focus rings, live regions, form labels, slot names, and canvas keyboard controls are strong. Native details popovers lack explicit focus management, and layer reorder semantics remain less discoverable than pointer dragging.

**Riley — print-accuracy owner:** The preflight appears trustworthy, but the preview/output positional mismatch makes its central promise unsafe. Repeat history storing only product IDs compounds the same problem.

## Cognitive Load

Moderate overall and high locally in Designer. Three checks fail:

- **Chunking:** Designer exposes more than eight simultaneous controls before canvas work begins.
- **One thing at a time:** Sheet Builder presents preflight, readiness, calibration, layout modes, assignments, warnings, and preview simultaneously.
- **Minimal choices:** Designer and Editor output clusters exceed four visible or immediately revealed actions.

Basic Editor entry, grouping, hierarchy, working-memory support, and progressive disclosure otherwise perform well.

## Emotional Journey

- **Arrival:** calm, competent, and clearly oriented toward label work.
- **Customization:** reassuring when product changes update a large physical preview.
- **Designer valley:** the friendly Editor abruptly becomes an expert-heavy layers/canvas/inspector environment.
- **Printing peak:** the exact slot preview and preflight initially inspire confidence.
- **Printing valley:** that confidence is currently undeserved because manual holes can be lost before output and the external dialog handoff cannot prove completion.

## Minor Observations

- `Live preview — matches printed output` is too absolute until positional equivalence is guaranteed.
- Editor dirty state is only implied when Saved disappears; standardize a visible `Unsaved changes` state.
- Navy Save and green Print compete as primary actions; printing should be the staged outcome while Save reads as document state.
- Workspace titles at 13px are visually close to breadcrumb and control text.
- The Library refresh icon has a title but no explicit `aria-label`.
- Responsive rules are comprehensive, but the Sheet Builder toolbar remains at risk of awkward multi-row wrapping around its long stock badge.

## Questions to Consider

- Is the canonical output model eight physical slots including empties, or a contiguous run from one starting slot? The interface should support one explicit contract, not infer both.
- Should `Customize this label` always affect only the current product while `Edit reusable template` affects every linked product—or create a copy by default?
- Should print confidence optimize for fastest OS-dialog access or an authoritative in-app review with test printing and calibration?
- Should Designer primarily serve guided market staff or graphics-savvy operators?
