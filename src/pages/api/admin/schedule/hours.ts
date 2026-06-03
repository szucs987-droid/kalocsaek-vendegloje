// GET /api/admin/schedule/hours  — get all 7 days
// PUT /api/admin/schedule/hours  — update one day { weekday, opens, closes, is_closed }
export const prerender = false;

import type { APIContext } from 'astro';

export async function GET({ locals }: APIContext) {
  const db = locals.runtime?.env?.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  try {
    const { results } = await db.prepare('SELECT * FROM opening_hours ORDER BY weekday').all();
    return json({ hours: results });
  } catch (err: any) {
    return json({ error: err?.message }, 500);
  }
}

export async function PUT({ request, locals }: APIContext) {
  const db = locals.runtime?.env?.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  let body: Record<string, any> = {};
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { weekday, opens, closes, is_closed } = body;
  if (weekday === undefined || weekday === null) return json({ error: 'weekday required' }, 400);

  try {
    await db.prepare(`
      INSERT INTO opening_hours (weekday, opens, closes, is_closed)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(weekday) DO UPDATE SET
        opens = excluded.opens,
        closes = excluded.closes,
        is_closed = excluded.is_closed
    `).bind(Number(weekday), opens || '11:00', closes || '21:00', Number(is_closed ?? 0)).run();
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
