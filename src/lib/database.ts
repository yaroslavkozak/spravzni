/**
 * Database Helper Functions
 * Functions for working with texts and media tables in D1
 */

import type { D1Database } from '../../types/cloudflare';
import type {
  Text,
  Media,
  CreateTextInput,
  UpdateTextInput,
  CreateMediaInput,
  UpdateMediaInput,
} from '../../types/database';

// ============================================================================
// TEXT FUNCTIONS
// ============================================================================

/**
 * Get a text by key and language
 */
export async function getText(
  db: D1Database,
  key: string,
  language: string = 'uk'
): Promise<Text | null> {
  const result = await db
    .prepare('SELECT * FROM texts WHERE key = ? AND language = ?')
    .bind(key, language)
    .first<Text>();
  return result || null;
}

/**
 * Get all texts for a specific language
 */
export async function getTextsByLanguage(
  db: D1Database,
  language: string = 'uk'
): Promise<Text[]> {
  const result = await db
    .prepare('SELECT * FROM texts WHERE language = ? ORDER BY key')
    .bind(language)
    .all<Text>();
  return result.results;
}

/**
 * Get all translations for a specific key (all languages)
 */
export async function getTextsByKey(
  db: D1Database,
  key: string
): Promise<Text[]> {
  const result = await db
    .prepare('SELECT * FROM texts WHERE key = ? ORDER BY language')
    .bind(key)
    .all<Text>();
  return result.results;
}

/**
 * Get all texts
 */
export async function getAllTexts(db: D1Database): Promise<Text[]> {
  const result = await db
    .prepare('SELECT * FROM texts ORDER BY key, language')
    .all<Text>();
  return result.results;
}

/**
 * Create a new text entry
 */
export async function createText(
  db: D1Database,
  input: CreateTextInput
): Promise<Text> {
  const language = input.language || 'uk';
  const result = await db
    .prepare(
      'INSERT INTO texts (key, language, value, description) VALUES (?, ?, ?, ?) RETURNING *'
    )
    .bind(input.key, language, input.value, input.description || null)
    .first<Text>();

  if (!result) {
    throw new Error('Failed to create text');
  }

  return result;
}

/**
 * Update a text entry
 */
export async function updateText(
  db: D1Database,
  key: string,
  language: string,
  input: UpdateTextInput
): Promise<Text | null> {
  const updates: string[] = [];
  const values: unknown[] = [];

  if (input.value !== undefined) {
    updates.push('value = ?');
    values.push(input.value);
  }
  if (input.description !== undefined) {
    updates.push('description = ?');
    values.push(input.description);
  }

  if (updates.length === 0) {
    return getText(db, key, language);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(key, language);

  const result = await db
    .prepare(
      `UPDATE texts SET ${updates.join(', ')} WHERE key = ? AND language = ? RETURNING *`
    )
    .bind(...values)
    .first<Text>();

  return result || null;
}

/**
 * Delete a text entry
 */
export async function deleteText(
  db: D1Database,
  key: string,
  language: string
): Promise<boolean> {
  const result = await db
    .prepare('DELETE FROM texts WHERE key = ? AND language = ?')
    .bind(key, language)
    .run();

  return result.success && result.meta.changes > 0;
}

/**
 * Bulk create texts
 */
export async function createTexts(
  db: D1Database,
  texts: CreateTextInput[]
): Promise<Text[]> {
  const results: Text[] = [];

  for (const text of texts) {
    try {
      const created = await createText(db, text);
      results.push(created);
    } catch (error) {
      console.error(`Failed to create text ${text.key}:`, error);
    }
  }

  return results;
}

// ============================================================================
// MEDIA FUNCTIONS
// ============================================================================

/**
 * Get media by key
 */
export async function getMedia(
  db: D1Database,
  key: string
): Promise<Media | null> {
  const result = await db
    .prepare('SELECT * FROM media WHERE key = ?')
    .bind(key)
    .first<Media>();
  return result || null;
}

/**
 * Get all media by type
 */
export async function getMediaByType(
  db: D1Database,
  type: 'image' | 'video'
): Promise<Media[]> {
  const result = await db
    .prepare('SELECT * FROM media WHERE type = ? ORDER BY created_at DESC')
    .bind(type)
    .all<Media>();
  return result.results;
}

/**
 * Get all public media
 */
export async function getPublicMedia(db: D1Database): Promise<Media[]> {
  const result = await db
    .prepare('SELECT * FROM media WHERE is_public = 1 ORDER BY created_at DESC')
    .all<Media>();
  return result.results;
}

/**
 * Get all media
 */
export async function getAllMedia(db: D1Database): Promise<Media[]> {
  const result = await db
    .prepare('SELECT * FROM media ORDER BY created_at DESC')
    .all<Media>();
  return result.results;
}

/**
 * Create a new media entry
 */
export async function createMedia(
  db: D1Database,
  input: CreateMediaInput
): Promise<Media> {
  const metadata = input.metadata ? JSON.stringify(input.metadata) : null;
  const r2_bucket = input.r2_bucket || 'spravzni-storage';
  const is_public = input.is_public !== undefined ? input.is_public : true;

  const result = await db
    .prepare(
      `INSERT INTO media (key, type, r2_key, r2_bucket, mime_type, size, width, height, alt_text, description, metadata, is_public)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
    )
    .bind(
      input.key,
      input.type,
      input.r2_key,
      r2_bucket,
      input.mime_type || null,
      input.size || null,
      input.width || null,
      input.height || null,
      input.alt_text || null,
      input.description || null,
      metadata,
      is_public ? 1 : 0
    )
    .first<Media>();

  if (!result) {
    throw new Error('Failed to create media');
  }

  return result;
}

/**
 * Update a media entry
 */
export async function updateMedia(
  db: D1Database,
  key: string,
  input: UpdateMediaInput
): Promise<Media | null> {
  const updates: string[] = [];
  const values: unknown[] = [];

  if (input.r2_key !== undefined) {
    updates.push('r2_key = ?');
    values.push(input.r2_key);
  }
  if (input.mime_type !== undefined) {
    updates.push('mime_type = ?');
    values.push(input.mime_type);
  }
  if (input.size !== undefined) {
    updates.push('size = ?');
    values.push(input.size);
  }
  if (input.width !== undefined) {
    updates.push('width = ?');
    values.push(input.width);
  }
  if (input.height !== undefined) {
    updates.push('height = ?');
    values.push(input.height);
  }
  if (input.alt_text !== undefined) {
    updates.push('alt_text = ?');
    values.push(input.alt_text);
  }
  if (input.description !== undefined) {
    updates.push('description = ?');
    values.push(input.description);
  }
  if (input.metadata !== undefined) {
    updates.push('metadata = ?');
    values.push(JSON.stringify(input.metadata));
  }
  if (input.is_public !== undefined) {
    updates.push('is_public = ?');
    values.push(input.is_public ? 1 : 0);
  }

  if (updates.length === 0) {
    return getMedia(db, key);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(key);

  const result = await db
    .prepare(
      `UPDATE media SET ${updates.join(', ')} WHERE key = ? RETURNING *`
    )
    .bind(...values)
    .first<Media>();

  return result || null;
}

/**
 * Delete a media entry
 */
export async function deleteMedia(
  db: D1Database,
  key: string
): Promise<boolean> {
  const result = await db
    .prepare('DELETE FROM media WHERE key = ?')
    .bind(key)
    .run();

  return result.success && result.meta.changes > 0;
}

/**
 * Get media metadata as parsed JSON
 */
export function parseMediaMetadata(media: Media): Record<string, unknown> | null {
  if (!media.metadata) {
    return null;
  }

  try {
    return JSON.parse(media.metadata) as Record<string, unknown>;
  } catch {
    return null;
  }
}

