/* eslint-disable import/no-extraneous-dependencies */
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import multiInput from 'rollup-plugin-multi-input';
import path from 'path';

export default {
  input: [path.join('dist','src','*.js')],
  output: {
    format: 'es',
    dir: 'build',
  },

  plugins: [
    multiInput.default({relative: 'dist/src'}),
    /** Resolve bare module imports */
    nodeResolve(),
    /** Minify JS */
    terser(),

  ],
};
