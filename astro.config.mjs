import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://kalocsaekvendegloje.hu',
  output: 'server',
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
});
