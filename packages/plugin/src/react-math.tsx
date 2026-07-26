import { MathEquation } from '@inkdropapp/math'
import type { CodeComponentProps } from '@inkdropapp/types'
import React, { memo } from 'react'

const renderError = (error: Error) => (
  <span className="ui error message mde-error-message">{error.message}</span>
)

const Math: React.FC<CodeComponentProps> = ({ className, children }) => {
  const equation = children?.[0]
  if (!equation) {
    return <span className="ui error message mde-error-message">Invalid math block</span>
  }
  return (
    <MathEquation
      code={equation}
      inline={(className || '').includes('inline')}
      renderError={renderError}
    />
  )
}

Math.displayName = 'Math'

export default memo(Math)
