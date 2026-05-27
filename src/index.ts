import { lazy } from 'react'
import type { Environment, IInkdropPlugin } from '@inkdropapp/types'

const ReactMath = lazy(() => import('./react-math'))

class InkdropPlugin implements IInkdropPlugin {
  activate(env: Environment) {
    if (env.markdownRenderer) {
      env.markdownRenderer.remarkCodeComponents.math = ReactMath
      env.markdownRenderer.remarkCodeComponents.inline_math = ReactMath
    }
  }

  deactivate(env: Environment) {
    if (env.markdownRenderer) {
      env.markdownRenderer.remarkCodeComponents.math = null
      env.markdownRenderer.remarkCodeComponents.inline_math = null
    }
  }
}

export default new InkdropPlugin()
