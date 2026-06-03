// GET  /api/admin/schedule/weekly  — list weekly specials
// POST /api/admin/schedule/weekly  — create new
export const prerender = false;

import type { APIContext } from 'astro';

export async function GET({ locals }: APIContext) {
  const db = locals.runtime?.env?.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  try {
    const { results } = await db.prepare(
      'SELECT * FROM weekly_specials ORDER BY valid_from DESC'
    ).all();
    return json({ specials: results });
  } catch (err: any) {
    return json({ error: err?.message }, 500);
  }
}

export async function POST({ request, locals }: APIContext) {
  const db = locals.runtime?.env?.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  let body: Record<string, any> = {};
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { title, description, valid_from, valid_to, is_active } = body;
  if (!title?.trim() || !description?.trim() || !valid_from || !valid_to) {
    return json({ error: 'title, description, valid_from, valid_to required' }, 400);
  }

  try {
    const result = await db.prepare(`
      INSERT INTO weekly_specials (title, description, valid_from, valid_to, is_active)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      title.trim(), description.trim(), valid_from, valid_to, Number(is_active ?? 1)
    ).run();
    return json({ ok: true, id: result.meta.last_row_id }, 201);
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
