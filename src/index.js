'use babel'
import math from './remark-math'
import { markdownRenderer } from 'inkdrop'
import CodeMirror from 'codemirror'
import ReactMath from './react-math'

const TeX = require('@matejmazur/react-katex')
const MATH_MODE_INFO = {
  name: 'math',
  mime: 'text/x-latex',
  mode: 'stex',
  ext: [],
  alias: ['inline_math']
}

module.exports = {
  activate() {
    if (markdownRenderer) {
      markdownRenderer.remarkPlugins.push(math)
      markdownRenderer.remarkCodeComponents.math = ReactMath
      markdownRenderer.remarkCodeComponents.inline_math = ReactMath
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
      if (remarkCodeComponents.math === ReactMath) delete remarkCodeComponents.math
      if (remarkCodeComponents.inline_math === ReactMath) delete remarkCodeComponents.inline_math
    }
    if (CodeMirror) {
      const { modeInfo } = CodeMirror
      const i = modeInfo.indexOf(MATH_MODE_INFO)
      if (i >= 0) modeInfo.splice(i, 1)
    }
  }
}
