'use strict';

var React = require('react');
var TeX = require('@matejmazur/react-katex');

const Math = /*#__PURE__*/React.memo(function Math(props) {
  const inline = (props.className || '').includes('inline');
  const equation = props.children?.[0];
  if (equation) {
    return /*#__PURE__*/React.createElement(TeX, {
      block: !inline,
      math: equation,
      renderError: error => /*#__PURE__*/React.createElement("span", {
        className: "ui error message mde-error-message"
      }, error.message)
    });
  }
  return /*#__PURE__*/React.createElement("span", {
    className: "ui error message mde-error-message"
  }, "Invalid math block");
});

exports.default = Math;
//# sourceMappingURL=react-math-Bta-qoqG.js.map
