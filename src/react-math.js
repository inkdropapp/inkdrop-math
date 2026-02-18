import React from 'react'
import TeX from '@matejmazur/react-katex'

const Math = props => {
  const inline = (props.className || '').includes('inline')
  const equation = props.children?.[0]
  if (equation) {
    return (
      <TeX
        block={!inline}
        math={equation}
        renderError={error => (
          <span className="ui error message mde-error-message">
            {error.message}
          </span>
        )}
      />
    )
  }
  return (
    <span className="ui error message mde-error-message">
      Invalid math block
    </span>
  )
}

export default Math
