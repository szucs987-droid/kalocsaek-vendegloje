import { writeFileSync, rmSync, existsSync } from 'fs';

// 1. Delete the adapter-generated wrangler redirect files.
//    The adapter writes dist/server/wrangler.json AND .wrangler/deploy/config.json.
//    config.json is a pointer to wrangler.json. Pages reads the pointer first;
//    if wrangler.json is gone but config.json still exists, Pages errors.
//    Delete both so Pages falls back to the root wrangler.toml.
const adapterWrangler = 'dist/server/wrangler.json';
if (existsSync(adapterWrangler)) {
  rmSync(adapterWrangler);
  console.log('postbuild: deleted dist/server/wrangler.json');
}
const deployConfig = '.wrangler/deploy/config.json';
if (existsSync(deployConfig)) {
  rmSync(deployConfig);
  console.log('postbuild: deleted .wrangler/deploy/config.json');
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
