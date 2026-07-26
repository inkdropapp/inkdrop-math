import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  format: ['cjs'],
  minify: true,
  sourcemap: true,
  clean: true,
  outExtensions: () => ({ js: '.js' }),
  treeshake: true,
  deps: {
    // `katex` stays external: `styles/katex.css` points its @font-face rules at
    // `inkdrop://math/node_modules/katex/dist/fonts`, so ipm has to install it
    // into the plugin directory either way.
    neverBundle: ['react', 'react/jsx-runtime', 'inkdrop', 'katex'],
    // The published plugin must be self-contained — the ipm tarball excludes
    // node_modules, so the workspace package is bundled in.
    alwaysBundle: ['@inkdropapp/math']
  },
  outputOptions: {
    inlineDynamicImports: true
  }
})
