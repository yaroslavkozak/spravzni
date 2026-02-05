-- Migration: Add chat tables for live chat functionality
-- Created: 2025-01-XX

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id TEXT PRIMARY KEY,                    -- UUID or nanoid
  user_identifier TEXT,                    -- Session ID or user ID (can be anonymous)
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'waiting', 'closed')), -- Session status
  manager_assigned TEXT,                   -- Manager phone/email (optional, for future WhatsApp integration)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,                     -- UUID or nanoid
  session_id TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK(sender_type IN ('user', 'manager')), -- Message sender type
  message_text TEXT NOT NULL,
  whatsapp_message_id TEXT,                -- For future WhatsApp integration
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_identifier);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated ON chat_sessions(updated_at);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_message ON chat_sessions(last_message_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_created ON chat_messages(session_id, created_at);
