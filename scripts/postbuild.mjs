/**
 * postbuild.mjs — Cloudflare Pages Advanced Mode cleanup
 *
 * @astrojs/cloudflare (v13+) splits output into:
 *   dist/client/  — static assets (images, CSS, JS)
 *   dist/server/  — Worker SSR code
 *
 * Cloudflare Pages ASSETS binding (Advanced Mode) serves static files from
 * the pages_build_output_dir root (dist/).  Files buried under dist/client/
 * are NOT found → images/CSS 404.
 *
 * This script:
 * 1. Copies dist/client/* → dist/ so every static asset is at the root level.
 * 2. Deletes adapter-generated wrangler configs that confuse Pages.
 * 3. Creates dist/_worker.js — the entry point Pages Advanced Mode requires.
 * 4. Writes dist/.assetsignore telling Pages NOT to expose server/ or the
 *    now-redundant client/ subtree as static assets.
 */

import { writeFileSync, rmSync, existsSync, cpSync } from 'fs';

// 1. Copy static assets from dist/client → dist root.
//    After this, dist/logo_atlatszo.png, dist/_astro/…, etc. all exist at
//    the path the ASSETS binding expects.
cpSync('dist/client', 'dist', { recursive: true });
console.log('postbuild: copied dist/client/* → dist/');

// 2. Delete adapter-generated wrangler configs.
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

// 3. Create dist/_worker.js — Cloudflare Pages picks this up automatically.
writeFileSync(
  'dist/_worker.js',
  "export { default } from './server/entry.mjs';\n"
);
console.log('postbuild: created dist/_worker.js');

// 4. Write dist/.assetsignore — keep server code and the now-redundant
//    client/ copy out of the Pages static-asset bundle.
writeFileSync('dist/.assetsignore', 'server\nclient\nwrangler.json\n.dev.vars\n');
console.log('postbuild: wrote dist/.assetsignore');
