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

export function I18nProvider({
  children,
  initialLanguage = 'uk',
  initialTranslations = {},
}: I18nProviderProps) {
  const [language, setLanguageState] = useState<SupportedLanguage>(initialLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>(initialTranslations);
  const [loading, setLoading] = useState(false);
  const languageRef = useRef<SupportedLanguage>(initialLanguage);

  // Load translations from static files (bundled)
  const loadTranslations = useCallback(async (lang: SupportedLanguage) => {
    setLoading(true);
    const baseTranslations = translationsByLanguage[lang] || {};
    setTranslations(baseTranslations as Record<string, string>);

    try {
      const response = await fetch(`/api/translations?lang=${encodeURIComponent(lang)}`);
      if (response.ok) {
        const data = await response.json() as { translations?: Record<string, string> };
        if (languageRef.current === lang && data.translations) {
          setTranslations({
            ...(baseTranslations as Record<string, string>),
            ...data.translations,
          });
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

  // Initialize language from localStorage or cookie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('lang') as SupportedLanguage | null;
      const cookieLang = document.cookie
        .split('; ')
        .find((row) => row.startsWith('lang='))
        ?.split('=')[1] as SupportedLanguage | null;

      const lang = storedLang || cookieLang || initialLanguage;
      if (lang !== language) {
        setLanguageState(lang);
        languageRef.current = lang;
        document.documentElement.lang = lang;
        void loadTranslations(lang);
      } else if (Object.keys(translations).length === 0 && Object.keys(initialTranslations).length === 0) {
        // Load initial translations if not provided
        document.documentElement.lang = lang;
        void loadTranslations(lang);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

