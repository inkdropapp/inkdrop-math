'use strict';
'use babel';

var _remarkMath = require('./remark-math');

var _remarkMath2 = _interopRequireDefault(_remarkMath);

var _inkdrop = require('inkdrop');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { BlockMath, InlineMath } = require('react-katex');

let Math = class Math extends _inkdrop.React.Component {
  render() {
    const lang = this.props.lang;
    const Component = lang === 'math' ? BlockMath : InlineMath;
    const equation = this.props.children[0];
    if (equation) {
      try {
        return _inkdrop.React.createElement(Component, { math: equation, renderError: error => {
            return _inkdrop.React.createElement(
              'span',
              { className: 'ui error message mde-error-message' },
              error.message
            );
          } });
      } catch (e) {
        return _inkdrop.React.createElement(
          'span',
          null,
          e.message
        );
      }
    } else {
      return _inkdrop.React.createElement(
        'span',
        null,
        'Invalid math block'
      );
    }
  }
};


module.exports = {
  activate() {
    const { MDEPreview } = inkdrop.components.classes;
    if (MDEPreview) {
      MDEPreview.remarkPlugins.push(_remarkMath2.default);
      MDEPreview.remarkCodeComponents.math = Math;
      MDEPreview.remarkCodeComponents.inline_math = Math;
    }
    if (inkdrop.CodeMirror) {
      inkdrop.CodeMirror.modeInfo.push({
        name: 'math',
        mime: 'text/x-latex',
        mode: 'stex',
        ext: [],
        alias: ['inline_math']
      });
    }
  },

  deactivate() {}

};