-- Migration: Add multilingual texts and media reference tables
-- Created: 2024-12-15

-- Table for multilingual texts/translations
CREATE TABLE IF NOT EXISTS texts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  language TEXT NOT NULL DEFAULT 'uk',
  value TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(key, language)
);

-- Table for media references (images and videos stored in R2)
CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK(type IN ('image', 'video')),
  r2_key TEXT NOT NULL,
  r2_bucket TEXT NOT NULL DEFAULT 'spravzni-storage',
  mime_type TEXT,
  size INTEGER,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  description TEXT,
  metadata TEXT, -- JSON string for additional metadata
  is_public BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_texts_key ON texts(key);
CREATE INDEX IF NOT EXISTS idx_texts_language ON texts(language);
CREATE INDEX IF NOT EXISTS idx_texts_key_language ON texts(key, language);

CREATE INDEX IF NOT EXISTS idx_media_key ON media(key);
CREATE INDEX IF NOT EXISTS idx_media_type ON media(type);
CREATE INDEX IF NOT EXISTS idx_media_r2_key ON media(r2_key);
CREATE INDEX IF NOT EXISTS idx_media_public ON media(is_public);

