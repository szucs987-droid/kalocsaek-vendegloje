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
const clean = {
  name: raw.name,
  compatibility_date: raw.compatibility_date,
  ...(raw.compatibility_flags?.length ? { compatibility_flags: raw.compatibility_flags } : {}),
  main: raw.main,
  no_bundle: raw.no_bundle,
  rules: raw.rules,
  assets: raw.assets,
  ...(raw.d1_databases?.length ? { d1_databases: raw.d1_databases } : {}),
};

writeFileSync(path, JSON.stringify(clean, null, 2));
console.log('postbuild: cleaned dist/server/wrangler.json');
