'use babel'
import PropTypes from 'prop-types'
import math from './remark-math'
import * as React from 'react'
import { markdownRenderer } from 'inkdrop'
import CodeMirror from 'codemirror'

const TeX = require('@matejmazur/react-katex')
const MATH_MODE_INFO = {
  name: 'math',
  mime: 'text/x-latex',
  mode: 'stex',
  ext: [],
  alias: ['inline_math']
}

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
      CodeMirror.modeInfo.push(MATH_MODE_INFO)
    }
  },

  deactivate() {
    if (markdownRenderer) {
      const { remarkPlugins, remarkCodeComponents } = markdownRenderer
      const i = remarkPlugins.indexOf(math)
      if (i >= 0) remarkPlugins.splice(i, 1)
      if (remarkCodeComponents.math === Math) delete remarkCodeComponents.math
      if (remarkCodeComponents.inline_math === Math) delete remarkCodeComponents.inline_math
    }
    if (CodeMirror) {
      const { modeInfo } = CodeMirror
      const i = modeInfo.indexOf(MATH_MODE_INFO)
      if (i >= 0) modeInfo.splice(i, 1)
    }
  }
}
