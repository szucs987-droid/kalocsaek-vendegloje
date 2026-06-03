// GET /api/admin/schedule/daily  — get all daily offers
// PUT /api/admin/schedule/daily  — update one day { weekday, soup_name, main_name, price_full, price_main_only, is_active }
export const prerender = false;

import type { APIContext } from 'astro';

export async function GET({ locals }: APIContext) {
  const db = locals.runtime?.env?.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  try {
    const { results } = await db.prepare('SELECT * FROM daily_offers ORDER BY weekday').all();
    return json({ offers: results });
  } catch (err: any) {
    return json({ error: err?.message }, 500);
  }
}

export async function PUT({ request, locals }: APIContext) {
  const db = locals.runtime?.env?.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  let body: Record<string, any> = {};
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { weekday, soup_name, main_name, price_full, price_main_only, is_active } = body;
  if (weekday === undefined || weekday === null) return json({ error: 'weekday required' }, 400);

  try {
    await db.prepare(`
      UPDATE daily_offers SET
        soup_name = ?, main_name = ?,
        price_full = ?, price_main_only = ?,
        is_active = ?, updated_at = datetime('now')
      WHERE weekday = ?
    `).bind(
      soup_name?.trim() || null, main_name?.trim() || null,
      Number(price_full || 1990), Number(price_main_only || 1590),
      Number(is_active ?? 1), Number(weekday)
    ).run();
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
