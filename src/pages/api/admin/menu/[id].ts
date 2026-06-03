// GET    /api/admin/menu/:id
// PUT    /api/admin/menu/:id
// DELETE /api/admin/menu/:id
export const prerender = false;

import type { APIContext } from 'astro';

export async function GET({ params, locals }: APIContext) {
  const db = locals.runtime?.env?.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  try {
    const row = await db.prepare('SELECT * FROM menu_items WHERE id = ?').bind(params.id).first();
    if (!row) return json({ error: 'Not found' }, 404);
    return json({ item: row });
  } catch (err: any) {
    return json({ error: err?.message }, 500);
  }
}

export async function PUT({ params, request, locals }: APIContext) {
  const db = locals.runtime?.env?.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  let body: Record<string, any> = {};
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { category, subcategory, name, description, price_display, price_min, allergens, sort_order, is_active, is_featured } = body;
  if (!category?.trim() || !name?.trim()) return json({ error: 'category and name are required' }, 400);

  try {
    await db.prepare(`
      UPDATE menu_items SET
        category = ?, subcategory = ?, name = ?, description = ?,
        price_display = ?, price_min = ?, allergens = ?,
        sort_order = ?, is_active = ?, is_featured = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      category.trim(), subcategory?.trim() || null, name.trim(),
      description?.trim() || null, price_display?.trim() || '',
      price_min ? Number(price_min) : null, allergens?.trim() || null,
      Number(sort_order || 0), Number(is_active ?? 1), Number(is_featured ?? 0),
      params.id
    ).run();
    return json({ ok: true });
  } catch (err: any) {
    return json({ error: err?.message }, 500);
  }
}

export async function DELETE({ params, locals }: APIContext) {
  const db = locals.runtime?.env?.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  try {
    await db.prepare('DELETE FROM menu_items WHERE id = ?').bind(params.id).run();
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
