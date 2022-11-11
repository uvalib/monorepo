// rollup.config.js
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: ['dist/src/bundle.js'],

  output: [
    {
      name: 'es6-components',
      format: 'es',
      dir: 'demo'
    },
  ],

  plugins: [
    nodeResolve(),
    commonjs()
  ]

};
