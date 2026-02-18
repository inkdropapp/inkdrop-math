'use strict';

var inkdrop = require('inkdrop');
var React = require('react');

const MATH_MODE_INFO = {
  name: 'math',
  mime: 'text/x-latex',
  mode: 'stex',
  ext: [],
  alias: ['inline_math']
};
const ReactMath = /*#__PURE__*/React.lazy(() => Promise.resolve().then(function () { return require('./react-math-Bta-qoqG.js'); }));
function activate() {
  if (inkdrop.markdownRenderer) {
    inkdrop.markdownRenderer.remarkCodeComponents.math = ReactMath;
    inkdrop.markdownRenderer.remarkCodeComponents.inline_math = ReactMath;
  }
  if (inkdrop.CodeMirror) {
    if (!inkdrop.CodeMirror.modeInfo.some(m => m.name === 'math')) {
      inkdrop.CodeMirror.modeInfo.push(MATH_MODE_INFO);
    }
  }
}
function deactivate() {
  if (inkdrop.markdownRenderer) {
    inkdrop.markdownRenderer.remarkCodeComponents.math = null;
    inkdrop.markdownRenderer.remarkCodeComponents.inline_math = null;
  }
  if (inkdrop.CodeMirror) {
    const {
      modeInfo
    } = inkdrop.CodeMirror;
    const i = modeInfo.findIndex(m => m.name === 'math');
    if (i >= 0) modeInfo.splice(i, 1);
  }
}

exports.activate = activate;
exports.deactivate = deactivate;
//# sourceMappingURL=index.js.map
