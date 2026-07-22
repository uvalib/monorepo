// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://occupancy.library.virginia.edu',
  base: '/',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
