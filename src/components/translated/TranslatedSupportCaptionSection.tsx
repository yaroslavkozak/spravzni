'use client'

import { useI18n } from '@/src/contexts/I18nContext'
import StaticSupportCaptionSection from '@/src/components/static/StaticSupportCaptionSection'

export default function TranslatedSupportCaptionSection() {
  const { t } = useI18n()
  return <StaticSupportCaptionSection t={t} />
}
