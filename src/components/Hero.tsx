'use client'

import { useState, useEffect, useRef } from 'react'
import { usePreload } from '@/src/contexts/PreloadContext'
import { useI18n } from '@/src/contexts/I18nContext'
import { useHomepageComponent } from '@/src/hooks/useHomepageComponent'

export default function Hero() {
  const [scrollY, setScrollY] = useState(0)
  const [animationStarted, setAnimationStarted] = useState(false)
  const { setPreloadComplete } = usePreload()
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language } = useI18n()
  const { getImageUrl } = useHomepageComponent('hero', language)
  
  const backgroundImageUrl = getImageUrl('hero.background') || '/hero-main.jpg'

  useEffect(() => {
    // Start the continuous animation immediately
    setAnimationStarted(true)
    
    // Mark preload as complete when header becomes visible (around 50-60% of animation timeline)
    // This allows other components to know when preload is done
    const preloadTimer = setTimeout(() => {
      setPreloadComplete(true)
    }, 3000) // Header becomes visible around 3s into the 5.5s animation

    return () => {
      clearTimeout(preloadTimer)
    }
  }, [setPreloadComplete])

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        // Only apply parallax when section is in viewport
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          setScrollY(window.scrollY)
        }
      }
    }

    // Use requestAnimationFrame for smoother updates with Lenis
    let rafId: number
    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(handleScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Calculate parallax offset (background moves slower than scroll)
  // Using 0.5 multiplier for subtle parallax effect
  const parallaxOffset = scrollY * 0.5

  return (
    <section ref={sectionRef} className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image - Mobile: CMS or hero-main.jpg */}
      <div 
        className={`absolute inset-0 bg-cover bg-no-repeat hero-bg-reveal lg:hidden`}
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundPosition: 'bottom center',
          transform: animationStarted ? `translateY(${parallaxOffset}px)` : 'none',
          willChange: animationStarted ? 'transform' : 'auto',
        }}
      />
      {/* Background Image - Desktop: hero.webp */}
      <div 
        className={`absolute inset-0 bg-cover bg-no-repeat hero-bg-reveal hidden lg:block`}
        style={{
          backgroundImage: `url(/hero.webp)`,
          backgroundPosition: 'bottom center',
          transform: animationStarted ? `translateY(${parallaxOffset}px)` : 'none',
          willChange: animationStarted ? 'transform' : 'auto',
        }}
      />

      {/* Dark Background Overlay - fades out smoothly as part of continuous animation */}
      <div 
        className={`absolute inset-0 bg-black z-[1] hero-overlay-fade`}
      />

      {/* Semi-transparent overlay - #00000033 */}
      <div 
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ backgroundColor: '#00000033' }}
      />

      {/* Main Content Container - centered horizontally and vertically */}
      <div className="relative z-10 w-full max-w-[90rem] mx-auto min-h-[95vh] flex max-md:items-start md:items-center justify-center pb-16 md:pb-16 max-md:pt-[7.5rem] md:pt-[2.6875rem] xl:pt-[14rem]">
        <div className="flex flex-col items-center justify-center gap-0 md:gap-[2.5rem] lg:gap-0 xl:gap-[1.875rem] w-full max-w-[45.9375rem] px-0 md:px-[2.03125rem] lg:mt-[1.875rem]">
          {/* Main Heading Text - continuous smooth animation from large centered to final position */}
          <div className="flex flex-col items-center w-full hero-text-animation mt-[7.5rem] md:mt-[9.1875rem] lg:mt-[9.375rem] xl:mt-0 gap-2">
            <h1 className="font-alternates font-bold leading-[1.1em] tracking-[-2%] text-center drop-shadow-[0_0_25px_rgba(0,0,0,0.25)] whitespace-nowrap hero-text-fade-1 pl-[2.25rem] pr-[2.25rem] md:pl-[10.75rem] md:pr-[10.75rem] lg:pl-[17.8125rem] lg:pr-[17.8125rem] xl:pl-[25.625rem] xl:pr-[25.625rem]" style={{ color: 'rgba(251, 251, 249, 1)', fontSize: 'clamp(2.5rem, 2.5rem + (100vw - 23.4375rem) * 0.0407, 5.125rem)' }}>
              {t('hero.title.line1')}
            </h1>
            <h2 className="font-alternates leading-[1.1em] tracking-[-2%] text-center drop-shadow-[0_0_16px_rgba(0,0,0,0.4)] whitespace-nowrap hero-text-fade-2 pl-[2.40625rem] pr-[2.40625rem] md:pl-[10.96875rem] md:pr-[10.96875rem] lg:pl-[18.03125rem] lg:pr-[18.03125rem] xl:pl-[25.9375rem] xl:pr-[25.9375rem]" style={{ color: 'rgba(251, 251, 249, 1)', fontWeight: 275, fontSize: 'clamp(2.5rem, 2.5rem + (100vw - 23.4375rem) * 0.0407, 5.125rem)' }}>
              {t('hero.title.line2')}
            </h2>
          </div>

          {/* Bottom Content Section - appears sequentially */}
          <div className="flex flex-col items-center gap-0 w-full mt-[6.125rem] md:mt-[10.25rem] lg:mt-[7.625rem] xl:mt-[6.125rem]">
            {/* Text Content - appears first */}
            <div className="flex flex-col items-start md:items-center gap-4 hero-content-text w-[43.9375rem] md:w-[43.9375rem] lg:w-[43.9375rem] xl:w-[43.9375rem] 2xl:w-[56.25rem] max-w-full px-[2.5rem] md:mx-[2.03125rem] lg:-mt-[1.875rem]">
              <p className="text-white font-montserrat font-bold leading-[1.3] tracking-[-0.015em] xl:font-bold xl:text-[24px] xl:leading-[1.3] xl:tracking-[1.5%] text-left md:text-center min-[680px]:whitespace-nowrap drop-shadow-[0_0_20px_rgba(0,0,0,1)]" style={{ fontSize: 'clamp(1rem, 1rem + (100vw - 20rem) * 0.00714, 1.5rem)' }}>
                {t('hero.subtitle.main')}
              </p>
              
              <div className="flex items-center justify-start md:justify-center gap-2 flex-wrap md:flex-nowrap">
                <p className="text-white font-montserrat font-normal leading-[1.3] tracking-[-0.015em] xl:tracking-[1.5%] text-left md:text-center min-[680px]:whitespace-nowrap drop-shadow-[0_0_20px_rgba(0,0,0,1)]" style={{ fontSize: 'clamp(1rem, 1rem + (100vw - 20rem) * 0.00714, 1.5rem)' }}>
                  {t('hero.subtitle.donationInfo')}{' '}
                  <a
                    href="/report"
                    className="underline font-medium hover:opacity-80 transition-opacity"
                  >
                    {t('hero.subtitle.report')}
                  </a>
                </p>
              </div>
            </div>

            {/* CTA Button - appears second */}
            <button
              type="button"
              onClick={() => {
                if (typeof document !== 'undefined') {
                  const servicesSection = document.getElementById('services')
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }
              }}
              className="bg-[#28694D] rounded-[2rem] px-[4rem] py-[0.5rem] md:pt-[0.375rem] md:pb-[0.375rem] flex items-center justify-center gap-2 transition-all duration-300 hero-content-button w-[17.5rem] xs:w-[17.5rem] md:w-auto lg:w-[14.6875rem] mt-[5rem] mb-0"
            >
              <span className={`hover-bold-no-shift font-montserrat text-white font-normal leading-[1.3em] tracking-[1.5%] transition-all duration-300`} style={{ fontSize: '1.5rem' }} data-text={t('hero.cta.services')}>
                <span>{t('hero.cta.services')}</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Down Icon - positioned at bottom of section */}
      {/*
        <button
          type="button"
          onClick={() => {
            if (typeof document !== 'undefined') {
              const imagineSection = document.getElementById('imagine')
              if (imagineSection) {
                imagineSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }
          }}
          className="absolute bottom-[3.875rem] md:bottom-12 lg:bottom-[33px] xl:bottom-20 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white hover:text-white/80 transition-all duration-300 group cursor-pointer hero-content-scroll"
          aria-label="Scroll to next section"
        >
          <span className="text-xs md:text-sm font-montserrat font-normal opacity-70 group-hover:opacity-100 transition-opacity" style={{ fontSize: 'clamp(0.75rem, 0.6875rem + 0.1667vw, 0.875rem)' }}>
            {t('hero.scroll')}
          </span>
          <svg 
            className="w-6 h-6 md:w-7 md:h-7 animate-bounce drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </button>
      */}
    </section>
  )
}

