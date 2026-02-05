-- Migration: Add WayForPay gateway support to donations table
-- Created: 2025-01-XX

-- Update the CHECK constraint to include 'wayforpay'
-- SQLite doesn't support ALTER TABLE to modify CHECK constraints directly,
-- so we need to recreate the table

-- Step 1: Create new table with updated constraint
CREATE TABLE IF NOT EXISTS donations_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL UNIQUE,
  gateway TEXT NOT NULL CHECK(gateway IN ('liqpay', 'monobank', 'wayforpay')),
  gateway_invoice_id TEXT,
  
  -- Donation details
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'UAH',
  description TEXT,
  
  -- Donor information (optional)
  donor_name TEXT,
  donor_email TEXT,
  donor_phone TEXT,
  
  -- Payment status
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN (
    'pending',
    'processing',
    'success',
    'failure',
    'expired',
    'cancelled'
  )),
  
  -- Gateway-specific data (JSON string with full gateway response)
  gateway_data TEXT,
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME,
  
  -- Metadata (JSON string for additional data)
  metadata TEXT
);

-- Step 2: Copy data from old table to new table
INSERT INTO donations_new 
SELECT * FROM donations;

-- Step 3: Drop old table
DROP TABLE donations;

-- Step 4: Rename new table to original name
ALTER TABLE donations_new RENAME TO donations;

-- Step 5: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_donations_order_id ON donations(order_id);
CREATE INDEX IF NOT EXISTS idx_donations_gateway ON donations(gateway);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_gateway_invoice_id ON donations(gateway_invoice_id);
CREATE INDEX IF NOT EXISTS idx_donations_paid_at ON donations(paid_at);
