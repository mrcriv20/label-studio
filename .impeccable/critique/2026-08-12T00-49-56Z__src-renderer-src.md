---
target: Tillie Print application
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
timestamp: 2026-08-12T00-49-56Z
slug: src-renderer-src
---
# Tillie Print Design Critique — Follow-up

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|------:|-----------|
| 1 | Visibility of System Status | 3 | Strong saved, ready, sync, and output states; some failures still use native alerts. |
| 2 | Match System / Real World | 3 | Product and print language is natural; points, raw offsets, Code 128, and database language leak expertise. |
| 3 | User Control and Freedom | 3 | Unsaved Editor/Designer protection and undo/redo are strong; Settings changes remain unprotected. |
| 4 | Consistency and Standards | 3 | Cohesive visual system; Settings still mixes immediate-save Tillie controls with manual Save. |
| 5 | Error Prevention | 2 | Implicit batch selection and weak calibration validation create print risk. |
| 6 | Recognition Rather Than Recall | 3 | Most actions are labeled; calibration requires a settings detour and remembered drift. |
| 7 | Flexibility and Efficiency | 3 | Search, sort, import, shortcuts, and two sheet modes help; explicit multi-select is absent. |
| 8 | Aesthetic and Minimalist Design | 3 | Calm and coherent; Editor and Designer still expose advanced machinery too early. |
| 9 | Error Recognition and Recovery | 2 | Inline errors improved, but alerts, distant Settings errors, and invalid offset coercion weaken recovery. |
| 10 | Help and Documentation | 2 | The guide is useful but lacks calibration, offline/conflict, and Designer guidance. |
| **Total** | | **27/40** | **Acceptable; one point below Good.** |

## Design Specificity Verdict

**LLM assessment:** Tillie Print now feels substantially authored for label work rather than like a reskinned admin dashboard. The live branded label, physical sheet geometry, slot terminology, calibration values, barcode/price data, and direct printing are unmistakably product-specific. The navy shell, paper surfaces, flat borders, and compact tactile controls express The Market Workbench. The remaining weakness is information architecture: exact physical output is still represented by warnings and raw offsets instead of a confident guided workflow, while advanced label-design administration interrupts everyday product entry.

**Deterministic scan:** The CLI detector reported one finding, `overused-font`, at `src/renderer/src/index.css:78`. This is a verified false positive because DESIGN.md mandates Inter for application chrome. Browser overlays were successfully injected on Products, Editor, Print Sheet, Designer, and Settings. Many overlay hits were verified false positives from closed `<details>` menus, translated off-canvas panes, full-bleed table structure, and overlapping SVG preview layers. Verified issues included small bespoke targets, two unnamed inputs, low-contrast success/slot text, and desktop Sheet Builder clipping.

**Visual overlays:** Mutable injection succeeded in a fresh source-backed Electron instance. Annotations were removed and all critique-owned processes were stopped after inspection, so no persistent Human tab remains.

## Overall Impression

The first remediation materially improved the app: unsaved work is protected, print readiness is explicit, sync scope is calmer, language is more coherent, and row actions are substantially less noisy. The product’s visual quality now exceeds its workflow safety. The next leap is not more styling—it is making batch selection, calibration, and everyday product entry unambiguous.

## Cognitive Load

Five of eight checks fail, with load concentrated in New Product and Designer:

- **Fail — Single focus:** Basic product entry competes with template import, design creation, and appearance controls.
- **Fail — Chunking:** Designer still exposes roughly 14 toolbar decisions.
- **Pass — Grouping:** Cards, panes, borders, and proximity remain strong.
- **Pass — Visual hierarchy:** Titles, actions, notices, and supporting copy scan clearly.
- **Pass — One thing at a time:** Most screens retain a recognizable linear task.
- **Fail — Minimal choices:** Designer, navigation, and several form regions exceed four visible choices.
- **Fail — Working memory:** Calibration requires moving to Settings while remembering physical drift.
- **Fail — Progressive disclosure:** Advanced template and appearance controls precede routine fields.

## What’s Working

1. **The product outcome is tangible.** The large live label and filled physical sheet make the work real.
2. **The visual system fits the use scene.** Navy framing, paper surfaces, restrained semantic color, fine borders, and compact typography feel calm and dependable.
3. **Accessibility and status are strong.** Labels, focus, headings, live regions, navigation state, dirty-work protection, and Designer keyboard commands are meaningfully implemented.

## Priority Issues

### [P1] Print Sheet silently means the first eight sorted or filtered products

**Why it matters:** Search, category, and sort state implicitly determine the print payload. Staff may believe they opened a blank sheet builder and instead receive an unintended assortment.

**Fix:** Add explicit row selection and a selection bar with `Print sheet (N)`. With no selection, the global action opens a blank builder. Never infer a batch from row order.

**Suggested command:** `$impeccable harden`

### [P1] Exact alignment lacks a trustworthy calibration workflow

**Why it matters:** Calibration remains two raw signed-inch fields buried in Settings. Invalid values silently become zero, changes are not dirty-state protected, and the print surface cannot prove which printer/sheet profile is calibrated.

**Fix:** Build a guided calibration flow reachable from Sheet Builder: print a marked test sheet, capture measured direction and drift, constrain increments/ranges, preview before/after, save explicitly, and confirm the active sheet/printer profile.

**Suggested command:** `$impeccable shape`

### [P1] Product entry is interrupted by design administration

**Why it matters:** Template deletion/import, New design, background color, and design overrides appear before Price and Category. A clerk adding an everyday product must process exceptional design-system choices first.

**Fix:** Lead with Product, Price, Category, and barcode state. Follow with a compact template thumbnail/switcher. Put import, new design, background, images, and long-form details behind Customize label and Advanced details disclosure.

**Suggested command:** `$impeccable distill`

### [P2] Designer starts as a crowded, cropped expert tool

**Why it matters:** The default 200% zoom crops the label and the toolbar wraps while presenting document, history, insertion, zoom, overflow, and save decisions simultaneously.

**Fix:** Default to Fit label, retain user zoom after interaction, group creation under Add, and move X/Y/W/H point fields into Advanced geometry. Preserve visible Undo/Redo and Save.

**Suggested command:** `$impeccable distill`

### [P2] Desktop Sheet Builder clips primary controls

**Why it matters:** At 1280px the controls pane measured 312px client width against 341px content width, visibly truncating Assign slots manually and Start at slot.

**Fix:** Give controls a stable 420–520px width, let preview absorb remaining space, stack mode choices at the actual content breakpoint, and allow complete control labels.

**Suggested command:** `$impeccable adapt`

## Persona Red Flags

**Alex — Power User:** The 190-product library still lacks explicit multi-select. The apparent batch shortcut prints the first eight sorted/filtered rows rather than chosen products. Designer shortcuts are strong, but sheet queues/presets are absent.

**Jordan — First-Timer:** Import label design, New design, Code 128, signed-inch calibration, and point geometry appear before adequate task framing. The global Print Sheet action gives no indication that it preassigns products.

**Sam — Keyboard/VoiceOver User:** Semantic foundations are strong, but Designer resize handles and layer reordering remain pointer/drag oriented. The Editor hex background and Designer name inputs lack accessible names. Several bespoke controls remain below comfortable target size.

## Minor Observations

- Editor compact mode auto-scrolls to 430px while leaving the first field barely visible beneath a dominant preview.
- Products category chips, table sort controls, product names, Designer lock controls, and Settings disclosure controls have small hit areas.
- Success text `#16a34a` on white measured 3.3:1; empty-sheet slot numbers measured 1.4:1 at 9px.
- Tillie integration should be labeled Optional integration or moved under an Integrations section for standalone users.
- Green currently represents both readiness/success and the pre-action Print button.
- Native alerts and confirms interrupt the otherwise coherent workbench language.
- How to Use implies PLS780 is the product’s only sheet profile.

## Questions to Consider

1. When nothing is selected, should Print Sheet always mean a blank job rather than an inferred batch?
2. If exact alignment is the differentiator, should calibration become a first-class guided task rather than a Settings field pair?
3. Should daily staff encounter New design before entering a price?
4. What should the first Settings viewport communicate to a standalone customer who has never used Tillie POS?
