import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from "rollup-plugin-import-css";
import multiInput from 'rollup-plugin-multi-input';

export default {
  input: 'src/**/*.js',
  output: {
    dir: 'dist',
    format: 'esm'
  },
  plugins: [
    commonjs(),
    multiInput.default({relative: 'src'}),
    resolve({ moduleDirectories: ['node_modules'], browser: true }),
    css()
  ]
};
