"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createStatementData;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var PerformanceCalculator = /*#__PURE__*/function () {
  function PerformanceCalculator(aPerformance) {
    _classCallCheck(this, PerformanceCalculator);

    this.performance = aPerformance;
    this.play = aPlay;
  }

  _createClass(PerformanceCalculator, [{
    key: "amount",
    get: function get() {
      var result = 0;

      switch (this.play.type) {
        case "tragedy":
          // 비극
          result = 40000;

          if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
          }

          break;

        case "comedy":
          // 희극
          result = 30000;

          if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
          }

          result += 300 * this.performance.audience;
          break;

        default:
          throw new Error("\uC54C \uC218 \uC5C6\uB294 \uC7A5\uB974: ".concat(this.play.type));
      }

      return result;
    }
  }, {
    key: "volumeCredits",
    get: function get() {
      var result = 0;
      result += Math.max(this.performance.audience - 30, 0);
      if ("comedy" === this.play.type) result += Math.floor(this.performance.audience / 5);
      return result;
    }
  }]);

  return PerformanceCalculator;
}();

function createStatementData(invoice, plays) {
  var result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);
  return result;

  function totalVolumeCredits(data) {
    return data.performances.reduce(function (total, p) {
      return total + p.amount;
    }, 0);
  }

  function totalAmount(data) {
    return data.performances.reduce(function (total, p) {
      return total + p.volumeCredits;
    }, 0);
  }

  function enrichPerformance(aPerformance) {
    var calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
    var result = Object.assign({}, aPerformance); // 얕은 복사 수행

    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance) {
    return PerformanceCalculator(aPerformance, playFor(aPerformance)).amount;
  }

  function volumeCreditsFor(aPerformance) {
    var result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
    return result;
  }
}