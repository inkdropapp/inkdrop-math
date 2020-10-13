import remarkMathInlineParser from './remark-math-inline-parser'
import remarkMathBlockParser from './remark-math-block-parser'

export default function (processor) {
  const Parser = this.Parser
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  const blockTokenizers = Parser.prototype.blockTokenizers
  const blockMethods = Parser.prototype.blockMethods

  inlineTokenizers.math = remarkMathInlineParser
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'math')

  blockTokenizers.math = remarkMathBlockParser
  blockMethods.splice(blockMethods.indexOf('text'), 0, 'math')
}
