import { o as createLucideIcon, v as reactExports, t as jsxRuntimeExports, j as Store, S as Search, R as RefreshCw, w as recordTillieSyncFailure, x as recordTillieSyncSuccess, l as applyFontSettings, s as installFonts, U as Upload } from "./index-DMdzO7HF.js";
import { D as Download } from "./download-BTvVv-0_.js";
import { S as Save } from "./save-BQ9KVetB.js";
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronDown = createLucideIcon("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronRight = createLucideIcon("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileCheck = createLucideIcon("FileCheck", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m9 15 2 2 4-4", key: "1grp1n" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderOpen = createLucideIcon("FolderOpen", [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Info = createLucideIcon("Info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Plug = createLucideIcon("Plug", [
  ["path", { d: "M12 22v-5", key: "1ega77" }],
  ["path", { d: "M9 8V2", key: "14iosj" }],
  ["path", { d: "M15 8V2", key: "18g5xt" }],
  ["path", { d: "M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z", key: "osxo6l" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Unplug = createLucideIcon("Unplug", [
  ["path", { d: "m19 5 3-3", key: "yk6iyv" }],
  ["path", { d: "m2 22 3-3", key: "19mgm9" }],
  [
    "path",
    { d: "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z", key: "goz73y" }
  ],
  ["path", { d: "M7.5 13.5 10 11", key: "7xgeeb" }],
  ["path", { d: "M10.5 16.5 13 14", key: "10btkg" }],
  [
    "path",
    { d: "m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z", key: "1snsnr" }
  ]
]);
function TillieSyncCard() {
  const [config, setConfig] = reactExports.useState(null);
  const [categories, setCategories] = reactExports.useState(null);
  const [products, setProducts] = reactExports.useState(null);
  const [baseUrlDraft, setBaseUrlDraft] = reactExports.useState("");
  const [mongoUriDraft, setMongoUriDraft] = reactExports.useState("");
  const [showDbSetup, setShowDbSetup] = reactExports.useState(false);
  const [pin, setPin] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [syncing, setSyncing] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [notice, setNotice] = reactExports.useState("");
  const [showPicker, setShowPicker] = reactExports.useState(false);
  const [showCategories, setShowCategories] = reactExports.useState(false);
  const [categoryQuery, setCategoryQuery] = reactExports.useState("");
  const [configSaving, setConfigSaving] = reactExports.useState(false);
  const [auditSummary, setAuditSummary] = reactExports.useState([]);
  const [syncSummary, setSyncSummary] = reactExports.useState(null);
  const [adminCredentialAcknowledged, setAdminCredentialAcknowledged] = reactExports.useState(false);
  const refreshCategories = reactExports.useCallback(async () => {
    const result = await window.api.tillie.getCategories();
    if (result.ok) {
      setCategories(result.data);
      setError("");
    } else {
      setCategories(null);
      setError(result.error);
    }
  }, []);
  const refreshProducts = reactExports.useCallback(async () => {
    const result = await window.api.tillie.listProducts();
    if (result.ok) setProducts(result.data);
    else setProducts(null);
  }, []);
  reactExports.useEffect(() => {
    window.api.tillie.getConfig().then((result) => {
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setConfig(result.data);
      setBaseUrlDraft(result.data.baseUrl);
    });
    refreshCategories();
  }, [refreshCategories]);
  reactExports.useEffect(() => {
    if (config?.connectedUserName && !products) refreshProducts();
  }, [config?.connectedUserName, products, refreshProducts]);
  async function saveBaseUrl() {
    const result = await window.api.tillie.setConfig({ baseUrl: baseUrlDraft });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setConfig(result.data);
    setBaseUrlDraft(result.data.baseUrl);
    refreshCategories();
  }
  async function connect() {
    setBusy(true);
    setError("");
    const result = await window.api.tillie.login(pin);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setConfig(result.data);
    setPin("");
    refreshCategories();
    refreshProducts();
  }
  async function disconnect() {
    const result = await window.api.tillie.disconnect();
    if (result.ok) {
      setConfig(result.data);
      setNotice("Tillie register disconnected. Saved labels remain available offline.");
    } else {
      setError(`Tillie could not be disconnected: ${result.error}`);
      return;
    }
    setProducts(null);
  }
  async function applyConfig(patch, summary) {
    setConfigSaving(true);
    setError("");
    const result = await window.api.tillie.setConfig(patch);
    setConfigSaving(false);
    if (!result.ok) {
      setError(result.error);
      setNotice("");
      return;
    }
    setConfig(result.data);
    setAuditSummary(summary);
    setNotice("Sync scope saved immediately.");
    if (products) refreshProducts();
  }
  function toggleCategory(cat) {
    if (!config) return;
    const subscribed = config.subscribedCategories.some((c) => c.id === cat.id);
    const next = subscribed ? config.subscribedCategories.filter((c) => c.id !== cat.id) : [...config.subscribedCategories, { id: cat.id, name: cat.name }];
    applyConfig({ subscribedCategories: next }, [
      `${subscribed ? "Removed" : "Added"} category: ${cat.name}.`,
      `${next.length} categor${next.length === 1 ? "y" : "ies"} will import new Tillie products.`,
      ...subscribed ? ["Products already linked from this category remain linked and continue syncing."] : []
    ]);
  }
  function toggleProduct(p) {
    if (!config) return;
    const inSubscribedCategory = config.subscribedCategories.some((c) => c.name === p.category);
    if (inSubscribedCategory) {
      const excluded = config.excludedProductIds.includes(p.id);
      applyConfig({
        excludedProductIds: excluded ? config.excludedProductIds.filter((id) => id !== p.id) : [...config.excludedProductIds, p.id]
      }, [`${excluded ? "Restored" : "Excluded"} product: ${p.name}.`, excluded ? "This product will resume syncing through its selected category." : "This linked product will stop receiving Tillie updates."]);
    } else {
      const included = config.includedProductIds.includes(p.id);
      applyConfig({
        includedProductIds: included ? config.includedProductIds.filter((id) => id !== p.id) : [...config.includedProductIds, p.id],
        // Re-adding a previously deleted label should work again.
        excludedProductIds: config.excludedProductIds.filter((id) => id !== p.id)
      }, [`${included ? "Removed individual inclusion for" : "Added individual inclusion for"} ${p.name}.`, included ? "It will sync only if its category is selected." : "It will sync even though its category is not selected."]);
    }
  }
  async function syncNow() {
    setSyncing(true);
    setError("");
    setNotice("");
    setSyncSummary(null);
    const result = await window.api.tillie.sync();
    setSyncing(false);
    if (!result.ok) {
      recordTillieSyncFailure(result.error);
      setError(`Sync failed: ${result.error}. Saved labels remain available offline.`);
      return;
    }
    const { created, updated, unchanged, pushed, pushSkipped, duplicateBarcodes } = result.data;
    recordTillieSyncSuccess();
    setSyncSummary({ created, updated, unchanged, pushed, pushSkipped, duplicateBarcodes });
    setNotice(pushSkipped.length || duplicateBarcodes.length ? "Sync finished with items that need attention." : "Sync complete.");
    const cfg = await window.api.tillie.getConfig();
    if (cfg.ok) setConfig(cfg.data);
    refreshProducts();
  }
  const dbMode = Boolean(config?.mongoUri);
  const connected = dbMode || Boolean(config?.connectedUserName);
  async function saveMongoUri(uri) {
    const result = await window.api.tillie.setConfig({ mongoUri: uri });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setConfig(result.data);
    setMongoUriDraft("");
    setShowDbSetup(false);
    setError("");
    setProducts(null);
    refreshCategories();
  }
  const productCountFor = (name) => products ? products.filter((p) => p.category === name).length : null;
  const selectedCategoryCount = config?.subscribedCategories.length ?? 0;
  const visibleCategories = (categories ?? []).filter(
    (category) => category.name.toLocaleLowerCase().includes(categoryQuery.trim().toLocaleLowerCase())
  );
  function setAllCategories(selected) {
    if (!categories) return;
    applyConfig({
      subscribedCategories: selected ? categories.map(({ id, name }) => ({ id, name })) : []
    }, selected ? [`Selected all ${categories.length} categories.`, "New products from every category will be imported; linked products remain linked."] : ["Cleared all category subscriptions.", "No new category products will be imported; products already linked to Tillie remain linked and continue syncing."]);
  }
  const pickerGroups = (() => {
    if (!products) return [];
    const groups = /* @__PURE__ */ new Map();
    for (const p of products) {
      const key = p.category || "Uncategorized";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(p);
    }
    return Array.from(groups.entries());
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: "20px 20px 24px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { style: { fontSize: 13, fontWeight: 600, color: "var(--color-workbench-navy)", margin: "0 0 6px", display: "flex", alignItems: "center", gap: 6 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 14 }),
      " Tillie POS · Optional integration"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-secondary)", margin: "0 0 16px", lineHeight: 1.5 }, children: "Pull products from your Tillie register. Labels linked to Tillie get their name, price, and category updated automatically — Tillie is the source of truth for those fields. Changes in this integration section save immediately." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: [
      dbMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--color-success-text)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plug, { size: 14 }),
        "Connected directly to Tillie's database",
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "btn-outline btn-sm",
            onClick: () => saveMongoUri(""),
            style: { marginLeft: "auto" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Unplug, { size: 13 }),
              " Disconnect"
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "tillie-address", children: "Tillie address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "tillie-address",
                className: "input",
                value: baseUrlDraft,
                onChange: (e) => setBaseUrlDraft(e.target.value),
                placeholder: "http://127.0.0.1:3000"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "btn-outline",
                style: { flexShrink: 0 },
                onClick: saveBaseUrl,
                disabled: !config || baseUrlDraft === config.baseUrl,
                children: "Save"
              }
            )
          ] })
        ] }),
        connected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--color-success-text)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plug, { size: 14 }),
          "Connected as ",
          config?.connectedUserName,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-outline btn-sm", onClick: disconnect, style: { marginLeft: "auto" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Unplug, { size: 13 }),
            " Disconnect"
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "tillie-pin", children: "Tillie PIN" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "tillie-pin",
                className: "input",
                style: { maxWidth: 160 },
                type: "password",
                inputMode: "numeric",
                value: pin,
                onChange: (e) => setPin(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter" && pin.trim()) connect();
                },
                placeholder: "Enter register PIN"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-outline", onClick: connect, disabled: busy || !pin.trim(), style: { flexShrink: 0 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plug, { size: 13 }),
              " ",
              busy ? "Connecting…" : "Connect"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-muted)", marginTop: 5 }, children: "Use the same PIN you sign in with at the register. The PIN itself is never stored." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "disclosure-button",
              "aria-expanded": showDbSetup,
              onClick: () => setShowDbSetup((v) => !v),
              style: { display: "inline-flex", alignItems: "center", gap: 4, border: "none", background: "transparent", fontSize: 12, fontWeight: 500, color: "var(--color-action-blue)", cursor: "pointer" },
              children: [
                showDbSetup ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 13 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 13 }),
                "Administrator database connection"
              ]
            }
          ),
          showDbSetup && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  "aria-label": "Tillie database connection string",
                  className: "input",
                  type: "password",
                  value: mongoUriDraft,
                  onChange: (e) => setMongoUriDraft(e.target.value),
                  placeholder: "mongodb+srv://…  (Atlas connection string)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "btn-outline",
                  style: { flexShrink: 0 },
                  onClick: () => saveMongoUri(mongoUriDraft.trim()),
                  disabled: !mongoUriDraft.trim() || !adminCredentialAcknowledged,
                  children: "Connect"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-credential-warning", role: "alert", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Administrator-only credential" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "This connection string grants broad access to store data. Use a dedicated least-privilege account, never share or paste it into support messages, and rotate it immediately if exposed." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: adminCredentialAcknowledged, onChange: (event) => setAdminCredentialAcknowledged(event.target.checked) }),
                " I am authorized to connect this store database."
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "aria-expanded": showCategories,
            onClick: () => setShowCategories((open) => !open),
            className: "btn-outline",
            style: { width: "100%", justifyContent: "space-between" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Categories to sync · ",
                selectedCategoryCount,
                " selected"
              ] }),
              showCategories ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
            ]
          }
        ),
        categories === null ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 12, color: "var(--color-text-muted)", margin: 0 }, children: "Waiting for Tillie — check the address above and make sure the register app is running." }) : categories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 12, color: "var(--color-text-muted)", margin: 0 }, children: "No categories found in Tillie." }) : showCategories ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", flex: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 13, style: { position: "absolute", insetInlineStart: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", pointerEvents: "none" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "input",
                  "aria-label": "Search Tillie categories",
                  value: categoryQuery,
                  onChange: (event) => setCategoryQuery(event.target.value),
                  placeholder: "Search categories…",
                  style: { paddingInlineStart: 32 }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-ghost btn-sm", onClick: () => setAllCategories(true), disabled: configSaving, children: "Select all" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-ghost btn-sm", onClick: () => setAllCategories(false), disabled: configSaving, children: "Clear" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxHeight: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, border: "1px solid var(--color-border)", borderRadius: 8, padding: 10 }, children: [
            visibleCategories.map((cat) => {
              const subscribed = config?.subscribedCategories.some((c) => c.id === cat.id) ?? false;
              const count = productCountFor(cat.name);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-text-strong-secondary)", cursor: "pointer" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: subscribed, disabled: configSaving, onChange: () => toggleCategory(cat) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 10, height: 10, borderRadius: 3, background: cat.color || "var(--color-border-strong)", flexShrink: 0 } }),
                    cat.name,
                    count !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "var(--color-text-muted)" }, children: [
                      count,
                      " product",
                      count !== 1 ? "s" : ""
                    ] })
                  ]
                },
                cat.id
              );
            }),
            visibleCategories.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { margin: 0, fontSize: 12, color: "var(--color-text-muted)" }, children: [
              "No categories match “",
              categoryQuery,
              "”."
            ] })
          ] })
        ] }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-muted)", marginTop: 6 }, children: "New products are imported from selected categories. Products already linked to Tillie keep syncing even if their category is later cleared." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { role: "status", "aria-live": "polite", className: "sr-only", children: configSaving ? "Saving sync settings" : "" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "disclosure-button",
            "aria-expanded": showPicker,
            onClick: () => {
              setShowPicker((v) => !v);
              if (!products) refreshProducts();
            },
            style: { display: "inline-flex", alignItems: "center", gap: 4, border: "none", background: "transparent", fontSize: 12, fontWeight: 500, color: "var(--color-action-blue)", cursor: "pointer" },
            children: [
              showPicker ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 13 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 13 }),
              "Choose individual products"
            ]
          }
        ),
        showPicker && (products === null ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 12, color: "var(--color-text-muted)", marginTop: 6 }, children: connected ? "Loading products…" : "Connect with your PIN to browse Tillie products." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxHeight: 260, overflow: "auto", border: "1px solid #f1f5f9", borderRadius: 8, marginTop: 8, padding: "6px 10px" }, children: pickerGroups.map(([category, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "6px 0 4px" }, children: category }),
          items.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              style: { display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--color-text-strong-secondary)", padding: "3px 0", cursor: "pointer" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: p.inScope, disabled: configSaving, onChange: () => toggleProduct(p) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1 }, children: p.name }),
                p.linked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "var(--color-success-text)", border: "1px solid var(--color-success-border)", background: "var(--color-success-surface)", borderRadius: 10, padding: "2px 7px" }, children: "linked" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontFamily: "monospace", fontSize: 11, color: "var(--color-text-muted)" }, children: [
                  "$",
                  p.price.toFixed(2)
                ] })
              ]
            },
            p.id
          ))
        ] }, category)) }))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-text-strong-secondary)", cursor: "pointer" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: config?.autoSyncOnLaunch ?? true,
            onChange: (e) => applyConfig({ autoSyncOnLaunch: e.target.checked }, [e.target.checked ? "Enabled automatic sync when Tillie Print opens." : "Disabled automatic sync on launch.", "This change was saved immediately."])
          }
        ),
        "Sync automatically when the app opens"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-primary", onClick: syncNow, disabled: syncing, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: syncing ? "spin" : void 0 }),
          syncing ? "Syncing…" : "Sync Now"
        ] }),
        config?.lastSyncAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "var(--color-text-muted)" }, children: [
          "Last synced ",
          new Date(config.lastSyncAt).toLocaleString()
        ] })
      ] }),
      notice && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "status", "aria-live": "polite", className: "status-message", style: { background: "var(--color-success-surface)", border: "1px solid var(--color-success-border)", borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: "var(--color-success-text)" }, children: notice }),
      auditSummary.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sync-audit-summary", role: "status", "aria-live": "polite", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Saved change" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: auditSummary.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: item }, item)) })
      ] }),
      syncSummary && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sync-result-summary", "aria-label": "Tillie sync result", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "is-success", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Updated" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            syncSummary.created,
            " new · ",
            syncSummary.updated,
            " changed · ",
            syncSummary.pushed,
            " sent to Tillie"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Unchanged" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            syncSummary.unchanged,
            " already current"
          ] })
        ] }),
        (syncSummary.pushSkipped.length > 0 || syncSummary.duplicateBarcodes.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "is-warning", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Needs attention" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            syncSummary.pushSkipped.length ? `Unreadable price: ${syncSummary.pushSkipped.join(", ")}. ` : "",
            syncSummary.duplicateBarcodes.length ? `Duplicate barcode: ${syncSummary.duplicateBarcodes.join(", ")}.` : ""
          ] })
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "alert", className: "status-message", style: { background: "var(--color-danger-surface)", border: "1px solid var(--color-danger-border)", borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: "var(--color-danger-text)" }, children: error })
    ] })
  ] });
}
function Settings({ onDirtyChange, onOpenCalibration }) {
  const [settings, setSettings] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [saved, setSaved] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [fonts, setFonts] = reactExports.useState([]);
  const [googleFamily, setGoogleFamily] = reactExports.useState("");
  const [addingFont, setAddingFont] = reactExports.useState(false);
  const savedSettingsRef = reactExports.useRef("");
  const dirty = reactExports.useMemo(() => Boolean(settings) && JSON.stringify(settings) !== savedSettingsRef.current, [settings, saved]);
  reactExports.useEffect(() => {
    window.api.settings.get().then((r) => {
      if (r.ok) {
        savedSettingsRef.current = JSON.stringify(r.data);
        setSettings(r.data);
      } else setError(r.error);
    });
  }, []);
  reactExports.useEffect(() => () => {
    if (!savedSettingsRef.current) return;
    try {
      const savedSettings = JSON.parse(savedSettingsRef.current);
      document.documentElement.style.setProperty("--page-background", savedSettings.pageBackgroundColor);
      applyFontSettings(savedSettings);
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    onDirtyChange(dirty);
    return () => onDirtyChange(false);
  }, [dirty, onDirtyChange]);
  reactExports.useEffect(() => {
    window.api.font.list().then((result) => {
      if (result.ok) {
        setFonts(result.data);
        installFonts(result.data);
      }
    });
  }, []);
  function update(key, value) {
    setSettings((prev) => prev ? { ...prev, [key]: value } : null);
    if (key === "pageBackgroundColor") {
      document.documentElement.style.setProperty("--page-background", value);
    }
    if (key === "titleFontId" || key === "priceFontId" || key === "bodyFontId") {
      const next = settings ? { ...settings, [key]: value } : null;
      if (next) applyFontSettings(next);
    }
    setSaved(false);
  }
  async function handleSave() {
    if (!settings) return;
    if (!/^#[0-9a-f]{6}$/i.test(settings.pageBackgroundColor) || settings.labelBackgroundColor && !/^#[0-9a-f]{6}$/i.test(settings.labelBackgroundColor)) {
      setError("Background colors must use a 6-digit hex value, such as #f4f5f7.");
      return;
    }
    const x = Number(settings.sheetOffsetXIn);
    const y = Number(settings.sheetOffsetYIn);
    if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > 0.5 || Math.abs(y) > 0.5) {
      setError("Calibration offsets must be numbers between -0.500 and +0.500 inches.");
      return;
    }
    setSaving(true);
    setError("");
    const result = await window.api.settings.setMany(settings);
    if (!result.ok) {
      setError(result.error);
      setSaving(false);
      return;
    }
    setSaving(false);
    savedSettingsRef.current = JSON.stringify(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2e3);
  }
  async function pickFolder() {
    const result = await window.api.file.pickExportFolder();
    if (result.ok && result.data) update("exportFolder", result.data);
  }
  async function addFont(kind) {
    setAddingFont(true);
    setError("");
    const result = kind === "google" ? await window.api.font.addGoogle(googleFamily) : kind === "local" ? await window.api.font.importLocal() : await window.api.font.upload();
    setAddingFont(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (!result.data) return;
    const next = [...fonts, result.data];
    setFonts(next);
    installFonts(next);
    if (kind === "google") setGoogleFamily("");
  }
  if (!settings) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "screen", style: { display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", fontSize: 13 }, children: error || "Loading settings…" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxWidth: 560 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: 22, fontWeight: 700, color: "var(--color-workbench-navy)", margin: "0 0 24px" }, children: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TillieSyncCard, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: "20px 20px 24px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: 13, fontWeight: 600, color: "var(--color-workbench-navy)", margin: "0 0 16px" }, children: "Label Formatting" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "price-prefix", children: "Price prefix (currency symbol)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "price-prefix",
                className: "input",
                style: { maxWidth: 100 },
                value: settings.pricePrefix,
                onChange: (e) => update("pricePrefix", e.target.value),
                maxLength: 5,
                placeholder: "$"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-muted)", marginTop: 5 }, children: 'Shown before the price — e.g. "$" for USD, "€" for EUR' })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "currency", children: "Currency" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                id: "currency",
                className: "input",
                style: { maxWidth: 220 },
                value: settings.currency,
                onChange: (e) => update("currency", e.target.value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "USD", children: "USD — US Dollar" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "EUR", children: "EUR — Euro" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "GBP", children: "GBP — British Pound" })
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: "20px 20px 24px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: 13, fontWeight: 600, color: "var(--color-workbench-navy)", margin: "0 0 6px" }, children: "Label Fonts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-secondary)", margin: "0 0 16px", lineHeight: 1.5 }, children: "Font selections preview immediately and are restored if you discard Settings changes. Imported font files are installed immediately and remain available even if you leave without saving." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-font-grid", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FontSelect, { label: "Product title", value: settings.titleFontId, fonts, onChange: (v) => update("titleFontId", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FontSelect, { label: "Price", value: settings.priceFontId, fonts, onChange: (v) => update("priceFontId", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FontSelect, { label: "Details and instructions", value: settings.bodyFontId, fonts, onChange: (v) => update("bodyFontId", v) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, marginTop: 16 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-outline", onClick: () => addFont("local"), disabled: addingFont, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 13 }),
            " Local font"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-outline", onClick: () => addFont("upload"), disabled: addingFont, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 13 }),
            " Upload file"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, marginTop: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { "aria-label": "Google Fonts family", className: "input", value: googleFamily, onChange: (e) => setGoogleFamily(e.target.value), placeholder: "Google Fonts family, e.g. Roboto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-outline", onClick: () => addFont("google"), disabled: addingFont || !googleFamily.trim(), style: { flexShrink: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 13 }),
            " ",
            addingFont ? "Adding…" : "Add Google font"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: "20px 20px 24px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: 13, fontWeight: 600, color: "var(--color-workbench-navy)", margin: "0 0 16px" }, children: "Background Colors" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ColorSetting,
            {
              label: "App page background",
              value: settings.pageBackgroundColor,
              fallback: "#f4f5f7",
              onChange: (value) => update("pageBackgroundColor", value)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ColorSetting,
            {
              label: "Global label background",
              value: settings.labelBackgroundColor,
              fallback: "#f5efdc",
              onChange: (value) => update("labelBackgroundColor", value),
              allowDefault: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-secondary)", margin: 0 }, children: "The global label color applies unless a label has its own override. Resetting it preserves each template’s original color." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: "20px 20px 24px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: 13, fontWeight: 600, color: "var(--color-workbench-navy)", margin: "0 0 16px" }, children: "Barcode" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "barcode-format", children: "Default format" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              id: "barcode-format",
              className: "input",
              style: { maxWidth: 280 },
              value: settings.barcodeType,
              onChange: (e) => update("barcodeType", e.target.value),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CODE128", children: "Code 128 (recommended for internal use)" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: "20px 20px 24px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: 13, fontWeight: 600, color: "var(--color-workbench-navy)", margin: "0 0 16px" }, children: "Export" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "export-folder", children: "Default export folder" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "export-folder", className: "input", value: settings.exportFolder, onChange: (e) => update("exportFolder", e.target.value), readOnly: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: pickFolder, className: "btn-outline", style: { flexShrink: 0 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 13 }),
              " Browse"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: "20px 20px 24px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: 13, fontWeight: 600, color: "var(--color-workbench-navy)", margin: "0 0 16px" }, children: "Print Calibration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: 11, color: "var(--color-text-secondary)", margin: 0 }, children: [
            "Current PLS780 calibration: horizontal ",
            Number(settings.sheetOffsetXIn) >= 0 ? "+" : "",
            Number(settings.sheetOffsetXIn || 0).toFixed(3),
            " in · vertical ",
            Number(settings.sheetOffsetYIn) >= 0 ? "+" : "",
            Number(settings.sheetOffsetYIn || 0).toFixed(3),
            " in. Calibration applies to sheet PDF export and direct printing."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-outline", onClick: onOpenCalibration, style: { alignSelf: "flex-start" }, children: "Open guided calibration in Print Sheet" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: "20px 20px 24px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: 13, fontWeight: 600, color: "var(--color-workbench-navy)", margin: "0 0 16px" }, children: "Label Template" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, fontSize: 13, color: "var(--color-text-tertiary)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileCheck, { size: 15, style: { marginTop: 1, color: "#16a34a", flexShrink: 0 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontWeight: 500, margin: 0 }, children: "Built-in market template — Grazia's Italian Market" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }, children: '2.514" × 4.014" (181 × 289 pt) · Adobe Illustrator EPS · Stored in app data folder' })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, fontSize: 13, color: "var(--color-text-tertiary)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 15, style: { marginTop: 1, color: "#3b82f6", flexShrink: 0 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontWeight: 500, margin: 0 }, children: "Premium Label Supply PLS780 Sheet Layout" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }, children: '8 labels per US Letter sheet (8.5" × 11"). 2 columns × 4 rows. Labels print landscape at 4" × 2.5" per slot with 0.15625" side margins, a 0.1875" center gutter, and 0.5" top/bottom margins. Product templates are now built from modular header, brand, and content zones and can be selected per label.' })
            ] })
          ] })
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "alert", className: "status-message", style: { background: "var(--color-danger-surface)", border: "1px solid var(--color-danger-border)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--color-danger-text)" }, children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSave, disabled: saving, className: "btn-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14 }),
          saving ? "Saving…" : saved ? "Saved!" : "Save Settings"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { role: "status", "aria-live": "polite", className: "sr-only", children: saving ? "Saving settings" : saved ? "Settings saved" : "" })
      ] })
    ] })
  ] }) });
}
function FontSelect({ label, value, fonts, onChange }) {
  const id = reactExports.useId();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: id, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("select", { id, className: "input", value, onChange: (e) => onChange(e.target.value), children: fonts.map((font) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: font.id, children: [
      font.family,
      " · ",
      font.source
    ] }, font.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 5, fontSize: 18, lineHeight: 1.2, fontFamily: `LabelFont-${value.replace(/[^a-z0-9_-]/gi, "-")}` }, children: "Market Aa" })
  ] });
}
function ColorSetting({
  label,
  value,
  fallback,
  onChange,
  allowDefault = false
}) {
  const colorId = reactExports.useId();
  const textId = reactExports.useId();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: textId, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: colorId,
          "aria-label": `${label} color picker`,
          type: "color",
          value: value || fallback,
          onChange: (e) => onChange(e.target.value),
          style: { width: 44, height: 36, padding: 2, border: "1px solid var(--color-border)", borderRadius: 6, background: "var(--color-surface)", cursor: "pointer" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: textId,
          className: "input",
          value,
          onChange: (e) => onChange(e.target.value),
          placeholder: allowDefault ? "Template default" : fallback,
          pattern: "^#[0-9A-Fa-f]{6}$",
          maxLength: 7
        }
      ),
      allowDefault && value && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn-outline", onClick: () => onChange(""), children: "Reset" })
    ] })
  ] });
}
export {
  Settings as default
};
