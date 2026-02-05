-- Migration: Add form submissions table for storing all form submissions
-- Created: 2025-01-XX

-- Table for storing all form submissions (contact form, chat form, questionnaire, etc.)
CREATE TABLE IF NOT EXISTS form_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  -- Form identification
  form_type TEXT NOT NULL CHECK(form_type IN ('contact', 'chat', 'questionnaire')),
  
  -- Common contact information (may be null depending on form type)
  name TEXT,
  email TEXT,
  phone TEXT,
  
  -- Form-specific data stored as JSON
  -- For contact form: contactPreference, selectedInterests, comment, wantsPriceList
  -- For chat form: message, responseMethod
  -- For questionnaire: userIdentifier
  form_data TEXT NOT NULL, -- JSON string with all form-specific fields
  
  -- Additional metadata
  ip_address TEXT,          -- Client IP address (if available)
  user_agent TEXT,          -- User agent string (if available)
  referrer TEXT,            -- Referrer URL (if available)
  
  -- Status tracking
  status TEXT DEFAULT 'new' CHECK(status IN ('new', 'viewed', 'contacted', 'resolved', 'archived')),
  notes TEXT,               -- Internal notes about the submission
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  viewed_at DATETIME,       -- When submission was first viewed
  contacted_at DATETIME,    -- When user was first contacted
  resolved_at DATETIME      -- When submission was resolved
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_form_submissions_type ON form_submissions(form_type);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_form_submissions_email ON form_submissions(email);
CREATE INDEX IF NOT EXISTS idx_form_submissions_phone ON form_submissions(phone);
CREATE INDEX IF NOT EXISTS idx_form_submissions_type_status ON form_submissions(form_type, status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_desc ON form_submissions(created_at DESC);
