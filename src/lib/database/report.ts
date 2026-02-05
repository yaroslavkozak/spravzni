/**
 * Database Helper Functions for Report Page
 * Functions for working with report_items and report_settings tables in D1
 */

import type { D1Database } from '../../../types/cloudflare';
import type {
  ReportItem,
  CreateReportItemInput,
  UpdateReportItemInput,
  ReportSettings,
  UpdateReportSettingsInput,
} from '../../../types/database';

// ============================================================================
// REPORT ITEMS
// ============================================================================

export async function getReportItems(db: D1Database): Promise<ReportItem[]> {
  const result = await db
    .prepare('SELECT * FROM report_items ORDER BY id ASC')
    .all<ReportItem>();
  return result.results || [];
}

export async function getReportItemById(
  db: D1Database,
  id: number
): Promise<ReportItem | null> {
  const result = await db
    .prepare('SELECT * FROM report_items WHERE id = ?')
    .bind(id)
    .first<ReportItem>();
  return result || null;
}

export async function createReportItem(
  db: D1Database,
  input: CreateReportItemInput
): Promise<ReportItem> {
  const result = await db
    .prepare(
      `INSERT INTO report_items (period, amount, category)
       VALUES (?, ?, ?) RETURNING *`
    )
    .bind(input.period, input.amount, input.category)
    .first<ReportItem>();

  if (!result) {
    throw new Error('Failed to create report item');
  }

  return result;
}

export async function updateReportItem(
  db: D1Database,
  id: number,
  input: UpdateReportItemInput
): Promise<ReportItem | null> {
  const updates: string[] = [];
  const values: unknown[] = [];

  if (input.period !== undefined) {
    updates.push('period = ?');
    values.push(input.period);
  }
  if (input.amount !== undefined) {
    updates.push('amount = ?');
    values.push(input.amount);
  }
  if (input.category !== undefined) {
    updates.push('category = ?');
    values.push(input.category);
  }

  if (updates.length === 0) {
    return getReportItemById(db, id);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const result = await db
    .prepare(`UPDATE report_items SET ${updates.join(', ')} WHERE id = ? RETURNING *`)
    .bind(...values)
    .first<ReportItem>();

  return result || null;
}

export async function deleteReportItem(db: D1Database, id: number): Promise<boolean> {
  const result = await db.prepare('DELETE FROM report_items WHERE id = ?').bind(id).run();
  return result.success && result.meta.changes > 0;
}

// ============================================================================
// REPORT SETTINGS
// ============================================================================

export async function getReportSettings(db: D1Database): Promise<ReportSettings | null> {
  const result = await db
    .prepare('SELECT * FROM report_settings WHERE id = 1')
    .first<ReportSettings>();
  return result || null;
}

export async function updateReportSettings(
  db: D1Database,
  input: UpdateReportSettingsInput
): Promise<ReportSettings> {
  const updatedDate = input.updated_date ?? null;
  const incomingAmount = input.incoming_amount ?? null;
  const outgoingAmount = input.outgoing_amount ?? null;

  const result = await db
    .prepare(
      `INSERT INTO report_settings (id, updated_date, incoming_amount, outgoing_amount)
       VALUES (1, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         updated_date = excluded.updated_date,
         incoming_amount = excluded.incoming_amount,
         outgoing_amount = excluded.outgoing_amount,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`
    )
    .bind(updatedDate, incomingAmount, outgoingAmount)
    .first<ReportSettings>();

  if (!result) {
    throw new Error('Failed to update report settings');
  }

  return result;
}
