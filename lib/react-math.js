"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactKatex = _interopRequireDefault(require("@matejmazur/react-katex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Math = props => {
  const lang = props.lang;
  const equation = props.children[0];

  if (equation) {
    try {
      return /*#__PURE__*/_react.default.createElement(_reactKatex.default, {
        block: lang === 'math',
        math: equation,
        renderError: error => {
          return /*#__PURE__*/_react.default.createElement("span", {
            className: "ui error message mde-error-message"
          }, error.message);
        }
      });
    } catch (e) {
      return /*#__PURE__*/_react.default.createElement("span", null, e.message);
    }
  } else {
    return /*#__PURE__*/_react.default.createElement("span", null, "Invalid math block");
  }
};

var _default = Math;
exports.default = _default;