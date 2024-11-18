'use strict';

var React = require('react');
var TeX = require('@matejmazur/react-katex');

const Math = props => {
  const inline = props.className.includes('inline');
  const equation = props.children[0];
  if (equation) {
    try {
      return /*#__PURE__*/React.createElement(TeX, {
        block: !inline,
        math: equation,
        renderError: error => {
          return /*#__PURE__*/React.createElement("span", {
            className: "ui error message mde-error-message"
          }, error.message);
        }
      });
    } catch (e) {
      return /*#__PURE__*/React.createElement("span", null, e.message);
    }
  } else {
    return /*#__PURE__*/React.createElement("span", null, "Invalid math block");
  }
};

exports.default = Math;
//# sourceMappingURL=react-math-tV9GlxJk.js.map
