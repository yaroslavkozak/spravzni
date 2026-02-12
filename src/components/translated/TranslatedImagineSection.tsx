'use client'

import { useI18n } from '@/src/contexts/I18nContext'
import StaticImagineSection from '@/src/components/static/StaticImagineSection'

export default function TranslatedImagineSection() {
  const { t } = useI18n()
  return <StaticImagineSection t={t} />
}
