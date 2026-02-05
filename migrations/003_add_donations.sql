-- Migration: Add donations table for tracking payment gateway donations
-- Created: 2025-01-XX

-- Table for tracking donations from LiqPay and Monobank
CREATE TABLE IF NOT EXISTS donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL UNIQUE,           -- Unique order identifier
  gateway TEXT NOT NULL CHECK(gateway IN ('liqpay', 'monobank')),
  gateway_invoice_id TEXT,                 -- Invoice ID from payment gateway (Monobank invoiceId, LiqPay transaction_id)
  
  -- Donation details
  amount INTEGER NOT NULL,                 -- Amount in kopecks/minimum units (100 UAH = 10000 kopecks)
  currency TEXT NOT NULL DEFAULT 'UAH',    -- Currency code (UAH, USD, EUR)
  description TEXT,
  
  -- Donor information (optional)
  donor_name TEXT,
  donor_email TEXT,
  donor_phone TEXT,
  
  -- Payment status
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN (
    'pending',      -- Payment initiated, waiting for user
    'processing',   -- Payment being processed by gateway
    'success',      -- Payment successful
    'failure',      -- Payment failed
    'expired',      -- Payment expired
    'cancelled'     -- Payment cancelled
  )),
  
  -- Gateway-specific data (JSON string with full gateway response)
  gateway_data TEXT,
  
  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME,                        -- When payment was completed (status = success)
  
  -- Metadata (JSON string for additional data)
  metadata TEXT
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_donations_order_id ON donations(order_id);
CREATE INDEX IF NOT EXISTS idx_donations_gateway ON donations(gateway);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_gateway_invoice_id ON donations(gateway_invoice_id);
CREATE INDEX IF NOT EXISTS idx_donations_paid_at ON donations(paid_at);
