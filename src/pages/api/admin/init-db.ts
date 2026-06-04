// GET /api/admin/init-db  — protected by middleware
// Applies CREATE TABLE IF NOT EXISTS for all tables (idempotent).
// Call once after first deployment to bootstrap the database.
export const prerender = false;

import type { APIContext } from 'astro';
import { cfEnv } from '../../../lib/env';

const SQL = `
CREATE TABLE IF NOT EXISTS menu_items (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  category      TEXT    NOT NULL,
  subcategory   TEXT,
  name          TEXT    NOT NULL,
  description   TEXT,
  price_display TEXT    NOT NULL DEFAULT '',
  price_min     INTEGER,
  allergens     TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_active     INTEGER NOT NULL DEFAULT 1,
  is_featured   INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_menu_category ON menu_items (category, sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_active    ON menu_items (is_active);

CREATE TABLE IF NOT EXISTS daily_offers (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  weekday         INTEGER NOT NULL UNIQUE,
  soup_name       TEXT,
  main_name       TEXT,
  price_full      INTEGER NOT NULL DEFAULT 1990,
  price_main_only INTEGER NOT NULL DEFAULT 1590,
  is_active       INTEGER NOT NULL DEFAULT 1,
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO daily_offers (weekday, price_full, price_main_only) VALUES
  (0, 1990, 1590),(1, 1990, 1590),(2, 1990, 1590),(3, 1990, 1590),
  (4, 1990, 1590),(5, 1990, 1590),(6, 1990, 1590);

CREATE TABLE IF NOT EXISTS weekly_specials (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  description TEXT    NOT NULL,
  valid_from  TEXT    NOT NULL,
  valid_to    TEXT    NOT NULL,
  is_active   INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS event_inquiries (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  phone       TEXT    NOT NULL,
  email       TEXT,
  event_type  TEXT    NOT NULL,
  headcount   INTEGER,
  starts_at   TEXT,
  ends_at     TEXT,
  details     TEXT,
  status      TEXT    NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  received_at TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON event_inquiries (status, received_at);

CREATE TABLE IF NOT EXISTS gallery_images (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  cloudinary_id  TEXT    NOT NULL UNIQUE,
  cloudinary_url TEXT    NOT NULL,
  alt_text       TEXT    NOT NULL DEFAULT '',
  sort_order     INTEGER NOT NULL DEFAULT 0,
  is_active      INTEGER NOT NULL DEFAULT 1,
  uploaded_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery_images (is_active, sort_order);

CREATE TABLE IF NOT EXISTS opening_hours (
  weekday   INTEGER PRIMARY KEY,
  opens     TEXT    NOT NULL DEFAULT '11:00',
  closes    TEXT    NOT NULL DEFAULT '21:00',
  is_closed INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO opening_hours VALUES
  (0,'11:00','21:00',0),(1,'11:00','21:00',0),(2,'11:00','21:00',0),
  (3,'11:00','21:00',0),(4,'11:00','21:00',0),
  (5,'11:00','22:00',0),(6,'11:00','22:00',0);

CREATE TABLE IF NOT EXISTS closed_day_overrides (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  date       TEXT    NOT NULL UNIQUE,
  reason     TEXT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO gallery_images (cloudinary_id, cloudinary_url, alt_text, sort_order, is_active) VALUES
  ('external_dish_co_1', 'https://cdn.website.dish.co/media/ea/10/3211641/Kalocsaek-Vendegloje-21122272-1506550899383656-3829873631109190797-o.jpg', 'Kerthelyiség, hangulatvilágítással', 1, 1),
  ('external_dish_co_2', 'https://cdn.website.dish.co/media/d6/c2/3211626/Kalocsaek-Vendegloje-21083250-1506550879383658-4573451657324914661-o.jpg', 'Belső termünk, tánctérrel', 2, 1),
  ('external_dish_co_3', 'https://cdn.website.dish.co/media/dc/ad/3211651/Kalocsaek-Vendegloje-21167069-1506550906050322-2998888195887132782-o.jpg', 'Pergola, szőlőlugas a kertben', 3, 1),
  ('external_dish_co_4', 'https://cdn.website.dish.co/media/dd/47/3211671/Kalocsaek-Vendegloje-130835177-3640366182668773-1406645070084188086-o.jpg', 'Bőséges sültestál', 4, 1),
  ('external_dish_co_5', 'https://cdn.website.dish.co/media/85/e7/3211621/Kalocsaek-Vendegloje-21083186-1506550972716982-3483539529075078717-o.jpg', 'Rendezvényterem fényfüzérrel', 5, 1),
  ('external_dish_co_6', 'https://cdn.website.dish.co/media/75/be/3211591/Kalocsaek-Vendegloje-527714-530192393686183-1332935311-n.jpg', 'Kemencés sültek', 6, 1),
  ('external_dish_co_7', 'https://cdn.website.dish.co/media/65/72/3211601/Kalocsaek-Vendegloje-10492308-865789876793098-6227095371384042938-n.jpg', 'Svédasztalos tálalás rendezvényre', 7, 1);
`;

export async function GET(_ctx: APIContext) {
  const db = cfEnv.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: 'DB binding not found' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // D1 does not support multi-statement exec reliably — run each statement individually
    const statements = SQL
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    const results: string[] = [];
    for (const stmt of statements) {
      try {
        await db.prepare(stmt).run();
        // grab just the first keyword for logging
        results.push(stmt.substring(0, 40).replace(/\s+/g, ' '));
      } catch (stmtErr: any) {
        // "table already exists" style errors are acceptable — log and continue
        const msg: string = stmtErr?.message ?? '';
        if (!msg.includes('already exists') && !msg.includes('UNIQUE constraint')) {
          throw stmtErr;
        }
        results.push(`[skip] ${stmt.substring(0, 40).replace(/\s+/g, ' ')}`);
      }
    }

    return new Response(
      JSON.stringify({ ok: true, message: 'Database initialised successfully.', statements: results.length }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message ?? 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
