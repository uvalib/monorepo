const {nodeResolve} = require('@rollup/plugin-node-resolve');

module.exports = {
  input: 'src/_js/main.js',
  plugins: [nodeResolve()],
  output: {
    file: 'src/js/bundle.js',
    format: 'iife',
    sourcemap: true
  },
};