'use client'

import { useI18n } from '@/src/contexts/I18nContext'
import StaticAboutSection from '@/src/components/static/StaticAboutSection'

export default function TranslatedAboutSection() {
  const { t } = useI18n()
  return <StaticAboutSection t={t} />
}
