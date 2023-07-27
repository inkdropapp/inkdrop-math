import { markdownRenderer, CodeMirror } from 'inkdrop'
import { lazy } from 'react'
import remarkMath from 'remark-math'
import { remarkMath2Code } from './remark-math-to-code'

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
      markdownRenderer.remarkPlugins.push(remarkMath)
      markdownRenderer.remarkPlugins.push(remarkMath2Code)
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
      markdownRenderer.remarkPlugins = markdownRenderer.remarkPlugins.filter(
        plugin => ![remarkMath, remarkMath2Code].includes(plugin)
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
