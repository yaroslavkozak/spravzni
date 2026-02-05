/**
 * Database Helper Functions for Donations
 * Functions for working with donations table in D1
 */

import type { D1Database } from '../../../types/cloudflare';

export interface Donation {
  id: number;
  order_id: string;
  gateway: 'liqpay' | 'monobank' | 'wayforpay';
  gateway_invoice_id: string | null;
  amount: number;
  currency: string;
  description: string | null;
  donor_name: string | null;
  donor_email: string | null;
  donor_phone: string | null;
  status: 'pending' | 'processing' | 'success' | 'failure' | 'expired' | 'cancelled';
  gateway_data: string | null;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
  metadata: string | null;
}

export interface CreateDonationInput {
  order_id: string;
  gateway: 'liqpay' | 'monobank' | 'wayforpay';
  gateway_invoice_id?: string | null;
  amount: number;
  currency: string;
  description?: string | null;
  donor_name?: string | null;
  donor_email?: string | null;
  donor_phone?: string | null;
  status?: 'pending' | 'processing' | 'success' | 'failure' | 'expired' | 'cancelled';
  gateway_data?: any | null;
  metadata?: any | null;
}

/**
 * Create a new donation record
 */
export async function createDonation(
  db: D1Database,
  donation: CreateDonationInput
): Promise<Donation> {
  try {
    const result = await db
      .prepare(
        `INSERT INTO donations (
          order_id, gateway, gateway_invoice_id, amount, currency, description,
          donor_name, donor_email, donor_phone, status, gateway_data, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        donation.order_id,
        donation.gateway,
        donation.gateway_invoice_id || null,
        donation.amount,
        donation.currency,
        donation.description || null,
        donation.donor_name || null,
        donation.donor_email || null,
        donation.donor_phone || null,
        donation.status || 'pending',
        donation.gateway_data ? JSON.stringify(donation.gateway_data) : null,
        donation.metadata ? JSON.stringify(donation.metadata) : null
      )
      .run();
    
    if (!result.success) {
      throw new Error(`Failed to create donation. Gateway: ${donation.gateway}. This might indicate the database migration for WayForPay hasn't been applied.`);
    }
  } catch (error) {
    // Re-throw with more context if it's a constraint violation
    if (error instanceof Error && error.message.includes('CHECK constraint')) {
      throw new Error(`Database constraint error: The '${donation.gateway}' gateway may not be allowed. Please ensure migration 007_add_wayforpay_gateway.sql has been applied. Original error: ${error.message}`);
    }
    throw error;
  }
  
  // Fetch the created donation
  const created = await getDonationByOrderId(db, donation.order_id);
  if (!created) {
    throw new Error('Failed to retrieve created donation');
  }
  
  return created;
}

/**
 * Get donation by order ID
 */
export async function getDonationByOrderId(
  db: D1Database,
  orderId: string
): Promise<Donation | null> {
  const result = await db
    .prepare('SELECT * FROM donations WHERE order_id = ?')
    .bind(orderId)
    .first<Donation>();
  
  return result || null;
}

/**
 * Get donation by gateway invoice ID
 */
export async function getDonationByGatewayInvoiceId(
  db: D1Database,
  gateway: 'liqpay' | 'monobank' | 'wayforpay',
  invoiceId: string
): Promise<Donation | null> {
  const result = await db
    .prepare('SELECT * FROM donations WHERE gateway = ? AND gateway_invoice_id = ?')
    .bind(gateway, invoiceId)
    .first<Donation>();
  
  return result || null;
}

/**
 * Update donation status
 */
export async function updateDonationStatus(
  db: D1Database,
  orderId: string,
  status: Donation['status'],
  gatewayData?: any,
  gatewayInvoiceId?: string
): Promise<boolean> {
  const updates: string[] = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
  const values: any[] = [status];
  
  if (status === 'success') {
    updates.push('paid_at = CURRENT_TIMESTAMP');
  }
  
  if (gatewayData) {
    updates.push('gateway_data = ?');
    values.push(JSON.stringify(gatewayData));
  }
  
  if (gatewayInvoiceId) {
    updates.push('gateway_invoice_id = ?');
    values.push(gatewayInvoiceId);
  }
  
  values.push(orderId);
  
  const result = await db
    .prepare(`UPDATE donations SET ${updates.join(', ')} WHERE order_id = ?`)
    .bind(...values)
    .run();
  
  return result.success;
}
