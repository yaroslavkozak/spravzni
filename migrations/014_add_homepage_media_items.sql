-- Migration: Add homepage media collection items
-- Used for ordered logo/gallery management in admin

CREATE TABLE IF NOT EXISTS homepage_media_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section TEXT NOT NULL, -- e.g. 'brand_logos', 'space_gallery'
  media_key TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(section, media_key),
  FOREIGN KEY (media_key) REFERENCES media(key) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_homepage_media_items_section_order
  ON homepage_media_items(section, sort_order);
