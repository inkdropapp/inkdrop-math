/**
 * Generates `styles/` — the stylesheet plus the WOFF2 files it points at.
 *
 * The fonts are copied rather than referenced across into `node_modules/katex`:
 * under pnpm's symlinked store a relative `../../katex/dist/fonts/…` from this
 * package's `styles/` does not reliably land anywhere, so a self-contained
 * `styles/fonts/` is the only URL a bundler can resolve from every host.
 */
import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildMathStylesheet } from './katex-css.mjs'

const require = createRequire(import.meta.url)
const packageDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const stylesDir = join(packageDir, 'styles')
const fontsDir = join(stylesDir, 'fonts')

const katexCssPath = require.resolve('katex/dist/katex.css')
const katexFontsDir = join(dirname(katexCssPath), 'fonts')

mkdirSync(fontsDir, { recursive: true })

writeFileSync(
  join(stylesDir, 'katex.css'),
  buildMathStylesheet(readFileSync(katexCssPath, 'utf-8'), { fontUrlPrefix: 'fonts' })
)

const fontFiles = readdirSync(katexFontsDir).filter(name => name.endsWith('.woff2'))
for (const name of fontFiles) {
  copyFileSync(join(katexFontsDir, name), join(fontsDir, name))
}

console.info(`build-styles: styles/katex.css + ${fontFiles.length} fonts from ${katexCssPath}`)
