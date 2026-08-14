---
target: src/renderer/src
total_score: 30
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-08-12T01-02-28Z
slug: src-renderer-src
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Saving, selection limits, readiness, calibration, and output states are strong; native dialogs still fragment feedback. |
| 2 | Match System / Real World | 4 | Product records, physical slots, sheet stock, directional corrections, and actual-size printing closely match the real task. |
| 3 | User Control and Freedom | 3 | Back paths, disclosures, manual/fill modes, and unsaved-work protection are good; product editing has no visible undo. |
| 4 | Consistency and Standards | 3 | The workbench system is cohesive, but native alerts/confirms and scattered interaction exceptions remain. |
| 5 | Error Prevention | 3 | Required fields, explicit selection, sheet limits, disabled actions, and calibration bounds prevent common mistakes; final print assumptions remain distributed. |
| 6 | Recognition Rather Than Recall | 3 | Labels, previews, hints, and directional calibration language reduce recall; template/design/override relationships still need interpretation. |
| 7 | Flexibility and Efficiency | 2 | Import, duplication, sorting, selection, and sheet modes help; shortcuts, repeat jobs, recent choices, and bulk editing are underdeveloped. |
| 8 | Aesthetic and Minimalist Design | 3 | Restrained, tactile visual language is disciplined; the editor gives too much width to inert canvas and too little to the working inspector. |
| 9 | Error Recovery | 3 | Most errors are specific and preserve work; native dialogs detach recovery from the initiating control. |
| 10 | Help and Documentation | 3 | How to Use, contextual hints, and calibration steps are useful; the final physical-print handoff lacks a unified preflight. |
| **Total** | | **30/40** | **Good — operationally sound, with workflow-composition and throughput opportunities.** |

## Design Specificity Verdict

**Strongly product-specific.** The label artifact, barcode and price fields, template controls, physical PLS780 sheet, slot assignment, calibration, and optional Tillie sync make this unmistakably a market label-production tool. The navy shell, paper-like workspaces, fine borders, compact type, and tactile pills clearly express “The Market Workbench” without drifting into corporate SaaS or industrial harshness.

The remaining generic note is compositional: the Editor still resembles a conventional inspector-based design application. A very large neutral center canvas surrounds a modest label while a narrow, long-scrolling property rail carries nearly all the work. The artifact is specific; the workspace choreography could be more specific to fast market-counter operation.

**Deterministic scan:** one raw warning at `src/renderer/src/index.css:78`: `overused-font` for Inter. This is a verified false positive because `DESIGN.md` explicitly mandates Inter for application chrome. Actionable detector findings: **0**.

**Visual overlays:** no reliable user-visible overlay is available. The in-app browser control surface was unavailable, and the fresh native Electron fallback exited before opening a window with `TypeError: Cannot read properties of undefined (reading 'isPackaged')`. Assessment A obtained one current Editor capture, but its window could not be safely attributed to the critique-owned process, so it was used conservatively for composition only. Responsive and accessibility conclusions otherwise use current source and exact contrast calculations.

## Overall Impression

Tillie Print now feels credible, calm, and purpose-built. The earlier high-risk failures—implicit sheet contents, buried raw calibration, clipped controls, crowded initial creation, and cropped Designer orientation—have been meaningfully addressed. The biggest opportunity is to make the Editor’s physical layout reflect the actual work: less inert preview space, more usable editing space, and one decisive print-readiness summary at the handoff.

## What's Working

1. **The physical artifact is the hero.** A production-like branded label—not a dashboard abstraction—anchors template, barcode, price, and imagery decisions.
2. **Print alignment is concrete and trustworthy.** PLS780 capacity, explicit selection, slot limits, constrained offsets, directional correction hints, test printing, and actual-size language acknowledge real physical failure modes.
3. **The design system fits the operating environment.** Navy framing, paper-gray working areas, quiet borders, restrained semantic color, and compact typography feel grounded and confident. Exact measured contrast passes for primary text, statuses, and the current green Print action.

## Priority Issues

### [P1] The Editor allocates space opposite to task effort

**Why it matters:** The preview sits in a large gray field with substantial unused space while the inspector carries nearly every decision in a narrow, vertically dense rail. Staff repeatedly scan and edit the rail, so the labor-intensive part receives the least room and requires excessive scrolling.

**Fix:** Use a balanced or resizable two-pane layout with a wider contextual inspector. Keep the label centered, but use nearby space for compact output facts—template, physical size, barcode state, and background. Let opened groups expand without pushing all later fields far below the fold.

**Suggested command:** `$impeccable layout`

### [P1] Final print confidence is distributed instead of summarized

**Why it matters:** Readiness, calibration offsets, stock, and actual-size guidance live in different moments. A digitally correct label can still waste physical stock through a wrong page size, scale, orientation, or stale calibration.

**Fix:** Place one persistent preflight beside Print/Export showing sheet stock, filled slots, calibration offsets, page size, required scale, and missing-data warnings. Give it one decisive readiness state and a clear `Review setup` escape hatch.

**Suggested command:** `$impeccable harden`

### [P2] Template customization still presents too many parallel concepts

**Why it matters:** Even behind disclosure, template selection, deletion, import, Designer editing, new design creation, image overrides, and background override appear as one conceptual block. Occasional staff must understand subtle distinctions before completing a routine label.

**Fix:** Separate `Choose label` from `Customize design`. Make the common path a visual template choice with a recommended default; nest import, deletion, Designer, image overrides, and background under a second advanced customization step.

**Suggested command:** `$impeccable distill`

### [P2] Status and recovery patterns remain fragmented

**Why it matters:** Inline notices coexist with native `alert()` and `confirm()` for deletion, imports, empty sheets, export failures, and print failures. This breaks the calm workbench language and separates recoverable errors from their source.

**Fix:** Standardize non-destructive results and recoverable errors as inline banners or lightweight toasts near the initiating control. Reserve modal confirmation for deletion and abandoning unsaved work, with explicit recovery actions.

**Suggested command:** `$impeccable harden`

### [P2] Expert throughput is underdeveloped

**Why it matters:** Daily operators still repeat pointer and scrolling work despite having import, duplicate, filters, selection, and sheet modes. The source shows no clear global shortcuts, recent choices, reusable sheet jobs, or bulk-edit workflow.

**Fix:** Add documented accelerators for save, new product, search, print sheet, and preview fit; remember recent templates and print configurations; add `Repeat last sheet` or reusable sheet presets. Give the Designer chooser a stable accessible name while touching keyboard workflows.

**Suggested command:** `$impeccable optimize`

## Persona Red Flags

**Mara — time-pressured market staff:** A quick price or barcode change can still feel like entering a design application because the tall inspector and customization vocabulary dominate the editing experience. The final Print action does not consolidate every physical assumption she needs before committing stock.

**Jordan — occasional, non-technical staff:** `Template`, `design`, `design image`, and `override` are adjacent concepts with insufficient separation. The calibration directions are good, but the overall printer/page-size/scale state is not summarized at the decision point.

**Alex — keyboard-heavy repeat operator:** Sorting, selection, import, duplication, and Designer keyboard controls are meaningful strengths. However, routine navigation, product creation, sheet reuse, and common print actions lack visible accelerators or repeat-job affordances. Desktop small buttons remain 28px, though coarse-pointer layouts correctly increase common targets to 44px.

**Riley — print-accuracy owner:** Explicit selection and bounded calibration have removed serious ambiguity. Riley still cannot audit sheet stock, calibration, page size, scale, orientation, filled slots, and missing data in one final preflight.

**Casey — standalone or future multi-POS customer:** `Tillie POS · Optional integration` correctly protects the independent product identity. Future integration screens must preserve a provider-neutral structure and treat Tillie as the configured provider, never as a core dependency.

## Cognitive Load

Moderate, with three main failures:

- **Chunking:** the Editor inspector still becomes one long rail of template, customization, imagery, core data, and advanced details.
- **Visual hierarchy:** a large calm preview field receives more space than the dense working inspector.
- **Minimal choices:** opening customization reveals more than four parallel concepts and actions.

Grouping, live preview, separate Designer/Sheet workflows, disclosures, and calibration guidance now pass. The remaining problem is attention imbalance rather than raw feature count.

## Emotional Journey

- **Arrival:** friendly, credible, and clearly purpose-built.
- **Creation peak:** the branded live label makes the task feel achievable immediately.
- **Primary valley:** the inspector becomes administrative and scroll-heavy.
- **High-stakes valley:** printing remains physically consequential, but confidence is split across several UI moments.
- **End:** the Ready state and actual-size language reassure, but a compact final preflight would create a more conclusive finish.

## Minor Observations

- The Designer’s design-selector `<select>` lacks a stable accessible name in current source.
- The Products header action group does not wrap in source and may pressure very narrow compact widths; runtime dimensions could not be verified in this run.
- The warning icon color is only 2.07:1 on its pale warning background; adjacent text carries the instruction, but the icon should not be the sole semantic signal.
- The emoji empty-state storefront is friendly but less authored than the rest of the visual system.
- Grouping Settings and How to Use at the bottom of navigation would clarify the hierarchy of six equal-weight destinations.
- `New Label` may better match the user’s intended outcome than `New Product` if those records are always created together.

## Questions to Consider

- If accurate physical output is the promise, should `ready to print` become the primary state of the whole workflow rather than a Sheet Builder message?
- Could clicking name, price, barcode, or imagery on the preview focus the corresponding inspector control?
- Would a `Quick label` mode—name, price, barcode, template, print—cover most daily work while preserving the current form as `Full details`?
- Which should the interface treat as more expensive: wasting a sheet of stock or taking ten seconds to verify setup?
