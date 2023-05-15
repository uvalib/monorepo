/* eslint-disable import/no-extraneous-dependencies */
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import multiInput from 'rollup-plugin-multi-input';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: ['dist/**/*.js'],
  output: {
    format: 'esm',
    dir: 'build',
  },

  plugins: [
    commonjs(),
    multiInput.default({relative: 'dist'}),
    /** Resolve bare module imports */
    nodeResolve(),
//    json({
//      compact: true
//    }),
    /** Minify JS */
//    terser(),

  ],
};
