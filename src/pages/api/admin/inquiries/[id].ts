// GET    /api/admin/inquiries/:id  — single inquiry
// PATCH  /api/admin/inquiries/:id  — update status / admin_notes
export const prerender = false;

import type { APIContext } from 'astro';
import { cfEnv } from '../../../../lib/env';

export async function GET({ params, locals }: APIContext) {
  const db = cfEnv.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  try {
    const row = await db.prepare('SELECT * FROM event_inquiries WHERE id = ?')
      .bind(params.id).first();
    if (!row) return json({ error: 'Not found' }, 404);
    return json({ inquiry: row });
  } catch (err: any) {
    return json({ error: err?.message }, 500);
  }
}

export async function PATCH({ params, request, locals }: APIContext) {
  const db = cfEnv.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  let body: Record<string, any> = {};
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const allowed = ['status', 'admin_notes'];
  const fields = Object.keys(body).filter(k => allowed.includes(k));
  if (!fields.length) return json({ error: 'No valid fields to update' }, 400);

  const sets = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => body[f]);

  try {
    await db.prepare(
      `UPDATE event_inquiries SET ${sets}, updated_at = datetime('now') WHERE id = ?`
    ).bind(...values, params.id).run();
    return json({ ok: true });
  } catch (err: any) {
    return json({ error: err?.message }, 500);
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
