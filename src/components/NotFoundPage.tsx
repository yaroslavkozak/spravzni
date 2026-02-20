'use client'

import { useEffect, useMemo, useState } from 'react'
import type { SupportedLanguage } from '@/src/lib/i18n'

type TranslationMap = Record<string, string>

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['uk', 'en', 'pl']

function normalizeLanguage(raw: string | null | undefined): SupportedLanguage | null {
  const value = raw?.toLowerCase().trim()
  if (value && SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)) {
    return value as SupportedLanguage
  }
  return null
}

function getInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') {
    return 'uk'
  }

  const stored = normalizeLanguage(window.localStorage.getItem('lang'))
  const cookieLang = normalizeLanguage(
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('lang='))
      ?.split('=')[1]
  )
  return stored || cookieLang || 'uk'
}

export default function NotFoundPage() {
  const [language, setLanguage] = useState<SupportedLanguage>('uk')
  const [translations, setTranslations] = useState<TranslationMap>({})

  useEffect(() => {
    const detectedLanguage = getInitialLanguage()
    setLanguage(detectedLanguage)

    const load = async () => {
      try {
        const response = await fetch(`/api/translations?lang=${encodeURIComponent(detectedLanguage)}`, {
          cache: 'no-store',
        })
        if (!response.ok) {
          return
        }
        const data = (await response.json()) as { translations?: TranslationMap }
        if (data.translations && typeof data.translations === 'object') {
          setTranslations(data.translations)
        }
      } catch {
        // Keep key fallback if API is unavailable.
      }
    }

    void load()
  }, [])

  const t = useMemo(
    () => (key: string) => translations[key] ?? '',
    [translations]
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FBFBF9] px-4" lang={language}>
      <div className="text-center">
        <h1 className="font-alternates text-[#111111] text-[48px] md:text-[64px] lg:text-[80px] font-medium leading-[1.1em] tracking-[-2%] mb-4">
          {t('404.title')}
        </h1>
        <p className="font-montserrat text-[#404040] text-[18px] md:text-[20px] lg:text-[24px] leading-[1.5em] tracking-[0.5%] mb-8">
          {t('404.description')}
        </p>
        <a
          href="/"
          className="inline-block font-montserrat text-[#28694D] text-[16px] md:text-[18px] font-medium hover:underline transition-colors"
        >
          {t('404.backToHome')}
        </a>
      </div>
    </div>
  )
}
