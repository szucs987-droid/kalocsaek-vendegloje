// GET  /api/admin/gallery  — list all gallery images
// POST /api/admin/gallery  — save a Cloudinary-uploaded image record
export const prerender = false;

import type { APIContext } from 'astro';
import { cfEnv } from '../../../../lib/env';

export async function GET({ locals }: APIContext) {
  const db = cfEnv.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  try {
    const { results } = await db.prepare(
      'SELECT * FROM gallery_images ORDER BY sort_order, uploaded_at DESC'
    ).all();
    return json({ images: results });
  } catch (err: any) {
    return json({ error: err?.message }, 500);
  }
}

export async function POST({ request, locals }: APIContext) {
  const db = cfEnv.DB;
  if (!db) return json({ error: 'DB not available' }, 500);

  let body: Record<string, any> = {};
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { cloudinary_id, cloudinary_url, alt_text, sort_order, is_active } = body;
  if (!cloudinary_id?.trim() || !cloudinary_url?.trim()) {
    return json({ error: 'cloudinary_id and cloudinary_url required' }, 400);
  }

  try {
    const result = await db.prepare(`
      INSERT INTO gallery_images (cloudinary_id, cloudinary_url, alt_text, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      cloudinary_id.trim(), cloudinary_url.trim(),
      alt_text?.trim() || '', Number(sort_order || 0), Number(is_active ?? 1)
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
