---
target: src/renderer/src
total_score: 31
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
timestamp: 2026-08-14T14-15-07Z
slug: src-renderer-src
---
# Tillie Print Renderer Critique

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Output, save, sync, dirty, readiness, and failure states are visible; calibration does not clearly distinguish calculated values from saved values. |
| 2 | Match System / Real World | 4/4 | PLS780 stock, eight physical slots, inches, drift direction, Actual Size, and macOS print-dialog limits match the real task exceptionally well. |
| 3 | User Control and Freedom | 3/4 | Undo, reset, dirty guards, modal Escape/focus behavior, and repeat-sheet controls are strong; discarded Settings appearance changes remain applied in the current session. |
| 4 | Consistency and Standards | 3/4 | The Market Workbench system is coherent, but staged Settings saving is mixed with immediate visual/font mutations and pervasive inline styles. |
| 5 | Error Prevention | 3/4 | Review gating, slot limits, calibration bounds, barcode validation, and destructive confirmation are strong; printed text can still clip without a content-fit gate. |
| 6 | Recognition Rather Than Recall | 3/4 | Visible previews and instructions help, but template inheritance, hidden secondary actions, and calculated-versus-saved calibration still require interpretation. |
| 7 | Flexibility and Efficiency | 3/4 | Strong shortcuts, fill/manual modes, repeat-last-sheet, bulk selection, and Designer manipulation; sheet assignment and output shortcuts remain limited. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Calm, flat, bordered, and restrained; Designer and the long Settings stack remain locally dense. |
| 9 | Error Recovery | 3/4 | Errors are generally local and work-preserving; canceled new-label asset uploads can become orphaned and deletion remains irreversible. |
| 10 | Help and Documentation | 3/4 | Task help and contextual print guidance are good; advanced Designer and calibration concepts still need closer in-flow examples. |
| **Total** | | **31/40** | **Good** |

## Design Specificity Verdict

**LLM assessment:** Strongly product-authored. Tillie Print could not be swapped unchanged into a generic CRUD application. The exact PLS780 geometry, eight-position spatial model, label-artwork preview, per-label overrides versus reusable templates, market-counter language, calibration workflow, and honest print completion contract create a credible specialist workbench. Settings and portions of Designer use familiar administrative/editor structures, but their content remains grounded in label production.

**Deterministic scan:** One warning: `overused-font` in `src/renderer/src/index.css:78` for Inter. This is a verified contextual false positive. `DESIGN.md` explicitly assigns Inter to compact operational app chrome and reserves distinctive fonts for printed label artwork. No actionable deterministic findings remain.

**Visual overlays:** No reliable user-visible overlay is available. The required in-app browser JavaScript control surface was not exposed, so mutable injection and fresh runtime screenshots could not be performed. The visual assessment therefore uses current source, responsive CSS, and a successful production build as fallback evidence.

## Overall Impression

Tillie Print now feels like dependable market equipment rather than generic SaaS. Its highest-stakes moment—composing and reviewing a physical sheet—is unusually trustworthy. The biggest remaining opportunity is to make the data lifecycle as trustworthy as the print review: what is saved, what is merely previewed, what will fit, and what gets cleaned up after cancellation must be unambiguous.

### Cognitive Load

Overall load is moderate. Five of eight checks pass: single focus, grouping, visual hierarchy, working-memory support, and progressive disclosure. Three fail locally:

- **Chunking:** Designer and Settings expose more than four peer groups in one scan.
- **One thing at a time:** Sheet Builder combines readiness, calibration, composition, assignment, and preview; Designer combines document, canvas, layers, content, and inspection.
- **Minimal choices:** Six primary navigation destinations, a control-heavy Designer toolbar, eight Settings sections, and advanced Editor options exceed four visible choices.

The eight sheet slots are unavoidable domain complexity and are correctly spatially grouped. Designer complexity is the main source of avoidable load.

### Emotional Journey

Products opens calmly and Editor builds confidence through live preview and print-specific readiness. Designer is still the emotional valley: a market employee can feel they are operating a graphics package with the ability to damage a reusable template. Calibration recovers confidence through plain-language direction and measurement, but its calculate-then-save sequence creates a small moment of doubt. Review & Print is the peak: stock, slots, offsets, scale, and honest completion language make the physical outcome feel controlled.

## What's Working

1. **Physical output is modeled as truth.** Eight nullable slots are preserved through preview, PDF, and printing; empty positions do not collapse. Both Print and PDF require an action-specific review.
2. **Calibration is concrete and product-specific.** The alignment pattern, directional measurement language, bounded offsets, Actual Size warning, and visible occupied-slot map connect software decisions to paper.
3. **Customization scope is much clearer.** “Customize this label only” is separated from reusable-template work in Designer, reducing accidental shared changes. Keyboard, focus, status, dirty-state, and coarse-pointer foundations are also strong.

## Priority Issues

### [P1] Settings discard does not restore previewed appearance

**Why it matters:** Background and label-font choices immediately mutate the live document, but confirming Discard only navigates away. The persisted settings stay unchanged while the current interface can continue looking changed, undermining the meaning of Save and Discard.

**Fix:** Snapshot applied appearance settings when Settings opens and restore them on discard/unmount, or make appearance explicitly instant-apply and remove staged Save semantics for those fields. Keep one model across color, font selection, and imported font assets.

**Suggested command:** `$impeccable harden`

### [P1] Printed-content fit is not validated

**Why it matters:** Long names, ingredients, or instructions can overflow fixed label zones or become unreadably small. That can waste stock even after a user passes the authoritative review.

**Fix:** Use the same layout metrics as export to classify each printed field as `Fits`, `Tight`, or `Clipped`. Show the status in Editor preflight and the output review. Block final output only for confirmed clipping, with direct recovery options: shorten text, hide the field, or choose another template.

**Suggested command:** `$impeccable harden`

### [P1] Canceled new-label uploads can leave orphaned assets

**Why it matters:** Barcode, logo, and design-slot files are persisted under temporary product IDs before the product is saved. Removing the asset or abandoning a new label clears React state but does not delete the stored file.

**Fix:** Create a draft asset session with an explicit commit/rollback lifecycle. Promote files when the product receives its permanent ID; delete draft assets on remove, discard, and expired-session cleanup. Add a startup sweep for abandoned draft directories.

**Suggested command:** `$impeccable harden`

### [P2] Calibration's intermediate state is ambiguous

**Why it matters:** “Apply measured correction” calculates new signed values, but a separate Save action makes it unclear whether preview and output already use them.

**Fix:** Rename the first action to `Calculate correction`, show `Proposed` beside `Currently saved`, and make `Save & update preview` the single unmistakable primary action. Keep signed values under Advanced.

**Suggested command:** `$impeccable clarify`

### [P2] Compact Designer remains an overlay, not a complete compact interaction model

**Why it matters:** At narrow macOS window widths, Layers and Inspector slide over the canvas without a scrim, inert background, focus containment, or explicit Escape/canvas dismissal. The icon-only navigation rail also weakens sighted orientation.

**Fix:** Give Designer drawers modal-like compact behavior: scrim, Escape/canvas close, focus containment, correct focus return, and mutually exclusive drawers. Keep a visible compact workspace label or persistent tooltip/popover for the navigation rail. Stage first-run Designer work around `Choose size → add field/logo → preview → save`.

**Suggested command:** `$impeccable adapt`

## Persona Red Flags

**Jordan, first-time market employee:** Products and basic Editor are approachable, but `PLS780`, `Code 128`, reusable-template inheritance, and signed offsets still require translation. Jordan may believe a calculated calibration correction is already saved, or trust a preview whose long text will clip in output. Designer exposes too much before the first meaningful action.

**Alex, high-throughput operator:** Bulk sheet selection, repeat-last-sheet, Cmd shortcuts, and Designer accelerators are strong. Alex still lacks efficient keyboard slot assignment/mode switching, broader batch output, and a quick way to confirm content fit across all eight labels.

**Sam, keyboard and low-vision user:** Dialog semantics, focus rings, live regions, labeled sheet slots, and keyboard Designer manipulation are strong. Compact Designer drawers can leave focus behind the visible pane; native details/popovers do not consistently advertise Escape behavior; the keyboard layer-reorder shortcut is not discoverable from its accessible label.

**Morgan, interrupted market-floor staff:** The exact sheet map and honest output status suit a busy counter. The two highest trust failures are physical waste: clipped content that passes review, and calibration values that appear applied before they are saved.

## Minor Observations

- Tillie POS Sync leads Settings. Add a clear `Optional — Tillie Print works offline without a POS` line or a quieter disconnected state so standalone value remains obvious.
- Single-label PDF export from Products is immediate, while sheet PDF requires review. Clarify that the authoritative physical-sheet review applies specifically to sheet output, or add a smaller single-label fidelity confirmation.
- Font import is an immediate persisted action inside an otherwise staged Settings surface; label that behavior explicitly.
- Designer onboarding remains visible for most dirty, low-element documents and may compete with the toolbar during routine work.
- Template provenance such as points, EPS format, and storage location is useful but developer-like; place it under a disclosure.
- Large lazy chunks for label SVG rendering and barcode generation merit first-open performance measurement, especially on older market Macs.
- Inline styling remains pervasive, increasing token drift and making responsive refinement harder.

## Questions to Consider

1. Should confirmed text clipping block both Print and PDF, or should managers be able to override it after an explicit warning?
2. Is calibration really global, or should offsets belong to a printer-and-stock profile?
3. Should imported fonts and visual appearance be staged together under Save, or should the entire appearance section be clearly instant-apply?
4. Would routine staff be better served if Designer were labeled as an advanced/admin workspace while Products, Editor, and Sheet Builder formed the everyday path?
