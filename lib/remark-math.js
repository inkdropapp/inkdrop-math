"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _remarkMathInlineParser = _interopRequireDefault(require("./remark-math-inline-parser"));

var _remarkMathBlockParser = _interopRequireDefault(require("./remark-math-block-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(processor) {
  const Parser = this.Parser;
  const inlineTokenizers = Parser.prototype.inlineTokenizers;
  const inlineMethods = Parser.prototype.inlineMethods;
  const blockTokenizers = Parser.prototype.blockTokenizers;
  const blockMethods = Parser.prototype.blockMethods;
  inlineTokenizers.math = _remarkMathInlineParser.default;
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'math');
  blockTokenizers.math = _remarkMathBlockParser.default;
  blockMethods.splice(blockMethods.indexOf('text'), 0, 'math');
}