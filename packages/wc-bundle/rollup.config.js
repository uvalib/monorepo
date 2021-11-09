// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import multiInput from 'rollup-plugin-multi-input';

export default {
  input: ['src/**/*.js'],

  output: [
    {
      name: 'es6-components',
      dir: 'lib',
      format: 'es'
    },
  ],

  plugins: [
    multiInput({ relative: 'src/' }),
    resolve()
  ]

};
