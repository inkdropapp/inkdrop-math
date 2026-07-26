/**
 * Generates `styles/katex.css`, the sheet Inkdrop loads for this plugin.
 *
 * The transform itself lives in `@inkdropapp/math` so the plugin and the web
 * hosts ship the same rules. Only the font URLs differ: Inkdrop injects a
 * plugin's stylesheet as text, so relative `url(fonts/…)` would resolve against
 * the document rather than the sheet — hence the absolute `inkdrop://` URL,
 * which is also why `katex` has to stay an unbundled runtime dependency: ipm
 * installs it into the plugin directory this URL points at.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildMathStylesheet } from '@inkdropapp/math/katex-css'

const require = createRequire(import.meta.url)
const pluginDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const destination = join(pluginDir, 'styles', 'katex.css')

const FONT_URL_PREFIX = 'inkdrop://math/node_modules/katex/dist/fonts'

const katexCssPath = require.resolve('katex/dist/katex.css')

mkdirSync(dirname(destination), { recursive: true })
writeFileSync(
  destination,
  buildMathStylesheet(readFileSync(katexCssPath, 'utf-8'), { fontUrlPrefix: FONT_URL_PREFIX })
)

console.info(`generate-katex-css: ${katexCssPath} -> ${destination}`)
