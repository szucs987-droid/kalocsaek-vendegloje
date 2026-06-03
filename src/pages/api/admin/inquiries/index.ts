// GET /api/admin/inquiries  — list all inquiries (newest first)
export const prerender = false;

import type { APIContext } from 'astro';

export async function GET({ locals, url }: APIContext) {
  const db = locals.runtime?.env?.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  const status = url.searchParams.get('status') || '';
  const limit = Number(url.searchParams.get('limit') || 100);

  try {
    let query = 'SELECT * FROM event_inquiries';
    const params: string[] = [];
    if (status) { query += ' WHERE status = ?'; params.push(status); }
    query += ' ORDER BY received_at DESC LIMIT ?';
    params.push(String(limit));

    const { results } = await db.prepare(query).bind(...params).all();
    return json({ inquiries: results });
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
