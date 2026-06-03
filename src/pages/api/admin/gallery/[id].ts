// PUT    /api/admin/gallery/:id  — update alt_text, sort_order, is_active
// DELETE /api/admin/gallery/:id
export const prerender = false;

import type { APIContext } from 'astro';
import { cfEnv } from '../../../../lib/env';

export async function PUT({ params, request, locals }: APIContext) {
  const db = cfEnv.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  let body: Record<string, any> = {};
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { alt_text, sort_order, is_active } = body;

  try {
    await db.prepare(`
      UPDATE gallery_images
      SET alt_text = ?, sort_order = ?, is_active = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      alt_text?.trim() || '', Number(sort_order || 0), Number(is_active ?? 1), params.id
    ).run();
    return json({ ok: true });
  } catch (err: any) {
    return json({ error: err?.message }, 500);
  }
}

export async function DELETE({ params, locals }: APIContext) {
  const db = cfEnv.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  try {
    await db.prepare('DELETE FROM gallery_images WHERE id = ?').bind(params.id).run();
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
