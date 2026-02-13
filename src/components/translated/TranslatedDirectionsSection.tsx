'use client'

import { useI18n } from '@/src/contexts/I18nContext'
import StaticDirectionsSection from '@/src/components/static/StaticDirectionsSection'

export default function TranslatedDirectionsSection() {
  const { t, language } = useI18n()
  return <StaticDirectionsSection t={t} language={language} />
}
