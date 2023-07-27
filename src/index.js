import { markdownRenderer, CodeMirror } from 'inkdrop'
import remarkMath from 'remark-math'
import rehypeCode2Math from './rehype-katex'
import rehypeKatex from 'rehype-katex'

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
      markdownRenderer.remarkPlugins.push(remarkMath)
      markdownRenderer.rehypePlugins.push(rehypeCode2Math)
      markdownRenderer.rehypePlugins.push(rehypeKatex)
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
      markdownRenderer.rehypePlugins = markdownRenderer.rehypePlugins.filter(
        plugin => ![rehypeCode2Math, rehypeKatex].includes(plugin)
      )
    }
    if (CodeMirror) {
      const { modeInfo } = CodeMirror
      const i = modeInfo.indexOf(MATH_MODE_INFO)
      if (i >= 0) modeInfo.splice(i, 1)
    }
  }
}
