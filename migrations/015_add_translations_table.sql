-- Migration: Add centralized translations table (key + ua/en/pl columns)
-- Created: 2026-02-19

CREATE TABLE IF NOT EXISTS translations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  ua TEXT,
  en TEXT,
  pl TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_translations_key ON translations(key);

-- Backfill from legacy texts table if it exists.
INSERT INTO translations (key, ua, en, pl, created_at, updated_at)
SELECT
  key,
  MAX(CASE WHEN language IN ('uk', 'ua') THEN value END) AS ua,
  MAX(CASE WHEN language = 'en' THEN value END) AS en,
  MAX(CASE WHEN language = 'pl' THEN value END) AS pl,
  MIN(created_at) AS created_at,
  MAX(updated_at) AS updated_at
FROM texts
GROUP BY key
ON CONFLICT(key) DO UPDATE SET
  ua = COALESCE(excluded.ua, translations.ua),
  en = COALESCE(excluded.en, translations.en),
  pl = COALESCE(excluded.pl, translations.pl),
  updated_at = CURRENT_TIMESTAMP;
