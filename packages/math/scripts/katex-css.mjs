/**
 * Builds the stylesheet `@inkdropapp/math` ships, out of KaTeX's own `katex.css`.
 *
 * Shared with the Inkdrop plugin (`@inkdropapp/math/katex-css`) so the two hosts
 * cannot drift: the only thing that legitimately differs between them is where
 * the fonts live, which is why `fontUrlPrefix` is a required argument rather
 * than something with a plausible default.
 *
 * Transforms:
 *  - Rewrites font URLs onto `fontUrlPrefix`
 *  - Strips WOFF and TTF sources (every host here runs a WOFF2-capable engine)
 *  - Replaces the `body` counter-reset with `.mde-preview`, the class Inkdrop's
 *    uikit puts on a rendered note, so equation numbering restarts per preview
 *    rather than per document
 *  - Wraps the `.katex`/`.katex-display` rules in `.inkdrop-math { … }`, matching
 *    the class the component renders on each math block, relying on native CSS
 *    nesting (baseline since Chromium 112) rather than a build-time flattener.
 *    `@font-face` can't be nested, so it stays outside the wrapper.
 */

const HEADER = '/* AUTO-GENERATED from katex.css — DO NOT EDIT */\n'
const SCOPE_CLASS = '.inkdrop-math'

/** Styles the element `MathEquation` renders when KaTeX rejects the source. */
const ERROR_RULE = `.inkdrop-math-error {
  color: var(--math-error-color, #cc0000);
}`

/**
 * @param {string} katexCss - Contents of `katex/dist/katex.css`.
 * @param {{ fontUrlPrefix: string }} options - `fontUrlPrefix` is prepended to every
 *   font filename. Web hosts want it relative to the sheet (`fonts`); Inkdrop
 *   injects plugin CSS as text, so it needs an absolute `inkdrop://…` URL.
 * @returns {string} The complete stylesheet.
 */
export function buildMathStylesheet(katexCss, { fontUrlPrefix } = {}) {
  if (!fontUrlPrefix) {
    throw new Error('buildMathStylesheet: `fontUrlPrefix` is required')
  }

  const transformed = katexCss
    .replace(/url\(fonts\/([^)]+)\)/g, (_, filename) => `url("${fontUrlPrefix}/${filename}")`)
    .replace(/,\s*url\("[^"]*\.woff"\)\s*format\("woff"\)/g, '')
    .replace(/,\s*url\("[^"]*\.ttf"\)\s*format\("truetype"\)/g, '')
    .replace(
      /^body\s*\{[^}]*counter-reset:\s*katexEqnNo\s+mmlEqnNo[^}]*\}/m,
      '.mde-preview {\n  counter-reset: katexEqnNo mmlEqnNo;\n}'
    )

  // Split off the `.katex`/`.katex-display` rules (everything between the last
  // @font-face block and the trailing .mde-preview rule) so they can be nested
  // under .inkdrop-math without touching @font-face or the counter-reset rule.
  const firstSelectorIndex = transformed.search(/^\.[^\n{}]*\{/m)
  const trailingRuleIndex = transformed.search(/^\.mde-preview\s*\{/m)
  if (firstSelectorIndex === -1 || trailingRuleIndex === -1) {
    throw new Error('buildMathStylesheet: could not locate the KaTeX rule block to scope')
  }

  const preamble = transformed.slice(0, firstSelectorIndex)
  const katexRules = transformed
    .slice(firstSelectorIndex, trailingRuleIndex)
    .trimEnd()
    .split('\n')
    .map(line => (line ? `  ${line}` : line))
    .join('\n')
  const trailingRule = transformed.slice(trailingRuleIndex).trimEnd()

  const output =
    HEADER +
    preamble +
    `${SCOPE_CLASS} {\n${katexRules}\n}\n\n` +
    trailingRule +
    '\n\n' +
    ERROR_RULE +
    '\n'

  if (/url\(fonts\//.test(output)) {
    console.warn('buildMathStylesheet: warning: unrewritten font URLs remain')
  }

  return output
}
