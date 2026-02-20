/**
 * Database Helper Functions
 * Functions for working with texts and media tables in D1
 */

import type { D1Database } from '../../types/cloudflare';
import type {
  Text,
  Translation,
  Media,
  HomepageMediaItem,
  HomepageMediaItemWithMedia,
  CreateTextInput,
  UpdateTextInput,
  CreateMediaInput,
  UpdateMediaInput,
  CreateHomepageMediaItemInput,
} from '../../types/database';

// ============================================================================
// TEXT FUNCTIONS
// ============================================================================

type TranslationLanguage = 'uk' | 'en' | 'pl' | 'ua';
type TranslationColumn = 'ua' | 'en' | 'pl';

interface TranslationRow {
  id: number;
  key: string;
  ua: string | null;
  en: string | null;
  pl: string | null;
  created_at: string;
  updated_at: string;
}

const LANGUAGE_TO_COLUMN: Record<TranslationLanguage, TranslationColumn> = {
  uk: 'ua',
  ua: 'ua',
  en: 'en',
  pl: 'pl',
};

function normalizeTranslationLanguage(language: string): TranslationLanguage {
  const normalized = language.toLowerCase();
  if (normalized === 'en' || normalized === 'pl' || normalized === 'ua' || normalized === 'uk') {
    return normalized;
  }
  return 'uk';
}

function getLanguageColumn(language: string): TranslationColumn {
  return LANGUAGE_TO_COLUMN[normalizeTranslationLanguage(language)];
}

function mapColumnToLanguage(column: TranslationColumn): TranslationLanguage {
  if (column === 'ua') return 'uk';
  return column;
}

function mapRowToText(row: TranslationRow, column: TranslationColumn): Text | null {
  const value = row[column];
  if (value === null) {
    return null;
  }

  return {
    id: row.id,
    key: row.key,
    language: mapColumnToLanguage(column),
    value,
    description: null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapRowToTranslation(row: TranslationRow): Translation {
  return {
    id: row.id,
    key: row.key,
    ua: row.ua,
    en: row.en,
    pl: row.pl,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * Get a text by key and language
 */
export async function getText(
  db: D1Database,
  key: string,
  language: string = 'uk'
): Promise<Text | null> {
  const languageColumn = getLanguageColumn(language);
  const result = await db
    .prepare('SELECT * FROM translations WHERE key = ?')
    .bind(key)
    .first<TranslationRow>();
  if (!result) {
    return null;
  }
  return mapRowToText(result, languageColumn);
}

/**
 * Get all texts for a specific language
 */
export async function getTextsByLanguage(
  db: D1Database,
  language: string = 'uk'
): Promise<Text[]> {
  const languageColumn = getLanguageColumn(language);
  const result = await db
    .prepare(`SELECT * FROM translations WHERE ${languageColumn} IS NOT NULL ORDER BY key`)
    .all<TranslationRow>();
  return result.results
    .map((row) => mapRowToText(row, languageColumn))
    .filter((entry): entry is Text => entry !== null);
}

/**
 * Get all translations for a specific key (all languages)
 */
export async function getTextsByKey(
  db: D1Database,
  key: string
): Promise<Text[]> {
  const result = await db
    .prepare('SELECT * FROM translations WHERE key = ?')
    .bind(key)
    .first<TranslationRow>();
  if (!result) {
    return [];
  }

  const entries: Text[] = [];
  for (const languageColumn of ['ua', 'en', 'pl'] as const) {
    const mapped = mapRowToText(result, languageColumn);
    if (mapped) {
      entries.push(mapped);
    }
  }
  return entries;
}

/**
 * Get all texts
 */
export async function getAllTexts(db: D1Database): Promise<Text[]> {
  const result = await db
    .prepare('SELECT * FROM translations ORDER BY key')
    .all<TranslationRow>();

  const entries: Text[] = [];
  for (const row of result.results) {
    for (const languageColumn of ['ua', 'en', 'pl'] as const) {
      const mapped = mapRowToText(row, languageColumn);
      if (mapped) {
        entries.push(mapped);
      }
    }
  }
  return entries;
}

/**
 * Get translation rows (key + ua/en/pl columns)
 */
export async function getAllTranslationRows(db: D1Database): Promise<Translation[]> {
  const result = await db
    .prepare('SELECT * FROM translations ORDER BY key')
    .all<TranslationRow>();
  return result.results.map(mapRowToTranslation);
}

/**
 * Create a new text entry
 */
export async function createText(
  db: D1Database,
  input: CreateTextInput
): Promise<Text> {
  const language = input.language || 'uk';
  const languageColumn = getLanguageColumn(language);
  const result = await db
    .prepare(
      `INSERT INTO translations (key, ${languageColumn})
       VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET
         ${languageColumn} = excluded.${languageColumn},
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`
    )
    .bind(input.key, input.value)
    .first<TranslationRow>();

  if (!result) {
    throw new Error('Failed to create text');
  }

  const mapped = mapRowToText(result, languageColumn);
  if (!mapped) {
    throw new Error('Failed to map created text');
  }

  return mapped;
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
  if (input.value === undefined) {
    return getText(db, key, language);
  }

  const languageColumn = getLanguageColumn(language);

  const result = await db
    .prepare(
      `UPDATE translations
       SET ${languageColumn} = ?, updated_at = CURRENT_TIMESTAMP
       WHERE key = ?
       RETURNING *`
    )
    .bind(input.value, key)
    .first<TranslationRow>();

  if (!result) {
    return null;
  }

  return mapRowToText(result, languageColumn);
}

/**
 * Delete a text entry
 */
export async function deleteText(
  db: D1Database,
  key: string,
  language: string
): Promise<boolean> {
  const languageColumn = getLanguageColumn(language);
  const result = await db
    .prepare(
      `UPDATE translations
       SET ${languageColumn} = NULL, updated_at = CURRENT_TIMESTAMP
       WHERE key = ?`
    )
    .bind(key)
    .run();

  if (!(result.success && result.meta.changes > 0)) {
    return false;
  }

  await db
    .prepare('DELETE FROM translations WHERE key = ? AND ua IS NULL AND en IS NULL AND pl IS NULL')
    .bind(key)
    .run();

  return true;
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

// ============================================================================
// HOMEPAGE MEDIA COLLECTION FUNCTIONS
// ============================================================================

/**
 * Get ordered homepage media items for a section with joined media metadata
 */
export async function getHomepageMediaItems(
  db: D1Database,
  section: string
): Promise<HomepageMediaItemWithMedia[]> {
  const result = await db
    .prepare(
      `SELECT hmi.*, m.type as media_type, m.r2_key as media_r2_key, m.alt_text as media_alt_text
       FROM homepage_media_items hmi
       INNER JOIN media m ON m.key = hmi.media_key
       WHERE hmi.section = ?
       ORDER BY hmi.sort_order ASC, hmi.id ASC`
    )
    .bind(section)
    .all<HomepageMediaItemWithMedia>();

  return result.results;
}

/**
 * Create homepage media item
 */
export async function createHomepageMediaItem(
  db: D1Database,
  input: CreateHomepageMediaItemInput
): Promise<HomepageMediaItem> {
  const sortOrder =
    input.sort_order ??
    ((await db
      .prepare('SELECT COALESCE(MAX(sort_order), -1) as max_order FROM homepage_media_items WHERE section = ?')
      .bind(input.section)
      .first<{ max_order: number | null }>())?.max_order ?? -1) + 1;

  const result = await db
    .prepare(
      `INSERT INTO homepage_media_items (section, media_key, sort_order)
       VALUES (?, ?, ?)
       RETURNING *`
    )
    .bind(input.section, input.media_key, sortOrder)
    .first<HomepageMediaItem>();

  if (!result) {
    throw new Error('Failed to create homepage media item');
  }

  return result;
}

/**
 * Delete homepage media item by id
 */
export async function deleteHomepageMediaItem(
  db: D1Database,
  id: number
): Promise<boolean> {
  const result = await db
    .prepare('DELETE FROM homepage_media_items WHERE id = ?')
    .bind(id)
    .run();

  return result.success && result.meta.changes > 0;
}

/**
 * Replace section order by ordered list of IDs
 */
export async function reorderHomepageMediaItems(
  db: D1Database,
  section: string,
  orderedIds: number[]
): Promise<void> {
  for (let index = 0; index < orderedIds.length; index += 1) {
    await db
      .prepare(
        `UPDATE homepage_media_items
         SET sort_order = ?, updated_at = CURRENT_TIMESTAMP
         WHERE section = ? AND id = ?`
      )
      .bind(index, section, orderedIds[index])
      .run();
  }
}

