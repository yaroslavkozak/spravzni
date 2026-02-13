'use client'

import { useEffect, useState } from 'react'
import MediaImage from '@/src/components/MediaImage'
import { useChatWindow } from '@/src/contexts/ChatWindowContext'
import { useRouterState } from '@tanstack/react-router'
import { useI18n } from '@/src/contexts/I18nContext'

export default function ChatButton() {
  const { openChat } = useChatWindow()
  const [isFooterVisible, setIsFooterVisible] = useState(false)
  const [shouldShowButton, setShouldShowButton] = useState(false)
  const { t } = useI18n()
  
  // Check if we're on an admin page
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isAdminPage = pathname.startsWith('/admin')

  // Check if 30% of imagine section has been scrolled past
  useEffect(() => {
    let rafId: number
    
    const checkScrollPosition = () => {
      const imagineSection = document.getElementById('imagine')
      if (!imagineSection) {
        // If imagine section doesn't exist, show button immediately
        setShouldShowButton(true)
      } else {
        const rect = imagineSection.getBoundingClientRect()
        // Show button when 30% of section has been scrolled past
        // This happens when: rect.top <= window.innerHeight - 0.3 * rect.height
        setShouldShowButton(rect.top <= window.innerHeight - 0.3 * rect.height)
      }

      const footer = document.getElementById('footer')
      if (!footer) {
        setIsFooterVisible(false)
        return
      }

      const footerRect = footer.getBoundingClientRect()
      const footerVisible = footerRect.top < window.innerHeight && footerRect.bottom > 0
      setIsFooterVisible(footerVisible)
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(checkScrollPosition)
    }

    // Check on mount
    checkScrollPosition()
    
    // Listen to scroll events
    window.addEventListener('scroll', onScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Don't render on admin pages
  if (isAdminPage) {
    return null
  }

  return (
    <button
      onClick={openChat}
      className={`fixed bottom-[24px] sm:bottom-[64px] right-[40px] z-50 flex items-center gap-2 sm:gap-3 group transition-opacity duration-300 px-4 py-2 xl:py-0 xl:h-12 xl:min-h-12 xl:max-h-12 ${
        !shouldShowButton || isFooterVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: '#11111133',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '32px',
        border: '1px solid #11111140',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
      aria-label={t('chat.button.aria')}
    >
      {/* <span className="font-montserrat text-[16px] font-normal whitespace-nowrap" style={{ color: '#FBFBF9' }}>
        <strong className="font-bold">{t('chat.button.question')}</strong> {t('chat.button.reply')}
      </span> */}
      <MediaImage
        src="/images/chat/floating-chat.svg"
        alt="Chat"
        width={24}
        height={24}
        className="object-contain w-6 h-6 sm:w-6 sm:h-6 group-hover:scale-110 transition-all flex-shrink-0"
      />
    </button>
  )
}

