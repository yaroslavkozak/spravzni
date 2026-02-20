/**
 * Internationalization (i18n) System
 * Fetches translations from D1 database
 */

import { getText, getTextsByLanguage, getAllTexts } from './database';
import type { Text } from '../../types/database';
import type { D1Database, R2Bucket } from '../../types/cloudflare';

export type SupportedLanguage = 'uk' | 'en' | 'pl';

export interface TranslationMap {
  [key: string]: string;
}

export interface I18nConfig {
  defaultLanguage: SupportedLanguage;
  supportedLanguages: SupportedLanguage[];
  fallbackLanguage: SupportedLanguage;
}

const DEFAULT_CONFIG: I18nConfig = {
  defaultLanguage: 'uk',
  supportedLanguages: ['uk', 'en', 'pl'],
  fallbackLanguage: 'uk',
};

/**
 * I18n class for managing translations
 */
export class I18n {
  private translations: TranslationMap = {};
  private language: SupportedLanguage;
  private config: I18nConfig;
  private db: D1Database | null = null;

  constructor(
    language: SupportedLanguage = 'uk',
    config: Partial<I18nConfig> = {}
  ) {
    this.language = language;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize with database connection
   */
  setDatabase(db: D1Database | null) {
    this.db = db;
  }

  /**
   * Load translations from D1 database
   */
  async loadTranslations(language?: SupportedLanguage): Promise<void> {
    if (!this.db) {
      throw new Error('Database not set. Call setDatabase() first.');
    }

    const lang = language || this.language;
    const texts = await getTextsByLanguage(this.db, lang);

    // Convert to key-value map
    this.translations = {};
    for (const text of texts) {
      this.translations[text.key] = text.value;
    }
  }

  /**
   * Preload all translations for all languages
   */
  async preloadAllTranslations(): Promise<Record<SupportedLanguage, TranslationMap>> {
    if (!this.db) {
      throw new Error('Database not set. Call setDatabase() first.');
    }

    const allTranslations: Record<SupportedLanguage, TranslationMap> = {
      uk: {},
      en: {},
      pl: {},
    };

    for (const lang of this.config.supportedLanguages) {
      const texts = await getTextsByLanguage(this.db, lang);
      for (const text of texts) {
        allTranslations[lang as SupportedLanguage][text.key] = text.value;
      }
    }

    return allTranslations;
  }

  /**
   * Get translation by key
   */
  t(key: string, params?: Record<string, string | number>): string {
    let translation = this.translations[key];

    // Fallback to key if translation not found
    if (!translation) {
      // Try fallback language
      if (this.language !== this.config.fallbackLanguage) {
        // This would require loading fallback translations
        // For now, return key
        console.warn(`Translation missing for key: ${key} (language: ${this.language})`);
        return '';
      }
      return '';
    }

    // Replace parameters
    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        translation = translation.replace(
          new RegExp(`{{${paramKey}}}`, 'g'),
          String(paramValue)
        );
      }
    }

    return translation;
  }

  /**
   * Get translation with fallback
   */
  async tWithFallback(
    key: string,
    fallback: string,
    params?: Record<string, string | number>
  ): Promise<string> {
    if (!this.db) {
      return fallback;
    }

    try {
      const text = await getText(this.db, key, this.language);
      if (text) {
        let translation = text.value;
        if (params) {
          for (const [paramKey, paramValue] of Object.entries(params)) {
            translation = translation.replace(
              new RegExp(`{{${paramKey}}}`, 'g'),
              String(paramValue)
            );
          }
        }
        return translation;
      }
    } catch (error) {
      console.error(`Error fetching translation for ${key}:`, error);
    }

    return fallback;
  }

  /**
   * Set current language
   */
  setLanguage(language: SupportedLanguage) {
    this.language = language;
    // Reload translations for new language
    if (this.db) {
      this.loadTranslations(language).catch(console.error);
    }
  }

  /**
   * Get current language
   */
  getLanguage(): SupportedLanguage {
    return this.language;
  }

  /**
   * Check if translation exists
   */
  has(key: string): boolean {
    return key in this.translations;
  }

  /**
   * Get all translations for current language
   */
  getAll(): TranslationMap {
    return { ...this.translations };
  }
}

/**
 * Server-side i18n instance factory
 * Use this in Server Components or API routes
 */
export function createServerI18n(
  env: { DB: D1Database; BUCKET: R2Bucket },
  language: SupportedLanguage = 'uk'
): I18n {
  const i18n = new I18n(language);
  i18n.setDatabase(env.DB);
  return i18n;
}

/**
 * Get translation helper for server components
 */
export async function getTranslation(
  env: { DB: D1Database; BUCKET: R2Bucket },
  key: string,
  language: SupportedLanguage = 'uk',
  params?: Record<string, string | number>
): Promise<string> {
  try {
    const text = await getText(env.DB, key, language);
    
    if (!text) {
      return '';
    }

    let translation = text.value;
    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        translation = translation.replace(
          new RegExp(`{{${paramKey}}}`, 'g'),
          String(paramValue)
        );
      }
    }

    return translation;
  } catch (error) {
    console.error(`Error getting translation for ${key}:`, error);
    return '';
  }
}

/**
 * Get all translations for a language (server-side)
 */
export async function getTranslations(
  env: { DB: D1Database; BUCKET: R2Bucket },
  language: SupportedLanguage = 'uk'
): Promise<TranslationMap> {
  try {
    const texts = await getTextsByLanguage(env.DB, language);
    
    const translations: TranslationMap = {};
    for (const text of texts) {
      translations[text.key] = text.value;
    }
    
    return translations;
  } catch (error) {
    console.error(`Error getting translations for ${language}:`, error);
    return {};
  }
}

/**
 * Language detection utilities
 */
export function detectLanguage(
  acceptLanguage?: string | null,
  cookie?: string | null
): SupportedLanguage {
  // Check cookie first
  if (cookie) {
    const cookieLang = cookie.match(/lang=([a-z]{2})/)?.[1];
    if (cookieLang && ['uk', 'en', 'pl'].includes(cookieLang)) {
      return cookieLang as SupportedLanguage;
    }
  }

  // Check Accept-Language header
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().toLowerCase().substring(0, 2));

    for (const lang of languages) {
      if (lang === 'uk' || lang === 'en' || lang === 'pl') {
        return lang as SupportedLanguage;
      }
    }

    // Fallback to English for other languages
    if (languages.includes('en')) {
      return 'en';
    }
  }

  return 'uk'; // Default
}

/**
 * Format language code
 */
export function formatLanguageCode(code: string): SupportedLanguage {
  const normalized = code.toLowerCase().substring(0, 2);
  if (['uk', 'en', 'pl'].includes(normalized)) {
    return normalized as SupportedLanguage;
  }
  return 'uk';
}

