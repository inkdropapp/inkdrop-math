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

export function activate() {
  if (markdownRenderer) {
    markdownRenderer.remarkCodeComponents.math = ReactMath
    markdownRenderer.remarkCodeComponents.inline_math = ReactMath
  }
  if (CodeMirror) {
    if (!CodeMirror.modeInfo.some(m => m.name === 'math')) {
      CodeMirror.modeInfo.push(MATH_MODE_INFO)
    }
  }
}

export function deactivate() {
  if (markdownRenderer) {
    markdownRenderer.remarkCodeComponents.math = null
    markdownRenderer.remarkCodeComponents.inline_math = null
  }
  if (CodeMirror) {
    const { modeInfo } = CodeMirror
    const i = modeInfo.findIndex(m => m.name === 'math')
    if (i >= 0) modeInfo.splice(i, 1)
  }
}
