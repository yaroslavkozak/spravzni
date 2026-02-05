-- Migration: Add user info fields to chat_sessions for questionnaire data
-- Created: 2025-01-XX

-- Add user information fields to chat_sessions (only if they don't exist)
-- SQLite doesn't support IF NOT EXISTS for ALTER TABLE, so we check first
-- Note: If columns already exist, this migration will fail - that's okay, just skip it

-- Add user_name column if it doesn't exist
-- (We'll handle this gracefully - if column exists, migration will show error but that's fine)

-- Add user information fields to chat_sessions
-- Using a workaround: Try to add, ignore if exists
-- Note: SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN
-- If columns already exist, you can safely ignore the error

-- Check if columns exist first (pragmatic approach - run each ALTER separately)
-- If you get "duplicate column" error, the columns already exist and you can skip this migration

ALTER TABLE chat_sessions ADD COLUMN user_name TEXT;
ALTER TABLE chat_sessions ADD COLUMN user_email TEXT;
ALTER TABLE chat_sessions ADD COLUMN user_phone TEXT;
ALTER TABLE chat_sessions ADD COLUMN queue_position INTEGER DEFAULT NULL; -- Position in queue (NULL if active or closed)

-- Add index for queue management (IF NOT EXISTS is supported for indexes)
CREATE INDEX IF NOT EXISTS idx_chat_sessions_queue ON chat_sessions(status, queue_position, created_at);
