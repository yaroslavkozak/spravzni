'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { SupportedLanguage } from '@/src/lib/i18n';
import { translationsByLanguage } from '@/src/i18n/translations';

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  translations: Record<string, string>;
  loading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
  initialLanguage?: SupportedLanguage;
  initialTranslations?: Record<string, string>;
}

function getBaseTranslations(lang: SupportedLanguage): Record<string, string> {
  const base = translationsByLanguage[lang] || translationsByLanguage.uk;
  return (base || {}) as Record<string, string>;
}

export function I18nProvider({
  children,
  initialLanguage = 'uk',
  initialTranslations = {},
}: I18nProviderProps) {
  const [language, setLanguageState] = useState<SupportedLanguage>(initialLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>(() => {
    const base = getBaseTranslations(initialLanguage);
    return Object.keys(initialTranslations).length > 0 ? { ...base, ...initialTranslations } : base;
  });
  const [loading, setLoading] = useState(false);
  const languageRef = useRef<SupportedLanguage>(initialLanguage);

  // Load translations from static files (bundled) + API overrides from admin/translations
  const loadTranslations = useCallback(async (lang: SupportedLanguage) => {
    setLoading(true);
    const baseTranslations = getBaseTranslations(lang);
    setTranslations(baseTranslations);

    try {
      // Cache-bust to avoid stale responses after admin edits
      const url = `/api/translations?lang=${encodeURIComponent(lang)}&_=${Date.now()}`;
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) {
        const data = (await response.json()) as { translations?: Record<string, string> };
        const overrides = data.translations != null && typeof data.translations === 'object'
          ? data.translations
          : {};
        if (languageRef.current === lang) {
          setTranslations({ ...baseTranslations, ...overrides });
        }
      }
    } catch (error) {
      console.warn('Failed to load translation overrides:', error);
    } finally {
      if (languageRef.current === lang) {
        setLoading(false);
      }
    }
  }, []);

  // Set language and load translations
  const setLanguage = useCallback(
    (lang: SupportedLanguage) => {
      setLanguageState(lang);
      languageRef.current = lang;
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('lang', lang);
        document.cookie = `lang=${lang}; path=/; max-age=31536000`; // 1 year
        // keep <html lang=\"...\"> in sync for accessibility/SEO
        document.documentElement.lang = lang;
      }
      void loadTranslations(lang);
    },
    [loadTranslations]
  );

  const supportedLanguages = ['uk', 'en', 'pl'] as const;
  const normalizeLang = (raw: string | null | undefined): SupportedLanguage | null => {
    const lower = raw?.toLowerCase().trim();
    return lower && supportedLanguages.includes(lower as SupportedLanguage) ? (lower as SupportedLanguage) : null;
  };

  // Initialize language from localStorage or cookie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLang = normalizeLang(localStorage.getItem('lang'));
      const cookieLang = normalizeLang(
        document.cookie.split('; ').find((row) => row.startsWith('lang='))?.split('=')[1]
      );
      const lang = storedLang ?? cookieLang ?? initialLanguage;
      languageRef.current = lang;
      if (lang !== language) {
        setLanguageState(lang);
      }
      document.documentElement.lang = lang;
      // Always load to get base + API overrides (server render only has base)
      void loadTranslations(lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch translations when tab becomes visible (e.g. after editing in admin)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handler = () => {
      if (document.visibilityState === 'visible') {
        void loadTranslations(languageRef.current);
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [loadTranslations]);

  // Translation function
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let translation = translations[key] || key;

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
    },
    [translations]
  );

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translations,
        loading,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

