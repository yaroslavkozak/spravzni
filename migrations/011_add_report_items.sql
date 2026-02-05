-- Migration: Add report items and report settings tables
-- Created: 2026-01-30

CREATE TABLE IF NOT EXISTS report_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  period TEXT NOT NULL,
  amount TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS report_settings (
  id INTEGER PRIMARY KEY CHECK(id = 1),
  updated_date TEXT,
  incoming_amount TEXT,
  outgoing_amount TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO report_settings (id, updated_date) VALUES (1, NULL);

CREATE INDEX IF NOT EXISTS idx_report_items_created ON report_items(created_at);
