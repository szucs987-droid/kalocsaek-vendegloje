import { readFileSync, writeFileSync } from 'fs';

const path = 'dist/server/wrangler.json';

let raw;
try {
  raw = JSON.parse(readFileSync(path, 'utf8'));
} catch {
  // File doesn't exist — nothing to do
  process.exit(0);
}

// Keep only fields the Cloudflare Pages build system understands.
// Strip all wrangler 4.x-only fields that cause "unknown field" failures.
// pages_build_output_dir is required — without it Pages rejects the file and
// falls back to static-only mode (no Worker deployed).
const clean = {
  name: raw.name,
  compatibility_date: raw.compatibility_date,
  ...(raw.compatibility_flags?.length ? { compatibility_flags: raw.compatibility_flags } : {}),
  pages_build_output_dir: '../client',
  main: raw.main,
  no_bundle: raw.no_bundle,
  rules: raw.rules,
  // 'assets' omitted: Pages auto-creates the ASSETS binding from pages_build_output_dir
  ...(raw.d1_databases?.length ? { d1_databases: raw.d1_databases } : {}),
};

writeFileSync(path, JSON.stringify(clean, null, 2));
console.log('postbuild: cleaned dist/server/wrangler.json');
