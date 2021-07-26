// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import multiInput from 'rollup-plugin-multi-input';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';

export default {
  input: ['src/modules/*.js'],

  output: [
    {
      name: 'es6-components',
      dir: '_site/module-build/',
      format: 'es'
    },
  ],

  plugins: [
    multiInput({ relative: 'src/modules/' }),
    resolve(),
    importMetaAssets()
  ]

};
