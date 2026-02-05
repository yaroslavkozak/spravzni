-- Migration: Add incoming/outgoing amounts to report settings
-- Created: 2026-01-30

ALTER TABLE report_settings ADD COLUMN incoming_amount TEXT;
ALTER TABLE report_settings ADD COLUMN outgoing_amount TEXT;
