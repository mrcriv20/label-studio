# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Staff at multiple small retail markets who need to create, maintain, and print accurate product labels as part of day-to-day store operations.

## Product Purpose

Tillie Print enables market staff to design, manage, and print retail product labels while optionally keeping barcode and pricing data synchronized with a point-of-sale system. Tillie POS is the first-class integration, but the product must also work independently. Success means staff can produce accurate labels without relying on expensive professional design software or manually reconciling label data with a connected POS.

## Positioning

Tillie Print combines practical label design and print production with optional POS synchronization. Unlike general-purpose tools such as Illustrator or Canva, it can store operational barcode and price data, synchronize that data through integrations such as Tillie POS, and support the physical label-printing workflow. Its core label capabilities remain valuable without a POS connection, allowing the product to be offered independently.

## Operating Context

- Staff manage product records, create or edit label templates, preview labels, compose print sheets, and print or export labels from a macOS desktop app.
- Labels may be printed individually or on precisely aligned physical label sheets.
- The product must remain usable offline and without a POS connection; POS data synchronizes when a configured integration is available.
- Product prices and barcodes are operational data that may be shared with a connected POS, not merely decorative label content.

## Capabilities and Constraints

- Create, edit, save, and reuse product labels and label designs.
- Store product information including prices and barcodes.
- Synchronize applicable barcode and price data with Tillie POS.
- Keep core product, label-design, storage, and printing capabilities independent of Tillie POS so the application can be sold as a standalone product.
- Keep the integration boundary POS-agnostic so additional POS providers can be supported without redesigning the core label workflow.
- Generate barcodes and export labels to PDF and SVG.
- Build and print multi-label sheets with exact physical-sheet placement and calibration.
- Preserve macOS desktop support and offline operation.
- Preserve existing templates and printing behavior unless a change is explicitly requested.
- The precise synchronization rules, conflict handling, and offline reconciliation behavior remain open product decisions.

## Brand Commitments

- Product name: Tillie Print.
- Tillie POS is the first-class POS integration, but Tillie Print must retain an independent product identity and standalone mode.
- Existing Tillie Print and market-specific templates, logos, and branding must remain supported.

## Evidence on Hand

- Existing React/Electron application with product library, label editor, design editor, sheet builder, settings, and usage guidance.
- Existing label and brand assets under `assets/` and `src/renderer/src/assets/`.
- Existing built-in template definitions in `src/shared/labelTemplates.ts` and reusable design files under `assets/designs/`.
- Existing PDF, SVG, barcode, roll-print, and sheet-layout implementation under `src/main/` and `src/shared/`.
- Existing Tillie synchronization interface in `src/renderer/src/components/TillieSyncCard.tsx` and supporting main-process integration.
- No customer testimonials, quantified savings, performance benchmarks, or other marketing proof are currently established; future work must not fabricate them.

## Product Principles

1. Keep connected POS data and printed-label data accurate and synchronized without making a POS connection mandatory.
2. Make professional label production accessible to small-market staff without specialist design software.
3. Treat print fidelity and physical sheet alignment as core functionality.
4. Preserve reliable offline operation and reconcile safely when connectivity returns.
5. Keep POS integrations modular while supporting each market's established templates and brand identity.
