'use strict';

var inkdrop = require('inkdrop');
var React = require('react');

console.log('module.paths:', module.paths);
const MATH_MODE_INFO = {
  name: 'math',
  mime: 'text/x-latex',
  mode: 'stex',
  ext: [],
  alias: ['inline_math']
};
const ReactMath = /*#__PURE__*/React.lazy(() => Promise.resolve().then(function () { return require('./react-math-tV9GlxJk.js'); }));
module.exports = {
  activate() {
    if (inkdrop.markdownRenderer) {
      inkdrop.markdownRenderer.remarkCodeComponents.math = ReactMath;
      inkdrop.markdownRenderer.remarkCodeComponents.inline_math = ReactMath;
    }
    if (inkdrop.CodeMirror) {
      inkdrop.CodeMirror.modeInfo.push(MATH_MODE_INFO);
    }
  },
  deactivate() {
    if (inkdrop.markdownRenderer) {
      inkdrop.markdownRenderer.remarkPlugins = inkdrop.markdownRenderer.remarkPlugins.filter(plugin => remarkMath !== plugin);
      inkdrop.markdownRenderer.remarkCodeComponents.math = null;
      inkdrop.markdownRenderer.remarkCodeComponents.inline_math = null;
    }
    if (inkdrop.CodeMirror) {
      const {
        modeInfo
      } = inkdrop.CodeMirror;
      const i = modeInfo.indexOf(MATH_MODE_INFO);
      if (i >= 0) modeInfo.splice(i, 1);
    }
  }
};
//# sourceMappingURL=index.js.map
