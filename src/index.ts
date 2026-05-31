import { lazy } from 'react'
import type { Environment, IInkdropPlugin } from '@inkdropapp/types'

const ReactMath = lazy(() => import('./react-math'))

class InkdropPlugin implements IInkdropPlugin {
  activate(env: Environment) {
    const app = env?.appVersion ? env : inkdrop // backward compatibility for v5
    if (app.markdownRenderer) {
      app.markdownRenderer.remarkCodeComponents.math = ReactMath
      app.markdownRenderer.remarkCodeComponents.inline_math = ReactMath
    }
  }

  deactivate(env: Environment) {
    const app = env?.appVersion ? env : inkdrop // backward compatibility for v5
    if (app.markdownRenderer) {
      app.markdownRenderer.remarkCodeComponents.math = null
      app.markdownRenderer.remarkCodeComponents.inline_math = null
    }
  }
}

export default new InkdropPlugin()
