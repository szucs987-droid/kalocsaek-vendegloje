// PUT    /api/admin/schedule/weekly/:id
// DELETE /api/admin/schedule/weekly/:id
export const prerender = false;

import type { APIContext } from 'astro';

export async function PUT({ params, request, locals }: APIContext) {
  const db = locals.runtime?.env?.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  let body: Record<string, any> = {};
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { title, description, valid_from, valid_to, is_active } = body;
  if (!title?.trim() || !description?.trim() || !valid_from || !valid_to) {
    return json({ error: 'title, description, valid_from, valid_to required' }, 400);
  }

  try {
    await db.prepare(`
      UPDATE weekly_specials SET
        title = ?, description = ?, valid_from = ?, valid_to = ?,
        is_active = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(title.trim(), description.trim(), valid_from, valid_to, Number(is_active ?? 1), params.id).run();
    return json({ ok: true });
  } catch (err: any) {
    return json({ error: err?.message }, 500);
  }
}

export async function DELETE({ params, locals }: APIContext) {
  const db = locals.runtime?.env?.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  try {
    await db.prepare('DELETE FROM weekly_specials WHERE id = ?').bind(params.id).run();
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
