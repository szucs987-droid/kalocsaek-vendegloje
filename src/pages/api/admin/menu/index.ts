// GET  /api/admin/menu  — list all menu items
// POST /api/admin/menu  — create new item
export const prerender = false;

import type { APIContext } from 'astro';

export async function GET({ locals }: APIContext) {
  const db = locals.runtime?.env?.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  try {
    const { results } = await db.prepare(
      'SELECT * FROM menu_items ORDER BY category, sort_order, name'
    ).all();
    return json({ items: results });
  } catch (err: any) {
    return json({ error: err?.message }, 500);
  }
}

export async function POST({ request, locals }: APIContext) {
  const db = locals.runtime?.env?.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  let body: Record<string, any> = {};
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { category, subcategory, name, description, price_display, price_min, allergens, sort_order, is_active, is_featured } = body;
  if (!category?.trim() || !name?.trim()) return json({ error: 'category and name are required' }, 400);

  try {
    const result = await db.prepare(`
      INSERT INTO menu_items (category, subcategory, name, description, price_display, price_min, allergens, sort_order, is_active, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      category.trim(), subcategory?.trim() || null, name.trim(),
      description?.trim() || null, price_display?.trim() || '',
      price_min ? Number(price_min) : null, allergens?.trim() || null,
      Number(sort_order || 0), Number(is_active ?? 1), Number(is_featured ?? 0)
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
