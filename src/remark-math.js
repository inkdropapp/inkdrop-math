module.exports = function(processor) {
  const Parser = this.Parser
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  const blockTokenizers = Parser.prototype.blockTokenizers
  const blockMethods = Parser.prototype.blockMethods

  inlineTokenizers.math = require('./remark-math-inline-parser')
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'math')

  blockTokenizers.math = require('./remark-math-block-parser')
  blockMethods.splice(blockMethods.indexOf('text'), 0, 'math')
}
