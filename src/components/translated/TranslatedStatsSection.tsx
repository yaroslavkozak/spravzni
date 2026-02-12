'use client'

import { useI18n } from '@/src/contexts/I18nContext'
import StaticStatsSection from '@/src/components/static/StaticStatsSection'

export default function TranslatedStatsSection() {
  const { t } = useI18n()
  return <StaticStatsSection t={t} />
}
