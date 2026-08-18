import { o as createLucideIcon, t as jsxRuntimeExports, T as Tag, e as Layers, f as Printer, b as CircleCheck, h as Settings } from "./index-BxS2c6tc.js";
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowRight = createLucideIcon("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileSpreadsheet = createLucideIcon("FileSpreadsheet", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M8 13h2", key: "yr2amv" }],
  ["path", { d: "M14 13h2", key: "un5t4a" }],
  ["path", { d: "M8 17h2", key: "2yhykz" }],
  ["path", { d: "M14 17h2", key: "10kma7" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lightbulb = createLucideIcon("Lightbulb", [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
]);
const steps = [
  {
    number: "01",
    title: "Add a product",
    description: "Choose New Label to enter one product, or use Import on the Products page to add a CSV or Excel list.",
    Icon: FileSpreadsheet
  },
  {
    number: "02",
    title: "Design the label",
    description: "Pick a template, enter the product details, and use the live preview to check the result. Save when it looks right.",
    Icon: Tag
  },
  {
    number: "03",
    title: "Build a print sheet",
    description: "Open Print Sheet, then fill the sheet with one product or assign a different product to each of the eight slots.",
    Icon: Layers
  },
  {
    number: "04",
    title: "Print at actual size",
    description: "Review the physical setup, then print or export a PDF. Printing from the app sends the sheet at 100% / Actual Size automatically; if you print an exported PDF yourself, choose US Letter and 100% / Actual Size.",
    Icon: Printer
  }
];
function HowTo({ onNavigate }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxWidth: 880, margin: "0 auto" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 24 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "0 0 5px", color: "var(--color-market-green)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }, children: "Quick guide" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: 24, lineHeight: 1.2, fontWeight: 700, color: "var(--color-workbench-navy)", margin: 0 }, children: "Create and print labels in four steps" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 13, lineHeight: 1.6, color: "var(--color-text-secondary)", margin: "8px 0 0", maxWidth: 620 }, children: "Tillie Print keeps product data in one library, turns it into reusable labels, and places those labels precisely on a PLS780 print sheet." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }, children: steps.map(({ number, title, description, Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 20, display: "flex", gap: 15 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 38, height: 38, borderRadius: 9, flexShrink: 0, background: "#eef8ee", color: "var(--color-market-green)", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--color-text-muted)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" }, children: [
            "STEP ",
            number
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: 0, color: "var(--color-workbench-navy)", fontSize: 14, fontWeight: 650 }, children: title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "7px 0 0", color: "var(--color-text-secondary)", fontSize: 12, lineHeight: 1.55 }, children: description })
      ] })
    ] }, number)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 14, marginTop: 14 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 20 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: "0 0 14px", color: "var(--color-workbench-navy)", fontSize: 14, fontWeight: 650 }, children: "Good to know" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 11 }, children: [
          "Use the Products page to search, sort, duplicate, edit, export, or delete saved labels.",
          "When reusing a partially printed sheet, set Start at slot to the first unused label.",
          "If labels drift on the paper, open Calibrate or test this sheet, print the alignment pattern, and enter the measured correction.",
          "Product editing changes one label. Reusable template creation, import, export, and deletion live in Designer."
        ].map((tip) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 9, alignItems: "flex-start", color: "var(--color-text-tertiary)", fontSize: 12, lineHeight: 1.5 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14, style: { color: "var(--color-market-green)", marginTop: 2, flexShrink: 0 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tip })
        ] }, tip)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { borderRadius: 10, padding: 20, background: "var(--color-warning-surface)", border: "1px solid var(--color-warning-border)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center", color: "#92400e" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: 0, fontSize: 14, fontWeight: 650 }, children: "Best print results" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { margin: "10px 0 0", color: "#78716c", fontSize: 12, lineHeight: 1.55 }, children: [
          "Use Premium Label Supply PLS780 sheets. Select US Letter and ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "100% / Actual Size" }),
          ". Turn off Fit to Page or Scale to Fit."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, marginTop: 20 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-primary", onClick: () => onNavigate("editor"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 14 }),
        " Create a label ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 13 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-outline", onClick: () => onNavigate("library"), children: "View products" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-ghost", onClick: () => onNavigate("settings"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 14 }),
        " Open settings"
      ] })
    ] })
  ] }) });
}
export {
  HowTo as default
};
