// POST /api/admin/auth  — login
// GET  /api/admin/auth?action=logout  — logout
export const prerender = false;

import type { APIContext } from 'astro';

export async function GET({ url, cookies, redirect }: APIContext) {
  const action = url.searchParams.get('action');
  if (action === 'logout') {
    cookies.delete('admin_session', { path: '/' });
    return redirect('/admin/login');
  }
  return new Response('Method not allowed', { status: 405 });
}

export async function POST({ request, cookies, locals, redirect }: APIContext) {
  const env = locals.runtime?.env;
  const secret = env?.ADMIN_SECRET;

  if (!secret) {
    return new Response(JSON.stringify({ error: 'Server not configured (ADMIN_SECRET missing).' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let password = '';
  const ct = request.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) {
    const body = await request.json();
    password = body?.password ?? '';
  } else {
    const form = await request.formData();
    password = (form.get('password') as string) ?? '';
  }

  if (password !== secret) {
    return new Response(JSON.stringify({ error: 'Helytelen jelszó.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  cookies.set('admin_session', secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    secure: true,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
