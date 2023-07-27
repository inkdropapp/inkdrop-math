import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import packageJson from './package.json'
const deps = Object.keys(packageJson.dependencies || {})

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: path.join('lib', 'index.js'),
        format: 'cjs',
        strict: true,
        sourcemap: true,
        exports: 'auto'
      }
    ],
    external: ['react', 'codemirror', 'inkdrop', 'is-buffer', ...deps],
    plugins: [
      nodeResolve(),
      babel({
        presets: ['@babel/preset-react']
      })
    ]
  }
]
