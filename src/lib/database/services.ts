/**
 * Database Helper Functions for Services
 * Functions for working with services and service_options tables in D1
 */

import type { D1Database } from '../../../types/cloudflare';
import type {
  Service,
  ServiceOption,
  CreateServiceInput,
  UpdateServiceInput,
  CreateServiceOptionInput,
  UpdateServiceOptionInput,
} from '../../../types/database';

// ============================================================================
// SERVICE FUNCTIONS
// ============================================================================

/**
 * Get all services, optionally filtered by active status
 */
export async function getServices(
  db: D1Database,
  options: { activeOnly?: boolean } = {}
): Promise<Service[]> {
  let query = 'SELECT * FROM services';
  const params: unknown[] = [];

  if (options.activeOnly) {
    query += ' WHERE is_active = 1';
  }

  query += ' ORDER BY display_order ASC, id ASC';

  const result = await db.prepare(query).bind(...params).all<Service>();
  return result.results || [];
}

/**
 * Get count of active service options per service_id (for showing vacation options button)
 */
export async function getActiveServiceOptionCounts(
  db: D1Database
): Promise<Record<number, number>> {
  const result = await db
    .prepare(
      'SELECT service_id, COUNT(*) as count FROM service_options WHERE is_active = 1 GROUP BY service_id'
    )
    .all<{ service_id: number; count: number }>();
  const map: Record<number, number> = {};
  for (const row of result.results || []) {
    map[row.service_id] = Number(row.count);
  }
  return map;
}

/**
 * Get a service by ID
 */
export async function getServiceById(
  db: D1Database,
  id: number
): Promise<Service | null> {
  const result = await db
    .prepare('SELECT * FROM services WHERE id = ?')
    .bind(id)
    .first<Service>();
  return result || null;
}

/**
 * Create a new service
 */
export async function createService(
  db: D1Database,
  input: CreateServiceInput
): Promise<Service> {
  const paragraphs_uk = JSON.stringify(input.paragraphs_uk || []);
  const paragraphs_en = input.paragraphs_en
    ? JSON.stringify(input.paragraphs_en)
    : null;
  const display_order = input.display_order ?? 0;
  const primary_action = input.primary_action || 'none';
  const secondary_action = input.secondary_action || 'none';
  const show_primary_button = input.show_primary_button !== false;
  const is_active = input.is_active !== false;

  const result = await db
    .prepare(
      `INSERT INTO services (
        display_order, heading_uk, heading_en,
        paragraphs_uk, paragraphs_en,
        primary_button_text_uk, primary_button_text_en,
        secondary_button_text_uk, secondary_button_text_en,
        primary_action, secondary_action,
        image_key, overlay_text_uk, overlay_text_en,
        show_primary_button, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
    )
    .bind(
      display_order,
      input.heading_uk,
      input.heading_en || null,
      paragraphs_uk,
      paragraphs_en,
      input.primary_button_text_uk,
      input.primary_button_text_en || null,
      input.secondary_button_text_uk,
      input.secondary_button_text_en || null,
      primary_action,
      secondary_action,
      input.image_key || null,
      input.overlay_text_uk || null,
      input.overlay_text_en || null,
      show_primary_button ? 1 : 0,
      is_active ? 1 : 0
    )
    .first<Service>();

  if (!result) {
    throw new Error('Failed to create service');
  }

  return result;
}

/**
 * Update a service
 */
export async function updateService(
  db: D1Database,
  id: number,
  input: UpdateServiceInput
): Promise<Service | null> {
  const updates: string[] = [];
  const values: unknown[] = [];

  if (input.display_order !== undefined) {
    updates.push('display_order = ?');
    values.push(input.display_order);
  }
  if (input.heading_uk !== undefined) {
    updates.push('heading_uk = ?');
    values.push(input.heading_uk);
  }
  if (input.heading_en !== undefined) {
    updates.push('heading_en = ?');
    values.push(input.heading_en);
  }
  if (input.paragraphs_uk !== undefined) {
    updates.push('paragraphs_uk = ?');
    values.push(JSON.stringify(input.paragraphs_uk));
  }
  if (input.paragraphs_en !== undefined) {
    updates.push('paragraphs_en = ?');
    values.push(input.paragraphs_en ? JSON.stringify(input.paragraphs_en) : null);
  }
  if (input.primary_button_text_uk !== undefined) {
    updates.push('primary_button_text_uk = ?');
    values.push(input.primary_button_text_uk);
  }
  if (input.primary_button_text_en !== undefined) {
    updates.push('primary_button_text_en = ?');
    values.push(input.primary_button_text_en);
  }
  if (input.secondary_button_text_uk !== undefined) {
    updates.push('secondary_button_text_uk = ?');
    values.push(input.secondary_button_text_uk);
  }
  if (input.secondary_button_text_en !== undefined) {
    updates.push('secondary_button_text_en = ?');
    values.push(input.secondary_button_text_en);
  }
  if (input.primary_action !== undefined) {
    updates.push('primary_action = ?');
    values.push(input.primary_action);
  }
  if (input.secondary_action !== undefined) {
    updates.push('secondary_action = ?');
    values.push(input.secondary_action);
  }
  if (input.image_key !== undefined) {
    updates.push('image_key = ?');
    values.push(input.image_key);
  }
  if (input.overlay_text_uk !== undefined) {
    updates.push('overlay_text_uk = ?');
    values.push(input.overlay_text_uk);
  }
  if (input.overlay_text_en !== undefined) {
    updates.push('overlay_text_en = ?');
    values.push(input.overlay_text_en);
  }
  if (input.show_primary_button !== undefined) {
    updates.push('show_primary_button = ?');
    values.push(input.show_primary_button ? 1 : 0);
  }
  if (input.is_active !== undefined) {
    updates.push('is_active = ?');
    values.push(input.is_active ? 1 : 0);
  }

  if (updates.length === 0) {
    return getServiceById(db, id);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const result = await db
    .prepare(`UPDATE services SET ${updates.join(', ')} WHERE id = ? RETURNING *`)
    .bind(...values)
    .first<Service>();

  return result || null;
}

/**
 * Delete a service
 */
export async function deleteService(db: D1Database, id: number): Promise<boolean> {
  const result = await db.prepare('DELETE FROM services WHERE id = ?').bind(id).run();
  return result.success && result.meta.changes > 0;
}

// ============================================================================
// SERVICE OPTION FUNCTIONS
// ============================================================================

/**
 * Get all service options for a service
 */
export async function getServiceOptions(
  db: D1Database,
  serviceId: number,
  options: { activeOnly?: boolean } = {}
): Promise<ServiceOption[]> {
  let query = 'SELECT * FROM service_options WHERE service_id = ?';
  const params: unknown[] = [serviceId];

  if (options.activeOnly) {
    query += ' AND is_active = 1';
  }

  query += ' ORDER BY display_order ASC, id ASC';

  const result = await db.prepare(query).bind(...params).all<ServiceOption>();
  return result.results || [];
}

/**
 * Get a service option by ID
 */
export async function getServiceOptionById(
  db: D1Database,
  id: number
): Promise<ServiceOption | null> {
  const result = await db
    .prepare('SELECT * FROM service_options WHERE id = ?')
    .bind(id)
    .first<ServiceOption>();
  return result || null;
}

/**
 * Create a new service option
 */
export async function createServiceOption(
  db: D1Database,
  input: CreateServiceOptionInput
): Promise<ServiceOption> {
  const display_order = input.display_order ?? 0;
  const is_active = input.is_active !== false;

  const result = await db
    .prepare(
      `INSERT INTO service_options (
        service_id, display_order,
        title_uk, title_en,
        description_uk, description_en,
        image_path, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
    )
    .bind(
      input.service_id,
      display_order,
      input.title_uk,
      input.title_en || null,
      input.description_uk,
      input.description_en || null,
      input.image_path,
      is_active ? 1 : 0
    )
    .first<ServiceOption>();

  if (!result) {
    throw new Error('Failed to create service option');
  }

  return result;
}

/**
 * Update a service option
 */
export async function updateServiceOption(
  db: D1Database,
  id: number,
  input: UpdateServiceOptionInput
): Promise<ServiceOption | null> {
  const updates: string[] = [];
  const values: unknown[] = [];

  if (input.service_id !== undefined) {
    updates.push('service_id = ?');
    values.push(input.service_id);
  }
  if (input.display_order !== undefined) {
    updates.push('display_order = ?');
    values.push(input.display_order);
  }
  if (input.title_uk !== undefined) {
    updates.push('title_uk = ?');
    values.push(input.title_uk);
  }
  if (input.title_en !== undefined) {
    updates.push('title_en = ?');
    values.push(input.title_en);
  }
  if (input.description_uk !== undefined) {
    updates.push('description_uk = ?');
    values.push(input.description_uk);
  }
  if (input.description_en !== undefined) {
    updates.push('description_en = ?');
    values.push(input.description_en);
  }
  if (input.image_path !== undefined) {
    updates.push('image_path = ?');
    values.push(input.image_path);
  }
  if (input.is_active !== undefined) {
    updates.push('is_active = ?');
    values.push(input.is_active ? 1 : 0);
  }

  if (updates.length === 0) {
    return getServiceOptionById(db, id);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const result = await db
    .prepare(`UPDATE service_options SET ${updates.join(', ')} WHERE id = ? RETURNING *`)
    .bind(...values)
    .first<ServiceOption>();

  return result || null;
}

/**
 * Delete a service option
 */
export async function deleteServiceOption(
  db: D1Database,
  id: number
): Promise<boolean> {
  const result = await db
    .prepare('DELETE FROM service_options WHERE id = ?')
    .bind(id)
    .run();
  return result.success && result.meta.changes > 0;
}

/**
 * Parse paragraphs JSON string to array
 */
export function parseServiceParagraphs(paragraphs: string | null): string[] {
  if (!paragraphs) return [];
  try {
    return JSON.parse(paragraphs) as string[];
  } catch {
    return [];
  }
}
