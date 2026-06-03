/// <reference path="../.astro/types.d.ts" />
/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: import('@cloudflare/workers-types').D1Database;
  ADMIN_SECRET: string;
  DEPLOY_HOOK_URL?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_UPLOAD_PRESET?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
