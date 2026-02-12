-- Migration: Add English translation columns to report tables
-- Enables translation of report items and amounts to English
-- Created: 2026-02-12

-- report_items: add English columns (existing period, amount, category = Ukrainian)
ALTER TABLE report_items ADD COLUMN period_en TEXT;
ALTER TABLE report_items ADD COLUMN amount_en TEXT;
ALTER TABLE report_items ADD COLUMN category_en TEXT;

-- report_settings: add English columns for amounts
ALTER TABLE report_settings ADD COLUMN incoming_amount_en TEXT;
ALTER TABLE report_settings ADD COLUMN outgoing_amount_en TEXT;
