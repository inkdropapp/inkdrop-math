import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  deps: {
    // `katex` and `react` are peers: the host installs and dedupes them. Bundling
    // `katex` here would also desync the rendered markup from the stylesheet,
    // which is generated from whichever `katex` the host has installed.
    neverBundle: ['react', 'react/jsx-runtime', 'katex']
  }
})
