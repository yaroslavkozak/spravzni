-- Migration: Add admin users table for authentication
-- Created: 2025-01-XX

-- Table for admin users
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,        -- Hashed password (using bcrypt or similar)
  name TEXT,                          -- Admin name
  role TEXT DEFAULT 'admin' CHECK(role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT 1,        -- Can be deactivated without deleting
  last_login_at DATETIME,             -- Last successful login timestamp
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table for admin sessions (for session management)
CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,                 -- Session token (UUID)
  admin_user_id INTEGER NOT NULL,
  expires_at DATETIME NOT NULL,       -- Session expiration time
  ip_address TEXT,                    -- IP address of the session
  user_agent TEXT,                    -- User agent of the session
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user ON admin_sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(id);
