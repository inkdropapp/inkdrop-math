'use babel'
import PropTypes from 'prop-types'
import math from './remark-math'
import * as React from 'react'
import { markdownRenderer } from 'inkdrop'
import CodeMirror from 'codemirror'

const TeX = require('@matejmazur/react-katex')

class Math extends React.Component {
  static propTypes = {
    lang: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.string)
  }

  render() {
    const lang = this.props.lang
    const equation = this.props.children[0]
    if (equation) {
      try {
        return (
          <TeX
            block={lang === 'math'}
            math={equation}
            renderError={error => {
              return (
                <span className="ui error message mde-error-message">
                  {error.message}
                </span>
              )
            }}
          />
        )
      } catch (e) {
        return <span>{e.message}</span>
      }
    } else {
      return <span>Invalid math block</span>
    }
  }
}

module.exports = {
  activate() {
    if (markdownRenderer) {
      markdownRenderer.remarkPlugins.push(math)
      markdownRenderer.remarkCodeComponents.math = Math
      markdownRenderer.remarkCodeComponents.inline_math = Math
    }
    if (CodeMirror) {
      CodeMirror.modeInfo.push({
        name: 'math',
        mime: 'text/x-latex',
        mode: 'stex',
        ext: [],
        alias: ['inline_math']
      })
    }
  },

  deactivate() {}
}
