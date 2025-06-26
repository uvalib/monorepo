// Rollup configuration for @uvalib/data-wrap
//
// We compile the already-transpiled TypeScript output in dist/src (generated
// via `tsc`) into both:
//   • dist/esm – preserved ES modules (essentially a copy)
//   • dist/cjs – CommonJS, so Node/Next.js can `require` the package without
//     needing Next.js' `transpilePackages`.
//
// The build workflow becomes:
//   1) tsc                                  → dist/src  (ESM, declarations)
//   2) rollup -c                            → dist/esm + dist/cjs
//
// `preserveModules: true` keeps the original folder / file structure so we
// can re-export individual entry points (e.g. "./DrupalData.js").

import path from 'path';
import { fileURLToPath } from 'url';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The directory where `tsc` writes JavaScript.
const SRC_DIR = path.join(__dirname, 'dist', 'src');

/**
 * Build helper: returns an absolute path inside the dist/src tree.
 * @param {string} rel  e.g. 'index.js'
 */
function src(rel) {
  return path.join(SRC_DIR, rel);
}

export default [
  // ES module build – we mainly copy files so downstream tools can import
  {
    input: src('index.js'),
    output: {
      dir: path.join(__dirname, 'dist', 'esm'),
      format: 'es',
      preserveModules: true,
      sourcemap: true,
    },
    plugins: [nodeResolve()],
    // nothing is bundled – keep all imports as is so they stay in the tree
    external: id => !id.startsWith('.') && !path.isAbsolute(id),
  },

  // CommonJS build – Node / Next.js SSR will automatically pick this up.
  {
    input: src('index.js'),
    output: {
      dir: path.join(__dirname, 'dist', 'cjs'),
      format: 'cjs',
      preserveModules: true,
      exports: 'named',
      sourcemap: true,
    },
    plugins: [nodeResolve(), commonjs()],
    external: id => !id.startsWith('.') && !path.isAbsolute(id),
  },
];
