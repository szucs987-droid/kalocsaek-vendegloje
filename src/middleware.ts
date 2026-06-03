import { defineMiddleware } from 'astro:middleware';
import { cfEnv } from './lib/env';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Protect all /admin/* routes (except /admin/login) and /api/admin/* endpoints
  const needsAuth =
    (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) ||
    pathname.startsWith('/api/admin');

  if (needsAuth) {
    const cookie = context.cookies.get('admin_session');
    const valid = cfEnv.ADMIN_SECRET && cookie?.value === cfEnv.ADMIN_SECRET;

    if (!valid) {
      // API endpoints → 401 JSON
      if (pathname.startsWith('/api/admin')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      // Pages → redirect to login
      return context.redirect('/admin/login');
    }
  }

  return next();
});
