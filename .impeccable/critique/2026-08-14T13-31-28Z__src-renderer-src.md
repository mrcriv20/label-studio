---
target: src/renderer/src
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-08-14T13-31-28Z
slug: src-renderer-src
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Strong loading, dirty, output, and readiness states; print completion cannot be verified after the system dialog opens. |
| 2 | Match System / Real World | 4 | Eight physical slots, PLS780 stock, Letter portrait, inches, offsets, and Actual Size closely match the real task. |
| 3 | User Control and Freedom | 2 | Guards and Designer history are good; the print-review modal lacks complete keyboard dismissal, containment, and focus return. |
| 4 | Consistency and Standards | 3 | Cohesive visual system; terminology and output hierarchy drift between Editor, Sheet Builder, and How to Use. |
| 5 | Error Prevention | 3 | Eight-slot output is correct and validation is strong; PDF and test routes can bypass the authoritative final review. |
| 6 | Recognition Rather Than Recall | 3 | Preflight and scope copy help; users still need to interpret several customization inheritance levels. |
| 7 | Flexibility and Efficiency | 3 | Shortcuts, repeat sheet, duplicate slot, bulk selection, and Designer history help; multi-slot operations remain limited. |
| 8 | Aesthetic and Minimalist Design | 3 | Calm, task-first workbench; Designer remains dense and print facts repeat between inline preflight and modal. |
| 9 | Error Recovery | 3 | Most messages preserve work and guide recovery; temporary print files can leak on failures and cancellation/device failure are not distinguished. |
| 10 | Help and Documentation | 2 | Print guidance is strong, but Designer lacks contextual onboarding and How to Use does not teach customization scope. |
| **Total** | | **29/40** | **Good specialist foundation; print authority and customization structure remain incomplete.** |

## Design Specificity Verdict

**Clearly authored for Tillie Print.** The navy workbench shell, market product library, physical-label previews, PLS780 terminology, eight-position sheet map, calibration offsets, Actual Size guidance, and reusable-template versus product-instance distinction form a credible specialist production tool. Sheet Builder carries the strongest specificity; Library and Settings retain more generic desktop CRUD structure, while Designer resembles a compact vector editor grounded by product-field bindings and label presets.

**Deterministic scan:** exactly one `overused-font` warning at `src/renderer/src/index.css:78` for Inter. This is a contextual false positive because DESIGN.md explicitly mandates Inter for operational chrome and reserves distinctive fonts for printed artwork. Actionable detector findings: **0**.

**Visual overlays:** no reliable overlay is available. The browser JavaScript control surface was absent, and a fresh Electron launch crashed before opening a window because `@electron-toolkit/utils` attempted to read an undefined `isPackaged` property under Node 24/Electron 43. Runtime conclusions therefore use source/CSS evidence; the production build itself passed.

## Overall Impression

The eight-slot physical model is now correct and consistent through renderer state, repeat history, preload, IPC, PDF export, and printing. Empty positions survive to output, and the review accurately names occupied slots and calibration. This removes the prior production-integrity failure.

The score remains flat because the next layer of the promise is incomplete: Review & Print is described as authoritative but can be bypassed through Export PDF and calibration/test actions; test and final printing produce the same artifact; customization scopes are explained but still structurally combined; and the high-stakes modal is not yet a complete keyboard-accessible dialog.

## What's Working

1. **Eight-slot physical truth is excellent.** State, preview, persistence, IPC, PDF layout, and printing all retain null positions and use the same PLS780 geometry.
2. **Review & Print is a credible checkpoint.** It names output target, stock, orientation, scale, occupied slots, calibration, and the limit of app-level completion knowledge.
3. **Customization and accessibility foundations have improved.** Per-label overrides explicitly say they affect one product, reusable actions are named, dirty states are visible, and keyboard/status infrastructure is strong.

## Priority Issues

### [P1] The authoritative print checkpoint remains bypassable

**Why it matters:** Export PDF and inline test printing can produce printable output without passing the final review. `test` and `final` call the same print API with the same label sheet, so test is currently only a different outcome message.

**Fix:** Route Print, test output, and PDF export through one review state. Make test purpose explicit—alignment test, content proof, or full-stock test—and generate a calibration-specific artifact when alignment is the purpose. Attach PDF export to the verified setup summary.

**Suggested command:** `$impeccable harden`

### [P1] Customization scopes are explained but structurally mixed

**Why it matters:** A single disclosure still contains reusable-template removal/import/creation, per-label image overrides, and a per-label background inheriting from global settings. Avoiding accidental shared changes depends on reading multiple helper paragraphs.

**Fix:** Split the interface into explicit `This label` and `Reusable template` sections or tabs. Show inheritance directly: `Template default → Global setting → This-label override`. Move destructive reusable-template administration out of routine product editing.

**Suggested command:** `$impeccable distill`

### [P2] The print-review dialog lacks full modal behavior

**Why it matters:** The highest-stakes confirmation has no initial focus, focus trap, Escape close, or focus restoration. Keyboard and screen-reader users can navigate behind it.

**Fix:** Focus the dialog or safest action on open, contain Tab/Shift-Tab, close on Escape, optionally support safe backdrop dismissal, restore focus to Review & Print, and announce launch progress inside the dialog.

**Suggested command:** `$impeccable audit`

### [P2] Designer simplification stops before the workflow level

**Why it matters:** Users still encounter document selection, New, rename, history, five Add types, zoom, file actions, layers, canvas, preview product, and a long inspector on one surface.

**Fix:** Default to an Essentials inspector for content/source, font, size, color, and alignment. Keep geometry, visibility, opacity, and layer mechanics under Advanced. Add a first-use scaffold: choose size, add or bind content, select preview product, save.

**Suggested command:** `$impeccable onboard`

### [P2] Edge cases weaken otherwise strong print hardening

**Why it matters:** Fill quantity can display a value above remaining capacity; calibration saves X and Y independently and can partially succeed; failed print flows can leak temporary PDFs because cleanup is scheduled only after success.

**Fix:** Clamp quantity to `8 - startSlot + 1`; save calibration atomically or roll back X if Y fails; schedule temp cleanup in `finally` and settle print promises on closed-window or timeout paths.

**Suggested command:** `$impeccable harden`

## Persona Red Flags

**Alex — repeat operator:** Shortcuts, Repeat Last Sheet, duplicate slot, and Designer history are valuable. Sheet work still lacks broader keyboard slot operations, and the review cannot be dismissed with Escape.

**Jordan — occasional label maker:** Product creation is clear, but template, reusable template, global default, design, and custom form a taxonomy learned through helper copy rather than visible structure. Designer offers no ordered first-success path.

**Sam — keyboard and VoiceOver user:** Focus styles, live regions, labels, and keyboard canvas controls are strong. The modal lacks containment/restoration, layer reorder shortcuts are undisclosed, and eight resize handles produce a noisy tab sequence.

**Riley — print-accuracy owner:** Physical positions are now trustworthy. Riley can still bypass the final review through PDF or test output, and the app cannot distinguish cancellation from printer failure.

## Cognitive Load

Moderate overall, with three failures:

- **Chunking:** Designer inspector groups routinely expose more than four peer controls.
- **One thing at a time:** Designer combines document management, element creation, layers, canvas work, zoom, and property editing.
- **Minimal choices:** primary navigation, Add choices, canvas presets, and visibility options exceed four.

Editor disclosures and Sheet Builder preflight otherwise provide strong grouping, hierarchy, progressive disclosure, and working-memory support.

## Emotional Journey

- **Arrival:** calm and capable.
- **Editing:** confidence grows through physical preview, dirty state, and validation.
- **Customization valley:** scope still requires careful reading.
- **Sheet peak:** numbered fixed slots and occupied-position review feel tangible and trustworthy.
- **Print valley:** authority is diluted by bypass routes and a test action that behaves like final printing.
- **End:** the honest completion disclaimer is responsible but needs a next verification choice such as `Printed correctly` or `Needs calibration`.

## Minor Observations

- How to Use says `New Product`; the interface says `New Label`.
- How to Use says `Calibrate this sheet`; the actual action says `Calibrate or test this sheet`.
- Designer references `Avery sheet slot` while the primary stock is PLS780; clarify whether this is compatible or legacy.
- Green Review & Print and navy Export PDF still compete as primary-looking outputs.
- Some success messages persist indefinitely.
- Critical layout and semantic styles remain heavily inline, increasing design-system drift risk.
- The Designer layer listbox contains a duplicated accessible label in source.
- The compact Sheet Builder toolbar may wrap awkwardly around its title, badge, and actions.

## Questions to Consider

- If Review & Print is authoritative, should any printable output bypass it?
- Is test printing intended to verify alignment, content, or the full final sheet?
- Should ordinary product editors ever have access to deleting a shared template?
- What is the smallest Designer path that produces a useful label without teaching points, layers, opacity, and visibility first?
