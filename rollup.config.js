import {nodeResolve} from '@rollup/plugin-node-resolve';
import multiInput from 'rollup-plugin-multi-input';

module.exports = {
  input: ['src/_js/*.js'],
  plugins: [
    nodeResolve(), 
    multiInput({relative: 'src/_js'})
  ],
  output: {
    dir: 'src/js/',
    format: 'esm'
  },
};