"use strict";
'use babel';

var _propTypes = _interopRequireDefault(require("prop-types"));

var _remarkMath = _interopRequireDefault(require("./remark-math"));

var React = _interopRequireWildcard(require("react"));

var _inkdrop = require("inkdrop");

var _codemirror = _interopRequireDefault(require("codemirror"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  BlockMath,
  InlineMath
} = require('react-katex');

class Math extends React.Component {
  render() {
    const lang = this.props.lang;
    const Component = lang === 'math' ? BlockMath : InlineMath;
    const equation = this.props.children[0];

    if (equation) {
      try {
        return React.createElement(Component, {
          math: equation,
          renderError: error => {
            return React.createElement("span", {
              className: "ui error message mde-error-message"
            }, error.message);
          }
        });
      } catch (e) {
        return React.createElement("span", null, e.message);
      }
    } else {
      return React.createElement("span", null, "Invalid math block");
    }
  }

}

_defineProperty(Math, "propTypes", {
  lang: _propTypes["default"].string.isRequired,
  children: _propTypes["default"].arrayOf(_propTypes["default"].string)
});

module.exports = {
  activate() {
    if (_inkdrop.markdownRenderer) {
      _inkdrop.markdownRenderer.remarkPlugins.push(_remarkMath["default"]);

      _inkdrop.markdownRenderer.remarkCodeComponents.math = Math;
      _inkdrop.markdownRenderer.remarkCodeComponents.inline_math = Math;
    }

    if (_codemirror["default"]) {
      _codemirror["default"].modeInfo.push({
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