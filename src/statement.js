"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _util = _interopRequireDefault(require("util"));

var _createStatementData = _interopRequireDefault(require("./createStatementData.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var playsFile = _fs["default"].readFileSync('./plays.json', 'utf-8');

var invoicesFile = _fs["default"].readFileSync('./invoices.json', 'utf-8');

var plays = JSON.parse(playsFile);
var invoices = JSON.parse(invoicesFile);

function statement(invoice, plays) {
  return renderPlainText((0, _createStatementData["default"])(invoice, plays));
}

function htmlStatement(invoice, plays) {
  return renderHtml((0, _createStatementData["default"])(invoice, plays));
}

function renderHtml(data) {
  var result = "<h1>\uCCAD\uAD6C \uB0B4\uC5ED (\uACE0\uAC1D\uBA85: ".concat(data.customer, ")</h1>\n");
  result += "<table>\n";
  result += "<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>";

  var _iterator = _createForOfIteratorHelper(data.performances),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var perf = _step.value;
      result += "  <tr><td>".concat(perf.play.name, "</td><td>(").concat(perf.audience, "\uC11D)</td>");
      result += "<td>".concat(usd(perf.amount), "</td></tr>\n");
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  result += "</table>\n";
  result += "<p>\uCD1D\uC561: <em>".concat(usd(data.totalAmount), "</em></p>\n");
  result += "<p>\uC801\uB9BD \uD3EC\uC778\uD2B8: <em>".concat(data.totalVolumeCredits, "</em>\uC810</p>\n");
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(aNumber / 100);
}

function renderPlainText(data, plays) {
  var result = "\uCCAD\uAD6C \uB0B4\uC5ED (\uACE0\uAC1D\uBA85: ".concat(data.customer, ")\n");

  var _iterator2 = _createForOfIteratorHelper(data.performances),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var perf = _step2.value;
      // 청구 내역을 출력한다.
      result += " ".concat(perf.play.name, ": ").concat(usd(perf.amount), " (").concat(perf.audience, "\uC11D)\n");
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  result += "\uCD1D\uC561: ".concat(usd(data.totalAmount), "\n");
  result += "\uC801\uB9BD \uD3EC\uC778\uD2B8: ".concat(data.totalVolumeCredits, "\uC810\n");
  return result;
}

try {
  var plainTextResult = statement(invoices, plays);
  console.log(plainTextResult);
  var htmlTextResult = htmlStatement(invoices, plays);
  console.log(_util["default"].inspect(htmlTextResult, false, null, true));
} catch (error) {
  console.log(error);
}