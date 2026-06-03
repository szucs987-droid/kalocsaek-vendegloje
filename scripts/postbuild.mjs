/**
 * postbuild.mjs — Cloudflare Pages Advanced Mode cleanup
 *
 * The @astrojs/cloudflare adapter (v13+) generates several wrangler config
 * files in dist/server/ and .wrangler/deploy/ that conflict with the Pages
 * manual-mode deployment via _worker.js.
 *
 * This script:
 * 1. Deletes the adapter-generated wrangler files (so Pages uses our root
 *    wrangler.toml instead).
 * 2. Creates dist/_worker.js — the Cloudflare Pages _worker.js entry point
 *    that exports the Astro SSR handler.
 * 3. Writes dist/.assetsignore so Pages does not serve server code as static
 *    files.
 */

import { writeFileSync, rmSync, existsSync } from 'fs';

// 1. Delete adapter-generated wrangler configs
const toDelete = [
  'dist/server/wrangler.json',
  '.wrangler/deploy/config.json',
];
for (const f of toDelete) {
  if (existsSync(f)) {
    rmSync(f);
    console.log(`postbuild: deleted ${f}`);
  }
}

// 2. Create dist/_worker.js — Cloudflare Pages picks this up automatically.
writeFileSync(
  'dist/_worker.js',
  "export { default } from './server/entry.mjs';\n"
);
console.log('postbuild: created dist/_worker.js');

// 3. Write dist/.assetsignore — prevents Pages from serving server/ as static.
writeFileSync('dist/.assetsignore', 'server\nwrangler.json\n.dev.vars\n');
console.log('postbuild: wrote dist/.assetsignore');
