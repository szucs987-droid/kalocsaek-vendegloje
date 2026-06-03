import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  build: {
    // Put static assets directly in dist/ so _worker.js and server/ are in the
    // same pages_build_output_dir. Cloudflare Pages requires _worker.js and all
    // files it imports to be inside pages_build_output_dir.
    client: '.',
  },
});
