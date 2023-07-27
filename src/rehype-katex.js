import { visit } from 'unist-util-visit'

const rehypeCode2Math = () => {
  return tree => {
    visit(tree, { type: 'element', tagName: 'code' }, element => {
      const classes =
        element.properties && Array.isArray(element.properties.className)
          ? element.properties.className
          : []
      if (classes.includes('language-math')) {
        classes.push('math-display')
        element.tagName = 'div'
        element.properties = {
          ...element.properties,
          className: classes
        }
      }
    })
  }
}

export default rehypeCode2Math
