---
name: Tillie Print
description: A grounded market-workbench interface for accurate label operations.
colors:
  workbench-navy: "#1a2332"
  workbench-navy-hover: "#2a3850"
  market-green: "#2d8f2d"
  market-green-bright: "#4cad4c"
  paper-gray: "#f4f5f7"
  white: "#ffffff"
  slate-body: "#64748b"
  slate-muted: "#526173"
  slate-strong: "#334155"
  slate-tertiary: "#475569"
  border: "#e2e8f0"
  border-soft: "#e8eaed"
  panel: "#f0f2f5"
  neutral-soft: "#f8fafc"
  neutral-subtle: "#f1f5f9"
  neutral-canvas: "#fafafa"
  action-blue: "#2563eb"
  danger: "#e5484d"
  danger-text: "#b91c1c"
  danger-surface: "#fef2f2"
  danger-border: "#fecaca"
  success: "#16a34a"
  success-text: "#166534"
  success-surface: "#f0fdf4"
  success-border: "#bbf7d0"
  warning-text: "#92400e"
  warning-surface: "#fffbeb"
  warning-border: "#fde68a"
  overlay: "rgba(15, 23, 42, 0.45)"
  overlay-soft: "rgba(15, 23, 42, 0.18)"
  control-pressed: "rgba(15, 23, 42, 0.09)"
  secondary-pressed: "#dce1e8"
  danger-hover: "#d63d42"
  danger-active: "#c43338"
  danger-soft: "#f87171"
  success-button: "#2b8a3e"
  success-button-hover: "#257a36"
  success-button-active: "#1f692e"
  success-button-deep: "#185525"
  success-dark: "#1f7a1f"
  warning-dark: "#b45309"
  warning-medium: "#d97706"
  warning-icon: "#f59e0b"
  warning-body: "#78716c"
  information: "#3b82f6"
  designer-selection: "#4f46e5"
  snap-guide: "#f43f5e"
  label-canvas-cream: "#f6f2df"
  label-ink: "#000000"
  preview-shadow: "rgba(0, 0, 0, 0.18)"
typography:
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
  supporting:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  control-large:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.006em"
  label-display:
    fontFamily: "Lora, Georgia, serif"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  label-script:
    fontFamily: "Genty Demo, cursive"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "normal"
  label-condensed:
    fontFamily: "Avenir Next Condensed Asset, Arial Narrow, sans-serif"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  focus: "2px"
  field: "6px"
  nav: "8px"
  surface: "10px"
  pill: "9999px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  section: "24px"
  screen-y: "28px"
  screen-x: "32px"
components:
  button-primary:
    backgroundColor: "{colors.workbench-navy}"
    textColor: "{colors.white}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "34px"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.workbench-navy}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "34px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.workbench-navy}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "8px 12px"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.workbench-navy}"
    rounded: "{rounded.surface}"
    padding: "20px"
---

# Design System: Tillie Print

## Overview

**Creative North Star: "The Market Workbench"**

Tillie Print should feel like dependable equipment on a well-kept market counter: grounded, efficient, and approachable. The interface favors clear working surfaces, direct controls, and compact information hierarchy so staff can move from product data to a correctly printed label without ceremony.

The construction is mostly flat and border-led. Tactile pill controls and crisp state changes provide confidence without visual bulk. Brand expression comes from Workbench Navy, selective Market Green, and the practical rhythm of the app shell—not from glossy dashboards, excessive decoration, or austere industrial styling.

**Key Characteristics:**

- Grounded navy frame around bright, paper-like work surfaces.
- Compact, legible operational typography.
- Mostly flat containers separated by fine cool-gray borders.
- Tactile, confident pill actions with fast state feedback.
- Friendly clarity without corporate SaaS gloss or industrial harshness.

## Colors

The palette pairs a dependable navy frame with clean paper neutrals and sparing, functional color.

### Primary

- **Workbench Navy** (`#1a2332`): App navigation, primary actions, headings, and highest-emphasis text.
- **Market Green** (`#2d8f2d`): Brand and positive action color; brighter `#4cad4c` is reserved for focus visibility and the existing brand ramp.

### Secondary

- **Action Blue** (`#2563eb`): Selection, sortable links, and direct object-level interaction where blue is already established.
- **Success Green** (`#16a34a`): Connected and successful operational states rather than general decoration.
- **Counter Red** (`#e5484d`): Destructive actions and failures only.

### Neutral

- **Paper Gray** (`#f4f5f7`): Default application workspace behind cards and editing surfaces.
- **Counter White** (`#ffffff`): Cards, inputs, tables, and button faces.
- **Slate Body** (`#64748b`): Supporting copy and secondary controls.
- **Slate Muted** (`#526173`): Labels, placeholders, metadata, and low-emphasis icons; chosen to maintain readable contrast on white and Paper Gray.
- **Cool Border** (`#e2e8f0`): Standard field and surface boundary.

### Named Rules

**The Working Color Rule.** Green, blue, and red communicate brand, selection, or state; they do not compete as ambient decoration.

## Typography

**Display Font:** Inter (with `system-ui, sans-serif` fallback)  
**Body Font:** Inter (with `system-ui, sans-serif` fallback)  
**Label Artwork Fonts:** Lora Bold, Genty Demo, and Avenir Next Condensed Asset are explicit document-content roles. They are available to printed labels but never define the application chrome.

**Character:** The interface uses a single, compact sans-serif voice for quick scanning and predictable control sizing. Weight and muted color establish hierarchy more often than dramatic scale changes.

### Hierarchy

- **Headline** (700, `22px`, `1.2`): Screen titles such as Products and Settings.
- **Title** (600, `13px`, `1.4`): Card headings, product names, and important local labels.
- **Body** (400–500, `13px`, `1.5`): Controls, table content, descriptions, and operational messages.
- **Supporting** (400, `11px`, `1.5`): Help text, metadata, counts, and technical detail.
- **Label** (600, `11px`, `0.08em`, uppercase): Form labels and table headers.

### Named Rules

**The Counter Glance Rule.** A screen title, working action, field label, and supporting explanation must remain distinguishable at a glance without relying on oversized type.

## Layout

The application uses a fixed `192px` Workbench Navy sidebar and a flexible paper-gray content region. Standard screens scroll vertically inside the shell with `28px 32px` padding. Workflows use constrained reading and form widths where appropriate—Settings is `560px`—while libraries and design tools expand to the available workspace.

Spacing follows the observed compact rhythm of `6`, `8`, `12`, `16`, `20`, `24`, `28`, and `32px`. Cards commonly use `20px` internal padding and `16px` separation. Dense operational groups use `6–10px` gaps; major regions use `20–24px`. Preserve the desktop-first macOS working model and avoid introducing web-page-style hero spacing into task surfaces.

## Elevation & Depth

The system is mostly flat with borders. Paper Gray behind Counter White establishes the primary layer change, while `1px` cool-gray borders define cards and fields. Shadows are exceptional: the brand logo has a soft drop shadow, focus rings create temporary lift, and overlays may use restrained shadow for separation. Resting task cards should not float.

### Shadow Vocabulary

- **Accessible Focus** (`0 0 0 2px #fff, 0 0 0 4px rgba(76, 173, 76, 0.55)`): Keyboard focus on buttons.
- **Field Focus** (`0 0 0 3px rgba(45, 143, 45, 0.12)`): Soft reinforcement around the active input.
- **Brand Mark** (`drop-shadow(0 5px 10px rgba(0, 0, 0, 0.28))`): Sidebar logo only.

### Named Rules

**The Flat Counter Rule.** Resting work surfaces use tonal contrast and borders; shadow appears only for focus, overlays, or the brand mark.

## Shapes

The form language balances precise rectangular work surfaces with friendly controls. Inputs use `6px` corners, navigation rows use `8px`, and cards use `10px`. Buttons and compact filter chips are full pills (`9999px` or equivalent), making actions tactile without softening the entire interface. Borders stay thin and quiet; avoid heavy outlines, beveled effects, or ornamental clipping.

## Components

### Buttons

- **Shape:** Full pill, `34px` tall, usually `16px` horizontal padding; small and large variants are `28px` and `40px`.
- **Primary:** Workbench Navy with white text; hover lightens to `#2a3850`, active deepens to `#10161f`.
- **Secondary / Outline:** Pale gray or white surfaces with navy text and quiet borders.
- **Ghost / Icon:** Transparent at rest, gaining a faint navy wash on hover; icon-only actions are circular.
- **Hover / Focus:** Fast `100–150ms` color transitions and a high-visibility green focus ring. Disabled controls use `0.45` opacity and no pointer interaction.

### Chips

- **Style:** Compact pill filters with a white surface, cool border, `12px` text, and `3px 12px` padding.
- **State:** Selected filters use Action Blue with white text; unselected filters remain neutral.

### Cards / Containers

- **Corner Style:** `10px` radius.
- **Background:** Counter White over Paper Gray.
- **Shadow Strategy:** Flat by default.
- **Border:** `1px solid #e2e8f0`.
- **Internal Padding:** Usually `20px`, rising to `24px` for generous empty states.

### Inputs / Fields

- **Style:** Counter White, `1px` cool border, `6px` radius, `8px 12px` padding, and `13px` text.
- **Focus:** Market Green border plus a translucent green outer ring.
- **Placeholder / Help:** Slate Muted at `11–13px`.
- **Error / Disabled:** Errors use pale red surfaces and direct red text; disabled controls reduce opacity without changing layout.

### Navigation

The `192px` Workbench Navy sidebar is the stable orientation anchor. Rows use `8px` corners, `9px 10px` padding, `13px` medium text, and Lucide icons. Default labels are half-opacity white; hover raises contrast over a subtle white wash; active navigation uses white text over a stronger translucent surface. The top `44px` remains a macOS drag region.

### Operational Notices

Success and error notices use pale semantic backgrounds, matching borders, and dark readable semantic text. Keep notices inline with the workflow, concise, and dismissible when persistent.

## Do's and Don'ts

### Do:

- **Do** preserve Workbench Navy as the stable shell and highest-emphasis action color.
- **Do** keep operational screens compact, scannable, and aligned to the established spacing rhythm.
- **Do** use borders and tonal layering before adding shadow.
- **Do** reserve semantic colors for clear actions, selections, connection states, warnings, and errors.
- **Do** keep controls tactile through pill geometry, clear hover states, and visible keyboard focus.

### Don't:

- **Don't** turn task screens into glossy corporate SaaS dashboards with floating cards, gradients, or ornamental metrics.
- **Don't** introduce industrial harshness through black slabs, hard-edged controls, dense rule lines, or aggressive condensed type in the app chrome.
- **Don't** use the label-artwork fonts as general interface typography.
- **Don't** scatter multiple accent colors across a surface without operational meaning.
- **Don't** use oversized marketing typography or excessive whitespace inside daily workflows.
