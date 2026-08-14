---
target: src/renderer/src
total_score: 32
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-08-14T14-38-34Z
slug: src-renderer-src
---
# Tillie Print Renderer Critique

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4/4 | Saved, proposed, dirty, output, readiness, and recovery states are consistently visible. |
| 2 | Match System / Real World | 4/4 | PLS780 stock, eight physical slots, Actual Size, and measured drift language closely match the physical workflow. |
| 3 | User Control and Freedom | 3/4 | Rollback, undo/redo, clear/repeat, modal dismissal, and focus restoration are strong; destructive template deletion still relies on a blunt native confirmation. |
| 4 | Consistency and Standards | 3/4 | The Market Workbench system is coherent, but primary-action color and menu behavior still vary and inline styling remains widespread. |
| 5 | Error Prevention | 2/4 | Fit checks protect Editor PDF and sheet output, but SVG, roll print, and direct IPC output can bypass them; Designer templates are excluded. |
| 6 | Recognition Rather Than Recall | 3/4 | Scope copy, preview, and preflight help; Designer still assumes familiarity with binding, visibility, auto-fit, and canvas terminology. |
| 7 | Flexibility and Efficiency | 3/4 | Shortcuts, fill/manual modes, duplicate, repeat sheet, and bulk selection are strong; shortcut discovery and large template-list navigation are limited. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Grounded and restrained overall; Designer and the Settings font section remain decision-dense. |
| 9 | Error Recovery | 3/4 | Settings rollback and managed asset cleanup are sound; cleanup failure is silent and several async failures lack direct retry actions. |
| 10 | Help and Documentation | 4/4 | How To and contextual guidance clearly cover slots, Actual Size, calibration, and customization scope. |
| **Total** | | **32/40** | **Good** |

## Design Specificity Verdict

**LLM assessment:** Tillie Print is strongly product-authored. The navy counter shell, paper work surfaces, PLS780 sheet map, exact eight-position model, calibration language, label preview, per-label customization, and reusable-template boundary make it recognizably market label-production equipment. The Designer still borrows familiar vector-editor conventions, but the product as a whole is not interchangeable with generic SaaS.

**Deterministic scan:** One raw warning, `overused-font`, at `src/renderer/src/index.css:78` for Inter. This is a verified contextual false positive because `DESIGN.md` explicitly commits Inter to compact operational chrome and reserves distinctive fonts for label artwork. Actionable deterministic count: zero.

**Visual overlays:** No reliable user-visible overlay is available. The required mutable in-app browser JavaScript surface was not exposed, so fresh runtime screenshots and detector injection could not be performed. Current source, responsive CSS, and a successful production build were used as fallback evidence.

## Overall Impression

Tillie Print now handles its physical workflow with unusual care. Four of the five latest priorities are genuinely closed. The remaining weakness is architectural rather than cosmetic: output eligibility is enforced by selected renderer screens instead of being a single authoritative contract shared by every export and print path.

### Cognitive Load

Moderate overall. Products, Editor, and Sheet Builder support recognition well. Designer remains the concentrated load point: document selection, naming, history, a five-item Add menu, Layers, Inspector, zoom, secondary actions, and Save all appear before the user establishes a main task. Settings' font section similarly presents three font roles, three acquisition paths, and a Google-family input together.

The compact Designer drawers successfully reduce spatial crowding, but they do not reduce decision density.

### Emotional Journey

Products feels grounded and direct. Editor builds confidence through preview, scope copy, and content-fit messaging. The print review remains the emotional peak: stock, slot map, calibration, scale, and honest completion language create trust. That trust drops if staff use a faster output route that bypasses fit checks. Calibration is now materially clearer through saved-versus-proposed values, though the alignment pattern's relationship to offsets needs one final sentence. Designer remains the emotional valley for non-designers because its first viewport still presents expert decisions simultaneously.

## What's Working

1. **Settings rollback is real.** Previewed page and label-font selections restore to the persisted snapshot when changes are discarded. Imported fonts are intentionally immediate and the copy discloses that exception.
2. **Draft asset cleanup has a safe lifecycle.** Unsaved new files are deleted on abandonment, prior saved files survive discard, replaced originals are removed only after a successful save, and deletion is restricted to managed directories.
3. **Calibration and compact Designer behavior are substantially improved.** Saved and proposed offsets are distinct; compact drawers add a scrim, inert background, focus containment, Escape dismissal, and focus return.

The exact eight-slot model also remains intact through preview, PDF generation, repeat sheet, and printing.

## Priority Issues

### [P1] Output eligibility is not a centralized contract

**Why it matters:** Single SVG export and roll printing do not use the clipping guard. Main-process IPC handlers also accept products and sheets without checking fit, so future UI paths or direct preload calls can bypass the safety promise.

**Fix:** Create one authoritative output-preflight function used by single PDF, SVG, roll print, sheet PDF, and sheet print. Enforce it again in the main process and return structured product/field/slot issues to the renderer. UI checks should improve feedback, but main-process checks must protect correctness.

**Suggested command:** `$impeccable harden`

### [P1] Content-fit confidence is heuristic and excludes reusable Designer templates

**Why it matters:** The current character-count model is intentionally conservative but does not use the embedded export font metrics. `design-*` templates are skipped even though their resolver can reach minimum font size or clip at maximum lines. Tillie Print cannot yet promise that `Fits` means nothing is clipped.

**Fix:** Report clipping from the authoritative render pipeline. Fixed templates should use the same font widths and line limits as PDF export. Designer resolution should expose minimum-size and clipped-frame results per bound field. Return `Fits`, `Tight`, or `Clipped` with the exact field and template element.

**Suggested command:** `$impeccable harden`

### [P2] Calibration-pattern causality needs one explicit contract

**Why it matters:** Saved and proposed offsets are now clear, but `Print Alignment Pattern` sits beside the unsaved proposal without explaining whether the pattern includes either offset. Users can still wonder whether they are testing geometry or the proposed correction.

**Fix:** Label the alignment pattern as `geometry-only — current and proposed offsets are not applied`, or generate a separate `Test proposed correction` output. Keep the card open after saving when retesting is the expected next step.

**Suggested command:** `$impeccable clarify`

### [P2] Designer decision density remains high

**Why it matters:** Responsive containment is solved, but novice staff still confront design selection, naming, history, five Add choices, Layers, Inspector, zoom, More, and Save simultaneously. The Add menu also mixes element type with image source.

**Fix:** Group Add into Text, Barcode, Shape, and Image; choose product logo versus uploaded image after inserting Image. Make the Inspector contextual, collapse canvas settings after setup, and provide searchable template switching once the list grows.

**Suggested command:** `$impeccable distill`

### [P2] Template and font acquisition need clearer grouping

**Why it matters:** Built-in labels, imported artwork, and reusable Designer templates share selectors without visible grouping. Settings presents installed font roles and three acquisition methods as one decision surface.

**Fix:** Group template options by source and explain whether each supports automatic content fields. Split Settings into `Installed fonts` and a collapsed `Add a font` section, clearly marking Google Fonts as network-dependent while preserving offline use of installed fonts.

**Suggested command:** `$impeccable distill`

## Persona Red Flags

**Morgan, busy market employee:** Morgan may use Products-row PDF or roll print as the fastest route and assume it has the same clipping protection as Sheet Builder. Output safety must not depend on navigation path.

**Jordan, first-time user:** Products and Editor are approachable, but Designer terms such as binding, visibility predicate, points, and auto-fit still require graphics-tool knowledge. The five-way Add menu is an early hesitation point.

**Alex, high-throughput operator:** Bulk sheet selection, repeat-last-sheet, shortcuts, and exact slot mapping are strong. Alex needs consistent preflight across every output route and better shortcut discovery for slot assignment and sheet modes.

**Sam, keyboard or low-vision user:** Review dialogs and compact Designer drawers have strong focus behavior. Remaining risks are undisclosed keyboard layer-reordering shortcuts, native details menus with inconsistent dismissal semantics, and icon-only compact navigation for sighted low-vision orientation.

## Minor Observations

- Content-fit blocking currently covers Editor PDF and sheet paths but not Editor SVG or roll print.
- The calibration card should distinguish a geometry pattern from a corrected test output.
- Google Fonts acquisition is network-dependent; make that exception explicit within an offline-first product.
- `Choose Label` is less precise than `Label template`.
- Designer onboarding appears whenever the document is dirty, so experienced users repeatedly see tutorial-like progress.
- Products' selection-limit warning should dismiss or clear automatically once selection returns below eight.
- Template provenance such as EPS, points, and storage paths belongs under technical details.
- A pre-existing localhost process on port 5173 was observed during assessment and deliberately left untouched.

## Questions to Consider

1. Is Tillie Print willing to promise that `Fits` means no printable field will be clipped? If so, render-pipeline measurement is mandatory.
2. Should reusable templates be allowed to save when sample content reaches minimum font size, or should that require an explicit template-author warning?
3. Should the alignment pattern always be geometry-only, with a separate corrected test sheet?
4. As template libraries grow, should staff choose by label purpose, template source, or recent use first?
