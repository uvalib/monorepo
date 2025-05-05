import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

export default {
  input: 'index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    sourcemap: true,
    banner: '#!/usr/bin/env node'
  },
  external: [
    'express',
    'express-http-proxy',
    'dotenv/config',
    'url'
  ],
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }),
    resolve({ preferBuiltins: true }),
    commonjs()
  ]
};