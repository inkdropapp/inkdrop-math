import katex, { type KatexOptions, type ParseError } from 'katex'
import React, { memo, useMemo } from 'react'

/**
 * The class every rule in `@inkdropapp/math/styles.css` is nested under.
 * Rendered on the wrapper element, so the sheet cannot leak into the rest of
 * the host's page.
 */
export const MATH_SCOPE_CLASS = 'inkdrop-math'

export interface MathEquationProps {
  /** LaTeX source — the body of a ```math fence or the inside of a `$…$` span. */
  code: string
  /** Render inline in a `<span>` rather than in display mode in a `<div>`. */
  inline?: boolean
  /** Appended to {@link MATH_SCOPE_CLASS} on the wrapper element. */
  className?: string
  /**
   * Passed through to `katex.renderToString`. `displayMode` follows `inline`
   * unless overridden here. Pass a stable reference — a fresh object literal
   * re-renders the equation on every parent render.
   */
  options?: KatexOptions
  /**
   * Rendered in place of the equation when KaTeX rejects the source, so hosts
   * can match their own error styling.
   */
  renderError?: (error: ParseError | TypeError) => React.ReactElement
}

const renderDefaultError = (error: ParseError | TypeError) => (
  <span className="inkdrop-math-error">{error.message}</span>
)

type RenderResult = { html: string } | { error: ParseError | TypeError }

/**
 * Renders a LaTeX expression with KaTeX.
 *
 * Rendering happens during render rather than in an effect: `renderToString` is
 * synchronous and pure, so there is no reason to paint an empty box first — it
 * also means the equation survives server-side rendering.
 *
 * Requires `@inkdropapp/math/styles.css`; without it KaTeX's markup renders as
 * unstyled fallback text with no runtime warning.
 */
export const MathEquation = memo<MathEquationProps>(function MathEquation({
  code,
  inline = false,
  className,
  options,
  renderError = renderDefaultError
}) {
  const rendered = useMemo<RenderResult>(() => {
    try {
      return {
        html: katex.renderToString(code, {
          displayMode: !inline,
          throwOnError: true,
          ...options
        })
      }
    } catch (error) {
      if (error instanceof katex.ParseError || error instanceof TypeError) {
        return { error }
      }
      throw error
    }
  }, [code, inline, options])

  if ('error' in rendered) return renderError(rendered.error)

  const Wrapper = inline ? 'span' : 'div'
  return (
    <Wrapper
      className={className ? `${MATH_SCOPE_CLASS} ${className}` : MATH_SCOPE_CLASS}
      dangerouslySetInnerHTML={{ __html: rendered.html }}
    />
  )
})
