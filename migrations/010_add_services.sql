-- Migration: Add services and service_options tables
-- Created: 2024-12-XX

-- Table for services
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  display_order INTEGER NOT NULL DEFAULT 0,
  heading_uk TEXT NOT NULL,
  heading_en TEXT,
  paragraphs_uk TEXT NOT NULL, -- JSON array of strings
  paragraphs_en TEXT, -- JSON array of strings
  primary_button_text_uk TEXT NOT NULL,
  primary_button_text_en TEXT,
  secondary_button_text_uk TEXT NOT NULL,
  secondary_button_text_en TEXT,
  primary_action TEXT CHECK(primary_action IN ('vacationOptions', 'none')) DEFAULT 'none',
  secondary_action TEXT CHECK(secondary_action IN ('contact', 'none')) DEFAULT 'none',
  image_key TEXT, -- Reference to media table
  overlay_text_uk TEXT,
  overlay_text_en TEXT,
  show_primary_button BOOLEAN DEFAULT 1,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (image_key) REFERENCES media(key)
);

-- Table for service options (vacation options)
CREATE TABLE IF NOT EXISTS service_options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id INTEGER NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  title_uk TEXT NOT NULL,
  title_en TEXT,
  description_uk TEXT NOT NULL,
  description_en TEXT,
  image_path TEXT NOT NULL, -- Path to image file
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_image_key ON services(image_key);

CREATE INDEX IF NOT EXISTS idx_service_options_service_id ON service_options(service_id);
CREATE INDEX IF NOT EXISTS idx_service_options_display_order ON service_options(display_order);
CREATE INDEX IF NOT EXISTS idx_service_options_active ON service_options(is_active);
