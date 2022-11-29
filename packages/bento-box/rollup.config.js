import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import path from 'path';

export default {
  input: path.join('dist','src','bento-box.js'),
  output: {
    format: 'es',
    dir: 'build',
  },

  plugins: [
    /** Resolve bare module imports */
    nodeResolve(),
    /** Minify JS */
    terser(),
    /** Compile JS to a lower language target */
    babel({
      babelHelpers: 'bundled',
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            targets: [
              'last 3 Chrome major versions',
              'last 3 Firefox major versions',
              'last 3 Edge major versions',
              'last 3 Safari major versions',
            ],
            modules: false,
            bugfixes: true,
          },
        ],
      ]
    }),
  ],
};
