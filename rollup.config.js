import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: './src/index.js',
  treeshaking: false,
  output: {
    file: './plugin/index.js',
    format: 'cjs',
  },
  plugins: [
    resolve(),
    terser({ output: { comments: false } })
  ],
};
