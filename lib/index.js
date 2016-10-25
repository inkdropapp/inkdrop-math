'use babel'

import math from './remark-math'
import { React } from 'inkdrop'

const { BlockMath, InlineMath } = require('react-katex')

class Math extends React.Component {
  render () {
    const lang = this.props.lang
    const Component = lang === 'math' ? BlockMath : InlineMath
    const equation = this.props.children[0]
    if (equation) {
      try {
        return <Component math={equation} />
      } catch (e) {
        return <span>{e.message}</span>
      }
    } else {
      return <span>Invalid math block</span>
    }
  }
}

module.exports = {
  activate () {
    const { MDEPreview } = inkdrop.components.classes
    if (MDEPreview) {
      MDEPreview.remarkPlugins.push(math)
      MDEPreview.remarkCodeComponents.math = Math
      MDEPreview.remarkCodeComponents.inline_math = Math
    }
    if (inkdrop.CodeMirror) {
      inkdrop.CodeMirror.modeInfo.push({
        name: 'math',
        mime: 'text/x-latex',
        mode: 'stex',
        ext: [],
        alias: ['inline_math']
      })
    }
  },

  deactivate () {
  }

}
