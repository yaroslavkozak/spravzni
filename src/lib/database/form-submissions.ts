/**
 * Database Helper Functions for Form Submissions
 * Functions for working with form_submissions table in D1
 */

import type { D1Database } from '../../../types/cloudflare';

export type FormType = 'contact' | 'chat' | 'questionnaire';
export type FormStatus = 'new' | 'viewed' | 'contacted' | 'resolved' | 'archived';

export interface FormSubmission {
  id: number;
  form_type: FormType;
  name: string | null;
  email: string | null;
  phone: string | null;
  form_data: string; // JSON string
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  status: FormStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  viewed_at: string | null;
  contacted_at: string | null;
  resolved_at: string | null;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  contactPreference: 'phone' | 'whatsapp' | 'email' | null;
  selectedInterests: string[];
  comment?: string;
  wantsPriceList: boolean;
}

export interface ChatFormData {
  message: string;
  responseMethod: 'whatsapp' | 'phone' | 'email' | null;
  phone?: string;
  email?: string;
}

export interface QuestionnaireFormData {
  name: string;
  email: string;
  phone: string;
  userIdentifier: string;
}

export interface CreateFormSubmissionInput {
  form_type: FormType;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  form_data: ContactFormData | ChatFormData | QuestionnaireFormData;
  ip_address?: string | null;
  user_agent?: string | null;
  referrer?: string | null;
  status?: FormStatus;
  notes?: string | null;
}

/**
 * Create a new form submission
 */
export async function createFormSubmission(
  db: D1Database,
  submission: CreateFormSubmissionInput
): Promise<FormSubmission> {
  const result = await db
    .prepare(
      `INSERT INTO form_submissions (
        form_type, name, email, phone, form_data,
        ip_address, user_agent, referrer, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      submission.form_type,
      submission.name || null,
      submission.email || null,
      submission.phone || null,
      JSON.stringify(submission.form_data),
      submission.ip_address || null,
      submission.user_agent || null,
      submission.referrer || null,
      submission.status || 'new',
      submission.notes || null
    )
    .run();

  if (!result.success) {
    throw new Error('Failed to create form submission');
  }

  // Fetch the created submission
  const created = await getFormSubmissionById(db, result.meta.last_row_id);
  if (!created) {
    throw new Error('Failed to retrieve created form submission');
  }

  return created;
}

/**
 * Get form submission by ID
 */
export async function getFormSubmissionById(
  db: D1Database,
  id: number
): Promise<FormSubmission | null> {
  const result = await db
    .prepare('SELECT * FROM form_submissions WHERE id = ?')
    .bind(id)
    .first<FormSubmission>();

  return result || null;
}

/**
 * Get all form submissions with optional filters
 */
export async function getFormSubmissions(
  db: D1Database,
  options: {
    form_type?: FormType;
    status?: FormStatus;
    limit?: number;
    offset?: number;
    orderBy?: 'created_at' | 'updated_at';
    orderDirection?: 'ASC' | 'DESC';
  } = {}
): Promise<FormSubmission[]> {
  const {
    form_type,
    status,
    limit = 100,
    offset = 0,
    orderBy = 'created_at',
    orderDirection = 'DESC',
  } = options;

  let query = 'SELECT * FROM form_submissions WHERE 1=1';
  const params: any[] = [];

  if (form_type) {
    query += ' AND form_type = ?';
    params.push(form_type);
  }

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ` ORDER BY ${orderBy} ${orderDirection} LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const result = await db.prepare(query).bind(...params).all<FormSubmission>();

  return result.results || [];
}

/**
 * Get form submissions by email
 */
export async function getFormSubmissionsByEmail(
  db: D1Database,
  email: string
): Promise<FormSubmission[]> {
  const result = await db
    .prepare('SELECT * FROM form_submissions WHERE email = ? ORDER BY created_at DESC')
    .bind(email)
    .all<FormSubmission>();

  return result.results || [];
}

/**
 * Get form submissions by phone
 */
export async function getFormSubmissionsByPhone(
  db: D1Database,
  phone: string
): Promise<FormSubmission[]> {
  const result = await db
    .prepare('SELECT * FROM form_submissions WHERE phone = ? ORDER BY created_at DESC')
    .bind(phone)
    .all<FormSubmission>();

  return result.results || [];
}

/**
 * Update form submission status
 */
export async function updateFormSubmissionStatus(
  db: D1Database,
  id: number,
  status: FormStatus,
  notes?: string | null
): Promise<boolean> {
  const updates: string[] = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
  const values: any[] = [status];

  // Set timestamp based on status
  if (status === 'viewed' && !updates.includes('viewed_at')) {
    updates.push('viewed_at = COALESCE(viewed_at, CURRENT_TIMESTAMP)');
  }
  if (status === 'contacted' && !updates.includes('contacted_at')) {
    updates.push('contacted_at = COALESCE(contacted_at, CURRENT_TIMESTAMP)');
  }
  if (status === 'resolved' && !updates.includes('resolved_at')) {
    updates.push('resolved_at = COALESCE(resolved_at, CURRENT_TIMESTAMP)');
  }

  if (notes !== undefined) {
    updates.push('notes = ?');
    values.push(notes);
  }

  values.push(id);

  const result = await db
    .prepare(`UPDATE form_submissions SET ${updates.join(', ')} WHERE id = ?`)
    .bind(...values)
    .run();

  return result.success;
}

/**
 * Get form submission count by status
 */
export async function getFormSubmissionCounts(
  db: D1Database,
  form_type?: FormType
): Promise<Record<FormStatus, number>> {
  let query = 'SELECT status, COUNT(*) as count FROM form_submissions';
  const params: any[] = [];

  if (form_type) {
    query += ' WHERE form_type = ?';
    params.push(form_type);
  }

  query += ' GROUP BY status';

  const result = await db.prepare(query).bind(...params).all<{ status: FormStatus; count: number }>();

  const counts: Record<FormStatus, number> = {
    new: 0,
    viewed: 0,
    contacted: 0,
    resolved: 0,
    archived: 0,
  };

  for (const row of result.results || []) {
    counts[row.status] = row.count;
  }

  return counts;
}
