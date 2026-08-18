import { o as createLucideIcon, q as getDefaultExportFromCjs, v as reactExports, r as getLabelTemplate, t as jsxRuntimeExports, I as INFO_LABEL_ZONES, y as toPercentHeight, B as toPercentWidth, D as toPercentX, z as toPercentTop, V as VERTICAL_INFO_LABEL_ZONES, d as LOGO_ONLY_LABEL_ZONES, L as LABEL_ZONES } from "./index-DMdzO7HF.js";
import { i as isDesignTemplateId, a as DesignLabelSvg } from "./DesignLabelSvg-BAkSpZGR.js";
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
  var res = number.substr(0, 12).split("").map(function(n) {
    return +n;
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
  var res = number.substr(0, 7).split("").map(function(n) {
    return +n;
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
  var result = data.split("").map(function(n) {
    return +n;
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
  }).reduce(function(sum, n, idx) {
    return sum + n * (3 - idx % 2 * 2);
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
function addZeroes(number, n) {
  for (var i = 0; i < n; i++) {
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
    var n = parseInt(number[i]);
    if ((i + number.length) % 2 === 0) {
      sum += n;
    } else {
      sum += n * 2 % 10 + Math.floor(n * 2 / 10);
    }
  }
  return (10 - sum % 10) % 10;
}
function mod11(number) {
  var sum = 0;
  var weights = [2, 3, 4, 5, 6, 7];
  for (var i = 0; i < number.length; i++) {
    var n = parseInt(number[number.length - 1 - i]);
    sum += weights[i % weights.length] * n;
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
      var z = this.number;
      var result = "";
      while (!isNaN(z) && z != 0) {
        if (z % 2 === 0) {
          result = "11100" + result;
          z = (z - 2) / 2;
        } else {
          result = "100" + result;
          z = (z - 1) / 2;
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
        var x = b * options.width + encoding.barcodePadding;
        if (binary[b] === "1") {
          ctx.fillRect(x, yFrom, options.width, options.height);
        } else if (binary[b]) {
          ctx.fillRect(x, yFrom, options.width, options.height * binary[b]);
        }
      }
    }
  }, {
    key: "drawCanvasText",
    value: function drawCanvasText(options, encoding) {
      var ctx = this.canvas.getContext("2d");
      var font = options.fontOptions + " " + options.fontSize + "px " + options.font;
      if (options.displayValue) {
        var x, y;
        if (options.textPosition == "top") {
          y = options.marginTop + options.fontSize - options.textMargin;
        } else {
          y = options.height + options.textMargin + options.marginTop + options.fontSize;
        }
        ctx.font = font;
        if (options.textAlign == "left" || encoding.barcodePadding > 0) {
          x = 0;
          ctx.textAlign = "left";
        } else if (options.textAlign == "right") {
          x = encoding.width - 1;
          ctx.textAlign = "right";
        } else {
          x = encoding.width / 2;
          ctx.textAlign = "center";
        }
        ctx.fillText(encoding.text, x, y);
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
      var x = 0;
      for (var b = 0; b < binary.length; b++) {
        x = b * options.width + encoding.barcodePadding;
        if (binary[b] === "1") {
          barWidth++;
        } else if (barWidth > 0) {
          this.drawRect(x - options.width * barWidth, yFrom, options.width * barWidth, options.height, parent);
          barWidth = 0;
        }
      }
      if (barWidth > 0) {
        this.drawRect(x - options.width * (barWidth - 1), yFrom, options.width * barWidth, options.height, parent);
      }
    }
  }, {
    key: "drawSVGText",
    value: function drawSVGText(parent, options, encoding) {
      var textElem = this.document.createElementNS(svgns, "text");
      if (options.displayValue) {
        var x, y;
        textElem.setAttribute("font-family", options.font);
        textElem.setAttribute("font-size", options.fontSize);
        if (options.fontOptions.includes("bold")) {
          textElem.setAttribute("font-weight", "bold");
        }
        if (options.fontOptions.includes("italic")) {
          textElem.setAttribute("font-style", "italic");
        }
        if (options.textPosition == "top") {
          y = options.fontSize - options.textMargin;
        } else {
          y = options.height + options.textMargin + options.fontSize;
        }
        if (options.textAlign == "left" || encoding.barcodePadding > 0) {
          x = 0;
          textElem.setAttribute("text-anchor", "start");
        } else if (options.textAlign == "right") {
          x = encoding.width - 1;
          textElem.setAttribute("text-anchor", "end");
        } else {
          x = encoding.width / 2;
          textElem.setAttribute("text-anchor", "middle");
        }
        textElem.setAttribute("x", x);
        textElem.setAttribute("y", y);
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
    value: function createGroup(x, y, parent) {
      var group = this.document.createElementNS(svgns, "g");
      group.setAttribute("transform", "translate(" + x + ", " + y + ")");
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
    value: function drawRect(x, y, width, height, parent) {
      var rect = this.document.createElementNS(svgns, "rect");
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
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
const DEFAULT_TOP_LOGO_SRC = new URL("" + new URL("default-label-logo-DOqzg7y1.png", import.meta.url).href, import.meta.url).href;
function LabelPreview({
  product,
  barcodeOverrideDataUri,
  logoDataUri,
  scale = 1
}) {
  const barcodeRef = reactExports.useRef(null);
  const template = getLabelTemplate(product.templateId);
  const [globalLabelBackground, setGlobalLabelBackground] = reactExports.useState("");
  const [customTemplateDataUri, setCustomTemplateDataUri] = reactExports.useState("");
  const [customTemplateAspect, setCustomTemplateAspect] = reactExports.useState(null);
  const [designTemplate, setDesignTemplate] = reactExports.useState(null);
  const designTemplateId = product.templateId && isDesignTemplateId(product.templateId) ? product.templateId : null;
  reactExports.useEffect(() => {
    if (!designTemplateId) {
      setDesignTemplate(null);
      return;
    }
    let alive = true;
    window.api.design.get(designTemplateId).then((result) => {
      if (alive) setDesignTemplate(result.ok ? result.data : null);
    });
    return () => {
      alive = false;
    };
  }, [designTemplateId]);
  const labelBackground = product.labelBackgroundColor || globalLabelBackground || template.shellColor;
  const resolvedProduct = reactExports.useMemo(
    () => ({ ...product, labelBackgroundColor: labelBackground }),
    [product, labelBackground]
  );
  reactExports.useEffect(() => {
    window.api.settings.get().then((result) => {
      if (result.ok) setGlobalLabelBackground(result.data.labelBackgroundColor);
    });
  }, []);
  reactExports.useEffect(() => {
    if (!product.templateId?.startsWith("custom-")) {
      setCustomTemplateDataUri("");
      setCustomTemplateAspect(null);
      return;
    }
    window.api.file.getTemplatePNG(product.templateId).then((result) => {
      const dataUri = result.ok ? result.data : "";
      setCustomTemplateDataUri(dataUri);
      if (!dataUri) {
        setCustomTemplateAspect(null);
        return;
      }
      const image = new Image();
      image.onload = () => {
        if (image.naturalWidth && image.naturalHeight) {
          setCustomTemplateAspect(image.naturalWidth / image.naturalHeight);
        }
      };
      image.src = dataUri;
    });
  }, [product.templateId]);
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
  if (designTemplateId) {
    if (!designTemplate) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%" } });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DesignLabelSvg,
      {
        design: designTemplate,
        product: resolvedProduct,
        logoDataUri,
        scale
      }
    );
  }
  if (template.layout === "info") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      InfoLabelPreview,
      {
        product: resolvedProduct,
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
        product: resolvedProduct,
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
        scale,
        labelBackground
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FrontLabelPreview,
    {
      product: resolvedProduct,
      template,
      barcodeRef,
      barcodeOverrideDataUri,
      logoDataUri,
      customTemplateDataUri,
      customTemplateAspect,
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
  customTemplateDataUri,
  customTemplateAspect,
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
        aspectRatio: customTemplateDataUri && customTemplateAspect ? `${customTemplateAspect}` : `${template.width} / ${template.height}`,
        overflow: "hidden",
        borderRadius: 18,
        boxShadow: "0 4px 24px rgba(0,0,0,0.16)",
        background: product.labelBackgroundColor || template.shellColor,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        flexShrink: 0,
        containerType: "inline-size"
      },
      children: [
        customTemplateDataUri && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: customTemplateDataUri, alt: "", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, border: `1px solid ${template.borderColor}`, borderRadius: 18, pointerEvents: "none" } }),
        !customTemplateDataUri && /* @__PURE__ */ jsxRuntimeExports.jsx(
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
        !customTemplateDataUri && /* @__PURE__ */ jsxRuntimeExports.jsx(
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
        (!customTemplateDataUri || product.showProductName !== false) && /* @__PURE__ */ jsxRuntimeExports.jsx(
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
                  fontFamily: 'var(--label-title-font, "Lora", Georgia, serif)',
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
                  fontFamily: 'var(--label-price-font, "Genty Demo", Georgia, serif)',
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
        background: product.labelBackgroundColor || template.shellColor,
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
                  fontFamily: 'var(--label-title-font, "Lora", Georgia, serif)',
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
                  fontFamily: 'var(--label-price-font, "Genty Demo", Georgia, serif)',
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
              fontFamily: 'var(--label-body-font, "Helvetica Neue", Arial, sans-serif)',
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
        background: product.labelBackgroundColor || template.shellColor,
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
                  fontFamily: 'var(--label-title-font, "Lora", Georgia, serif)',
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
                    fontFamily: 'var(--label-body-font, "Helvetica Neue", Arial, sans-serif)',
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
                    fontFamily: 'var(--label-body-font, "Avenir Next Condensed Asset", Arial, sans-serif)',
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
        ] }),
        product.customerName?.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: toPercentTop(VERTICAL_INFO_LABEL_ZONES.customerName.y, VERTICAL_INFO_LABEL_ZONES.customerName.h, template.height),
              left: toPercentX(VERTICAL_INFO_LABEL_ZONES.customerName.x, template.width),
              width: toPercentWidth(VERTICAL_INFO_LABEL_ZONES.customerName.w, template.width),
              height: toPercentHeight(VERTICAL_INFO_LABEL_ZONES.customerName.h, template.height),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              overflow: "hidden"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                style: {
                  fontSize: "2.8cqw",
                  fontFamily: 'var(--label-body-font, "Helvetica Neue", Arial, sans-serif)',
                  fontWeight: 700,
                  color: template.textColor,
                  textAlign: "center",
                  whiteSpace: "nowrap"
                },
                children: [
                  "Order: ",
                  product.customerName.trim()
                ]
              }
            )
          }
        )
      ]
    }
  );
}
function LogoOnlyLabelPreview({
  template,
  logoDataUri,
  scale,
  labelBackground
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
        background: labelBackground,
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
  x,
  y,
  w,
  h,
  canvasWidth,
  canvasHeight
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        position: "absolute",
        top: toPercentTop(y, h, canvasHeight),
        left: toPercentX(x, canvasWidth),
        width: toPercentWidth(w, canvasWidth),
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
  x,
  y,
  w,
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
        top: toPercentTop(y, h, canvasHeight),
        left: toPercentX(x, canvasWidth),
        width: toPercentWidth(w, canvasWidth),
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
export {
  ArrowLeft as A,
  JsBarcode$1 as J,
  LabelPreview as L
};
