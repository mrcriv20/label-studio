function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$1:
        case n$1:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$1(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f2 = d + Q$1(k2, g);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$2() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$2;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$1, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = X$2;
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$1.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$1.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$1.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports.unstable_now());
    }, b);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_scheduleCallback = function(a, b, c) {
    var d = exports.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh, a), G(uh, c));
}
function Bh(a) {
  vh.current === a && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p(301));
      f2 += 1;
      O = N = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N && null !== N.next;
  Hh = 0;
  O = N = M = null;
  Ih = false;
  if (b) throw Error(p(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O ? M.memoizedState = O = a : O = O.next = a;
  return O;
}
function Uh() {
  if (null === N) {
    var a = M.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N.next;
  var b = null === O ? M.memoizedState : O.next;
  if (null !== b) O = b, N = a;
  else {
    if (null === a) throw Error(p(310));
    N = a;
    a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
  }
  return O;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = N, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N) {
    var g = N.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M || null !== b && b === M;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
    jh = false;
    r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L, L.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L, L.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(L);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return ah(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(L);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L, L.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g);
            r2 === f2 && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X$1 = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Lj(c, b);
    case 6:
      var d = X$1, e = Xj;
      X$1 = null;
      Yj(a, b, c);
      X$1 = d;
      Xj = e;
      null !== X$1 && (Xj ? (a = X$1, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X$1.removeChild(c.stateNode));
      break;
    case 18:
      null !== X$1 && (Xj ? (a = X$1, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X$1, c.stateNode));
      break;
    case 4:
      d = X$1;
      e = Xj;
      X$1 = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X$1 = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X$1 = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X$1 = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X$1 = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X$1) throw Error(p(160));
      Zj(f2, g, e);
      X$1 = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Pj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Jj;
        var l2 = U;
        Jj = g;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U || b.flags & 512 && Rj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Dk(a, B());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok.transition, d = C;
  try {
    if (ok.transition = null, C = 1, a) return a();
  } finally {
    C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L);
        break;
      case 19:
        E(L);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O = N = M = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g, h, f2, b);
            y2.mode & 1 && Si(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Ui(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T && (T = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Ni(f2, k2, b);
              ph(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Qi(f2, h, b);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p(261));
  Q = null;
  Z = 0;
  return T;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Pk(a, b, c) {
  var d = C, e = ok.transition;
  try {
    ok.transition = null, C = 1, Wk(a, b, c, d);
  } finally {
    ok.transition = e, C = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C = g;
    ok.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok.transition, c = C;
    try {
      ok.transition = null;
      C = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, ok.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && array.indexOf(className) === index;
}).join(" ");
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return reactExports.createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
      ...props
    })
  );
  Component.displayName = `${iconName}`;
  return Component;
};
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowDown = createLucideIcon("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowLeft = createLucideIcon("ArrowLeft", [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowUpDown = createLucideIcon("ArrowUpDown", [
  ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
  ["path", { d: "M17 20V4", key: "1ejh1v" }],
  ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
  ["path", { d: "M7 4v16", key: "1glfcx" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowUp = createLucideIcon("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleAlert = createLucideIcon("CircleAlert", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleCheck = createLucideIcon("CircleCheck", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Copy = createLucideIcon("Copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
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
const FileCode2 = createLucideIcon("FileCode2", [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m5 12-3 3 3 3", key: "oke12k" }],
  ["path", { d: "m9 18 3-3-3-3", key: "112psh" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileText = createLucideIcon("FileText", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
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
const Layers = createLucideIcon("Layers", [
  [
    "path",
    {
      d: "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",
      key: "8b97xw"
    }
  ],
  ["path", { d: "m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65", key: "dd6zsq" }],
  ["path", { d: "m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65", key: "ep9fru" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LayoutGrid = createLucideIcon("LayoutGrid", [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pen = createLucideIcon("Pen", [
  ["path", { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z", key: "5qss01" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Plus = createLucideIcon("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Printer = createLucideIcon("Printer", [
  [
    "path",
    {
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      key: "143wyd"
    }
  ],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6", key: "1itne7" }],
  ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1", key: "1ue0tg" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RefreshCw = createLucideIcon("RefreshCw", [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Save = createLucideIcon("Save", [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Search = createLucideIcon("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Settings$1 = createLucideIcon("Settings", [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tag = createLucideIcon("Tag", [
  [
    "path",
    {
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
      key: "vktsd0"
    }
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Trash2 = createLucideIcon("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Upload = createLucideIcon("Upload", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
]);
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const X = createLucideIcon("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
const items = [
  { id: "library", label: "Products", Icon: LayoutGrid },
  { id: "editor", label: "New Label", Icon: Tag },
  { id: "sheet", label: "Print Sheet", Icon: Layers },
  { id: "settings", label: "Settings", Icon: Settings$1 }
];
function Nav({ current, onNavigate }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "sidebar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar-traffic" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar-brand", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar-brand-name", children: "GRAZIA'S" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar-brand-sub", children: "Label Studio" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar-sep" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "sidebar-nav", children: items.map(({ id: id2, label, Icon: Icon2 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => onNavigate(id2),
        className: `nav-item${current === id2 ? " active" : ""}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 15 }),
          label
        ]
      },
      id2
    )) })
  ] });
}
function Library({ onEdit, onOpenSheet }) {
  const [products, setProducts] = reactExports.useState([]);
  const [query, setQuery] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState("");
  const [deleting, setDeleting] = reactExports.useState(null);
  const [exporting, setExporting] = reactExports.useState(null);
  const [importing, setImporting] = reactExports.useState(false);
  const [activeCategory, setActiveCategory] = reactExports.useState("__all__");
  const [sortKey, setSortKey] = reactExports.useState("name");
  const [sortDirection, setSortDirection] = reactExports.useState("asc");
  const load = reactExports.useCallback(async () => {
    setLoading(true);
    const result = await window.api.product.list();
    if (result.ok) {
      setProducts(result.data);
      setError("");
    } else setError(result.error);
    setLoading(false);
  }, []);
  reactExports.useEffect(() => {
    load();
  }, [load]);
  const filtered = products.filter(
    (p2) => p2.name.toLowerCase().includes(query.toLowerCase()) || p2.barcodeValue.includes(query) || p2.price.toLowerCase().includes(query.toLowerCase())
  );
  const categories = Array.from(
    new Set(products.map((p2) => p2.category?.trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  const categoryFiltered = filtered.filter(
    (p2) => activeCategory === "__all__" || (p2.category?.trim() || "") === activeCategory
  );
  const sortedProducts = reactExports.useMemo(() => {
    const items2 = [...categoryFiltered];
    items2.sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortKey === "price") {
        return direction * (parsePrice(a.price) - parsePrice(b.price));
      }
      if (sortKey === "updatedAt") {
        return direction * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      }
      const aValue = (a[sortKey] ?? "").toString();
      const bValue = (b[sortKey] ?? "").toString();
      return direction * aValue.localeCompare(bValue, void 0, { numeric: true, sensitivity: "base" });
    });
    return items2;
  }, [categoryFiltered, sortDirection, sortKey]);
  function parsePrice(value) {
    const numeric = Number.parseFloat(value.replace(/[^0-9.-]/g, ""));
    return Number.isNaN(numeric) ? Number.NEGATIVE_INFINITY : numeric;
  }
  function toggleSort(nextKey) {
    if (sortKey === nextKey) {
      setSortDirection((prev) => prev === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(nextKey);
    setSortDirection("asc");
  }
  function renderSortIcon(key) {
    if (sortKey !== key) return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { size: 12 });
    return sortDirection === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 12 });
  }
  async function handleDelete(id2) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(id2);
    const result = await window.api.product.delete(id2);
    if (result.ok) setProducts((prev) => prev.filter((p2) => p2.id !== id2));
    else alert(`Delete failed: ${result.error}`);
    setDeleting(null);
  }
  async function handleDuplicate(id2) {
    const result = await window.api.product.duplicate(id2);
    if (result.ok) setProducts((prev) => [result.data, ...prev]);
    else alert(`Duplicate failed: ${result.error}`);
  }
  async function handleImport() {
    setImporting(true);
    const result = await window.api.product.importSpreadsheet();
    setImporting(false);
    if (!result.ok) {
      alert(`Import failed: ${result.error}`);
      return;
    }
    if (result.data === null) return;
    const { imported, skipped } = result.data;
    await load();
    let msg = `Imported ${imported} product${imported !== 1 ? "s" : ""}.`;
    if (skipped.length) msg += `

Skipped ${skipped.length} row${skipped.length !== 1 ? "s" : ""}:
${skipped.slice(0, 10).join("\n")}${skipped.length > 10 ? `
…and ${skipped.length - 10} more` : ""}`;
    alert(msg);
  }
  async function handleExportPDF(product) {
    setExporting(product.id);
    const result = await window.api.export.singlePDF(product);
    if (!result.ok) alert(`Export failed: ${result.error}`);
    setExporting(null);
  }
  function fmtDate(iso) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "screen", style: { display: "flex", flexDirection: "column", gap: 20, minHeight: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: 22, fontWeight: 700, color: "#1a2332", margin: 0 }, children: "Products" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: 13, color: "#64748b", marginTop: 3 }, children: [
          products.length,
          " product",
          products.length !== 1 ? "s" : "",
          " in your library"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: load, className: "btn btn-icon", title: "Refresh", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 13 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleImport, disabled: importing, className: "btn-outline btn-sm", title: "Import from CSV / Excel", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 13 }),
          " ",
          importing ? "Importing…" : "Import"
        ] }),
        products.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onOpenSheet(sortedProducts.slice(0, 8)), className: "btn-outline btn-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 13 }),
          " Print Sheet"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onEdit(void 0), className: "btn-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
          " New Product"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14, style: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "input",
          style: { paddingLeft: 36 },
          placeholder: "Search by name, price, or barcode…",
          value: query,
          onChange: (e) => setQuery(e.target.value)
        }
      )
    ] }),
    categories.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 12, style: { color: "#94a3b8", flexShrink: 0 } }),
      [{ id: "__all__", label: "All" }, ...categories.map((c) => ({ id: c, label: c }))].map(({ id: id2, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setActiveCategory(id2),
          style: {
            padding: "3px 12px",
            borderRadius: 20,
            border: "1px solid",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.1s",
            borderColor: activeCategory === id2 ? "#2563eb" : "#e2e8f0",
            background: activeCategory === id2 ? "#2563eb" : "white",
            color: activeCategory === id2 ? "white" : "#64748b"
          },
          children: [
            label,
            id2 !== "__all__" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginLeft: 5, opacity: 0.7 }, children: products.filter((p2) => (p2.category?.trim() || "") === id2).length })
          ]
        },
        id2
      ))
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#dc2626" }, children: error }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13, paddingTop: 60 }, children: "Loading products…" }) : sortedProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: "60px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 40 }, children: "🏪" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontWeight: 600, color: "#1a2332", margin: 0 }, children: query || activeCategory !== "__all__" ? "No products match your filter" : "No products yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 13, color: "#94a3b8", marginTop: 2 }, children: query || activeCategory !== "__all__" ? "Try clearing the search or selecting a different category." : "Create your first product label to get started." }),
      !query && activeCategory === "__all__" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => onEdit(void 0),
          className: "btn-primary",
          style: { marginTop: 8 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
            " Create Product"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", style: { flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, minHeight: 0, overflow: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 13 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { style: { position: "sticky", top: 0, zIndex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { borderBottom: "1px solid #f1f5f9", background: "#fafafa" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => toggleSort("name"), style: sortButtonStyle, children: [
          "Product ",
          renderSortIcon("name")
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => toggleSort("price"), style: sortButtonStyle, children: [
          "Price ",
          renderSortIcon("price")
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => toggleSort("barcodeValue"), style: sortButtonStyle, children: [
          "Barcode ",
          renderSortIcon("barcodeValue")
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => toggleSort("updatedAt"), style: sortButtonStyle, children: [
          "Modified ",
          renderSortIcon("updatedAt")
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right", padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }, children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sortedProducts.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          style: { borderBottom: "1px solid #f8fafc" },
          onMouseEnter: (e) => e.currentTarget.style.background = "#fafafa",
          onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "11px 16px", fontWeight: 600, color: "#1a2332" }, children: p2.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "11px 16px", color: "#334155", fontFamily: "monospace" }, children: p2.price }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "11px 16px", color: "#94a3b8", fontFamily: "monospace", fontSize: 11 }, children: p2.barcodeValue }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "11px 16px", color: "#94a3b8", fontSize: 12 }, children: fmtDate(p2.updatedAt) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "11px 16px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onEdit(p2), className: "btn btn-icon", title: "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 13 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDuplicate(p2.id), className: "btn btn-icon", title: "Duplicate", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 13 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleExportPDF(p2), disabled: exporting === p2.id, className: "btn btn-icon", title: "Export PDF", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 13 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onOpenSheet([p2]), className: "btn btn-icon", title: "Print Sheet", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 13 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handleDelete(p2.id),
                  disabled: deleting === p2.id,
                  className: "btn btn-icon danger",
                  title: "Delete",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                }
              )
            ] }) })
          ]
        },
        p2.id
      )) })
    ] }) }) })
  ] });
}
const sortButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: 0,
  border: "none",
  background: "transparent",
  color: "inherit",
  font: "inherit",
  textTransform: "inherit",
  letterSpacing: "inherit",
  cursor: "pointer"
};
var barcodes = {};
var CODE39$1 = {};
var Barcode$1 = {};
Object.defineProperty(Barcode$1, "__esModule", {
  value: true
});
function _classCallCheck$u(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var Barcode = function Barcode2(data, options) {
  _classCallCheck$u(this, Barcode2);
  this.data = data;
  this.text = options.text || data;
  this.options = options;
};
Barcode$1.default = Barcode;
Object.defineProperty(CODE39$1, "__esModule", {
  value: true
});
CODE39$1.CODE39 = void 0;
var _createClass$n = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _Barcode2$c = Barcode$1;
var _Barcode3$c = _interopRequireDefault$A(_Barcode2$c);
function _interopRequireDefault$A(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$t(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$p(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$p(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var CODE39 = function(_Barcode) {
  _inherits$p(CODE392, _Barcode);
  function CODE392(data, options) {
    _classCallCheck$t(this, CODE392);
    data = data.toUpperCase();
    if (options.mod43) {
      data += getCharacter(mod43checksum(data));
    }
    return _possibleConstructorReturn$p(this, (CODE392.__proto__ || Object.getPrototypeOf(CODE392)).call(this, data, options));
  }
  _createClass$n(CODE392, [{
    key: "encode",
    value: function encode3() {
      var result = getEncoding("*");
      for (var i = 0; i < this.data.length; i++) {
        result += getEncoding(this.data[i]) + "0";
      }
      result += getEncoding("*");
      return {
        data: result,
        text: this.text
      };
    }
  }, {
    key: "valid",
    value: function valid2() {
      return this.data.search(/^[0-9A-Z\-\.\ \$\/\+\%]+$/) !== -1;
    }
  }]);
  return CODE392;
}(_Barcode3$c.default);
var characters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "-", ".", " ", "$", "/", "+", "%", "*"];
var encodings = [20957, 29783, 23639, 30485, 20951, 29813, 23669, 20855, 29789, 23645, 29975, 23831, 30533, 22295, 30149, 24005, 21623, 29981, 23837, 22301, 30023, 23879, 30545, 22343, 30161, 24017, 21959, 30065, 23921, 22385, 29015, 18263, 29141, 17879, 29045, 18293, 17783, 29021, 18269, 17477, 17489, 17681, 20753, 35770];
function getEncoding(character) {
  return getBinary(characterValue(character));
}
function getBinary(characterValue2) {
  return encodings[characterValue2].toString(2);
}
function getCharacter(characterValue2) {
  return characters[characterValue2];
}
function characterValue(character) {
  return characters.indexOf(character);
}
function mod43checksum(data) {
  var checksum6 = 0;
  for (var i = 0; i < data.length; i++) {
    checksum6 += characterValue(data[i]);
  }
  checksum6 = checksum6 % 43;
  return checksum6;
}
CODE39$1.CODE39 = CODE39;
var CODE128$2 = {};
var CODE128_AUTO = {};
var CODE128$1 = {};
var constants$3 = {};
Object.defineProperty(constants$3, "__esModule", {
  value: true
});
var _SET_BY_CODE;
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var SET_A = constants$3.SET_A = 0;
var SET_B = constants$3.SET_B = 1;
var SET_C = constants$3.SET_C = 2;
constants$3.SHIFT = 98;
var START_A = constants$3.START_A = 103;
var START_B = constants$3.START_B = 104;
var START_C = constants$3.START_C = 105;
constants$3.MODULO = 103;
constants$3.STOP = 106;
constants$3.FNC1 = 207;
constants$3.SET_BY_CODE = (_SET_BY_CODE = {}, _defineProperty(_SET_BY_CODE, START_A, SET_A), _defineProperty(_SET_BY_CODE, START_B, SET_B), _defineProperty(_SET_BY_CODE, START_C, SET_C), _SET_BY_CODE);
constants$3.SWAP = {
  101: SET_A,
  100: SET_B,
  99: SET_C
};
constants$3.A_START_CHAR = String.fromCharCode(208);
constants$3.B_START_CHAR = String.fromCharCode(209);
constants$3.C_START_CHAR = String.fromCharCode(210);
constants$3.A_CHARS = "[\0-_È-Ï]";
constants$3.B_CHARS = "[ -È-Ï]";
constants$3.C_CHARS = "(Ï*[0-9]{2}Ï*)";
constants$3.BARS = [11011001100, 11001101100, 11001100110, 10010011e3, 10010001100, 10001001100, 10011001e3, 10011000100, 10001100100, 11001001e3, 11001000100, 11000100100, 10110011100, 10011011100, 10011001110, 10111001100, 10011101100, 10011100110, 11001110010, 11001011100, 11001001110, 11011100100, 11001110100, 11101101110, 11101001100, 11100101100, 11100100110, 11101100100, 11100110100, 11100110010, 11011011e3, 11011000110, 11000110110, 10100011e3, 10001011e3, 10001000110, 10110001e3, 10001101e3, 10001100010, 11010001e3, 11000101e3, 11000100010, 10110111e3, 10110001110, 10001101110, 10111011e3, 10111000110, 10001110110, 11101110110, 11010001110, 11000101110, 11011101e3, 11011100010, 11011101110, 11101011e3, 11101000110, 11100010110, 11101101e3, 11101100010, 11100011010, 11101111010, 11001000010, 11110001010, 1010011e4, 10100001100, 1001011e4, 10010000110, 10000101100, 10000100110, 1011001e4, 10110000100, 1001101e4, 10011000010, 10000110100, 10000110010, 11000010010, 1100101e4, 11110111010, 11000010100, 10001111010, 10100111100, 10010111100, 10010011110, 10111100100, 10011110100, 10011110010, 11110100100, 11110010100, 11110010010, 11011011110, 11011110110, 11110110110, 10101111e3, 10100011110, 10001011110, 10111101e3, 10111100010, 11110101e3, 11110100010, 10111011110, 10111101110, 11101011110, 11110101110, 11010000100, 1101001e4, 11010011100, 1100011101011];
Object.defineProperty(CODE128$1, "__esModule", {
  value: true
});
var _createClass$m = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _Barcode2$b = Barcode$1;
var _Barcode3$b = _interopRequireDefault$z(_Barcode2$b);
var _constants$b = constants$3;
function _interopRequireDefault$z(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$s(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$o(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$o(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var CODE128 = function(_Barcode) {
  _inherits$o(CODE1282, _Barcode);
  function CODE1282(data, options) {
    _classCallCheck$s(this, CODE1282);
    var _this = _possibleConstructorReturn$o(this, (CODE1282.__proto__ || Object.getPrototypeOf(CODE1282)).call(this, data.substring(1), options));
    _this.bytes = data.split("").map(function(char) {
      return char.charCodeAt(0);
    });
    return _this;
  }
  _createClass$m(CODE1282, [{
    key: "valid",
    value: function valid2() {
      return /^[\x00-\x7F\xC8-\xD3]+$/.test(this.data);
    }
    // The public encoding function
  }, {
    key: "encode",
    value: function encode3() {
      var bytes = this.bytes;
      var startIndex = bytes.shift() - 105;
      var startSet = _constants$b.SET_BY_CODE[startIndex];
      if (startSet === void 0) {
        throw new RangeError("The encoding does not start with a start character.");
      }
      if (this.shouldEncodeAsEan128() === true) {
        bytes.unshift(_constants$b.FNC1);
      }
      var encodingResult = CODE1282.next(bytes, 1, startSet);
      return {
        text: this.text === this.data ? this.text.replace(/[^\x20-\x7E]/g, "") : this.text,
        data: (
          // Add the start bits
          CODE1282.getBar(startIndex) + // Add the encoded bits
          encodingResult.result + // Add the checksum
          CODE1282.getBar((encodingResult.checksum + startIndex) % _constants$b.MODULO) + // Add the end bits
          CODE1282.getBar(_constants$b.STOP)
        )
      };
    }
    // GS1-128/EAN-128
  }, {
    key: "shouldEncodeAsEan128",
    value: function shouldEncodeAsEan128() {
      var isEAN128 = this.options.ean128 || false;
      if (typeof isEAN128 === "string") {
        isEAN128 = isEAN128.toLowerCase() === "true";
      }
      return isEAN128;
    }
    // Get a bar symbol by index
  }], [{
    key: "getBar",
    value: function getBar(index) {
      return _constants$b.BARS[index] ? _constants$b.BARS[index].toString() : "";
    }
    // Correct an index by a set and shift it from the bytes array
  }, {
    key: "correctIndex",
    value: function correctIndex(bytes, set) {
      if (set === _constants$b.SET_A) {
        var charCode = bytes.shift();
        return charCode < 32 ? charCode + 64 : charCode - 32;
      } else if (set === _constants$b.SET_B) {
        return bytes.shift() - 32;
      } else {
        return (bytes.shift() - 48) * 10 + bytes.shift() - 48;
      }
    }
  }, {
    key: "next",
    value: function next(bytes, pos, set) {
      if (!bytes.length) {
        return { result: "", checksum: 0 };
      }
      var nextCode = void 0, index = void 0;
      if (bytes[0] >= 200) {
        index = bytes.shift() - 105;
        var nextSet = _constants$b.SWAP[index];
        if (nextSet !== void 0) {
          nextCode = CODE1282.next(bytes, pos + 1, nextSet);
        } else {
          if ((set === _constants$b.SET_A || set === _constants$b.SET_B) && index === _constants$b.SHIFT) {
            bytes[0] = set === _constants$b.SET_A ? bytes[0] > 95 ? bytes[0] - 96 : bytes[0] : bytes[0] < 32 ? bytes[0] + 96 : bytes[0];
          }
          nextCode = CODE1282.next(bytes, pos + 1, set);
        }
      } else {
        index = CODE1282.correctIndex(bytes, set);
        nextCode = CODE1282.next(bytes, pos + 1, set);
      }
      var enc = CODE1282.getBar(index);
      var weight = index * pos;
      return {
        result: enc + nextCode.result,
        checksum: weight + nextCode.checksum
      };
    }
  }]);
  return CODE1282;
}(_Barcode3$b.default);
CODE128$1.default = CODE128;
var auto = {};
Object.defineProperty(auto, "__esModule", {
  value: true
});
var _constants$a = constants$3;
var matchSetALength = function matchSetALength2(string) {
  return string.match(new RegExp("^" + _constants$a.A_CHARS + "*"))[0].length;
};
var matchSetBLength = function matchSetBLength2(string) {
  return string.match(new RegExp("^" + _constants$a.B_CHARS + "*"))[0].length;
};
var matchSetC = function matchSetC2(string) {
  return string.match(new RegExp("^" + _constants$a.C_CHARS + "*"))[0];
};
function autoSelectFromAB(string, isA) {
  var ranges = isA ? _constants$a.A_CHARS : _constants$a.B_CHARS;
  var untilC = string.match(new RegExp("^(" + ranges + "+?)(([0-9]{2}){2,})([^0-9]|$)"));
  if (untilC) {
    return untilC[1] + String.fromCharCode(204) + autoSelectFromC(string.substring(untilC[1].length));
  }
  var chars = string.match(new RegExp("^" + ranges + "+"))[0];
  if (chars.length === string.length) {
    return string;
  }
  return chars + String.fromCharCode(isA ? 205 : 206) + autoSelectFromAB(string.substring(chars.length), !isA);
}
function autoSelectFromC(string) {
  var cMatch = matchSetC(string);
  var length = cMatch.length;
  if (length === string.length) {
    return string;
  }
  string = string.substring(length);
  var isA = matchSetALength(string) >= matchSetBLength(string);
  return cMatch + String.fromCharCode(isA ? 206 : 205) + autoSelectFromAB(string, isA);
}
auto.default = function(string) {
  var newString = void 0;
  var cLength = matchSetC(string).length;
  if (cLength >= 2) {
    newString = _constants$a.C_START_CHAR + autoSelectFromC(string);
  } else {
    var isA = matchSetALength(string) > matchSetBLength(string);
    newString = (isA ? _constants$a.A_START_CHAR : _constants$a.B_START_CHAR) + autoSelectFromAB(string, isA);
  }
  return newString.replace(
    /[\xCD\xCE]([^])[\xCD\xCE]/,
    // Any sequence between 205 and 206 characters
    function(match, char) {
      return String.fromCharCode(203) + char;
    }
  );
};
Object.defineProperty(CODE128_AUTO, "__esModule", {
  value: true
});
var _CODE2$6 = CODE128$1;
var _CODE3$5 = _interopRequireDefault$y(_CODE2$6);
var _auto = auto;
var _auto2 = _interopRequireDefault$y(_auto);
function _interopRequireDefault$y(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$r(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$n(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$n(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var CODE128AUTO = function(_CODE4) {
  _inherits$n(CODE128AUTO2, _CODE4);
  function CODE128AUTO2(data, options) {
    _classCallCheck$r(this, CODE128AUTO2);
    if (/^[\x00-\x7F\xC8-\xD3]+$/.test(data)) {
      var _this = _possibleConstructorReturn$n(this, (CODE128AUTO2.__proto__ || Object.getPrototypeOf(CODE128AUTO2)).call(this, (0, _auto2.default)(data), options));
    } else {
      var _this = _possibleConstructorReturn$n(this, (CODE128AUTO2.__proto__ || Object.getPrototypeOf(CODE128AUTO2)).call(this, data, options));
    }
    return _possibleConstructorReturn$n(_this);
  }
  return CODE128AUTO2;
}(_CODE3$5.default);
CODE128_AUTO.default = CODE128AUTO;
var CODE128A$1 = {};
Object.defineProperty(CODE128A$1, "__esModule", {
  value: true
});
var _createClass$l = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _CODE2$5 = CODE128$1;
var _CODE3$4 = _interopRequireDefault$x(_CODE2$5);
var _constants$9 = constants$3;
function _interopRequireDefault$x(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$q(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$m(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$m(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var CODE128A = function(_CODE4) {
  _inherits$m(CODE128A2, _CODE4);
  function CODE128A2(string, options) {
    _classCallCheck$q(this, CODE128A2);
    return _possibleConstructorReturn$m(this, (CODE128A2.__proto__ || Object.getPrototypeOf(CODE128A2)).call(this, _constants$9.A_START_CHAR + string, options));
  }
  _createClass$l(CODE128A2, [{
    key: "valid",
    value: function valid2() {
      return new RegExp("^" + _constants$9.A_CHARS + "+$").test(this.data);
    }
  }]);
  return CODE128A2;
}(_CODE3$4.default);
CODE128A$1.default = CODE128A;
var CODE128B$1 = {};
Object.defineProperty(CODE128B$1, "__esModule", {
  value: true
});
var _createClass$k = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _CODE2$4 = CODE128$1;
var _CODE3$3 = _interopRequireDefault$w(_CODE2$4);
var _constants$8 = constants$3;
function _interopRequireDefault$w(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$p(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$l(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$l(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var CODE128B = function(_CODE4) {
  _inherits$l(CODE128B2, _CODE4);
  function CODE128B2(string, options) {
    _classCallCheck$p(this, CODE128B2);
    return _possibleConstructorReturn$l(this, (CODE128B2.__proto__ || Object.getPrototypeOf(CODE128B2)).call(this, _constants$8.B_START_CHAR + string, options));
  }
  _createClass$k(CODE128B2, [{
    key: "valid",
    value: function valid2() {
      return new RegExp("^" + _constants$8.B_CHARS + "+$").test(this.data);
    }
  }]);
  return CODE128B2;
}(_CODE3$3.default);
CODE128B$1.default = CODE128B;
var CODE128C$1 = {};
Object.defineProperty(CODE128C$1, "__esModule", {
  value: true
});
var _createClass$j = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _CODE2$3 = CODE128$1;
var _CODE3$2 = _interopRequireDefault$v(_CODE2$3);
var _constants$7 = constants$3;
function _interopRequireDefault$v(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$o(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$k(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$k(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var CODE128C = function(_CODE4) {
  _inherits$k(CODE128C2, _CODE4);
  function CODE128C2(string, options) {
    _classCallCheck$o(this, CODE128C2);
    return _possibleConstructorReturn$k(this, (CODE128C2.__proto__ || Object.getPrototypeOf(CODE128C2)).call(this, _constants$7.C_START_CHAR + string, options));
  }
  _createClass$j(CODE128C2, [{
    key: "valid",
    value: function valid2() {
      return new RegExp("^" + _constants$7.C_CHARS + "+$").test(this.data);
    }
  }]);
  return CODE128C2;
}(_CODE3$2.default);
CODE128C$1.default = CODE128C;
Object.defineProperty(CODE128$2, "__esModule", {
  value: true
});
CODE128$2.CODE128C = CODE128$2.CODE128B = CODE128$2.CODE128A = CODE128$2.CODE128 = void 0;
var _CODE128_AUTO = CODE128_AUTO;
var _CODE128_AUTO2 = _interopRequireDefault$u(_CODE128_AUTO);
var _CODE128A = CODE128A$1;
var _CODE128A2 = _interopRequireDefault$u(_CODE128A);
var _CODE128B = CODE128B$1;
var _CODE128B2 = _interopRequireDefault$u(_CODE128B);
var _CODE128C = CODE128C$1;
var _CODE128C2 = _interopRequireDefault$u(_CODE128C);
function _interopRequireDefault$u(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
CODE128$2.CODE128 = _CODE128_AUTO2.default;
CODE128$2.CODE128A = _CODE128A2.default;
CODE128$2.CODE128B = _CODE128B2.default;
CODE128$2.CODE128C = _CODE128C2.default;
var EAN_UPC = {};
var EAN13$1 = {};
var constants$2 = {};
Object.defineProperty(constants$2, "__esModule", {
  value: true
});
constants$2.SIDE_BIN = "101";
constants$2.MIDDLE_BIN = "01010";
constants$2.BINARIES = {
  "L": [
    // The L (left) type of encoding
    "0001101",
    "0011001",
    "0010011",
    "0111101",
    "0100011",
    "0110001",
    "0101111",
    "0111011",
    "0110111",
    "0001011"
  ],
  "G": [
    // The G type of encoding
    "0100111",
    "0110011",
    "0011011",
    "0100001",
    "0011101",
    "0111001",
    "0000101",
    "0010001",
    "0001001",
    "0010111"
  ],
  "R": [
    // The R (right) type of encoding
    "1110010",
    "1100110",
    "1101100",
    "1000010",
    "1011100",
    "1001110",
    "1010000",
    "1000100",
    "1001000",
    "1110100"
  ],
  "O": [
    // The O (odd) encoding for UPC-E
    "0001101",
    "0011001",
    "0010011",
    "0111101",
    "0100011",
    "0110001",
    "0101111",
    "0111011",
    "0110111",
    "0001011"
  ],
  "E": [
    // The E (even) encoding for UPC-E
    "0100111",
    "0110011",
    "0011011",
    "0100001",
    "0011101",
    "0111001",
    "0000101",
    "0010001",
    "0001001",
    "0010111"
  ]
};
constants$2.EAN2_STRUCTURE = ["LL", "LG", "GL", "GG"];
constants$2.EAN5_STRUCTURE = ["GGLLL", "GLGLL", "GLLGL", "GLLLG", "LGGLL", "LLGGL", "LLLGG", "LGLGL", "LGLLG", "LLGLG"];
constants$2.EAN13_STRUCTURE = ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"];
var EAN$1 = {};
var encoder = {};
Object.defineProperty(encoder, "__esModule", {
  value: true
});
var _constants$6 = constants$2;
var encode$1 = function encode(data, structure, separator) {
  var encoded = data.split("").map(function(val, idx) {
    return _constants$6.BINARIES[structure[idx]];
  }).map(function(val, idx) {
    return val ? val[data[idx]] : "";
  });
  if (separator) {
    var last = data.length - 1;
    encoded = encoded.map(function(val, idx) {
      return idx < last ? val + separator : val;
    });
  }
  return encoded.join("");
};
encoder.default = encode$1;
Object.defineProperty(EAN$1, "__esModule", {
  value: true
});
var _createClass$i = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _constants$5 = constants$2;
var _encoder$4 = encoder;
var _encoder2$4 = _interopRequireDefault$t(_encoder$4);
var _Barcode2$a = Barcode$1;
var _Barcode3$a = _interopRequireDefault$t(_Barcode2$a);
function _interopRequireDefault$t(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$n(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$j(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$j(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var EAN = function(_Barcode) {
  _inherits$j(EAN3, _Barcode);
  function EAN3(data, options) {
    _classCallCheck$n(this, EAN3);
    var _this = _possibleConstructorReturn$j(this, (EAN3.__proto__ || Object.getPrototypeOf(EAN3)).call(this, data, options));
    _this.fontSize = !options.flat && options.fontSize > options.width * 10 ? options.width * 10 : options.fontSize;
    _this.guardHeight = options.height + _this.fontSize / 2 + options.textMargin;
    return _this;
  }
  _createClass$i(EAN3, [{
    key: "encode",
    value: function encode3() {
      return this.options.flat ? this.encodeFlat() : this.encodeGuarded();
    }
  }, {
    key: "leftText",
    value: function leftText(from, to) {
      return this.text.substr(from, to);
    }
  }, {
    key: "leftEncode",
    value: function leftEncode(data, structure) {
      return (0, _encoder2$4.default)(data, structure);
    }
  }, {
    key: "rightText",
    value: function rightText(from, to) {
      return this.text.substr(from, to);
    }
  }, {
    key: "rightEncode",
    value: function rightEncode(data, structure) {
      return (0, _encoder2$4.default)(data, structure);
    }
  }, {
    key: "encodeGuarded",
    value: function encodeGuarded() {
      var textOptions = { fontSize: this.fontSize };
      var guardOptions = { height: this.guardHeight };
      return [{ data: _constants$5.SIDE_BIN, options: guardOptions }, { data: this.leftEncode(), text: this.leftText(), options: textOptions }, { data: _constants$5.MIDDLE_BIN, options: guardOptions }, { data: this.rightEncode(), text: this.rightText(), options: textOptions }, { data: _constants$5.SIDE_BIN, options: guardOptions }];
    }
  }, {
    key: "encodeFlat",
    value: function encodeFlat() {
      var data = [_constants$5.SIDE_BIN, this.leftEncode(), _constants$5.MIDDLE_BIN, this.rightEncode(), _constants$5.SIDE_BIN];
      return {
        data: data.join(""),
        text: this.text
      };
    }
  }]);
  return EAN3;
}(_Barcode3$a.default);
EAN$1.default = EAN;
Object.defineProperty(EAN13$1, "__esModule", {
  value: true
});
var _createClass$h = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _get$1 = function get(object2, property, receiver) {
  if (object2 === null) object2 = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object2, property);
  if (desc === void 0) {
    var parent = Object.getPrototypeOf(object2);
    if (parent === null) {
      return void 0;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === void 0) {
      return void 0;
    }
    return getter.call(receiver);
  }
};
var _constants$4 = constants$2;
var _EAN2$2 = EAN$1;
var _EAN3$2 = _interopRequireDefault$s(_EAN2$2);
function _interopRequireDefault$s(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$m(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$i(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$i(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var checksum$4 = function checksum(number) {
  var res = number.substr(0, 12).split("").map(function(n2) {
    return +n2;
  }).reduce(function(sum, a, idx) {
    return idx % 2 ? sum + a * 3 : sum + a;
  }, 0);
  return (10 - res % 10) % 10;
};
var EAN13 = function(_EAN9) {
  _inherits$i(EAN132, _EAN9);
  function EAN132(data, options) {
    _classCallCheck$m(this, EAN132);
    if (data.search(/^[0-9]{12}$/) !== -1) {
      data += checksum$4(data);
    }
    var _this = _possibleConstructorReturn$i(this, (EAN132.__proto__ || Object.getPrototypeOf(EAN132)).call(this, data, options));
    _this.lastChar = options.lastChar;
    return _this;
  }
  _createClass$h(EAN132, [{
    key: "valid",
    value: function valid2() {
      return this.data.search(/^[0-9]{13}$/) !== -1 && +this.data[12] === checksum$4(this.data);
    }
  }, {
    key: "leftText",
    value: function leftText() {
      return _get$1(EAN132.prototype.__proto__ || Object.getPrototypeOf(EAN132.prototype), "leftText", this).call(this, 1, 6);
    }
  }, {
    key: "leftEncode",
    value: function leftEncode() {
      var data = this.data.substr(1, 6);
      var structure = _constants$4.EAN13_STRUCTURE[this.data[0]];
      return _get$1(EAN132.prototype.__proto__ || Object.getPrototypeOf(EAN132.prototype), "leftEncode", this).call(this, data, structure);
    }
  }, {
    key: "rightText",
    value: function rightText() {
      return _get$1(EAN132.prototype.__proto__ || Object.getPrototypeOf(EAN132.prototype), "rightText", this).call(this, 7, 6);
    }
  }, {
    key: "rightEncode",
    value: function rightEncode() {
      var data = this.data.substr(7, 6);
      return _get$1(EAN132.prototype.__proto__ || Object.getPrototypeOf(EAN132.prototype), "rightEncode", this).call(this, data, "RRRRRR");
    }
    // The "standard" way of printing EAN13 barcodes with guard bars
  }, {
    key: "encodeGuarded",
    value: function encodeGuarded() {
      var data = _get$1(EAN132.prototype.__proto__ || Object.getPrototypeOf(EAN132.prototype), "encodeGuarded", this).call(this);
      if (this.options.displayValue) {
        data.unshift({
          data: "000000000000",
          text: this.text.substr(0, 1),
          options: { textAlign: "left", fontSize: this.fontSize }
        });
        if (this.options.lastChar) {
          data.push({
            data: "00"
          });
          data.push({
            data: "00000",
            text: this.options.lastChar,
            options: { fontSize: this.fontSize }
          });
        }
      }
      return data;
    }
  }]);
  return EAN132;
}(_EAN3$2.default);
EAN13$1.default = EAN13;
var EAN8$1 = {};
Object.defineProperty(EAN8$1, "__esModule", {
  value: true
});
var _createClass$g = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _get = function get2(object2, property, receiver) {
  if (object2 === null) object2 = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object2, property);
  if (desc === void 0) {
    var parent = Object.getPrototypeOf(object2);
    if (parent === null) {
      return void 0;
    } else {
      return get2(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === void 0) {
      return void 0;
    }
    return getter.call(receiver);
  }
};
var _EAN2$1 = EAN$1;
var _EAN3$1 = _interopRequireDefault$r(_EAN2$1);
function _interopRequireDefault$r(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$l(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$h(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$h(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var checksum$3 = function checksum2(number) {
  var res = number.substr(0, 7).split("").map(function(n2) {
    return +n2;
  }).reduce(function(sum, a, idx) {
    return idx % 2 ? sum + a : sum + a * 3;
  }, 0);
  return (10 - res % 10) % 10;
};
var EAN8 = function(_EAN9) {
  _inherits$h(EAN82, _EAN9);
  function EAN82(data, options) {
    _classCallCheck$l(this, EAN82);
    if (data.search(/^[0-9]{7}$/) !== -1) {
      data += checksum$3(data);
    }
    return _possibleConstructorReturn$h(this, (EAN82.__proto__ || Object.getPrototypeOf(EAN82)).call(this, data, options));
  }
  _createClass$g(EAN82, [{
    key: "valid",
    value: function valid2() {
      return this.data.search(/^[0-9]{8}$/) !== -1 && +this.data[7] === checksum$3(this.data);
    }
  }, {
    key: "leftText",
    value: function leftText() {
      return _get(EAN82.prototype.__proto__ || Object.getPrototypeOf(EAN82.prototype), "leftText", this).call(this, 0, 4);
    }
  }, {
    key: "leftEncode",
    value: function leftEncode() {
      var data = this.data.substr(0, 4);
      return _get(EAN82.prototype.__proto__ || Object.getPrototypeOf(EAN82.prototype), "leftEncode", this).call(this, data, "LLLL");
    }
  }, {
    key: "rightText",
    value: function rightText() {
      return _get(EAN82.prototype.__proto__ || Object.getPrototypeOf(EAN82.prototype), "rightText", this).call(this, 4, 4);
    }
  }, {
    key: "rightEncode",
    value: function rightEncode() {
      var data = this.data.substr(4, 4);
      return _get(EAN82.prototype.__proto__ || Object.getPrototypeOf(EAN82.prototype), "rightEncode", this).call(this, data, "RRRR");
    }
  }]);
  return EAN82;
}(_EAN3$1.default);
EAN8$1.default = EAN8;
var EAN5$1 = {};
Object.defineProperty(EAN5$1, "__esModule", {
  value: true
});
var _createClass$f = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _constants$3 = constants$2;
var _encoder$3 = encoder;
var _encoder2$3 = _interopRequireDefault$q(_encoder$3);
var _Barcode2$9 = Barcode$1;
var _Barcode3$9 = _interopRequireDefault$q(_Barcode2$9);
function _interopRequireDefault$q(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$k(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$g(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$g(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var checksum$2 = function checksum3(data) {
  var result = data.split("").map(function(n2) {
    return +n2;
  }).reduce(function(sum, a, idx) {
    return idx % 2 ? sum + a * 9 : sum + a * 3;
  }, 0);
  return result % 10;
};
var EAN5 = function(_Barcode) {
  _inherits$g(EAN52, _Barcode);
  function EAN52(data, options) {
    _classCallCheck$k(this, EAN52);
    return _possibleConstructorReturn$g(this, (EAN52.__proto__ || Object.getPrototypeOf(EAN52)).call(this, data, options));
  }
  _createClass$f(EAN52, [{
    key: "valid",
    value: function valid2() {
      return this.data.search(/^[0-9]{5}$/) !== -1;
    }
  }, {
    key: "encode",
    value: function encode3() {
      var structure = _constants$3.EAN5_STRUCTURE[checksum$2(this.data)];
      return {
        data: "1011" + (0, _encoder2$3.default)(this.data, structure, "01"),
        text: this.text
      };
    }
  }]);
  return EAN52;
}(_Barcode3$9.default);
EAN5$1.default = EAN5;
var EAN2$1 = {};
Object.defineProperty(EAN2$1, "__esModule", {
  value: true
});
var _createClass$e = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _constants$2 = constants$2;
var _encoder$2 = encoder;
var _encoder2$2 = _interopRequireDefault$p(_encoder$2);
var _Barcode2$8 = Barcode$1;
var _Barcode3$8 = _interopRequireDefault$p(_Barcode2$8);
function _interopRequireDefault$p(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$j(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$f(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$f(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var EAN2 = function(_Barcode) {
  _inherits$f(EAN22, _Barcode);
  function EAN22(data, options) {
    _classCallCheck$j(this, EAN22);
    return _possibleConstructorReturn$f(this, (EAN22.__proto__ || Object.getPrototypeOf(EAN22)).call(this, data, options));
  }
  _createClass$e(EAN22, [{
    key: "valid",
    value: function valid2() {
      return this.data.search(/^[0-9]{2}$/) !== -1;
    }
  }, {
    key: "encode",
    value: function encode3() {
      var structure = _constants$2.EAN2_STRUCTURE[parseInt(this.data) % 4];
      return {
        // Start bits + Encode the two digits with 01 in between
        data: "1011" + (0, _encoder2$2.default)(this.data, structure, "01"),
        text: this.text
      };
    }
  }]);
  return EAN22;
}(_Barcode3$8.default);
EAN2$1.default = EAN2;
var UPC$1 = {};
Object.defineProperty(UPC$1, "__esModule", {
  value: true
});
var _createClass$d = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
UPC$1.checksum = checksum$1;
var _encoder$1 = encoder;
var _encoder2$1 = _interopRequireDefault$o(_encoder$1);
var _Barcode2$7 = Barcode$1;
var _Barcode3$7 = _interopRequireDefault$o(_Barcode2$7);
function _interopRequireDefault$o(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$i(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$e(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$e(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var UPC = function(_Barcode) {
  _inherits$e(UPC2, _Barcode);
  function UPC2(data, options) {
    _classCallCheck$i(this, UPC2);
    if (data.search(/^[0-9]{11}$/) !== -1) {
      data += checksum$1(data);
    }
    var _this = _possibleConstructorReturn$e(this, (UPC2.__proto__ || Object.getPrototypeOf(UPC2)).call(this, data, options));
    _this.displayValue = options.displayValue;
    if (options.fontSize > options.width * 10) {
      _this.fontSize = options.width * 10;
    } else {
      _this.fontSize = options.fontSize;
    }
    _this.guardHeight = options.height + _this.fontSize / 2 + options.textMargin;
    return _this;
  }
  _createClass$d(UPC2, [{
    key: "valid",
    value: function valid2() {
      return this.data.search(/^[0-9]{12}$/) !== -1 && this.data[11] == checksum$1(this.data);
    }
  }, {
    key: "encode",
    value: function encode3() {
      if (this.options.flat) {
        return this.flatEncoding();
      } else {
        return this.guardedEncoding();
      }
    }
  }, {
    key: "flatEncoding",
    value: function flatEncoding() {
      var result = "";
      result += "101";
      result += (0, _encoder2$1.default)(this.data.substr(0, 6), "LLLLLL");
      result += "01010";
      result += (0, _encoder2$1.default)(this.data.substr(6, 6), "RRRRRR");
      result += "101";
      return {
        data: result,
        text: this.text
      };
    }
  }, {
    key: "guardedEncoding",
    value: function guardedEncoding() {
      var result = [];
      if (this.displayValue) {
        result.push({
          data: "00000000",
          text: this.text.substr(0, 1),
          options: { textAlign: "left", fontSize: this.fontSize }
        });
      }
      result.push({
        data: "101" + (0, _encoder2$1.default)(this.data[0], "L"),
        options: { height: this.guardHeight }
      });
      result.push({
        data: (0, _encoder2$1.default)(this.data.substr(1, 5), "LLLLL"),
        text: this.text.substr(1, 5),
        options: { fontSize: this.fontSize }
      });
      result.push({
        data: "01010",
        options: { height: this.guardHeight }
      });
      result.push({
        data: (0, _encoder2$1.default)(this.data.substr(6, 5), "RRRRR"),
        text: this.text.substr(6, 5),
        options: { fontSize: this.fontSize }
      });
      result.push({
        data: (0, _encoder2$1.default)(this.data[11], "R") + "101",
        options: { height: this.guardHeight }
      });
      if (this.displayValue) {
        result.push({
          data: "00000000",
          text: this.text.substr(11, 1),
          options: { textAlign: "right", fontSize: this.fontSize }
        });
      }
      return result;
    }
  }]);
  return UPC2;
}(_Barcode3$7.default);
function checksum$1(number) {
  var result = 0;
  var i;
  for (i = 1; i < 11; i += 2) {
    result += parseInt(number[i]);
  }
  for (i = 0; i < 11; i += 2) {
    result += parseInt(number[i]) * 3;
  }
  return (10 - result % 10) % 10;
}
UPC$1.default = UPC;
var UPCE$1 = {};
Object.defineProperty(UPCE$1, "__esModule", {
  value: true
});
var _createClass$c = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _encoder = encoder;
var _encoder2 = _interopRequireDefault$n(_encoder);
var _Barcode2$6 = Barcode$1;
var _Barcode3$6 = _interopRequireDefault$n(_Barcode2$6);
var _UPC$1 = UPC$1;
function _interopRequireDefault$n(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$h(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$d(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$d(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var EXPANSIONS = ["XX00000XXX", "XX10000XXX", "XX20000XXX", "XXX00000XX", "XXXX00000X", "XXXXX00005", "XXXXX00006", "XXXXX00007", "XXXXX00008", "XXXXX00009"];
var PARITIES = [["EEEOOO", "OOOEEE"], ["EEOEOO", "OOEOEE"], ["EEOOEO", "OOEEOE"], ["EEOOOE", "OOEEEO"], ["EOEEOO", "OEOOEE"], ["EOOEEO", "OEEOOE"], ["EOOOEE", "OEEEOO"], ["EOEOEO", "OEOEOE"], ["EOEOOE", "OEOEEO"], ["EOOEOE", "OEEOEO"]];
var UPCE = function(_Barcode) {
  _inherits$d(UPCE2, _Barcode);
  function UPCE2(data, options) {
    _classCallCheck$h(this, UPCE2);
    var _this = _possibleConstructorReturn$d(this, (UPCE2.__proto__ || Object.getPrototypeOf(UPCE2)).call(this, data, options));
    _this.isValid = false;
    if (data.search(/^[0-9]{6}$/) !== -1) {
      _this.middleDigits = data;
      _this.upcA = expandToUPCA(data, "0");
      _this.text = options.text || "" + _this.upcA[0] + data + _this.upcA[_this.upcA.length - 1];
      _this.isValid = true;
    } else if (data.search(/^[01][0-9]{7}$/) !== -1) {
      _this.middleDigits = data.substring(1, data.length - 1);
      _this.upcA = expandToUPCA(_this.middleDigits, data[0]);
      if (_this.upcA[_this.upcA.length - 1] === data[data.length - 1]) {
        _this.isValid = true;
      } else {
        return _possibleConstructorReturn$d(_this);
      }
    } else {
      return _possibleConstructorReturn$d(_this);
    }
    _this.displayValue = options.displayValue;
    if (options.fontSize > options.width * 10) {
      _this.fontSize = options.width * 10;
    } else {
      _this.fontSize = options.fontSize;
    }
    _this.guardHeight = options.height + _this.fontSize / 2 + options.textMargin;
    return _this;
  }
  _createClass$c(UPCE2, [{
    key: "valid",
    value: function valid2() {
      return this.isValid;
    }
  }, {
    key: "encode",
    value: function encode3() {
      if (this.options.flat) {
        return this.flatEncoding();
      } else {
        return this.guardedEncoding();
      }
    }
  }, {
    key: "flatEncoding",
    value: function flatEncoding() {
      var result = "";
      result += "101";
      result += this.encodeMiddleDigits();
      result += "010101";
      return {
        data: result,
        text: this.text
      };
    }
  }, {
    key: "guardedEncoding",
    value: function guardedEncoding() {
      var result = [];
      if (this.displayValue) {
        result.push({
          data: "00000000",
          text: this.text[0],
          options: { textAlign: "left", fontSize: this.fontSize }
        });
      }
      result.push({
        data: "101",
        options: { height: this.guardHeight }
      });
      result.push({
        data: this.encodeMiddleDigits(),
        text: this.text.substring(1, 7),
        options: { fontSize: this.fontSize }
      });
      result.push({
        data: "010101",
        options: { height: this.guardHeight }
      });
      if (this.displayValue) {
        result.push({
          data: "00000000",
          text: this.text[7],
          options: { textAlign: "right", fontSize: this.fontSize }
        });
      }
      return result;
    }
  }, {
    key: "encodeMiddleDigits",
    value: function encodeMiddleDigits() {
      var numberSystem = this.upcA[0];
      var checkDigit = this.upcA[this.upcA.length - 1];
      var parity = PARITIES[parseInt(checkDigit)][parseInt(numberSystem)];
      return (0, _encoder2.default)(this.middleDigits, parity);
    }
  }]);
  return UPCE2;
}(_Barcode3$6.default);
function expandToUPCA(middleDigits, numberSystem) {
  var lastUpcE = parseInt(middleDigits[middleDigits.length - 1]);
  var expansion = EXPANSIONS[lastUpcE];
  var result = "";
  var digitIndex = 0;
  for (var i = 0; i < expansion.length; i++) {
    var c = expansion[i];
    if (c === "X") {
      result += middleDigits[digitIndex++];
    } else {
      result += c;
    }
  }
  result = "" + numberSystem + result;
  return "" + result + (0, _UPC$1.checksum)(result);
}
UPCE$1.default = UPCE;
Object.defineProperty(EAN_UPC, "__esModule", {
  value: true
});
EAN_UPC.UPCE = EAN_UPC.UPC = EAN_UPC.EAN2 = EAN_UPC.EAN5 = EAN_UPC.EAN8 = EAN_UPC.EAN13 = void 0;
var _EAN = EAN13$1;
var _EAN2 = _interopRequireDefault$m(_EAN);
var _EAN3 = EAN8$1;
var _EAN4 = _interopRequireDefault$m(_EAN3);
var _EAN5 = EAN5$1;
var _EAN6 = _interopRequireDefault$m(_EAN5);
var _EAN7 = EAN2$1;
var _EAN8 = _interopRequireDefault$m(_EAN7);
var _UPC = UPC$1;
var _UPC2 = _interopRequireDefault$m(_UPC);
var _UPCE = UPCE$1;
var _UPCE2 = _interopRequireDefault$m(_UPCE);
function _interopRequireDefault$m(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
EAN_UPC.EAN13 = _EAN2.default;
EAN_UPC.EAN8 = _EAN4.default;
EAN_UPC.EAN5 = _EAN6.default;
EAN_UPC.EAN2 = _EAN8.default;
EAN_UPC.UPC = _UPC2.default;
EAN_UPC.UPCE = _UPCE2.default;
var ITF$2 = {};
var ITF$1 = {};
var constants$1 = {};
Object.defineProperty(constants$1, "__esModule", {
  value: true
});
constants$1.START_BIN = "1010";
constants$1.END_BIN = "11101";
constants$1.BINARIES = ["00110", "10001", "01001", "11000", "00101", "10100", "01100", "00011", "10010", "01010"];
Object.defineProperty(ITF$1, "__esModule", {
  value: true
});
var _createClass$b = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _constants$1 = constants$1;
var _Barcode2$5 = Barcode$1;
var _Barcode3$5 = _interopRequireDefault$l(_Barcode2$5);
function _interopRequireDefault$l(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$g(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$c(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$c(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var ITF = function(_Barcode) {
  _inherits$c(ITF2, _Barcode);
  function ITF2() {
    _classCallCheck$g(this, ITF2);
    return _possibleConstructorReturn$c(this, (ITF2.__proto__ || Object.getPrototypeOf(ITF2)).apply(this, arguments));
  }
  _createClass$b(ITF2, [{
    key: "valid",
    value: function valid2() {
      return this.data.search(/^([0-9]{2})+$/) !== -1;
    }
  }, {
    key: "encode",
    value: function encode3() {
      var _this2 = this;
      var encoded = this.data.match(/.{2}/g).map(function(pair) {
        return _this2.encodePair(pair);
      }).join("");
      return {
        data: _constants$1.START_BIN + encoded + _constants$1.END_BIN,
        text: this.text
      };
    }
    // Calculate the data of a number pair
  }, {
    key: "encodePair",
    value: function encodePair(pair) {
      var second = _constants$1.BINARIES[pair[1]];
      return _constants$1.BINARIES[pair[0]].split("").map(function(first, idx) {
        return (first === "1" ? "111" : "1") + (second[idx] === "1" ? "000" : "0");
      }).join("");
    }
  }]);
  return ITF2;
}(_Barcode3$5.default);
ITF$1.default = ITF;
var ITF14$1 = {};
Object.defineProperty(ITF14$1, "__esModule", {
  value: true
});
var _createClass$a = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _ITF2$1 = ITF$1;
var _ITF3$1 = _interopRequireDefault$k(_ITF2$1);
function _interopRequireDefault$k(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$f(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$b(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$b(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var checksum4 = function checksum5(data) {
  var res = data.substr(0, 13).split("").map(function(num) {
    return parseInt(num, 10);
  }).reduce(function(sum, n2, idx) {
    return sum + n2 * (3 - idx % 2 * 2);
  }, 0);
  return Math.ceil(res / 10) * 10 - res;
};
var ITF14 = function(_ITF5) {
  _inherits$b(ITF142, _ITF5);
  function ITF142(data, options) {
    _classCallCheck$f(this, ITF142);
    if (data.search(/^[0-9]{13}$/) !== -1) {
      data += checksum4(data);
    }
    return _possibleConstructorReturn$b(this, (ITF142.__proto__ || Object.getPrototypeOf(ITF142)).call(this, data, options));
  }
  _createClass$a(ITF142, [{
    key: "valid",
    value: function valid2() {
      return this.data.search(/^[0-9]{14}$/) !== -1 && +this.data[13] === checksum4(this.data);
    }
  }]);
  return ITF142;
}(_ITF3$1.default);
ITF14$1.default = ITF14;
Object.defineProperty(ITF$2, "__esModule", {
  value: true
});
ITF$2.ITF14 = ITF$2.ITF = void 0;
var _ITF$1 = ITF$1;
var _ITF2 = _interopRequireDefault$j(_ITF$1);
var _ITF3 = ITF14$1;
var _ITF4 = _interopRequireDefault$j(_ITF3);
function _interopRequireDefault$j(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
ITF$2.ITF = _ITF2.default;
ITF$2.ITF14 = _ITF4.default;
var MSI$2 = {};
var MSI$1 = {};
Object.defineProperty(MSI$1, "__esModule", {
  value: true
});
var _createClass$9 = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _Barcode2$4 = Barcode$1;
var _Barcode3$4 = _interopRequireDefault$i(_Barcode2$4);
function _interopRequireDefault$i(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$e(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$a(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$a(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var MSI = function(_Barcode) {
  _inherits$a(MSI2, _Barcode);
  function MSI2(data, options) {
    _classCallCheck$e(this, MSI2);
    return _possibleConstructorReturn$a(this, (MSI2.__proto__ || Object.getPrototypeOf(MSI2)).call(this, data, options));
  }
  _createClass$9(MSI2, [{
    key: "encode",
    value: function encode3() {
      var ret = "110";
      for (var i = 0; i < this.data.length; i++) {
        var digit = parseInt(this.data[i]);
        var bin = digit.toString(2);
        bin = addZeroes(bin, 4 - bin.length);
        for (var b = 0; b < bin.length; b++) {
          ret += bin[b] == "0" ? "100" : "110";
        }
      }
      ret += "1001";
      return {
        data: ret,
        text: this.text
      };
    }
  }, {
    key: "valid",
    value: function valid2() {
      return this.data.search(/^[0-9]+$/) !== -1;
    }
  }]);
  return MSI2;
}(_Barcode3$4.default);
function addZeroes(number, n2) {
  for (var i = 0; i < n2; i++) {
    number = "0" + number;
  }
  return number;
}
MSI$1.default = MSI;
var MSI10$1 = {};
var checksums = {};
Object.defineProperty(checksums, "__esModule", {
  value: true
});
checksums.mod10 = mod10;
checksums.mod11 = mod11;
function mod10(number) {
  var sum = 0;
  for (var i = 0; i < number.length; i++) {
    var n2 = parseInt(number[i]);
    if ((i + number.length) % 2 === 0) {
      sum += n2;
    } else {
      sum += n2 * 2 % 10 + Math.floor(n2 * 2 / 10);
    }
  }
  return (10 - sum % 10) % 10;
}
function mod11(number) {
  var sum = 0;
  var weights = [2, 3, 4, 5, 6, 7];
  for (var i = 0; i < number.length; i++) {
    var n2 = parseInt(number[number.length - 1 - i]);
    sum += weights[i % weights.length] * n2;
  }
  return (11 - sum % 11) % 11;
}
Object.defineProperty(MSI10$1, "__esModule", {
  value: true
});
var _MSI2$4 = MSI$1;
var _MSI3$4 = _interopRequireDefault$h(_MSI2$4);
var _checksums$3 = checksums;
function _interopRequireDefault$h(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$d(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$9(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$9(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var MSI10 = function(_MSI11) {
  _inherits$9(MSI102, _MSI11);
  function MSI102(data, options) {
    _classCallCheck$d(this, MSI102);
    return _possibleConstructorReturn$9(this, (MSI102.__proto__ || Object.getPrototypeOf(MSI102)).call(this, data + (0, _checksums$3.mod10)(data), options));
  }
  return MSI102;
}(_MSI3$4.default);
MSI10$1.default = MSI10;
var MSI11$1 = {};
Object.defineProperty(MSI11$1, "__esModule", {
  value: true
});
var _MSI2$3 = MSI$1;
var _MSI3$3 = _interopRequireDefault$g(_MSI2$3);
var _checksums$2 = checksums;
function _interopRequireDefault$g(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$c(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$8(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$8(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var MSI11 = function(_MSI11) {
  _inherits$8(MSI112, _MSI11);
  function MSI112(data, options) {
    _classCallCheck$c(this, MSI112);
    return _possibleConstructorReturn$8(this, (MSI112.__proto__ || Object.getPrototypeOf(MSI112)).call(this, data + (0, _checksums$2.mod11)(data), options));
  }
  return MSI112;
}(_MSI3$3.default);
MSI11$1.default = MSI11;
var MSI1010$1 = {};
Object.defineProperty(MSI1010$1, "__esModule", {
  value: true
});
var _MSI2$2 = MSI$1;
var _MSI3$2 = _interopRequireDefault$f(_MSI2$2);
var _checksums$1 = checksums;
function _interopRequireDefault$f(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$b(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$7(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$7(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var MSI1010 = function(_MSI11) {
  _inherits$7(MSI10102, _MSI11);
  function MSI10102(data, options) {
    _classCallCheck$b(this, MSI10102);
    data += (0, _checksums$1.mod10)(data);
    data += (0, _checksums$1.mod10)(data);
    return _possibleConstructorReturn$7(this, (MSI10102.__proto__ || Object.getPrototypeOf(MSI10102)).call(this, data, options));
  }
  return MSI10102;
}(_MSI3$2.default);
MSI1010$1.default = MSI1010;
var MSI1110$1 = {};
Object.defineProperty(MSI1110$1, "__esModule", {
  value: true
});
var _MSI2$1 = MSI$1;
var _MSI3$1 = _interopRequireDefault$e(_MSI2$1);
var _checksums = checksums;
function _interopRequireDefault$e(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$a(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$6(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$6(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var MSI1110 = function(_MSI11) {
  _inherits$6(MSI11102, _MSI11);
  function MSI11102(data, options) {
    _classCallCheck$a(this, MSI11102);
    data += (0, _checksums.mod11)(data);
    data += (0, _checksums.mod10)(data);
    return _possibleConstructorReturn$6(this, (MSI11102.__proto__ || Object.getPrototypeOf(MSI11102)).call(this, data, options));
  }
  return MSI11102;
}(_MSI3$1.default);
MSI1110$1.default = MSI1110;
Object.defineProperty(MSI$2, "__esModule", {
  value: true
});
MSI$2.MSI1110 = MSI$2.MSI1010 = MSI$2.MSI11 = MSI$2.MSI10 = MSI$2.MSI = void 0;
var _MSI$1 = MSI$1;
var _MSI2 = _interopRequireDefault$d(_MSI$1);
var _MSI3 = MSI10$1;
var _MSI4 = _interopRequireDefault$d(_MSI3);
var _MSI5 = MSI11$1;
var _MSI6 = _interopRequireDefault$d(_MSI5);
var _MSI7 = MSI1010$1;
var _MSI8 = _interopRequireDefault$d(_MSI7);
var _MSI9 = MSI1110$1;
var _MSI10 = _interopRequireDefault$d(_MSI9);
function _interopRequireDefault$d(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
MSI$2.MSI = _MSI2.default;
MSI$2.MSI10 = _MSI4.default;
MSI$2.MSI11 = _MSI6.default;
MSI$2.MSI1010 = _MSI8.default;
MSI$2.MSI1110 = _MSI10.default;
var pharmacode$1 = {};
Object.defineProperty(pharmacode$1, "__esModule", {
  value: true
});
pharmacode$1.pharmacode = void 0;
var _createClass$8 = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _Barcode2$3 = Barcode$1;
var _Barcode3$3 = _interopRequireDefault$c(_Barcode2$3);
function _interopRequireDefault$c(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$9(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$5(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$5(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var pharmacode = function(_Barcode) {
  _inherits$5(pharmacode2, _Barcode);
  function pharmacode2(data, options) {
    _classCallCheck$9(this, pharmacode2);
    var _this = _possibleConstructorReturn$5(this, (pharmacode2.__proto__ || Object.getPrototypeOf(pharmacode2)).call(this, data, options));
    _this.number = parseInt(data, 10);
    return _this;
  }
  _createClass$8(pharmacode2, [{
    key: "encode",
    value: function encode3() {
      var z2 = this.number;
      var result = "";
      while (!isNaN(z2) && z2 != 0) {
        if (z2 % 2 === 0) {
          result = "11100" + result;
          z2 = (z2 - 2) / 2;
        } else {
          result = "100" + result;
          z2 = (z2 - 1) / 2;
        }
      }
      result = result.slice(0, -2);
      return {
        data: result,
        text: this.text
      };
    }
  }, {
    key: "valid",
    value: function valid2() {
      return this.number >= 3 && this.number <= 131070;
    }
  }]);
  return pharmacode2;
}(_Barcode3$3.default);
pharmacode$1.pharmacode = pharmacode;
var codabar$1 = {};
Object.defineProperty(codabar$1, "__esModule", {
  value: true
});
codabar$1.codabar = void 0;
var _createClass$7 = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _Barcode2$2 = Barcode$1;
var _Barcode3$2 = _interopRequireDefault$b(_Barcode2$2);
function _interopRequireDefault$b(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$8(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$4(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$4(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var codabar = function(_Barcode) {
  _inherits$4(codabar2, _Barcode);
  function codabar2(data, options) {
    _classCallCheck$8(this, codabar2);
    if (data.search(/^[0-9\-\$\:\.\+\/]+$/) === 0) {
      data = "A" + data + "A";
    }
    var _this = _possibleConstructorReturn$4(this, (codabar2.__proto__ || Object.getPrototypeOf(codabar2)).call(this, data.toUpperCase(), options));
    _this.text = _this.options.text || _this.text.replace(/[A-D]/g, "");
    return _this;
  }
  _createClass$7(codabar2, [{
    key: "valid",
    value: function valid2() {
      return this.data.search(/^[A-D][0-9\-\$\:\.\+\/]+[A-D]$/) !== -1;
    }
  }, {
    key: "encode",
    value: function encode3() {
      var result = [];
      var encodings2 = this.getEncodings();
      for (var i = 0; i < this.data.length; i++) {
        result.push(encodings2[this.data.charAt(i)]);
        if (i !== this.data.length - 1) {
          result.push("0");
        }
      }
      return {
        text: this.text,
        data: result.join("")
      };
    }
  }, {
    key: "getEncodings",
    value: function getEncodings() {
      return {
        "0": "101010011",
        "1": "101011001",
        "2": "101001011",
        "3": "110010101",
        "4": "101101001",
        "5": "110101001",
        "6": "100101011",
        "7": "100101101",
        "8": "100110101",
        "9": "110100101",
        "-": "101001101",
        "$": "101100101",
        ":": "1101011011",
        "/": "1101101011",
        ".": "1101101101",
        "+": "1011011011",
        "A": "1011001001",
        "B": "1001001011",
        "C": "1010010011",
        "D": "1010011001"
      };
    }
  }]);
  return codabar2;
}(_Barcode3$2.default);
codabar$1.codabar = codabar;
var CODE93$2 = {};
var CODE93$1 = {};
var constants = {};
Object.defineProperty(constants, "__esModule", {
  value: true
});
constants.SYMBOLS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "-",
  ".",
  " ",
  "$",
  "/",
  "+",
  "%",
  // Only used for csum and multi-symbols character encodings
  "($)",
  "(%)",
  "(/)",
  "(+)",
  // Start/Stop
  "ÿ"
];
constants.BINARIES = ["100010100", "101001000", "101000100", "101000010", "100101000", "100100100", "100100010", "101010000", "100010010", "100001010", "110101000", "110100100", "110100010", "110010100", "110010010", "110001010", "101101000", "101100100", "101100010", "100110100", "100011010", "101011000", "101001100", "101000110", "100101100", "100010110", "110110100", "110110010", "110101100", "110100110", "110010110", "110011010", "101101100", "101100110", "100110110", "100111010", "100101110", "111010100", "111010010", "111001010", "101101110", "101110110", "110101110", "100100110", "111011010", "111010110", "100110010", "101011110"];
constants.MULTI_SYMBOLS = {
  "\0": ["(%)", "U"],
  "": ["($)", "A"],
  "": ["($)", "B"],
  "": ["($)", "C"],
  "": ["($)", "D"],
  "": ["($)", "E"],
  "": ["($)", "F"],
  "\x07": ["($)", "G"],
  "\b": ["($)", "H"],
  "	": ["($)", "I"],
  "\n": ["($)", "J"],
  "\v": ["($)", "K"],
  "\f": ["($)", "L"],
  "\r": ["($)", "M"],
  "": ["($)", "N"],
  "": ["($)", "O"],
  "": ["($)", "P"],
  "": ["($)", "Q"],
  "": ["($)", "R"],
  "": ["($)", "S"],
  "": ["($)", "T"],
  "": ["($)", "U"],
  "": ["($)", "V"],
  "": ["($)", "W"],
  "": ["($)", "X"],
  "": ["($)", "Y"],
  "": ["($)", "Z"],
  "\x1B": ["(%)", "A"],
  "": ["(%)", "B"],
  "": ["(%)", "C"],
  "": ["(%)", "D"],
  "": ["(%)", "E"],
  "!": ["(/)", "A"],
  '"': ["(/)", "B"],
  "#": ["(/)", "C"],
  "&": ["(/)", "F"],
  "'": ["(/)", "G"],
  "(": ["(/)", "H"],
  ")": ["(/)", "I"],
  "*": ["(/)", "J"],
  ",": ["(/)", "L"],
  ":": ["(/)", "Z"],
  ";": ["(%)", "F"],
  "<": ["(%)", "G"],
  "=": ["(%)", "H"],
  ">": ["(%)", "I"],
  "?": ["(%)", "J"],
  "@": ["(%)", "V"],
  "[": ["(%)", "K"],
  "\\": ["(%)", "L"],
  "]": ["(%)", "M"],
  "^": ["(%)", "N"],
  "_": ["(%)", "O"],
  "`": ["(%)", "W"],
  "a": ["(+)", "A"],
  "b": ["(+)", "B"],
  "c": ["(+)", "C"],
  "d": ["(+)", "D"],
  "e": ["(+)", "E"],
  "f": ["(+)", "F"],
  "g": ["(+)", "G"],
  "h": ["(+)", "H"],
  "i": ["(+)", "I"],
  "j": ["(+)", "J"],
  "k": ["(+)", "K"],
  "l": ["(+)", "L"],
  "m": ["(+)", "M"],
  "n": ["(+)", "N"],
  "o": ["(+)", "O"],
  "p": ["(+)", "P"],
  "q": ["(+)", "Q"],
  "r": ["(+)", "R"],
  "s": ["(+)", "S"],
  "t": ["(+)", "T"],
  "u": ["(+)", "U"],
  "v": ["(+)", "V"],
  "w": ["(+)", "W"],
  "x": ["(+)", "X"],
  "y": ["(+)", "Y"],
  "z": ["(+)", "Z"],
  "{": ["(%)", "P"],
  "|": ["(%)", "Q"],
  "}": ["(%)", "R"],
  "~": ["(%)", "S"],
  "": ["(%)", "T"]
};
Object.defineProperty(CODE93$1, "__esModule", {
  value: true
});
var _createClass$6 = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _constants = constants;
var _Barcode2$1 = Barcode$1;
var _Barcode3$1 = _interopRequireDefault$a(_Barcode2$1);
function _interopRequireDefault$a(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$7(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$3(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$3(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var CODE93 = function(_Barcode) {
  _inherits$3(CODE932, _Barcode);
  function CODE932(data, options) {
    _classCallCheck$7(this, CODE932);
    return _possibleConstructorReturn$3(this, (CODE932.__proto__ || Object.getPrototypeOf(CODE932)).call(this, data, options));
  }
  _createClass$6(CODE932, [{
    key: "valid",
    value: function valid2() {
      return /^[0-9A-Z\-. $/+%]+$/.test(this.data);
    }
  }, {
    key: "encode",
    value: function encode3() {
      var symbols = this.data.split("").flatMap(function(c) {
        return _constants.MULTI_SYMBOLS[c] || c;
      });
      var encoded = symbols.map(function(s) {
        return CODE932.getEncoding(s);
      }).join("");
      var csumC = CODE932.checksum(symbols, 20);
      var csumK = CODE932.checksum(symbols.concat(csumC), 15);
      return {
        text: this.text,
        data: (
          // Add the start bits
          CODE932.getEncoding("ÿ") + // Add the encoded bits
          encoded + // Add the checksum
          CODE932.getEncoding(csumC) + CODE932.getEncoding(csumK) + // Add the stop bits
          CODE932.getEncoding("ÿ") + // Add the termination bit
          "1"
        )
      };
    }
    // Get the binary encoding of a symbol
  }], [{
    key: "getEncoding",
    value: function getEncoding2(symbol) {
      return _constants.BINARIES[CODE932.symbolValue(symbol)];
    }
    // Get the symbol for a symbol value
  }, {
    key: "getSymbol",
    value: function getSymbol(symbolValue) {
      return _constants.SYMBOLS[symbolValue];
    }
    // Get the symbol value of a symbol
  }, {
    key: "symbolValue",
    value: function symbolValue(symbol) {
      return _constants.SYMBOLS.indexOf(symbol);
    }
    // Calculate a checksum symbol
  }, {
    key: "checksum",
    value: function checksum6(symbols, maxWeight) {
      var csum = symbols.slice().reverse().reduce(function(sum, symbol, idx) {
        var weight = idx % maxWeight + 1;
        return sum + CODE932.symbolValue(symbol) * weight;
      }, 0);
      return CODE932.getSymbol(csum % 47);
    }
  }]);
  return CODE932;
}(_Barcode3$1.default);
CODE93$1.default = CODE93;
var CODE93FullASCII$1 = {};
Object.defineProperty(CODE93FullASCII$1, "__esModule", {
  value: true
});
var _createClass$5 = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _CODE2$2 = CODE93$1;
var _CODE3$1 = _interopRequireDefault$9(_CODE2$2);
function _interopRequireDefault$9(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$6(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$2(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$2(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var CODE93FullASCII = function(_CODE4) {
  _inherits$2(CODE93FullASCII2, _CODE4);
  function CODE93FullASCII2(data, options) {
    _classCallCheck$6(this, CODE93FullASCII2);
    return _possibleConstructorReturn$2(this, (CODE93FullASCII2.__proto__ || Object.getPrototypeOf(CODE93FullASCII2)).call(this, data, options));
  }
  _createClass$5(CODE93FullASCII2, [{
    key: "valid",
    value: function valid2() {
      return /^[\x00-\x7f]+$/.test(this.data);
    }
  }]);
  return CODE93FullASCII2;
}(_CODE3$1.default);
CODE93FullASCII$1.default = CODE93FullASCII;
Object.defineProperty(CODE93$2, "__esModule", {
  value: true
});
CODE93$2.CODE93FullASCII = CODE93$2.CODE93 = void 0;
var _CODE$1 = CODE93$1;
var _CODE2$1 = _interopRequireDefault$8(_CODE$1);
var _CODE93FullASCII = CODE93FullASCII$1;
var _CODE93FullASCII2 = _interopRequireDefault$8(_CODE93FullASCII);
function _interopRequireDefault$8(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
CODE93$2.CODE93 = _CODE2$1.default;
CODE93$2.CODE93FullASCII = _CODE93FullASCII2.default;
var GenericBarcode$1 = {};
Object.defineProperty(GenericBarcode$1, "__esModule", {
  value: true
});
GenericBarcode$1.GenericBarcode = void 0;
var _createClass$4 = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _Barcode2 = Barcode$1;
var _Barcode3 = _interopRequireDefault$7(_Barcode2);
function _interopRequireDefault$7(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$5(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$1(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits$1(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var GenericBarcode = function(_Barcode) {
  _inherits$1(GenericBarcode2, _Barcode);
  function GenericBarcode2(data, options) {
    _classCallCheck$5(this, GenericBarcode2);
    return _possibleConstructorReturn$1(this, (GenericBarcode2.__proto__ || Object.getPrototypeOf(GenericBarcode2)).call(this, data, options));
  }
  _createClass$4(GenericBarcode2, [{
    key: "encode",
    value: function encode3() {
      return {
        data: "10101010101010101010101010101010101010101",
        text: this.text
      };
    }
    // Resturn true/false if the string provided is valid for this encoder
  }, {
    key: "valid",
    value: function valid2() {
      return true;
    }
  }]);
  return GenericBarcode2;
}(_Barcode3.default);
GenericBarcode$1.GenericBarcode = GenericBarcode;
Object.defineProperty(barcodes, "__esModule", {
  value: true
});
var _CODE = CODE39$1;
var _CODE2 = CODE128$2;
var _EAN_UPC = EAN_UPC;
var _ITF = ITF$2;
var _MSI = MSI$2;
var _pharmacode = pharmacode$1;
var _codabar = codabar$1;
var _CODE3 = CODE93$2;
var _GenericBarcode = GenericBarcode$1;
barcodes.default = {
  CODE39: _CODE.CODE39,
  CODE128: _CODE2.CODE128,
  CODE128A: _CODE2.CODE128A,
  CODE128B: _CODE2.CODE128B,
  CODE128C: _CODE2.CODE128C,
  EAN13: _EAN_UPC.EAN13,
  EAN8: _EAN_UPC.EAN8,
  EAN5: _EAN_UPC.EAN5,
  EAN2: _EAN_UPC.EAN2,
  UPC: _EAN_UPC.UPC,
  UPCE: _EAN_UPC.UPCE,
  ITF14: _ITF.ITF14,
  ITF: _ITF.ITF,
  MSI: _MSI.MSI,
  MSI10: _MSI.MSI10,
  MSI11: _MSI.MSI11,
  MSI1010: _MSI.MSI1010,
  MSI1110: _MSI.MSI1110,
  pharmacode: _pharmacode.pharmacode,
  codabar: _codabar.codabar,
  CODE93: _CODE3.CODE93,
  CODE93FullASCII: _CODE3.CODE93FullASCII,
  GenericBarcode: _GenericBarcode.GenericBarcode
};
var merge = {};
Object.defineProperty(merge, "__esModule", {
  value: true
});
var _extends = Object.assign || function(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
merge.default = function(old, replaceObj) {
  return _extends({}, old, replaceObj);
};
var linearizeEncodings$1 = {};
Object.defineProperty(linearizeEncodings$1, "__esModule", {
  value: true
});
linearizeEncodings$1.default = linearizeEncodings;
function linearizeEncodings(encodings2) {
  var linearEncodings = [];
  function nextLevel(encoded) {
    if (Array.isArray(encoded)) {
      for (var i = 0; i < encoded.length; i++) {
        nextLevel(encoded[i]);
      }
    } else {
      encoded.text = encoded.text || "";
      encoded.data = encoded.data || "";
      linearEncodings.push(encoded);
    }
  }
  nextLevel(encodings2);
  return linearEncodings;
}
var fixOptions$1 = {};
Object.defineProperty(fixOptions$1, "__esModule", {
  value: true
});
fixOptions$1.default = fixOptions;
function fixOptions(options) {
  options.marginTop = options.marginTop || options.margin;
  options.marginBottom = options.marginBottom || options.margin;
  options.marginRight = options.marginRight || options.margin;
  options.marginLeft = options.marginLeft || options.margin;
  return options;
}
var getRenderProperties$1 = {};
var getOptionsFromElement$1 = {};
var optionsFromStrings$1 = {};
Object.defineProperty(optionsFromStrings$1, "__esModule", {
  value: true
});
optionsFromStrings$1.default = optionsFromStrings;
function optionsFromStrings(options) {
  var intOptions = ["width", "height", "textMargin", "fontSize", "margin", "marginTop", "marginBottom", "marginLeft", "marginRight"];
  for (var intOption in intOptions) {
    if (intOptions.hasOwnProperty(intOption)) {
      intOption = intOptions[intOption];
      if (typeof options[intOption] === "string") {
        options[intOption] = parseInt(options[intOption], 10);
      }
    }
  }
  if (typeof options["displayValue"] === "string") {
    options["displayValue"] = options["displayValue"] != "false";
  }
  return options;
}
var defaults$1 = {};
Object.defineProperty(defaults$1, "__esModule", {
  value: true
});
var defaults = {
  width: 2,
  height: 100,
  format: "auto",
  displayValue: true,
  fontOptions: "",
  font: "monospace",
  text: void 0,
  textAlign: "center",
  textPosition: "bottom",
  textMargin: 2,
  fontSize: 20,
  background: "#ffffff",
  lineColor: "#000000",
  margin: 10,
  marginTop: void 0,
  marginBottom: void 0,
  marginLeft: void 0,
  marginRight: void 0,
  valid: function valid() {
  }
};
defaults$1.default = defaults;
Object.defineProperty(getOptionsFromElement$1, "__esModule", {
  value: true
});
var _optionsFromStrings$1 = optionsFromStrings$1;
var _optionsFromStrings2$1 = _interopRequireDefault$6(_optionsFromStrings$1);
var _defaults$1 = defaults$1;
var _defaults2$1 = _interopRequireDefault$6(_defaults$1);
function _interopRequireDefault$6(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function getOptionsFromElement(element) {
  var options = {};
  for (var property in _defaults2$1.default) {
    if (_defaults2$1.default.hasOwnProperty(property)) {
      if (element.hasAttribute("jsbarcode-" + property.toLowerCase())) {
        options[property] = element.getAttribute("jsbarcode-" + property.toLowerCase());
      }
      if (element.hasAttribute("data-" + property.toLowerCase())) {
        options[property] = element.getAttribute("data-" + property.toLowerCase());
      }
    }
  }
  options["value"] = element.getAttribute("jsbarcode-value") || element.getAttribute("data-value");
  options = (0, _optionsFromStrings2$1.default)(options);
  return options;
}
getOptionsFromElement$1.default = getOptionsFromElement;
var renderers = {};
var canvas = {};
var shared = {};
Object.defineProperty(shared, "__esModule", {
  value: true
});
shared.getTotalWidthOfEncodings = shared.calculateEncodingAttributes = shared.getBarcodePadding = shared.getEncodingHeight = shared.getMaximumHeightOfEncodings = void 0;
var _merge$3 = merge;
var _merge2$3 = _interopRequireDefault$5(_merge$3);
function _interopRequireDefault$5(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function getEncodingHeight(encoding, options) {
  return options.height + (options.displayValue && encoding.text.length > 0 ? options.fontSize + options.textMargin : 0) + options.marginTop + options.marginBottom;
}
function getBarcodePadding(textWidth, barcodeWidth, options) {
  if (options.displayValue && barcodeWidth < textWidth) {
    if (options.textAlign == "center") {
      return Math.floor((textWidth - barcodeWidth) / 2);
    } else if (options.textAlign == "left") {
      return 0;
    } else if (options.textAlign == "right") {
      return Math.floor(textWidth - barcodeWidth);
    }
  }
  return 0;
}
function calculateEncodingAttributes(encodings2, barcodeOptions, context) {
  for (var i = 0; i < encodings2.length; i++) {
    var encoding = encodings2[i];
    var options = (0, _merge2$3.default)(barcodeOptions, encoding.options);
    var textWidth;
    if (options.displayValue) {
      textWidth = messureText(encoding.text, options, context);
    } else {
      textWidth = 0;
    }
    var barcodeWidth = encoding.data.length * options.width;
    encoding.width = Math.ceil(Math.max(textWidth, barcodeWidth));
    encoding.height = getEncodingHeight(encoding, options);
    encoding.barcodePadding = getBarcodePadding(textWidth, barcodeWidth, options);
  }
}
function getTotalWidthOfEncodings(encodings2) {
  var totalWidth = 0;
  for (var i = 0; i < encodings2.length; i++) {
    totalWidth += encodings2[i].width;
  }
  return totalWidth;
}
function getMaximumHeightOfEncodings(encodings2) {
  var maxHeight = 0;
  for (var i = 0; i < encodings2.length; i++) {
    if (encodings2[i].height > maxHeight) {
      maxHeight = encodings2[i].height;
    }
  }
  return maxHeight;
}
function messureText(string, options, context) {
  var ctx;
  if (context) {
    ctx = context;
  } else if (typeof document !== "undefined") {
    ctx = document.createElement("canvas").getContext("2d");
  } else {
    return 0;
  }
  ctx.font = options.fontOptions + " " + options.fontSize + "px " + options.font;
  var measureTextResult = ctx.measureText(string);
  if (!measureTextResult) {
    return 0;
  }
  var size = measureTextResult.width;
  return size;
}
shared.getMaximumHeightOfEncodings = getMaximumHeightOfEncodings;
shared.getEncodingHeight = getEncodingHeight;
shared.getBarcodePadding = getBarcodePadding;
shared.calculateEncodingAttributes = calculateEncodingAttributes;
shared.getTotalWidthOfEncodings = getTotalWidthOfEncodings;
Object.defineProperty(canvas, "__esModule", {
  value: true
});
var _createClass$3 = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _merge$2 = merge;
var _merge2$2 = _interopRequireDefault$4(_merge$2);
var _shared$1 = shared;
function _interopRequireDefault$4(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$4(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var CanvasRenderer = function() {
  function CanvasRenderer2(canvas2, encodings2, options) {
    _classCallCheck$4(this, CanvasRenderer2);
    this.canvas = canvas2;
    this.encodings = encodings2;
    this.options = options;
  }
  _createClass$3(CanvasRenderer2, [{
    key: "render",
    value: function render2() {
      if (!this.canvas.getContext) {
        throw new Error("The browser does not support canvas.");
      }
      this.prepareCanvas();
      for (var i = 0; i < this.encodings.length; i++) {
        var encodingOptions = (0, _merge2$2.default)(this.options, this.encodings[i].options);
        this.drawCanvasBarcode(encodingOptions, this.encodings[i]);
        this.drawCanvasText(encodingOptions, this.encodings[i]);
        this.moveCanvasDrawing(this.encodings[i]);
      }
      this.restoreCanvas();
    }
  }, {
    key: "prepareCanvas",
    value: function prepareCanvas() {
      var ctx = this.canvas.getContext("2d");
      ctx.save();
      (0, _shared$1.calculateEncodingAttributes)(this.encodings, this.options, ctx);
      var totalWidth = (0, _shared$1.getTotalWidthOfEncodings)(this.encodings);
      var maxHeight = (0, _shared$1.getMaximumHeightOfEncodings)(this.encodings);
      this.canvas.width = totalWidth + this.options.marginLeft + this.options.marginRight;
      this.canvas.height = maxHeight;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.options.background) {
        ctx.fillStyle = this.options.background;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
      ctx.translate(this.options.marginLeft, 0);
    }
  }, {
    key: "drawCanvasBarcode",
    value: function drawCanvasBarcode(options, encoding) {
      var ctx = this.canvas.getContext("2d");
      var binary = encoding.data;
      var yFrom;
      if (options.textPosition == "top") {
        yFrom = options.marginTop + options.fontSize + options.textMargin;
      } else {
        yFrom = options.marginTop;
      }
      ctx.fillStyle = options.lineColor;
      for (var b = 0; b < binary.length; b++) {
        var x2 = b * options.width + encoding.barcodePadding;
        if (binary[b] === "1") {
          ctx.fillRect(x2, yFrom, options.width, options.height);
        } else if (binary[b]) {
          ctx.fillRect(x2, yFrom, options.width, options.height * binary[b]);
        }
      }
    }
  }, {
    key: "drawCanvasText",
    value: function drawCanvasText(options, encoding) {
      var ctx = this.canvas.getContext("2d");
      var font = options.fontOptions + " " + options.fontSize + "px " + options.font;
      if (options.displayValue) {
        var x2, y2;
        if (options.textPosition == "top") {
          y2 = options.marginTop + options.fontSize - options.textMargin;
        } else {
          y2 = options.height + options.textMargin + options.marginTop + options.fontSize;
        }
        ctx.font = font;
        if (options.textAlign == "left" || encoding.barcodePadding > 0) {
          x2 = 0;
          ctx.textAlign = "left";
        } else if (options.textAlign == "right") {
          x2 = encoding.width - 1;
          ctx.textAlign = "right";
        } else {
          x2 = encoding.width / 2;
          ctx.textAlign = "center";
        }
        ctx.fillText(encoding.text, x2, y2);
      }
    }
  }, {
    key: "moveCanvasDrawing",
    value: function moveCanvasDrawing(encoding) {
      var ctx = this.canvas.getContext("2d");
      ctx.translate(encoding.width, 0);
    }
  }, {
    key: "restoreCanvas",
    value: function restoreCanvas() {
      var ctx = this.canvas.getContext("2d");
      ctx.restore();
    }
  }]);
  return CanvasRenderer2;
}();
canvas.default = CanvasRenderer;
var svg = {};
Object.defineProperty(svg, "__esModule", {
  value: true
});
var _createClass$2 = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _merge$1 = merge;
var _merge2$1 = _interopRequireDefault$3(_merge$1);
var _shared = shared;
function _interopRequireDefault$3(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck$3(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var svgns = "http://www.w3.org/2000/svg";
var SVGRenderer = function() {
  function SVGRenderer2(svg2, encodings2, options) {
    _classCallCheck$3(this, SVGRenderer2);
    this.svg = svg2;
    this.encodings = encodings2;
    this.options = options;
    this.document = options.xmlDocument || document;
  }
  _createClass$2(SVGRenderer2, [{
    key: "render",
    value: function render2() {
      var currentX = this.options.marginLeft;
      this.prepareSVG();
      for (var i = 0; i < this.encodings.length; i++) {
        var encoding = this.encodings[i];
        var encodingOptions = (0, _merge2$1.default)(this.options, encoding.options);
        var group = this.createGroup(currentX, encodingOptions.marginTop, this.svg);
        this.setGroupOptions(group, encodingOptions);
        this.drawSvgBarcode(group, encodingOptions, encoding);
        this.drawSVGText(group, encodingOptions, encoding);
        currentX += encoding.width;
      }
    }
  }, {
    key: "prepareSVG",
    value: function prepareSVG() {
      while (this.svg.firstChild) {
        this.svg.removeChild(this.svg.firstChild);
      }
      (0, _shared.calculateEncodingAttributes)(this.encodings, this.options);
      var totalWidth = (0, _shared.getTotalWidthOfEncodings)(this.encodings);
      var maxHeight = (0, _shared.getMaximumHeightOfEncodings)(this.encodings);
      var width = totalWidth + this.options.marginLeft + this.options.marginRight;
      this.setSvgAttributes(width, maxHeight);
      if (this.options.background) {
        this.drawRect(0, 0, width, maxHeight, this.svg).setAttribute("fill", this.options.background);
      }
    }
  }, {
    key: "drawSvgBarcode",
    value: function drawSvgBarcode(parent, options, encoding) {
      var binary = encoding.data;
      var yFrom;
      if (options.textPosition == "top") {
        yFrom = options.fontSize + options.textMargin;
      } else {
        yFrom = 0;
      }
      var barWidth = 0;
      var x2 = 0;
      for (var b = 0; b < binary.length; b++) {
        x2 = b * options.width + encoding.barcodePadding;
        if (binary[b] === "1") {
          barWidth++;
        } else if (barWidth > 0) {
          this.drawRect(x2 - options.width * barWidth, yFrom, options.width * barWidth, options.height, parent);
          barWidth = 0;
        }
      }
      if (barWidth > 0) {
        this.drawRect(x2 - options.width * (barWidth - 1), yFrom, options.width * barWidth, options.height, parent);
      }
    }
  }, {
    key: "drawSVGText",
    value: function drawSVGText(parent, options, encoding) {
      var textElem = this.document.createElementNS(svgns, "text");
      if (options.displayValue) {
        var x2, y2;
        textElem.setAttribute("font-family", options.font);
        textElem.setAttribute("font-size", options.fontSize);
        if (options.fontOptions.includes("bold")) {
          textElem.setAttribute("font-weight", "bold");
        }
        if (options.fontOptions.includes("italic")) {
          textElem.setAttribute("font-style", "italic");
        }
        if (options.textPosition == "top") {
          y2 = options.fontSize - options.textMargin;
        } else {
          y2 = options.height + options.textMargin + options.fontSize;
        }
        if (options.textAlign == "left" || encoding.barcodePadding > 0) {
          x2 = 0;
          textElem.setAttribute("text-anchor", "start");
        } else if (options.textAlign == "right") {
          x2 = encoding.width - 1;
          textElem.setAttribute("text-anchor", "end");
        } else {
          x2 = encoding.width / 2;
          textElem.setAttribute("text-anchor", "middle");
        }
        textElem.setAttribute("x", x2);
        textElem.setAttribute("y", y2);
        textElem.appendChild(this.document.createTextNode(encoding.text));
        parent.appendChild(textElem);
      }
    }
  }, {
    key: "setSvgAttributes",
    value: function setSvgAttributes(width, height) {
      var svg2 = this.svg;
      svg2.setAttribute("width", width + "px");
      svg2.setAttribute("height", height + "px");
      svg2.setAttribute("x", "0px");
      svg2.setAttribute("y", "0px");
      svg2.setAttribute("viewBox", "0 0 " + width + " " + height);
      svg2.setAttribute("xmlns", svgns);
      svg2.setAttribute("version", "1.1");
    }
  }, {
    key: "createGroup",
    value: function createGroup(x2, y2, parent) {
      var group = this.document.createElementNS(svgns, "g");
      group.setAttribute("transform", "translate(" + x2 + ", " + y2 + ")");
      parent.appendChild(group);
      return group;
    }
  }, {
    key: "setGroupOptions",
    value: function setGroupOptions(group, options) {
      group.setAttribute("fill", options.lineColor);
    }
  }, {
    key: "drawRect",
    value: function drawRect(x2, y2, width, height, parent) {
      var rect = this.document.createElementNS(svgns, "rect");
      rect.setAttribute("x", x2);
      rect.setAttribute("y", y2);
      rect.setAttribute("width", width);
      rect.setAttribute("height", height);
      parent.appendChild(rect);
      return rect;
    }
  }]);
  return SVGRenderer2;
}();
svg.default = SVGRenderer;
var object = {};
Object.defineProperty(object, "__esModule", {
  value: true
});
var _createClass$1 = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
function _classCallCheck$2(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var ObjectRenderer = function() {
  function ObjectRenderer2(object2, encodings2, options) {
    _classCallCheck$2(this, ObjectRenderer2);
    this.object = object2;
    this.encodings = encodings2;
    this.options = options;
  }
  _createClass$1(ObjectRenderer2, [{
    key: "render",
    value: function render2() {
      this.object.encodings = this.encodings;
    }
  }]);
  return ObjectRenderer2;
}();
object.default = ObjectRenderer;
Object.defineProperty(renderers, "__esModule", {
  value: true
});
var _canvas = canvas;
var _canvas2 = _interopRequireDefault$2(_canvas);
var _svg = svg;
var _svg2 = _interopRequireDefault$2(_svg);
var _object = object;
var _object2 = _interopRequireDefault$2(_object);
function _interopRequireDefault$2(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
renderers.default = { CanvasRenderer: _canvas2.default, SVGRenderer: _svg2.default, ObjectRenderer: _object2.default };
var exceptions = {};
Object.defineProperty(exceptions, "__esModule", {
  value: true
});
function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var InvalidInputException = function(_Error) {
  _inherits(InvalidInputException2, _Error);
  function InvalidInputException2(symbology, input) {
    _classCallCheck$1(this, InvalidInputException2);
    var _this = _possibleConstructorReturn(this, (InvalidInputException2.__proto__ || Object.getPrototypeOf(InvalidInputException2)).call(this));
    _this.name = "InvalidInputException";
    _this.symbology = symbology;
    _this.input = input;
    _this.message = '"' + _this.input + '" is not a valid input for ' + _this.symbology;
    return _this;
  }
  return InvalidInputException2;
}(Error);
var InvalidElementException = function(_Error2) {
  _inherits(InvalidElementException2, _Error2);
  function InvalidElementException2() {
    _classCallCheck$1(this, InvalidElementException2);
    var _this2 = _possibleConstructorReturn(this, (InvalidElementException2.__proto__ || Object.getPrototypeOf(InvalidElementException2)).call(this));
    _this2.name = "InvalidElementException";
    _this2.message = "Not supported type to render on";
    return _this2;
  }
  return InvalidElementException2;
}(Error);
var NoElementException = function(_Error3) {
  _inherits(NoElementException2, _Error3);
  function NoElementException2() {
    _classCallCheck$1(this, NoElementException2);
    var _this3 = _possibleConstructorReturn(this, (NoElementException2.__proto__ || Object.getPrototypeOf(NoElementException2)).call(this));
    _this3.name = "NoElementException";
    _this3.message = "No element to render on.";
    return _this3;
  }
  return NoElementException2;
}(Error);
exceptions.InvalidInputException = InvalidInputException;
exceptions.InvalidElementException = InvalidElementException;
exceptions.NoElementException = NoElementException;
Object.defineProperty(getRenderProperties$1, "__esModule", {
  value: true
});
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
  return typeof obj;
} : function(obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};
var _getOptionsFromElement = getOptionsFromElement$1;
var _getOptionsFromElement2 = _interopRequireDefault$1(_getOptionsFromElement);
var _renderers = renderers;
var _renderers2 = _interopRequireDefault$1(_renderers);
var _exceptions$1 = exceptions;
function _interopRequireDefault$1(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function getRenderProperties(element) {
  if (typeof element === "string") {
    return querySelectedRenderProperties(element);
  } else if (Array.isArray(element)) {
    var returnArray = [];
    for (var i = 0; i < element.length; i++) {
      returnArray.push(getRenderProperties(element[i]));
    }
    return returnArray;
  } else if (typeof HTMLCanvasElement !== "undefined" && element instanceof HTMLImageElement) {
    return newCanvasRenderProperties(element);
  } else if (element && element.nodeName && element.nodeName.toLowerCase() === "svg" || typeof SVGElement !== "undefined" && element instanceof SVGElement) {
    return {
      element,
      options: (0, _getOptionsFromElement2.default)(element),
      renderer: _renderers2.default.SVGRenderer
    };
  } else if (typeof HTMLCanvasElement !== "undefined" && element instanceof HTMLCanvasElement) {
    return {
      element,
      options: (0, _getOptionsFromElement2.default)(element),
      renderer: _renderers2.default.CanvasRenderer
    };
  } else if (element && element.getContext) {
    return {
      element,
      renderer: _renderers2.default.CanvasRenderer
    };
  } else if (element && (typeof element === "undefined" ? "undefined" : _typeof(element)) === "object" && !element.nodeName) {
    return {
      element,
      renderer: _renderers2.default.ObjectRenderer
    };
  } else {
    throw new _exceptions$1.InvalidElementException();
  }
}
function querySelectedRenderProperties(string) {
  var selector = document.querySelectorAll(string);
  if (selector.length === 0) {
    return void 0;
  } else {
    var returnArray = [];
    for (var i = 0; i < selector.length; i++) {
      returnArray.push(getRenderProperties(selector[i]));
    }
    return returnArray;
  }
}
function newCanvasRenderProperties(imgElement) {
  var canvas2 = document.createElement("canvas");
  return {
    element: canvas2,
    options: (0, _getOptionsFromElement2.default)(imgElement),
    renderer: _renderers2.default.CanvasRenderer,
    afterRender: function afterRender() {
      imgElement.setAttribute("src", canvas2.toDataURL());
    }
  };
}
getRenderProperties$1.default = getRenderProperties;
var ErrorHandler$1 = {};
Object.defineProperty(ErrorHandler$1, "__esModule", {
  value: true
});
var _createClass = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var ErrorHandler = function() {
  function ErrorHandler2(api) {
    _classCallCheck(this, ErrorHandler2);
    this.api = api;
  }
  _createClass(ErrorHandler2, [{
    key: "handleCatch",
    value: function handleCatch(e) {
      if (e.name === "InvalidInputException") {
        if (this.api._options.valid !== this.api._defaults.valid) {
          this.api._options.valid(false);
        } else {
          throw e.message;
        }
      } else {
        throw e;
      }
      this.api.render = function() {
      };
    }
  }, {
    key: "wrapBarcodeCall",
    value: function wrapBarcodeCall(func) {
      try {
        var result = func.apply(void 0, arguments);
        this.api._options.valid(true);
        return result;
      } catch (e) {
        this.handleCatch(e);
        return this.api;
      }
    }
  }]);
  return ErrorHandler2;
}();
ErrorHandler$1.default = ErrorHandler;
var _barcodes = barcodes;
var _barcodes2 = _interopRequireDefault(_barcodes);
var _merge = merge;
var _merge2 = _interopRequireDefault(_merge);
var _linearizeEncodings = linearizeEncodings$1;
var _linearizeEncodings2 = _interopRequireDefault(_linearizeEncodings);
var _fixOptions = fixOptions$1;
var _fixOptions2 = _interopRequireDefault(_fixOptions);
var _getRenderProperties = getRenderProperties$1;
var _getRenderProperties2 = _interopRequireDefault(_getRenderProperties);
var _optionsFromStrings = optionsFromStrings$1;
var _optionsFromStrings2 = _interopRequireDefault(_optionsFromStrings);
var _ErrorHandler = ErrorHandler$1;
var _ErrorHandler2 = _interopRequireDefault(_ErrorHandler);
var _exceptions = exceptions;
var _defaults = defaults$1;
var _defaults2 = _interopRequireDefault(_defaults);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var API = function API2() {
};
var JsBarcode = function JsBarcode2(element, text, options) {
  var api = new API();
  if (typeof element === "undefined") {
    throw Error("No element to render on was provided.");
  }
  api._renderProperties = (0, _getRenderProperties2.default)(element);
  api._encodings = [];
  api._options = _defaults2.default;
  api._errorHandler = new _ErrorHandler2.default(api);
  if (typeof text !== "undefined") {
    options = options || {};
    if (!options.format) {
      options.format = autoSelectBarcode();
    }
    api.options(options)[options.format](text, options).render();
  }
  return api;
};
JsBarcode.getModule = function(name) {
  return _barcodes2.default[name];
};
for (var name in _barcodes2.default) {
  if (_barcodes2.default.hasOwnProperty(name)) {
    registerBarcode(_barcodes2.default, name);
  }
}
function registerBarcode(barcodes2, name) {
  API.prototype[name] = API.prototype[name.toUpperCase()] = API.prototype[name.toLowerCase()] = function(text, options) {
    var api = this;
    return api._errorHandler.wrapBarcodeCall(function() {
      options.text = typeof options.text === "undefined" ? void 0 : "" + options.text;
      var newOptions = (0, _merge2.default)(api._options, options);
      newOptions = (0, _optionsFromStrings2.default)(newOptions);
      var Encoder = barcodes2[name];
      var encoded = encode2(text, Encoder, newOptions);
      api._encodings.push(encoded);
      return api;
    });
  };
}
function encode2(text, Encoder, options) {
  text = "" + text;
  var encoder2 = new Encoder(text, options);
  if (!encoder2.valid()) {
    throw new _exceptions.InvalidInputException(encoder2.constructor.name, text);
  }
  var encoded = encoder2.encode();
  encoded = (0, _linearizeEncodings2.default)(encoded);
  for (var i = 0; i < encoded.length; i++) {
    encoded[i].options = (0, _merge2.default)(options, encoded[i].options);
  }
  return encoded;
}
function autoSelectBarcode() {
  if (_barcodes2.default["CODE128"]) {
    return "CODE128";
  }
  return Object.keys(_barcodes2.default)[0];
}
API.prototype.options = function(options) {
  this._options = (0, _merge2.default)(this._options, options);
  return this;
};
API.prototype.blank = function(size) {
  var zeroes = new Array(size + 1).join("0");
  this._encodings.push({ data: zeroes });
  return this;
};
API.prototype.init = function() {
  if (!this._renderProperties) {
    return;
  }
  if (!Array.isArray(this._renderProperties)) {
    this._renderProperties = [this._renderProperties];
  }
  var renderProperty;
  for (var i in this._renderProperties) {
    renderProperty = this._renderProperties[i];
    var options = (0, _merge2.default)(this._options, renderProperty.options);
    if (options.format == "auto") {
      options.format = autoSelectBarcode();
    }
    this._errorHandler.wrapBarcodeCall(function() {
      var text = options.value;
      var Encoder = _barcodes2.default[options.format.toUpperCase()];
      var encoded = encode2(text, Encoder, options);
      render(renderProperty, encoded, options);
    });
  }
};
API.prototype.render = function() {
  if (!this._renderProperties) {
    throw new _exceptions.NoElementException();
  }
  if (Array.isArray(this._renderProperties)) {
    for (var i = 0; i < this._renderProperties.length; i++) {
      render(this._renderProperties[i], this._encodings, this._options);
    }
  } else {
    render(this._renderProperties, this._encodings, this._options);
  }
  return this;
};
API.prototype._defaults = _defaults2.default;
function render(renderProperties, encodings2, options) {
  encodings2 = (0, _linearizeEncodings2.default)(encodings2);
  for (var i = 0; i < encodings2.length; i++) {
    encodings2[i].options = (0, _merge2.default)(options, encodings2[i].options);
    (0, _fixOptions2.default)(encodings2[i].options);
  }
  (0, _fixOptions2.default)(options);
  var Renderer = renderProperties.renderer;
  var renderer = new Renderer(renderProperties.element, encodings2, options);
  renderer.render();
  if (renderProperties.afterRender) {
    renderProperties.afterRender();
  }
}
if (typeof window !== "undefined") {
  window.JsBarcode = JsBarcode;
}
if (typeof jQuery !== "undefined") {
  jQuery.fn.JsBarcode = function(content, options) {
    var elementArray = [];
    jQuery(this).each(function() {
      elementArray.push(this);
    });
    return JsBarcode(elementArray, content, options);
  };
}
var JsBarcode_1 = JsBarcode;
const JsBarcode$1 = /* @__PURE__ */ getDefaultExportFromCjs(JsBarcode_1);
const LABEL_WIDTH = 181;
const LABEL_HEIGHT = 289;
const INFO_LABEL_WIDTH = 289;
const INFO_LABEL_HEIGHT = 181;
const LABEL_ZONES = {
  topImage: { x: 10, y: 169, w: 161, h: 104 },
  contentPanel: { x: 10, y: 10, w: 161, h: 145 },
  name: { x: 20, y: 92, w: 141, h: 42 },
  price: { x: 26, y: 54, w: 129, h: 24 },
  barcode: { x: 30, y: 14, w: 121, h: 30 }
};
const INFO_LABEL_ZONES = {
  topImage: { x: 12, y: 84, w: 132, h: 85 },
  leftName: { x: 16, y: 48, w: 124, h: 26 },
  leftPrice: { x: 26, y: 18, w: 104, h: 18 },
  infoPanel: { x: 150, y: 10, w: 126, h: 161 },
  infoText: { x: 156, y: 36, w: 114, h: 126 },
  barcode: { x: 184, y: 12, w: 58, h: 28 }
};
const VERTICAL_INFO_LABEL_ZONES = {
  topImage: { x: 10, y: 166, w: 161, h: 108 },
  contentPanel: { x: 10, y: 10, w: 161, h: 150 },
  title: { x: 20, y: 95, w: 141, h: 44 },
  cookingTitle: { x: 20, y: 66, w: 141, h: 16 },
  cookingBody: { x: 18, y: 28, w: 145, h: 34 }
};
const LOGO_ONLY_LABEL_ZONES = {
  topImage: { x: 18, y: 86, w: 145, h: 120 }
};
const BUILT_IN_TEMPLATES = [
  {
    id: "avery5821",
    name: "Base Label",
    layout: "front",
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    shellColor: "#f5efdc",
    borderColor: "#efe6c8",
    panelColor: "#ffffff",
    topImageColor: "#ffffff",
    textColor: "#1b2733"
  },
  {
    id: "soft-sage",
    name: "Soft Sage",
    layout: "front",
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    shellColor: "#edf1e7",
    borderColor: "#d9e2d0",
    panelColor: "#ffffff",
    topImageColor: "#ffffff",
    textColor: "#223127"
  },
  {
    id: "info-card",
    name: "Info Label",
    layout: "info",
    width: INFO_LABEL_WIDTH,
    height: INFO_LABEL_HEIGHT,
    shellColor: "#f6f2df",
    borderColor: "#1b2733",
    panelColor: "#f6f2df",
    topImageColor: "#ffffff",
    textColor: "#1b2733",
    infoPanelColor: "#ffffff"
  },
  {
    id: "vertical-instructions",
    name: "Vertical Instructions",
    layout: "vertical-info",
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    shellColor: "#f6f2df",
    borderColor: "#efe6c8",
    panelColor: "#ffffff",
    topImageColor: "#ffffff",
    textColor: "#1b2733"
  },
  {
    id: "logo-only",
    name: "Logo Only",
    layout: "logo-only",
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    shellColor: "#ffffff",
    borderColor: "#ffffff",
    panelColor: "#ffffff",
    topImageColor: "#ffffff",
    textColor: "#1b2733"
  }
];
function getLabelTemplate(templateId) {
  return BUILT_IN_TEMPLATES.find((template) => template.id === templateId) ?? BUILT_IN_TEMPLATES[0];
}
function toPercentX(value, width = LABEL_WIDTH) {
  return `${value / width * 100}%`;
}
function toPercentWidth(value, width = LABEL_WIDTH) {
  return `${value / width * 100}%`;
}
function toPercentHeight(value, height = LABEL_HEIGHT) {
  return `${value / height * 100}%`;
}
function toPercentTop(y2, zoneHeight = 0, canvasHeight = LABEL_HEIGHT) {
  return `${(canvasHeight - y2 - zoneHeight) / canvasHeight * 100}%`;
}
const DEFAULT_TOP_LOGO_SRC = new URL("" + new URL("default-label-logo-DOqzg7y1.png", import.meta.url).href, import.meta.url).href;
function LabelPreview({
  product,
  barcodeOverrideDataUri,
  logoDataUri,
  scale = 1
}) {
  const barcodeRef = reactExports.useRef(null);
  const template = getLabelTemplate(product.templateId);
  reactExports.useEffect(() => {
    if (!barcodeRef.current || !product.barcodeValue || barcodeOverrideDataUri || product.showBarcode === false) return;
    try {
      JsBarcode$1(barcodeRef.current, product.barcodeValue, {
        format: "CODE128",
        width: template.layout === "info" ? 1.2 : 1.6,
        height: template.layout === "info" ? 28 : 34,
        displayValue: true,
        fontSize: template.layout === "info" ? 7 : 8,
        margin: 1,
        background: "transparent",
        lineColor: template.textColor
      });
    } catch {
    }
  }, [barcodeOverrideDataUri, product.barcodeValue, product.showBarcode, template.layout, template.textColor]);
  if (template.layout === "info") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      InfoLabelPreview,
      {
        product,
        template,
        barcodeRef,
        barcodeOverrideDataUri,
        logoDataUri,
        scale
      }
    );
  }
  if (template.layout === "vertical-info") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      VerticalInfoLabelPreview,
      {
        product,
        template,
        logoDataUri,
        scale
      }
    );
  }
  if (template.layout === "logo-only") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      LogoOnlyLabelPreview,
      {
        template,
        logoDataUri,
        scale
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FrontLabelPreview,
    {
      product,
      template,
      barcodeRef,
      barcodeOverrideDataUri,
      logoDataUri,
      scale
    }
  );
}
function FrontLabelPreview({
  product,
  template,
  barcodeRef,
  barcodeOverrideDataUri,
  logoDataUri,
  scale
}) {
  const name = product.name || "Product Name";
  const price = product.price || "$13.99";
  const nameFontSize = name.length > 30 ? "4.6cqw" : name.length > 18 ? "5.4cqw" : "6.6cqw";
  const priceFontSize = price.length > 10 ? "6.6cqw" : "8.2cqw";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        position: "relative",
        width: "100%",
        aspectRatio: `${template.width} / ${template.height}`,
        overflow: "hidden",
        borderRadius: 18,
        boxShadow: "0 4px 24px rgba(0,0,0,0.16)",
        background: template.shellColor,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        flexShrink: 0,
        containerType: "inline-size"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, border: `1px solid ${template.borderColor}`, borderRadius: 18, pointerEvents: "none" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TopImage,
          {
            logoDataUri,
            x: LABEL_ZONES.topImage.x,
            y: LABEL_ZONES.topImage.y,
            w: LABEL_ZONES.topImage.w,
            h: LABEL_ZONES.topImage.h,
            canvasWidth: template.width,
            canvasHeight: template.height
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: toPercentTop(LABEL_ZONES.contentPanel.y, LABEL_ZONES.contentPanel.h, template.height),
              left: toPercentX(LABEL_ZONES.contentPanel.x, template.width),
              width: toPercentWidth(LABEL_ZONES.contentPanel.w, template.width),
              height: toPercentHeight(LABEL_ZONES.contentPanel.h, template.height),
              background: template.panelColor,
              borderRadius: 12
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: toPercentTop(LABEL_ZONES.name.y, LABEL_ZONES.name.h, template.height),
              left: toPercentX(LABEL_ZONES.name.x, template.width),
              width: toPercentWidth(LABEL_ZONES.name.w, template.width),
              height: toPercentHeight(LABEL_ZONES.name.h, template.height),
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "0 2%",
              pointerEvents: "none"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  fontSize: nameFontSize,
                  fontFamily: '"Lora", Georgia, serif',
                  fontWeight: 700,
                  color: template.textColor,
                  textAlign: "center",
                  lineHeight: 1.05,
                  wordBreak: "break-word",
                  hyphens: "auto"
                },
                children: name
              }
            )
          }
        ),
        product.showPrice !== false && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: toPercentTop(LABEL_ZONES.price.y, LABEL_ZONES.price.h, template.height),
              left: toPercentX(LABEL_ZONES.price.x, template.width),
              width: toPercentWidth(LABEL_ZONES.price.w, template.width),
              height: toPercentHeight(LABEL_ZONES.price.h, template.height),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  fontSize: priceFontSize,
                  fontFamily: '"Genty Demo", Georgia, serif',
                  fontWeight: 400,
                  color: template.textColor,
                  textAlign: "center",
                  lineHeight: 1
                },
                children: price
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          BarcodeBlock,
          {
            visible: product.showBarcode !== false,
            barcodeRef,
            barcodeOverrideDataUri,
            x: LABEL_ZONES.barcode.x,
            y: LABEL_ZONES.barcode.y,
            w: LABEL_ZONES.barcode.w,
            h: LABEL_ZONES.barcode.h,
            canvasWidth: template.width,
            canvasHeight: template.height
          }
        )
      ]
    }
  );
}
function InfoLabelPreview({
  product,
  template,
  barcodeRef,
  barcodeOverrideDataUri,
  logoDataUri,
  scale
}) {
  const name = product.name || "Product Name";
  const price = product.price || "$8.99";
  const infoCopySize = "clamp(6px, 2.9cqw, 10.67px)";
  const infoHeadingSize = "clamp(6px, 3.2cqw, 12px)";
  const infoNameSize = "clamp(6px, 4.2cqw, 12px)";
  const infoPriceSize = "clamp(6px, 4.2cqw, 12px)";
  const infoBodyFontFamily = '"Avenir Next Condensed Asset", "Avenir Next Condensed", "Avenir Next", "Arial Narrow", Arial, sans-serif';
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        position: "relative",
        width: "100%",
        aspectRatio: `${template.width} / ${template.height}`,
        overflow: "hidden",
        borderRadius: 18,
        boxShadow: "0 4px 24px rgba(0,0,0,0.16)",
        background: template.shellColor,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        flexShrink: 0,
        containerType: "inline-size"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, border: `2px solid ${template.borderColor}`, borderRadius: 18, pointerEvents: "none" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TopImage,
          {
            logoDataUri,
            x: INFO_LABEL_ZONES.topImage.x,
            y: INFO_LABEL_ZONES.topImage.y,
            w: INFO_LABEL_ZONES.topImage.w,
            h: INFO_LABEL_ZONES.topImage.h,
            canvasWidth: template.width,
            canvasHeight: template.height
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: toPercentTop(INFO_LABEL_ZONES.infoPanel.y, INFO_LABEL_ZONES.infoPanel.h, template.height),
              left: toPercentX(INFO_LABEL_ZONES.infoPanel.x, template.width),
              width: toPercentWidth(INFO_LABEL_ZONES.infoPanel.w, template.width),
              height: toPercentHeight(INFO_LABEL_ZONES.infoPanel.h, template.height),
              background: template.infoPanelColor ?? "#fff",
              borderRadius: 12
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: toPercentTop(INFO_LABEL_ZONES.leftName.y, INFO_LABEL_ZONES.leftName.h, template.height),
              left: toPercentX(INFO_LABEL_ZONES.leftName.x, template.width),
              width: toPercentWidth(INFO_LABEL_ZONES.leftName.w, template.width),
              height: toPercentHeight(INFO_LABEL_ZONES.leftName.h, template.height),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 2%",
              pointerEvents: "none"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  fontSize: infoNameSize,
                  fontFamily: '"Lora", Georgia, serif',
                  fontWeight: 700,
                  color: template.textColor,
                  lineHeight: 1.05
                },
                children: name
              }
            )
          }
        ),
        product.showPrice !== false && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: toPercentTop(INFO_LABEL_ZONES.leftPrice.y, INFO_LABEL_ZONES.leftPrice.h, template.height),
              left: toPercentX(INFO_LABEL_ZONES.leftPrice.x, template.width),
              width: toPercentWidth(INFO_LABEL_ZONES.leftPrice.w, template.width),
              height: toPercentHeight(INFO_LABEL_ZONES.leftPrice.h, template.height),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  fontSize: infoPriceSize,
                  fontFamily: '"Genty Demo", Georgia, serif',
                  fontWeight: 400,
                  color: template.textColor,
                  lineHeight: 1
                },
                children: price
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              position: "absolute",
              top: toPercentTop(INFO_LABEL_ZONES.infoText.y, INFO_LABEL_ZONES.infoText.h, template.height),
              left: toPercentX(INFO_LABEL_ZONES.infoText.x, template.width),
              width: toPercentWidth(INFO_LABEL_ZONES.infoText.w, template.width),
              height: toPercentHeight(INFO_LABEL_ZONES.infoText.h, template.height),
              color: template.textColor,
              fontFamily: '"Helvetica Neue", Arial, sans-serif',
              pointerEvents: "none",
              overflow: "hidden"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                InfoSection,
                {
                  title: "Nutrition Facts:",
                  body: joinInfo(product.servingInfo, product.nutritionInfo),
                  bodySize: infoCopySize,
                  titleSize: infoHeadingSize,
                  bodyFontFamily: infoBodyFontFamily
                }
              ),
              product.showCookingInstructions !== false && /* @__PURE__ */ jsxRuntimeExports.jsx(
                InfoSection,
                {
                  title: "Cooking Instructions",
                  body: product.cookingInstructions || "Add cooking instructions",
                  bodySize: infoCopySize,
                  titleSize: infoHeadingSize,
                  bodyFontFamily: infoBodyFontFamily
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                InfoSection,
                {
                  title: "Ingredients:",
                  body: product.ingredients || "Add ingredients",
                  bodySize: infoCopySize,
                  titleSize: infoHeadingSize,
                  bodyFontFamily: infoBodyFontFamily
                }
              ),
              !!product.allergenStatement && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "1.8cqw 0 0", fontSize: infoCopySize, lineHeight: 1.25, fontStyle: "italic", color: "#3f3f46", fontFamily: infoBodyFontFamily }, children: product.allergenStatement })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          BarcodeBlock,
          {
            visible: product.showBarcode !== false,
            barcodeRef,
            barcodeOverrideDataUri,
            x: INFO_LABEL_ZONES.barcode.x,
            y: INFO_LABEL_ZONES.barcode.y,
            w: INFO_LABEL_ZONES.barcode.w,
            h: INFO_LABEL_ZONES.barcode.h,
            canvasWidth: template.width,
            canvasHeight: template.height
          }
        )
      ]
    }
  );
}
function VerticalInfoLabelPreview({
  product,
  template,
  logoDataUri,
  scale
}) {
  const name = product.name || "Product Title";
  const titleSize = name.length > 26 ? "4.8cqw" : name.length > 16 ? "5.8cqw" : "6.8cqw";
  const showCookingInstructions = product.showCookingInstructions !== false;
  const cookingCopy = product.cookingInstructions || "Add cooking instructions";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        position: "relative",
        width: "100%",
        aspectRatio: `${template.width} / ${template.height}`,
        overflow: "hidden",
        borderRadius: 18,
        boxShadow: "0 4px 24px rgba(0,0,0,0.16)",
        background: template.shellColor,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        flexShrink: 0,
        containerType: "inline-size"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, border: `1px solid ${template.borderColor}`, borderRadius: 18, pointerEvents: "none" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TopImage,
          {
            logoDataUri,
            x: VERTICAL_INFO_LABEL_ZONES.topImage.x,
            y: VERTICAL_INFO_LABEL_ZONES.topImage.y,
            w: VERTICAL_INFO_LABEL_ZONES.topImage.w,
            h: VERTICAL_INFO_LABEL_ZONES.topImage.h,
            canvasWidth: template.width,
            canvasHeight: template.height
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: toPercentTop(VERTICAL_INFO_LABEL_ZONES.contentPanel.y, VERTICAL_INFO_LABEL_ZONES.contentPanel.h, template.height),
              left: toPercentX(VERTICAL_INFO_LABEL_ZONES.contentPanel.x, template.width),
              width: toPercentWidth(VERTICAL_INFO_LABEL_ZONES.contentPanel.w, template.width),
              height: toPercentHeight(VERTICAL_INFO_LABEL_ZONES.contentPanel.h, template.height),
              background: template.panelColor,
              borderRadius: 12
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: toPercentTop(VERTICAL_INFO_LABEL_ZONES.title.y, VERTICAL_INFO_LABEL_ZONES.title.h, template.height),
              left: toPercentX(VERTICAL_INFO_LABEL_ZONES.title.x, template.width),
              width: toPercentWidth(VERTICAL_INFO_LABEL_ZONES.title.w, template.width),
              height: toPercentHeight(VERTICAL_INFO_LABEL_ZONES.title.h, template.height),
              display: "flex",
              alignItems: showCookingInstructions ? "flex-start" : "center",
              justifyContent: "center",
              padding: "0 2%",
              pointerEvents: "none"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  fontSize: titleSize,
                  fontFamily: '"Lora", Georgia, serif',
                  fontWeight: 700,
                  color: template.textColor,
                  textAlign: "center",
                  lineHeight: 1.02,
                  wordBreak: "break-word",
                  hyphens: "auto"
                },
                children: name
              }
            )
          }
        ),
        showCookingInstructions && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                position: "absolute",
                top: toPercentTop(VERTICAL_INFO_LABEL_ZONES.cookingTitle.y, VERTICAL_INFO_LABEL_ZONES.cookingTitle.h, template.height),
                left: toPercentX(VERTICAL_INFO_LABEL_ZONES.cookingTitle.x, template.width),
                width: toPercentWidth(VERTICAL_INFO_LABEL_ZONES.cookingTitle.w, template.width),
                height: toPercentHeight(VERTICAL_INFO_LABEL_ZONES.cookingTitle.h, template.height),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontSize: "3.6cqw",
                    fontFamily: '"Helvetica Neue", Arial, sans-serif',
                    fontWeight: 700,
                    color: template.textColor,
                    textAlign: "center",
                    lineHeight: 1.1
                  },
                  children: "Cooking Instructions"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                position: "absolute",
                top: toPercentTop(VERTICAL_INFO_LABEL_ZONES.cookingBody.y, VERTICAL_INFO_LABEL_ZONES.cookingBody.h, template.height),
                left: toPercentX(VERTICAL_INFO_LABEL_ZONES.cookingBody.x, template.width),
                width: toPercentWidth(VERTICAL_INFO_LABEL_ZONES.cookingBody.w, template.width),
                height: toPercentHeight(VERTICAL_INFO_LABEL_ZONES.cookingBody.h, template.height),
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                pointerEvents: "none",
                overflow: "hidden"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontSize: "2.8cqw",
                    fontFamily: '"Avenir Next Condensed Asset", "Avenir Next Condensed", "Avenir Next", "Arial Narrow", Arial, sans-serif',
                    fontWeight: 400,
                    color: template.textColor,
                    textAlign: "center",
                    lineHeight: 1.16,
                    whiteSpace: "pre-wrap"
                  },
                  children: cookingCopy
                }
              )
            }
          )
        ] })
      ]
    }
  );
}
function LogoOnlyLabelPreview({
  template,
  logoDataUri,
  scale
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        position: "relative",
        width: "100%",
        aspectRatio: `${template.width} / ${template.height}`,
        overflow: "hidden",
        borderRadius: 18,
        boxShadow: "0 4px 24px rgba(0,0,0,0.16)",
        background: template.shellColor,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        flexShrink: 0,
        containerType: "inline-size"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        TopImage,
        {
          logoDataUri,
          x: LOGO_ONLY_LABEL_ZONES.topImage.x,
          y: LOGO_ONLY_LABEL_ZONES.topImage.y,
          w: LOGO_ONLY_LABEL_ZONES.topImage.w,
          h: LOGO_ONLY_LABEL_ZONES.topImage.h,
          canvasWidth: template.width,
          canvasHeight: template.height
        }
      )
    }
  );
}
function TopImage({
  logoDataUri,
  x: x2,
  y: y2,
  w: w2,
  h,
  canvasWidth,
  canvasHeight
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        position: "absolute",
        top: toPercentTop(y2, h, canvasHeight),
        left: toPercentX(x2, canvasWidth),
        width: toPercentWidth(w2, canvasWidth),
        height: toPercentHeight(h, canvasHeight),
        overflow: "hidden",
        background: "transparent"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: logoDataUri || DEFAULT_TOP_LOGO_SRC,
          alt: "Top label image",
          style: { width: "auto", height: "100%", margin: "0 auto", display: "block" },
          draggable: false
        }
      )
    }
  );
}
function BarcodeBlock({
  visible,
  barcodeRef,
  barcodeOverrideDataUri,
  x: x2,
  y: y2,
  w: w2,
  h,
  canvasWidth,
  canvasHeight
}) {
  if (!visible) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        position: "absolute",
        top: toPercentTop(y2, h, canvasHeight),
        left: toPercentX(x2, canvasWidth),
        width: toPercentWidth(w2, canvasWidth),
        height: toPercentHeight(h, canvasHeight),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none"
      },
      children: barcodeOverrideDataUri ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: barcodeOverrideDataUri, alt: "Barcode", style: { width: "100%", height: "100%", objectFit: "contain" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { ref: barcodeRef, style: { width: "100%", height: "100%" } })
    }
  );
}
function InfoSection({
  title,
  body,
  bodySize,
  titleSize = "clamp(6px, 3.2cqw, 12px)",
  bodyFontFamily
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "2cqw" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, fontSize: titleSize, fontWeight: 700, lineHeight: 1.2 }, children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "0.4cqw 0 0", fontSize: bodySize, lineHeight: 1.25, whiteSpace: "pre-wrap", fontFamily: bodyFontFamily }, children: body })
  ] });
}
function joinInfo(servingInfo, nutritionInfo) {
  return [servingInfo, nutritionInfo].filter(Boolean).join(" | ") || "Add serving and nutrition info";
}
function generateBarcodeValue() {
  const num = Math.floor(Math.random() * 9e11) + 1e11;
  return String(num);
}
const EMPTY_PRODUCT = () => ({
  name: "",
  price: "",
  category: "",
  servingInfo: "",
  nutritionInfo: "",
  cookingInstructions: "",
  ingredients: "",
  allergenStatement: "",
  barcodeValue: generateBarcodeValue(),
  barcodeType: "CODE128",
  barcodeImagePath: null,
  logoImagePath: null,
  templateId: "avery5821",
  showPrice: true,
  showBarcode: true,
  showCookingInstructions: true
});
function Editor({ initialProduct, onBack, onOpenSheet }) {
  const isNew = !initialProduct;
  const [product, setProduct] = reactExports.useState(
    initialProduct ?? EMPTY_PRODUCT()
  );
  const [barcodeOverrideDataUri, setBarcodeOverrideDataUri] = reactExports.useState("");
  const [logoDataUri, setLogoDataUri] = reactExports.useState("");
  const [templates, setTemplates] = reactExports.useState([]);
  const [saveStatus, setSaveStatus] = reactExports.useState("idle");
  const [saveError, setSaveError] = reactExports.useState("");
  const [exporting, setExporting] = reactExports.useState(false);
  const [regenConfirm, setRegenConfirm] = reactExports.useState(false);
  reactExports.useEffect(() => {
    window.api.file.listTemplates().then((r2) => {
      if (r2.ok) setTemplates(r2.data);
    });
  }, []);
  reactExports.useEffect(() => {
    if (!product.barcodeImagePath) {
      setBarcodeOverrideDataUri("");
      return;
    }
    window.api.file.readImageAsBase64(product.barcodeImagePath).then((r2) => {
      if (r2.ok && r2.data) setBarcodeOverrideDataUri(r2.data);
    });
  }, [product.barcodeImagePath]);
  reactExports.useEffect(() => {
    if (!product.logoImagePath) {
      setLogoDataUri("");
      return;
    }
    window.api.file.readImageAsBase64(product.logoImagePath).then((r2) => {
      if (r2.ok && r2.data) setLogoDataUri(r2.data);
    });
  }, [product.logoImagePath]);
  const barcodeValidity = reactExports.useMemo(() => {
    const value = (product.barcodeValue ?? "").trim();
    if (!value) return null;
    try {
      const svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      JsBarcode$1(svg2, value, {
        format: "CODE128",
        displayValue: false
      });
      return true;
    } catch {
      return false;
    }
  }, [product.barcodeValue]);
  const activeTemplate = reactExports.useMemo(
    () => getLabelTemplate(product.templateId),
    [product.templateId]
  );
  const usesPrice = activeTemplate.layout === "front" || activeTemplate.layout === "info";
  const usesBarcode = activeTemplate.layout === "front" || activeTemplate.layout === "info";
  const usesCookingInstructions = activeTemplate.layout === "info" || activeTemplate.layout === "vertical-info";
  const requiresName = activeTemplate.layout !== "logo-only";
  const templateNote = activeTemplate.layout === "front" ? "Classic vertical label with name, optional price, and optional barcode." : activeTemplate.layout === "info" ? "Landscape info label with nutrition, ingredients, and optional cooking instructions." : activeTemplate.layout === "vertical-info" ? "Vertical label with a title and cooking instructions below the logo." : "Minimal white label that renders only the logo.";
  function update(field, value) {
    setProduct((prev) => ({ ...prev, [field]: value }));
    if (saveStatus === "saved") setSaveStatus("idle");
  }
  function updateFlag(field, value) {
    setProduct((prev) => ({ ...prev, [field]: value }));
    if (saveStatus === "saved") setSaveStatus("idle");
  }
  async function handleSave() {
    if (requiresName && !product.name?.trim()) {
      setSaveError("Product name is required.");
      setSaveStatus("error");
      return null;
    }
    if (usesPrice && product.showPrice !== false && !product.price?.trim()) {
      setSaveError("Price is required.");
      setSaveStatus("error");
      return null;
    }
    if (usesBarcode && product.showBarcode !== false && !product.barcodeValue?.trim() && !product.barcodeImagePath) {
      setSaveError("Barcode value is required.");
      setSaveStatus("error");
      return null;
    }
    setSaveStatus("saving");
    setSaveError("");
    let result;
    if (isNew || !product.id) {
      result = await window.api.product.create({
        name: product.name,
        price: product.price ?? "",
        showPrice: product.showPrice ?? true,
        category: product.category ?? "",
        servingInfo: product.servingInfo ?? "",
        nutritionInfo: product.nutritionInfo ?? "",
        cookingInstructions: product.cookingInstructions ?? "",
        ingredients: product.ingredients ?? "",
        allergenStatement: product.allergenStatement ?? "",
        barcodeValue: (product.barcodeValue ?? "").trim(),
        showBarcode: product.showBarcode ?? true,
        barcodeType: "CODE128",
        barcodeImagePath: product.barcodeImagePath ?? null,
        logoImagePath: product.logoImagePath ?? null,
        templateId: product.templateId ?? "avery5821",
        showCookingInstructions: product.showCookingInstructions ?? true
      });
    } else {
      result = await window.api.product.update({
        ...product,
        barcodeValue: (product.barcodeValue ?? "").trim()
      });
    }
    if (result.ok) {
      setProduct(result.data);
      setSaveStatus("saved");
      return result.data;
    } else {
      setSaveError(result.error);
      setSaveStatus("error");
      return null;
    }
  }
  async function handleExportPDF() {
    const saved = await handleSave();
    if (!saved) return;
    setExporting(true);
    const result = await window.api.export.singlePDF(saved);
    if (!result.ok) alert(`Export failed: ${result.error}`);
    setExporting(false);
  }
  async function handleExportSVG() {
    const saved = await handleSave();
    if (!saved) return;
    setExporting(true);
    const result = await window.api.export.singleSVG(saved);
    if (!result.ok) alert(`Export failed: ${result.error}`);
    setExporting(false);
  }
  async function handlePrint() {
    const saved = await handleSave();
    if (!saved) return;
    onOpenSheet(saved);
  }
  async function handleUploadBarcode() {
    const pickedResult = await window.api.file.pickBarcodeImage();
    if (!pickedResult.ok || !pickedResult.data) return;
    const sourcePath = pickedResult.data;
    const productId = product.id ?? `tmp-${Date.now()}`;
    const saveResult = await window.api.file.saveBarcodeImage(sourcePath, productId);
    if (!saveResult.ok) {
      alert(`Failed to save barcode image: ${saveResult.error}`);
      return;
    }
    const storedPath = saveResult.data;
    setProduct((prev) => ({ ...prev, barcodeImagePath: storedPath }));
    const b64Result = await window.api.file.readImageAsBase64(storedPath);
    if (b64Result.ok && b64Result.data) setBarcodeOverrideDataUri(b64Result.data);
    setSaveStatus("idle");
  }
  async function handleUploadLogo() {
    const pickedResult = await window.api.file.pickLogoImage();
    if (!pickedResult.ok || !pickedResult.data) return;
    const sourcePath = pickedResult.data;
    const productId = product.id ?? `tmp-${Date.now()}`;
    const saveResult = await window.api.file.saveLogoImage(sourcePath, productId);
    if (!saveResult.ok) {
      alert(`Failed to save top image: ${saveResult.error}`);
      return;
    }
    setProduct((prev) => ({ ...prev, logoImagePath: saveResult.data }));
    setSaveStatus("idle");
  }
  function handleRemoveBarcodeImage() {
    setProduct((prev) => ({ ...prev, barcodeImagePath: null }));
    setBarcodeOverrideDataUri("");
    setSaveStatus("idle");
  }
  function handleRemoveLogo() {
    setProduct((prev) => ({ ...prev, logoImagePath: null }));
    setLogoDataUri("");
    setSaveStatus("idle");
  }
  function handleRegen() {
    if (!regenConfirm) {
      setRegenConfirm(true);
      return;
    }
    const newVal = generateBarcodeValue();
    setProduct((prev) => ({ ...prev, barcodeValue: newVal, barcodeImagePath: null }));
    setBarcodeOverrideDataUri("");
    setRegenConfirm(false);
    setSaveStatus("idle");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "0 20px",
      height: 52,
      background: "white",
      borderBottom: "1px solid #e8eaed",
      flexShrink: 0
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onBack, className: "btn-ghost btn-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 13 }),
        " Products"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#cbd5e1", fontSize: 13 }, children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, fontWeight: 600, color: "#1a2332", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: isNew ? "New Product" : product.name || "Edit Product" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }, children: [
        saveStatus === "saved" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#1f7a1f", fontWeight: 500, marginRight: 4 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13 }),
          " Saved"
        ] }),
        saveStatus === "error" && saveError && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#dc2626", fontWeight: 500, marginRight: 4 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 13 }),
          " ",
          saveError
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSave, disabled: saveStatus === "saving", className: "btn-primary btn-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 12 }),
          " ",
          saveStatus === "saving" ? "Saving…" : "Save"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleExportPDF, disabled: exporting, className: "btn-outline btn-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 12 }),
          " PDF"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleExportSVG, disabled: exporting, className: "btn-outline btn-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileCode2, { size: 12 }),
          " SVG"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handlePrint, className: "btn-green btn-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 12 }),
          " Print Sheet"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flex: 1, overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        flex: 2,
        background: "#f0f2f5",
        borderRight: "1px solid #e8eaed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "28px 24px",
        gap: 14,
        overflowY: "auto"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }, children: "Preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "80%", maxWidth: 480 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          LabelPreview,
          {
            product,
            barcodeOverrideDataUri,
            logoDataUri
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: 11, color: "#94a3b8", textAlign: "center", lineHeight: 1.5, margin: 0 }, children: [
          "Live preview —",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "matches printed output"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto", background: "white", padding: "28px 24px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 20 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "label-text", children: [
            "Product Name ",
            requiresName ? "*" : "(optional)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "input",
              placeholder: "e.g. Fresh Mozzarella",
              value: product.name ?? "",
              onChange: (e) => update("name", e.target.value),
              maxLength: 80,
              autoFocus: isNew
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 16, display: "flex", flexDirection: "column", gap: 12 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", style: { marginBottom: 0 }, children: "Template" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              className: "input",
              value: product.templateId ?? "avery5821",
              onChange: (e) => update("templateId", e.target.value),
              children: templates.map((template) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: template.id, children: template.name }, template.id))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "#94a3b8", margin: 0 }, children: templateNote })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "label-text", children: [
            "Price ",
            usesPrice && product.showPrice !== false ? "*" : "(optional)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "input",
              placeholder: "e.g. $9.99/lb",
              value: product.price ?? "",
              onChange: (e) => update("price", e.target.value),
              maxLength: 30
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "#94a3b8", marginTop: 5 }, children: "Include symbol and unit — e.g. $9.99/lb or $4.50 each" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "input",
              placeholder: "e.g. Grab & Go, Sauces, Cheese…",
              value: product.category ?? "",
              onChange: (e) => update("category", e.target.value),
              maxLength: 60
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 16, display: "flex", flexDirection: "column", gap: 14 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", style: { marginBottom: 0 }, children: "Details Panel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", children: "Serving Info" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                className: "input",
                rows: 2,
                placeholder: "e.g. Serving Size: 1 oz | Calories 25",
                value: product.servingInfo ?? "",
                onChange: (e) => update("servingInfo", e.target.value),
                style: { resize: "vertical", minHeight: 56 }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", children: "Nutrition Info" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                className: "input",
                rows: 3,
                placeholder: "e.g. Total Fat 0g | Total Carbohydrates 3g | Sodium 150mg | Protein 1g",
                value: product.nutritionInfo ?? "",
                onChange: (e) => update("nutritionInfo", e.target.value),
                style: { resize: "vertical", minHeight: 72 }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", children: "Cooking Instructions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                className: "input",
                rows: 2,
                placeholder: "e.g. Fry at 365° for 5 minutes",
                value: product.cookingInstructions ?? "",
                onChange: (e) => update("cookingInstructions", e.target.value),
                style: { resize: "vertical", minHeight: 56 }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", children: "Ingredients" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                className: "input",
                rows: 3,
                placeholder: "e.g. water, chickpea flour, salt",
                value: product.ingredients ?? "",
                onChange: (e) => update("ingredients", e.target.value),
                style: { resize: "vertical", minHeight: 72 }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", children: "Allergen / Handling Note" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                className: "input",
                rows: 3,
                placeholder: "e.g. Manufactured on equipment that also handles eggs, wheat...",
                value: product.allergenStatement ?? "",
                onChange: (e) => update("allergenStatement", e.target.value),
                style: { resize: "vertical", minHeight: 72 }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 16, display: "flex", flexDirection: "column", gap: 12 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", style: { marginBottom: 0 }, children: "Display Options" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#334155", cursor: "pointer" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: product.showPrice !== false,
                onChange: (e) => updateFlag("showPrice", e.target.checked),
                disabled: !usesPrice
              }
            ),
            "Show price on label"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#334155", cursor: "pointer" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: product.showBarcode !== false,
                onChange: (e) => updateFlag("showBarcode", e.target.checked),
                disabled: !usesBarcode
              }
            ),
            "Show barcode on label"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#334155", cursor: "pointer" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: product.showCookingInstructions !== false,
                onChange: (e) => updateFlag("showCookingInstructions", e.target.checked),
                disabled: !usesCookingInstructions
              }
            ),
            "Show cooking instructions"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "#94a3b8", margin: 0 }, children: "Disabled options are ignored by the selected template." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 16, display: "flex", flexDirection: "column", gap: 12 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", style: { marginBottom: 0 }, children: "Top Image" }) }),
          logoDataUri ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: logoDataUri,
                alt: "Uploaded top image",
                style: { width: 88, height: 44, objectFit: "contain", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: 4 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "#64748b", flex: 1 }, children: "Fills the image area at the top of the label." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleRemoveLogo, className: "btn-ghost btn-sm", style: { color: "#f87171" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }),
              " Remove"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleUploadLogo, className: "btn-outline btn-sm", style: { alignSelf: "flex-start" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 12 }),
            " Upload image"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "#94a3b8", margin: 0 }, children: "If you leave this empty, the default Grazia's logo is used. Uploading an image overrides it for this product only." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 16, display: "flex", flexDirection: "column", gap: 12 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", style: { marginBottom: 0 }, children: "Barcode (Code 128)" }),
            regenConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "#d97706" }, children: "Confirm?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleRegen, className: "btn-danger btn-sm", children: "Yes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRegenConfirm(false), className: "btn-ghost btn-sm", children: "Cancel" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleRegen, className: "btn-outline btn-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 11 }),
              " Regenerate"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", children: "Barcode Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "input",
                placeholder: "Type barcode value",
                value: product.barcodeValue ?? "",
                onChange: (e) => update("barcodeValue", e.target.value),
                maxLength: 80,
                style: { fontFamily: "monospace", letterSpacing: "0.04em" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "#94a3b8", marginTop: 5 }, children: "You can type your own barcode or regenerate one automatically." }),
            usesBarcode && product.showBarcode !== false && barcodeValidity === false && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "#dc2626", marginTop: 5 }, children: "This value cannot be rendered as Code 128." }),
            usesBarcode && product.showBarcode !== false && barcodeValidity === true && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "#16a34a", marginTop: 5 }, children: "Valid Code 128 value." })
          ] }),
          barcodeOverrideDataUri ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: barcodeOverrideDataUri,
                alt: "Uploaded barcode",
                style: { height: 36, objectFit: "contain", background: "white", border: "1px solid #e2e8f0", borderRadius: 6, padding: 4 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "#64748b", flex: 1 }, children: "Custom uploaded image (overrides typed/generated barcode)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleRemoveBarcodeImage, className: "btn-ghost btn-sm", style: { color: "#f87171" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }),
              " Remove"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleUploadBarcode, className: "btn-outline btn-sm", style: { alignSelf: "flex-start" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 12 }),
            " Upload image"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          fontSize: 12,
          color: "#78716c",
          background: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: 8,
          padding: "10px 14px"
        }, children: [
          "When printing, set scale to ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "100% / Actual Size" }),
          '. Do not use "Fit to page."'
        ] })
      ] }) })
    ] })
  ] });
}
function SheetBuilder({ initialProducts, onBack }) {
  const [slots, setSlots] = reactExports.useState(Array.from({ length: 8 }, () => ({ product: null })));
  const [allProducts, setAllProducts] = reactExports.useState([]);
  const [templateDataUri, setTemplateDataUri] = reactExports.useState("");
  const [startSlot, setStartSlot] = reactExports.useState(1);
  const [fillProduct, setFillProduct] = reactExports.useState(null);
  const [fillCount, setFillCount] = reactExports.useState(8);
  const [exporting, setExporting] = reactExports.useState(false);
  const [printing, setPrinting] = reactExports.useState(false);
  const [activeSlot, setActiveSlot] = reactExports.useState(null);
  const [mode, setMode] = reactExports.useState("fill");
  reactExports.useEffect(() => {
    window.api.product.list().then((r2) => {
      if (r2.ok) setAllProducts(r2.data);
    });
    window.api.file.getTemplatePNG().then((r2) => {
      if (r2.ok && r2.data) setTemplateDataUri(r2.data);
    });
  }, []);
  reactExports.useEffect(() => {
    if (initialProducts.length === 1) {
      setFillProduct(initialProducts[0]);
      setMode("fill");
    } else if (initialProducts.length > 1) {
      const newSlots = Array.from({ length: 8 }, () => ({ product: null }));
      initialProducts.slice(0, 8).forEach((p2, i) => {
        newSlots[i].product = p2;
      });
      setSlots(newSlots);
      setMode("manual");
    }
  }, [initialProducts]);
  function resolveSlots() {
    if (mode === "fill" && fillProduct) {
      const result = [];
      for (let s = startSlot; s <= 8 && result.length < fillCount; s++) result.push(fillProduct);
      return result;
    }
    return slots.map((s) => s.product).filter(Boolean);
  }
  function setSlotProduct(slotIndex, product) {
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = { product };
      return next;
    });
  }
  async function handleExport() {
    const toExport = resolveSlots();
    if (toExport.length === 0) {
      alert("No products assigned to slots.");
      return;
    }
    setExporting(true);
    const result = await window.api.export.sheetPDF(toExport, startSlot);
    if (!result.ok) alert(`Export failed: ${result.error}`);
    setExporting(false);
  }
  async function handlePrintDirect() {
    const toPrint = resolveSlots();
    if (toPrint.length === 0) {
      alert("No products assigned to slots.");
      return;
    }
    setPrinting(true);
    const result = await window.api.print.sheet(toPrint, startSlot);
    if (!result.ok) {
      alert(`Print failed: ${result.error}`);
    }
    setPrinting(false);
  }
  function buildDisplaySlots() {
    if (mode === "fill" && fillProduct) {
      return Array.from({ length: 8 }, (_, i) => {
        const slot = i + 1;
        if (slot < startSlot) return null;
        if (slot - startSlot < fillCount) return fillProduct;
        return null;
      });
    }
    return slots.map((s) => s.product);
  }
  const displaySlots = buildDisplaySlots();
  const filled = displaySlots.filter(Boolean).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "0 20px",
      height: 52,
      background: "white",
      borderBottom: "1px solid #e8eaed",
      flexShrink: 0
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onBack, className: "btn-ghost btn-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 13 }),
        " Products"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#cbd5e1", fontSize: 13 }, children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, fontWeight: 600, color: "#1a2332" }, children: "Print Sheet Builder" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, background: "#f1f5f9", color: "#64748b", borderRadius: 20, padding: "2px 10px", marginLeft: 4 }, children: "Avery 5821 — 8 labels per sheet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginLeft: "auto", display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handlePrintDirect, disabled: printing, className: "btn-green btn-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 13 }),
          " ",
          printing ? "Opening…" : "Print"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleExport, disabled: exporting, className: "btn-primary btn-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 13 }),
          " ",
          exporting ? "Exporting…" : "Export PDF"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flex: 1, overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto", padding: "24px 28px", background: "white" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxWidth: 520, display: "flex", flexDirection: "column", gap: 20 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", children: "Layout mode" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setMode("fill"),
                className: mode === "fill" ? "btn-primary btn-sm" : "btn-outline btn-sm",
                style: { flex: 1 },
                children: "Fill all with one product"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setMode("manual"),
                className: mode === "manual" ? "btn-primary btn-sm" : "btn-outline btn-sm",
                style: { flex: 1 },
                children: "Assign slots manually"
              }
            )
          ] })
        ] }),
        mode === "fill" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 16, display: "flex", flexDirection: "column", gap: 14 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", children: "Product" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "input",
                value: fillProduct?.id ?? "",
                onChange: (e) => setFillProduct(allProducts.find((p2) => p2.id === e.target.value) ?? null),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select a product —" }),
                  allProducts.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: p2.id, children: [
                    p2.name,
                    " — ",
                    p2.price
                  ] }, p2.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", children: "Quantity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  className: "input",
                  min: 1,
                  max: 8 - startSlot + 1,
                  value: fillCount,
                  onChange: (e) => setFillCount(Math.min(8, Math.max(1, Number(e.target.value))))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", children: "Start at slot" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  className: "input",
                  value: startSlot,
                  onChange: (e) => {
                    const s = Number(e.target.value);
                    setStartSlot(s);
                    setFillCount(Math.min(fillCount, 8 - s + 1));
                  },
                  children: Array.from({ length: 8 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: i + 1, children: [
                    "Slot ",
                    i + 1,
                    i === 0 ? " (top-left)" : ""
                  ] }, i + 1))
                }
              )
            ] })
          ] })
        ] }),
        mode === "manual" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 16 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", style: { marginBottom: 10 }, children: "Slot assignments" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }, children: slots.map((slot, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "#94a3b8", width: 40, textAlign: "right", flexShrink: 0 }, children: [
              "#",
              i + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "input",
                style: { fontSize: 12, padding: "6px 10px" },
                value: slot.product?.id ?? "",
                onChange: (e) => setSlotProduct(i, allProducts.find((p2) => p2.id === e.target.value) ?? null),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— empty —" }),
                  allProducts.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p2.id, children: p2.name }, p2.id))
                ]
              }
            )
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#78716c" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 13, style: { flexShrink: 0, marginTop: 1, color: "#f59e0b" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Print at 100% / Actual Size." }),
            ' Do not enable "Fit to Page." The PDF is sized for Avery 5821 (US Letter, 8 labels).'
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        width: 260,
        flexShrink: 0,
        background: "#f0f2f5",
        borderLeft: "1px solid #e8eaed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 20px",
        gap: 12,
        overflowY: "auto"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }, children: "Sheet Preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", background: "white", border: "1px solid #e2e8f0", borderRadius: 8, padding: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "repeat(4, 1fr)", gap: 2, background: "#d1d5db", aspectRatio: "8.5 / 11" }, children: displaySlots.map((product, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          SheetSlotPreview,
          {
            index: i,
            product,
            templateDataUri,
            isActive: activeSlot === i,
            onClick: () => setActiveSlot(activeSlot === i ? null : i)
          },
          i
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: 12, color: "#94a3b8", margin: 0 }, children: [
          filled,
          " / 8 slots filled"
        ] })
      ] })
    ] })
  ] });
}
function SheetSlotPreview({
  index,
  product,
  templateDataUri,
  isActive,
  onClick
}) {
  const SLOT_ASPECT = 4 / 2.5;
  const template = product ? getLabelTemplate(product.templateId) : null;
  const isInfoLayout = template?.layout === "info";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      onClick,
      style: {
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
        background: product ? "white" : "#f8fafc",
        outline: isActive ? "2px solid #2d8f2d" : "none",
        outlineOffset: -2,
        aspectRatio: "4 / 2.5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      },
      title: product ? product.name : `Slot ${index + 1} — empty`,
      children: product ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                width: isInfoLayout ? "100%" : "auto",
                height: isInfoLayout ? "auto" : `${SLOT_ASPECT * 100}%`,
                aspectRatio: isInfoLayout ? `${template?.width ?? 289} / ${template?.height ?? 181}` : "181 / 289",
                transform: isInfoLayout ? "none" : "rotate(-90deg)",
                transformOrigin: "center",
                flexShrink: 0
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LabelPreview, { product, templateDataUri, scale: 1 })
            }
          )
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, color: "#cbd5e1", fontWeight: 500 }, children: index + 1 })
    }
  );
}
function Settings() {
  const [settings, setSettings] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [saved, setSaved] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  reactExports.useEffect(() => {
    window.api.settings.get().then((r2) => {
      if (r2.ok) setSettings(r2.data);
      else setError(r2.error);
    });
  }, []);
  function update(key, value) {
    setSettings((prev) => prev ? { ...prev, [key]: value } : null);
    setSaved(false);
  }
  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setError("");
    const entries = Object.entries(settings);
    for (const [key, value] of entries) {
      const result = await window.api.settings.set(key, String(value));
      if (!result.ok) {
        setError(result.error);
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2e3);
  }
  async function pickFolder() {
    const result = await window.api.file.pickExportFolder();
    if (result.ok && result.data) update("exportFolder", result.data);
  }
  if (!settings) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "screen", style: { display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13 }, children: error || "Loading settings…" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxWidth: 560 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: 22, fontWeight: 700, color: "#1a2332", margin: "0 0 24px" }, children: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: "20px 20px 24px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: 13, fontWeight: 600, color: "#1a2332", margin: "0 0 16px" }, children: "Label Formatting" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", children: "Price prefix (currency symbol)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "input",
                style: { maxWidth: 100 },
                value: settings.pricePrefix,
                onChange: (e) => update("pricePrefix", e.target.value),
                maxLength: 5,
                placeholder: "$"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "#94a3b8", marginTop: 5 }, children: 'Shown before the price — e.g. "$" for USD, "€" for EUR' })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", children: "Currency" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: 13, fontWeight: 600, color: "#1a2332", margin: "0 0 16px" }, children: "Barcode" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", children: "Default format" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: 13, fontWeight: 600, color: "#1a2332", margin: "0 0 16px" }, children: "Export" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", children: "Default export folder" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: settings.exportFolder, onChange: (e) => update("exportFolder", e.target.value), readOnly: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: pickFolder, className: "btn-outline", style: { flexShrink: 0 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 13 }),
              " Browse"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: "20px 20px 24px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: 13, fontWeight: 600, color: "#1a2332", margin: "0 0 16px" }, children: "Label Template" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, fontSize: 13, color: "#475569" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileCheck, { size: 15, style: { marginTop: 1, color: "#16a34a", flexShrink: 0 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontWeight: 500, margin: 0 }, children: "label-template.eps — Grazia's Italian Market" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "#94a3b8", marginTop: 2 }, children: '2.514" × 4.014" (181 × 289 pt) · Adobe Illustrator EPS · Stored in app data folder' })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, fontSize: 13, color: "#475569" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 15, style: { marginTop: 1, color: "#3b82f6", flexShrink: 0 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontWeight: 500, margin: 0 }, children: "Avery 5821 Layout and Alternatives" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "#94a3b8", marginTop: 2 }, children: '8 labels per US Letter sheet (8.5" × 11"). 2 columns × 4 rows. Labels printed landscape (4" × 2.5" per slot). Margins: 0.25" left/right, 0.5" top/bottom. Product templates are now built from modular header, brand, and content zones and can be selected per label.' })
            ] })
          ] })
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626" }, children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSave, disabled: saving, className: "btn-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14 }),
        saving ? "Saving…" : saved ? "Saved!" : "Save Settings"
      ] }) })
    ] })
  ] }) });
}
function App() {
  const [screen, setScreen] = reactExports.useState("library");
  const [editingProduct, setEditingProduct] = reactExports.useState(null);
  const [sheetProducts, setSheetProducts] = reactExports.useState([]);
  function openEditor(product) {
    setEditingProduct(product ?? null);
    setScreen("editor");
  }
  function openSheet(products) {
    setSheetProducts(products);
    setScreen("sheet");
  }
  function backToLibrary() {
    setEditingProduct(null);
    setScreen("library");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app-layout", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Nav,
      {
        current: screen,
        onNavigate: (s) => {
          if (s === "editor") openEditor();
          else setScreen(s);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "content-area", children: [
      screen === "library" && /* @__PURE__ */ jsxRuntimeExports.jsx(Library, { onEdit: openEditor, onOpenSheet: openSheet }),
      screen === "editor" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Editor,
        {
          initialProduct: editingProduct,
          onBack: backToLibrary,
          onOpenSheet: (p2) => openSheet([p2])
        }
      ),
      screen === "sheet" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SheetBuilder,
        {
          initialProducts: sheetProducts,
          onBack: () => setScreen("library")
        }
      ),
      screen === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, {})
    ] })
  ] });
}
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
