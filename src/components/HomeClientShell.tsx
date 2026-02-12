'use client'

import type { ReactNode } from 'react'
import SmoothScroll from '@/src/components/SmoothScroll'
import { PreloadProvider } from '@/src/contexts/PreloadContext'
import { I18nProvider } from '@/src/contexts/I18nContext'
import { SliderProvider } from '@/src/contexts/SliderContext'
import { ContactPopupProvider } from '@/src/contexts/ContactPopupContext'
import { VacationOptionsPopupProvider } from '@/src/contexts/VacationOptionsPopupContext'
import { ChatWindowProvider } from '@/src/contexts/ChatWindowContext'
import VacationOptionsPopupWrapper from '@/src/components/VacationOptionsPopupWrapper'
import ChatButton from '@/src/components/ChatButton'

interface HomeClientShellProps {
  children: ReactNode
}

export default function HomeClientShell({ children }: HomeClientShellProps) {
  return (
    <SmoothScroll>
      <PreloadProvider>
        <I18nProvider>
          <SliderProvider>
            <ContactPopupProvider>
              <VacationOptionsPopupProvider>
                <ChatWindowProvider>
                  {children}
                  <VacationOptionsPopupWrapper />
                  <ChatButton />
                </ChatWindowProvider>
              </VacationOptionsPopupProvider>
            </ContactPopupProvider>
          </SliderProvider>
        </I18nProvider>
      </PreloadProvider>
    </SmoothScroll>
  )
}
