import { writeFileSync, rmSync, existsSync } from 'fs';

// 1. Delete the adapter-generated dist/server/wrangler.json.
//    Cloudflare Pages' BETA redirected-config feature picks this file up and
//    validates it with Pages-specific rules that forbid "main" and "rules" —
//    fields the adapter always writes. Deleting it makes Pages fall back to the
//    root wrangler.toml (which already has pages_build_output_dir + D1 binding).
const adapterWrangler = 'dist/server/wrangler.json';
if (existsSync(adapterWrangler)) {
  rmSync(adapterWrangler);
  console.log('postbuild: deleted dist/server/wrangler.json');
}

// 2. Create dist/_worker.js — the Cloudflare Pages Advanced Mode Worker shim.
//    Pages picks up _worker.js from pages_build_output_dir (./dist) and deploys
//    it as the Worker. Both this file and dist/server/ are inside dist/ so all
//    relative imports resolve correctly.
writeFileSync('dist/_worker.js', "export { default } from './server/entry.mjs';\n");
console.log('postbuild: created dist/_worker.js');

// 3. Write dist/.assetsignore so Pages does not try to serve the server code or
//    the wrangler config as static files.
writeFileSync('dist/.assetsignore', 'server\nwrangler.json\n.dev.vars\n');
console.log('postbuild: wrote dist/.assetsignore');
