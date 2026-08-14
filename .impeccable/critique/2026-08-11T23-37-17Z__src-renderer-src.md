---
target: Tillie Print application
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
timestamp: 2026-08-11T23-37-17Z
slug: src-renderer-src
---
# Tillie Print Design Critique

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|------:|-----------|
| 1 | Visibility of System Status | 3 | Save and sync states are generally clear, but category changes and successful exports can feel silent. |
| 2 | Match System / Real World | 3 | Label, sheet, slot, and print language is strong; points, Code 128, URLs, and direct MongoDB setup expose implementation detail. |
| 3 | User Control and Freedom | 2 | Ordinary navigation can discard unsaved Editor or Designer work. |
| 4 | Consistency and Standards | 2 | Product naming, object language, save color, and persistence behavior diverge. |
| 5 | Error Prevention | 2 | Print and Export remain available with zero assigned sheet slots; unsaved navigation is unprotected. |
| 6 | Recognition Rather Than Recall | 3 | Stable navigation and visible tool panes help, but icon-only actions and slot-number mapping increase recall. |
| 7 | Flexibility and Efficiency | 3 | Search, sorting, import, designer shortcuts, and two sheet modes help; bulk product operations are absent. |
| 8 | Aesthetic and Minimalist Design | 2 | The system is visually disciplined, but Settings, Editor, and the Designer toolbar expose too much at once. |
| 9 | Error Recovery | 2 | Errors preserve work, but several messages are remote from the source and lack localized recovery. |
| 10 | Help and Documentation | 2 | A visible guide exists, but it is shallow, occasionally stale, and not contextual at high-risk decisions. |
| **Total** | | **24/40** | **Acceptable; important workflow improvements remain.** |

## Design Specificity Verdict

**LLM assessment:** Tillie Print is moderately authored and meaningfully product-specific. The large live label preview, artwork-oriented Designer, PLS780 sheet model, barcode fields, Tillie provenance, and physical slot language could only belong to a label-production tool. The navy shell, paper surfaces, fine borders, and restrained state colors also honor “The Market Workbench.” The identity weakens where Products and Settings revert to generic inventory/admin patterns, where Print Sheet makes the physical sheet visually secondary, and where “Tillie Print,” “Label Studio,” “New Label,” and “New Product” compete as product and object names.

**Deterministic scan:** The CLI detector reported one warning: `overused-font` at `src/renderer/src/index.css:78`. This is a false positive because Inter is explicitly documented as the operational application face; Lora, Genty, and Avenir Next Condensed remain confined to label artwork. Browser overlay evidence produced 407 rule occurrences across Products, Settings, and Designer. Most were genuine repetitions of the 10px green Tillie badge: 190 undersized-text and 190 low-contrast occurrences on the 190-row Products screen. Container-padding and label-art fallback-font warnings were verified false positives.

**Visual overlays:** Mutable injection succeeded in a fresh Electron instance, and captured overlays visibly marked issues. The critique-owned Electron window and overlay server were closed after evidence capture, so no persistent user-visible Human tab remains.

## Overall Impression

The app looks calm, credible, and operationally grounded. Its strongest moment is the label itself: staff can immediately see a tangible shelf artifact rather than a generic database record. The biggest opportunity is to make the workflow feel as trustworthy as the visual system—especially before abandoning unsaved work, changing synchronization scope, or consuming physical label stock.

## Cognitive Load

Six of eight checks fail, producing high load in the most complex workflows:

- **Pass — Single focus:** Each screen has a recognizable primary domain.
- **Fail — Chunking:** Settings exposes 30+ Tillie categories; Designer presents roughly 15 toolbar controls.
- **Pass — Grouping:** Cards, panes, borders, and proximity are consistently applied.
- **Fail — Visual hierarchy:** Print Sheet’s small preview and large unused region invert the importance of the physical output.
- **Fail — One thing at a time:** Editor exposes creation, styling, imagery, barcode, and five output actions together.
- **Fail — Minimal choices:** Product rows, Editor output, Designer tools, sheet slots, sync categories, and roll sizes exceed four visible choices.
- **Fail — Working memory:** Staff must map slot numbers to a small sheet and remember buried sync exceptions.
- **Fail — Progressive disclosure:** Sync scope and most Editor detail controls are presented upfront.

## What’s Working

1. **The label is the hero artifact.** Editor and Designer reserve real space for the output, making the app’s purpose instantly legible.
2. **The visual foundation fits the brief.** Navy framing, paper neutrals, restrained borders, semantic color, and exceptional rather than ambient shadow feel grounded without becoming harsh.
3. **The accessibility foundation is strong.** Labels, focus rings, status roles, keyboard-operable layers, shortcuts, reduced motion, and modal focus management are meaningfully implemented.

## Priority Issues

### [P1] Unsaved work can disappear during ordinary navigation

**Why it matters:** Sidebar navigation immediately unmounts Editor or Designer local state. Staff moving between Products, Designer, and Settings can silently lose work, which is especially damaging in an offline desktop tool.

**Fix:** Establish a shared dirty-workflow contract with Save, Discard, and Cancel. Apply it to sidebar navigation, back actions, switching designs, and window close; preserve recoverable drafts where practical.

**Suggested command:** `$impeccable harden`

### [P1] Print Sheet does not provide enough physical confidence

**Why it matters:** Exact alignment is a core promise, yet the sheet preview is small, effective calibration is absent, and output actions remain enabled at zero assigned slots. The riskiest task feels least verified.

**Fix:** Make the sheet the visual center, enlarge inspectable slots, spatially connect manual assignments to the sheet, display effective X/Y calibration, disable invalid output with inline explanation, and add an explicit readiness/preflight state plus test-sheet action.

**Suggested command:** `$impeccable layout`

### [P1] Tillie sync scope is an unbounded, partially silent settings wall

**Why it matters:** More than 30 categories appear at once and apply immediately without unmistakable per-change confirmation. This controls source-of-truth boundaries, so ambiguity can become an operational data problem.

**Fix:** Give integrations a dedicated settings section with category search, selected count, bulk select/clear, grouped disclosure, and either staged Apply or explicit per-change saved/reverted status. Summarize what applies to new imports, existing links, push direction, and conflicts.

**Suggested command:** `$impeccable distill`

### [P2] Product identity and object language are inconsistent

**Why it matters:** “Tillie Print,” “Label Studio,” “New Label,” “New Product,” reusable designs, and print jobs compete. First-time staff cannot form a clean mental model, and permanent market-specific copy undermines the POS-agnostic promise.

**Fix:** Commit to a vocabulary: a product owns operational data, a label is printable output, a design is reusable artwork, and a print job places labels on media. Rename stale Label Studio references and isolate market-specific configuration from general product settings.

**Suggested command:** `$impeccable clarify`

### [P2] Repeated and rare actions compete for attention

**Why it matters:** Six icon-only actions repeat across every product row, producing 190 tiny low-contrast Tillie badges and a dense action column. Editor and Designer similarly mix primary, output, document, insertion, and expert actions at equal weight. Compact navigation removes visible labels without tooltips.

**Fix:** Keep Edit and the primary print action visible; move rare row actions into a labeled More menu. Group Editor outputs under one control, divide Designer tools into document/insert/view/save groups, and retain tooltips or accessible compact labels. Replace repeated provenance badges with a filter/column or exception-only indicator, and correct badge size/contrast if retained.

**Suggested command:** `$impeccable distill`

## Persona Red Flags

**Alex — Power User:** The 190-item library has no multi-select or batch operations. Six row controls force one-at-a-time work. Manual sheets lack drag-to-slot, repeat/copy, or keyboard-efficient placement. Designer shortcuts are useful but equivalent accelerators are absent elsewhere.

**Jordan — First-Timer:** New Label opens New Product; blank previews resemble finished output; Print remains available at 0/8 slots; Designer exposes points, bindings, visibility rules, and a dense toolbar immediately; Settings exposes a full-access database URI in a staff-facing flow.

**Sam — Keyboard/Low-Vision User:** Form semantics and focus states are strong, but 28px icon-only row controls are difficult to identify, compact navigation visually removes labels without tooltips, save errors are remote from fields, and substantial guidance remains at 11px.

## Emotional Journey

- **Arrival:** Calm and credible; the market context is immediately apparent.
- **Creation peak:** The live label preview makes the work tangible and rewarding.
- **Creation valley:** Placeholder price/barcode artwork can look real while required data is empty, and the long form makes completion feel distant.
- **Sync valley:** Connection status reassures, but the category wall and full-access database language introduce anxiety.
- **Print valley:** Actual-size warnings help, but the small sheet and missing readiness state ask for trust precisely when paper will be consumed.
- **End state:** Save confirmation is solid; print/export completion often ends in a procedural native handoff rather than a confident ready-to-shelve moment.

## Minor Observations

- Repeating the Tillie pill on every synchronized product becomes clutter at scale.
- The Products empty state uses an emoji while the rest of the app uses Lucide icons.
- Settings mixes auto-applied synchronization controls with a global Save Settings action.
- Save is navy in Editor and green in Designer, weakening action-color consistency.
- Direct database setup belongs behind an administrator or advanced boundary.
- Compact Products intentionally uses an internal horizontal scroller; all six row actions remain off-screen rather than adapting.

## Questions to Consider

1. Is the user’s primary object a product, a label, or a print job—and what changes if the interface commits to that hierarchy?
2. Why is the app’s most physically consequential object, the sheet, the smallest meaningful element on its screen?
3. If a clerk has 60 seconds, which three actions deserve permanent visibility?
4. Should a staff-facing app expose a full-access MongoDB URI, or is that an administrator deployment task?
5. What proof can Tillie Print show before paper is consumed: printer profile, effective offsets, printable bounds, calibration test, and a single Ready verdict?
