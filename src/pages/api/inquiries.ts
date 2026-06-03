// POST /api/inquiries — save event inquiry to D1
export const prerender = false;

import type { APIContext } from 'astro';

export async function POST({ request, locals }: APIContext) {
  const db = locals.runtime?.env?.DB;

  let body: Record<string, any> = {};
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const { name, phone, email, event_type, headcount, starts_at, ends_at, details } = body;

  if (!name?.trim() || !phone?.trim() || !event_type?.trim()) {
    return json({ error: 'Hiányzó kötelező mezők (name, phone, event_type).' }, 400);
  }

  // If DB is not available (local dev without wrangler), still return success
  // so the public form works even without a DB binding.
  if (!db) {
    console.warn('[inquiries] DB binding not available — inquiry not persisted.');
    return json({ ok: true, id: null, warning: 'DB not available' });
  }

  try {
    const result = await db.prepare(`
      INSERT INTO event_inquiries (name, phone, email, event_type, headcount, starts_at, ends_at, details)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      name.trim(),
      phone.trim(),
      email?.trim() || null,
      event_type.trim(),
      headcount ? Number(headcount) : null,
      starts_at || null,
      ends_at || null,
      details?.trim() || null,
    ).run();

    return json({ ok: true, id: result.meta.last_row_id });
  } catch (err: any) {
    console.error('[inquiries] DB error:', err);
    return json({ error: 'Adatbázis hiba.', detail: err?.message }, 500);
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
