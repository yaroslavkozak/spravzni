'use client'

import { useI18n } from '@/src/contexts/I18nContext'
import StaticFooterSection from '@/src/components/static/StaticFooterSection'

export default function TranslatedFooterSection() {
  const { t } = useI18n()
  return <StaticFooterSection t={t} />
}
