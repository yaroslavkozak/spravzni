/**
 * Database Helper Functions for Report Page
 * Functions for working with report_items and report_settings tables in D1
 */

import type { SupportedLanguage } from '@/src/lib/i18n';
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
      `INSERT INTO report_items (period, amount, category, period_en, amount_en, category_en)
       VALUES (?, ?, ?, ?, ?, ?) RETURNING *`
    )
    .bind(
      input.period,
      input.amount,
      input.category,
      input.period_en ?? null,
      input.amount_en ?? null,
      input.category_en ?? null
    )
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
  if (input.period_en !== undefined) {
    updates.push('period_en = ?');
    values.push(input.period_en);
  }
  if (input.amount_en !== undefined) {
    updates.push('amount_en = ?');
    values.push(input.amount_en);
  }
  if (input.category_en !== undefined) {
    updates.push('category_en = ?');
    values.push(input.category_en);
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

export function localizeReportItem(
  item: ReportItem,
  language: SupportedLanguage
): { period: string; amount: string; category: string } {
  const useEn = language === 'en';
  return {
    period: (useEn && item.period_en) || item.period,
    amount: (useEn && item.amount_en) || item.amount,
    category: (useEn && item.category_en) || item.category,
  };
}

export function localizeReportSettings(
  settings: ReportSettings | null,
  language: SupportedLanguage
): {
  updatedDate: string | null;
  incomingAmount: string | null;
  outgoingAmount: string | null;
} {
  if (!settings) {
    return { updatedDate: null, incomingAmount: null, outgoingAmount: null };
  }
  const useEn = language === 'en';
  return {
    updatedDate: settings.updated_date,
    incomingAmount: (useEn && settings.incoming_amount_en) || settings.incoming_amount,
    outgoingAmount: (useEn && settings.outgoing_amount_en) || settings.outgoing_amount,
  };
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
  const incomingAmountEn = input.incoming_amount_en ?? null;
  const outgoingAmountEn = input.outgoing_amount_en ?? null;

  const result = await db
    .prepare(
      `INSERT INTO report_settings (id, updated_date, incoming_amount, outgoing_amount, incoming_amount_en, outgoing_amount_en)
       VALUES (1, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         updated_date = excluded.updated_date,
         incoming_amount = excluded.incoming_amount,
         outgoing_amount = excluded.outgoing_amount,
         incoming_amount_en = excluded.incoming_amount_en,
         outgoing_amount_en = excluded.outgoing_amount_en,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`
    )
    .bind(updatedDate, incomingAmount, outgoingAmount, incomingAmountEn, outgoingAmountEn)
    .first<ReportSettings>();

  if (!result) {
    throw new Error('Failed to update report settings');
  }

  return result;
}
