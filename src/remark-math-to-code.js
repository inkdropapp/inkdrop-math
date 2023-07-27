import { visit } from 'unist-util-visit'

export const remarkMath2Code = () => {
  return tree => {
    visit(tree, { type: 'math' }, element => {
      element.type = 'code'
      element.lang = 'math'
      element.data.hChildren = undefined
      element.data.hName = undefined
    })
    visit(tree, { type: 'inlineMath' }, element => {
      element.type = 'inlineCode'
      element.lang = 'inline_math'
      element.data.hChildren = undefined
      element.data.hName = undefined
      element.data.hProperties = {
        lang: 'inline_math'
      }
    })
  }
}
