"use strict";

var _remarkMath = _interopRequireDefault(require("./remark-math"));

var _inkdrop = require("inkdrop");

var _codemirror = _interopRequireDefault(require("codemirror"));

var _reactMath = _interopRequireDefault(require("./react-math"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MATH_MODE_INFO = {
  name: 'math',
  mime: 'text/x-latex',
  mode: 'stex',
  ext: [],
  alias: ['inline_math']
};
module.exports = {
  activate() {
    if (_inkdrop.markdownRenderer) {
      _inkdrop.markdownRenderer.remarkPlugins.push(_remarkMath.default);

      _inkdrop.markdownRenderer.remarkCodeComponents.math = _reactMath.default;
      _inkdrop.markdownRenderer.remarkCodeComponents.inline_math = _reactMath.default;
    }

    if (_codemirror.default) {
      _codemirror.default.modeInfo.push(MATH_MODE_INFO);
    }
  },

  deactivate() {
    if (_inkdrop.markdownRenderer) {
      const {
        remarkPlugins,
        remarkCodeComponents
      } = _inkdrop.markdownRenderer;
      const i = remarkPlugins.indexOf(_remarkMath.default);
      if (i >= 0) remarkPlugins.splice(i, 1);
      if (remarkCodeComponents.math === _reactMath.default) delete remarkCodeComponents.math;
      if (remarkCodeComponents.inline_math === _reactMath.default) delete remarkCodeComponents.inline_math;
    }

    if (_codemirror.default) {
      const {
        modeInfo
      } = _codemirror.default;
      const i = modeInfo.indexOf(MATH_MODE_INFO);
      if (i >= 0) modeInfo.splice(i, 1);
    }
  }

};