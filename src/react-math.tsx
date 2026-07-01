import type { CodeComponentProps } from '@inkdropapp/types'
import TeX from '@matejmazur/react-katex'
import React, { memo } from 'react'

const Math: React.FC<CodeComponentProps> = ({ className, children }) => {
  const inline = (className || '').includes('inline')
  const equation = children?.[0]
  if (equation) {
    return (
      <TeX
        block={!inline}
        math={equation}
        renderError={error => (
          <span className="ui error message mde-error-message">{error.message}</span>
        )}
      />
    )
  }
  return <span className="ui error message mde-error-message">Invalid math block</span>
}

Math.displayName = 'Math'

export default memo(Math)
