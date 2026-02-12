'use client'

import { useI18n } from '@/src/contexts/I18nContext'
import StaticContributionSectionFullImage from '@/src/components/static/StaticContributionSectionFullImage'

export default function TranslatedContributionSectionFullImage() {
  const { t } = useI18n()
  return <StaticContributionSectionFullImage t={t} />
}
