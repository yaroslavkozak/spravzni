'use client'

import { useI18n } from '@/src/contexts/I18nContext'
import StaticTextOverImageSection from '@/src/components/static/StaticTextOverImageSection'

export default function TranslatedTextOverImageSection() {
  const { t } = useI18n()
  return <StaticTextOverImageSection t={t} />
}
