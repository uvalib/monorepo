import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from "rollup-plugin-import-css";

export default {
  input: 'demo/main.js',
  output: {
    file: 'demo/bundle.js',
    format: 'esm'
  },
  plugins: [
    commonjs(),
    resolve({ moduleDirectories: ['node_modules'], browser: true }),
    css()
  ]
};
