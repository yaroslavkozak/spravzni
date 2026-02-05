'use client'

import MediaImage from '@/src/components/MediaImage'
import { useSlider } from '@/src/contexts/SliderContext'
import { useI18n } from '@/src/contexts/I18nContext'
import { useHomepageComponent } from '@/src/hooks/useHomepageComponent'

export default function AboutSection() {
  const { navigateToSlide } = useSlider()
  const { t, language } = useI18n()
  const { getImageUrl } = useHomepageComponent('about', language)
  
  const quoteIconUrl = getImageUrl('about.quote_icon') || '/images/about/lapki.svg'

  const handleContinueClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    // Navigate to second slide (index 1)
    navigateToSlide(1)
    // Scroll to top of the slider section
    const sliderSection = document.getElementById('mi')
    if (sliderSection) {
      sliderSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section id="about" className="bg-white pt-0 pb-16 md:py-20 lg:py-24">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20">
          {/* Left Column */}
          <div className="relative w-full">
            {/* First Paragraph */}
            <div className="relative z-10 mb-4 sm:mb-5 md:mb-6 flex items-start gap-2 sm:gap-3">
              <span className="flex-shrink-0 mt-1">
                <MediaImage
                  src={quoteIconUrl}
                  alt="Quote mark"
                  width={108}
                  height={108}
                  className="object-contain w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
                />
              </span>
              <p className="font-montserrat text-[#111111] text-[16px] leading-[1.5em] tracking-[0.5%] flex-1 min-w-0">
                {t('about.p1')}
              </p>
            </div>

            {/* Second Paragraph */}
            <p className="relative z-10 font-montserrat text-[#111111] text-[16px] leading-[1.5em] tracking-[0.5%] ml-[calc(4rem+0.5rem)] sm:ml-[calc(5rem+0.75rem)] md:ml-[calc(6rem+0.75rem)] lg:ml-[calc(7rem+0.75rem)]">
              {t('about.p2')}
            </p>
          </div>

          {/* Right Column */}
          <div className="flex flex-col w-full">
            {/* First Paragraph */}
            <p className="font-montserrat text-[#111111] text-[16px] leading-[1.5em] tracking-[0.5%] mb-4 sm:mb-5 md:mb-6 max-w-[calc(100%-4rem-0.5rem)] sm:max-w-[calc(100%-5rem-0.75rem)] md:max-w-[calc(100%-6rem-0.75rem)] lg:max-w-[calc(100%-7rem-0.75rem)]">
              {t('about.p3')}
            </p>

            {/* Second Paragraph */}
            <p className="font-montserrat text-[#111111] text-[16px] leading-[1.5em] tracking-[0.5%] mb-6 sm:mb-7 md:mb-8 max-w-[calc(100%-4rem-0.5rem)] sm:max-w-[calc(100%-5rem-0.75rem)] md:max-w-[calc(100%-6rem-0.75rem)] lg:max-w-[calc(100%-7rem-0.75rem)]">
              {t('about.p4')}
            </p>

            {/* Read More Link - Aligned to bottom right - Desktop only */}
            <div className="hidden lg:flex mt-auto justify-end lg:justify-start">
              <a 
                href="#mi" 
                onClick={handleContinueClick}
                className="text-[#28694D] text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] font-medium hover:opacity-80 transition-opacity inline-block underline"
              >
                {t('about.readMore')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

