import type { SupportedLanguage } from '@/src/lib/i18n'
import { translationsByLanguage, type TranslationKey } from '@/src/i18n/translations'

export type StaticTranslator = (
  key: TranslationKey,
  params?: Record<string, string | number>
) => string

function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text
  let result = text
  for (const [paramKey, paramValue] of Object.entries(params)) {
    result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue))
  }
  return result
}

export function getStaticTranslator(language: SupportedLanguage = 'uk'): StaticTranslator {
  const baseTranslations = translationsByLanguage[language] || translationsByLanguage.uk
  return (key, params) => {
    const value = baseTranslations[key] ?? key
    return interpolate(value, params)
  }
}
