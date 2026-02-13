'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/src/contexts/I18nContext'

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { language } = useI18n()

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = () => setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const videoPreviewSrc = isMobile
    ? language === 'uk'
      ? '/video-2-mobile-ua.png'
      : language === 'en'
        ? '/video-2-mobile-eng.png'
        : '/video-2.webp'
    : language === 'en'
      ? '/eng/video-2-banner.jpg'
      : '/video-2.webp'

  return (
    <section className="bg-[#FBFBF9] py-16 md:py-20 lg:py-24">
      <div className="w-full">
        <div className="relative w-full aspect-video overflow-hidden bg-[#FBFBF9]">
          {isPlaying ? (
            <iframe
              className="w-full h-full bg-[#FBFBF9]"
              src="https://www.youtube.com/embed/yecz6zovLO8?autoplay=1&rel=0"
              title="Spravzhni video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 w-full h-full"
              aria-label="Play video"
            >
              <img
                src={videoPreviewSrc}
                alt="Spravzhni video preview"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/20" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
