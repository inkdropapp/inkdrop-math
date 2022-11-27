import React from 'react'
import TeX from '@matejmazur/react-katex'

const Math = props => {
  const lang = props.lang
  const equation = props.children[0]
  if (equation) {
    try {
      return (
        <TeX
          block={lang === 'math'}
          math={equation}
          renderError={error => {
            return (
              <span className="ui error message mde-error-message">
                {error.message}
              </span>
            )
          }}
        />
      )
    } catch (e) {
      return <span>{e.message}</span>
    }
  } else {
    return <span>Invalid math block</span>
  }
}

export default Math
