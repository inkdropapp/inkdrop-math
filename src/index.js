import { markdownRenderer, CodeMirror } from 'inkdrop'
import { lazy } from 'react'

const MATH_MODE_INFO = {
  name: 'math',
  mime: 'text/x-latex',
  mode: 'stex',
  ext: [],
  alias: ['inline_math']
}

const ReactMath = lazy(() => import('./react-math'))

module.exports = {
  activate() {
    if (markdownRenderer) {
      markdownRenderer.remarkCodeComponents.math = ReactMath
      markdownRenderer.remarkCodeComponents.inline_math = ReactMath
    }
    if (CodeMirror) {
      CodeMirror.modeInfo.push(MATH_MODE_INFO)
    }
  },

  deactivate() {
    if (markdownRenderer) {
      markdownRenderer.remarkPlugins = markdownRenderer.remarkPlugins.filter(
        plugin => remarkMath !== plugin
      )
      markdownRenderer.remarkCodeComponents.math = null
      markdownRenderer.remarkCodeComponents.inline_math = null
    }
    if (CodeMirror) {
      const { modeInfo } = CodeMirror
      const i = modeInfo.indexOf(MATH_MODE_INFO)
      if (i >= 0) modeInfo.splice(i, 1)
    }
  }
}
