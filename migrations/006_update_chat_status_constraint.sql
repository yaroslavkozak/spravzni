-- Migration: Update chat_sessions status constraint to include 'queued'
-- Created: 2025-01-XX
-- Note: SQLite doesn't support ALTER TABLE to modify CHECK constraints directly
-- We need to recreate the table with the new constraint

-- Step 1: Create new table with updated constraint
CREATE TABLE IF NOT EXISTS chat_sessions_new (
  id TEXT PRIMARY KEY,
  user_identifier TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'waiting', 'closed', 'queued')),
  manager_assigned TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_name TEXT,
  user_email TEXT,
  user_phone TEXT,
  queue_position INTEGER DEFAULT NULL
);

-- Step 2: Copy data from old table
INSERT INTO chat_sessions_new 
SELECT * FROM chat_sessions;

-- Step 3: Drop old table
DROP TABLE chat_sessions;

-- Step 4: Rename new table
ALTER TABLE chat_sessions_new RENAME TO chat_sessions;

-- Step 5: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_identifier);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated ON chat_sessions(updated_at);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_message ON chat_sessions(last_message_at);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_queue ON chat_sessions(status, queue_position, created_at);
