'use client'

import type { ReactNode } from 'react'
import { PreloadProvider } from '@/src/contexts/PreloadContext'
import { I18nProvider } from '@/src/contexts/I18nContext'
import { ContactPopupProvider } from '@/src/contexts/ContactPopupContext'

interface PageClientShellProps {
  children: ReactNode
}

export default function PageClientShell({ children }: PageClientShellProps) {
  return (
    <PreloadProvider>
      <I18nProvider>
        <ContactPopupProvider>{children}</ContactPopupProvider>
      </I18nProvider>
    </PreloadProvider>
  )
}
