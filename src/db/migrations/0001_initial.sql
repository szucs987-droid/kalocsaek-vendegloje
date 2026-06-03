-- ============================================================
-- Kalocsáék Vendéglője — D1 initial schema
-- ============================================================

-- MENU ITEMS
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

-- DAILY OFFERS
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

-- WEEKLY SPECIALS
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

-- EVENT INQUIRIES
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

-- GALLERY IMAGES
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

-- OPENING HOURS
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

-- CLOSED DAY OVERRIDES
CREATE TABLE IF NOT EXISTS closed_day_overrides (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  date       TEXT    NOT NULL UNIQUE,
  reason     TEXT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);
