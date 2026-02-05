-- Migration: Add Telegram and user type fields to users table
-- Created: 2024-12-XX
-- Purpose: Enable Telegram notifications for admin users

-- Add user_type column if it doesn't exist
-- Note: SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN
-- This will fail gracefully if the column already exists
-- You may need to check manually or use a more sophisticated migration tool

-- Add user_type column
-- If column exists, this will fail - that's okay, just continue
-- For production, you may want to check first:
-- SELECT COUNT(*) FROM pragma_table_info('users') WHERE name='user_type';

-- Add columns (will fail if they exist - that's expected)
ALTER TABLE users ADD COLUMN user_type TEXT DEFAULT 'customer';
ALTER TABLE users ADD COLUMN telegram_chat_id INTEGER;
ALTER TABLE users ADD COLUMN telegram_username TEXT;
ALTER TABLE users ADD COLUMN telegram_linked_at TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_telegram_chat_id ON users(telegram_chat_id);

-- Update existing users to have default user_type if NULL
UPDATE users SET user_type = 'customer' WHERE user_type IS NULL;
