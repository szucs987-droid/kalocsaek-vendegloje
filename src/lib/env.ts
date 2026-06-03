/**
 * Cloudflare Workers environment bindings helper.
 *
 * In @astrojs/cloudflare v13 / Astro 6, `Astro.locals.runtime.env` was removed.
 * Use `import { cfEnv } from '~/lib/env'` to access bindings instead.
 */
import { env } from 'cloudflare:workers';
export const cfEnv = env as unknown as Env;
