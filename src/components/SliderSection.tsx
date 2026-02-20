'use client'

import { useEffect, useCallback, useState } from 'react'
import Image from 'next/image'
import { useSlider } from '@/src/contexts/SliderContext'
import { useI18n } from '@/src/contexts/I18nContext'

interface Slide {
  id: number
  imageOnly?: boolean
  image: string
  text?: {
    quote: string
    heading: string
    body: string
  }
}

// Helper function to render slides 2+ with image covering whole slide and quote block at bottom right
const renderSlideWithQuote = (slide: Slide, slideNumber: number, totalSlides: number, quoteAlt: string) => (
  <div key={slide.id} className="relative w-full h-full flex-shrink-0">
    <Image
      src={`/images/slider/${slide.image.replace('gallery.image', '')}.png`}
      alt=""
      fill
      className="object-cover"
      unoptimized={true}
    />

    {/* Slide Counter - Bottom center */}
    <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end px-4 sm:px-6 md:px-8 lg:px-10 pb-4 sm:pb-6 md:pb-8 lg:pb-10 xl:pb-[40px] z-10">
      <div className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-[1.3em] tracking-[1.5%]">
        {slideNumber} / {totalSlides}
      </div>
    </div>

    {/* Quote Block - Bottom right - Desktop only */}
    {slide.text && (
      <div className="hidden min-[756px]:block absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-10 lg:right-10 xl:bottom-[40px] xl:right-[40px] z-20">
        <div className="bg-white border border-[rgba(17,17,17,0.07)] p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-[526px] shadow-lg">
          {/* Text Content */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 mt-1">
                <Image
                  src="/images/about/lapki.svg"
                  alt={quoteAlt}
                  width={36}
                  height={36}
                  className="object-contain w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
                  unoptimized={true}
                />
              </div>
              <h3 className="font-alternates text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[1.1em] tracking-[-2%]">
                {slide.text.heading}
              </h3>
            </div>
            <p className="font-montserrat text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[1.5em] tracking-[0.5%] ml-[calc(2rem+0.5rem)] sm:ml-[calc(2.25rem+0.75rem)] md:ml-[calc(2.5rem+0.75rem)]">
              {slide.text.body}
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
)

export default function SliderSection() {
  const { currentSlide, navigateToSlide } = useSlider()
  const { t } = useI18n()

  const slides: Slide[] = [
    {
      id: 1,
      imageOnly: true,
      image: 'gallery.image2',
    },
    {
      id: 2,
      imageOnly: false,
      image: 'gallery.image3',
      text: {
        quote: 'icons.lapki',
        heading: t('slider.slide2.heading'),
        body: t('slider.slide2.body'),
      },
    },
    {
      id: 3,
      imageOnly: false,
      image: 'gallery.image4',
      text: {
        quote: 'icons.lapki',
        heading: t('slider.slide3.heading'),
        body: t('slider.slide3.body'),
      },
    },
    {
      id: 4,
      imageOnly: false,
      image: 'gallery.image5',
      text: {
        quote: 'icons.lapki',
        heading: t('slider.slide4.heading'),
        body: t('slider.slide4.body'),
      },
    },
    {
      id: 5,
      imageOnly: false,
      image: 'gallery.image6',
      text: {
        quote: 'icons.lapki',
        heading: t('slider.slide5.heading'),
        body: t('slider.slide5.body'),
      },
    },
    {
      id: 6,
      imageOnly: false,
      image: 'gallery.image7',
      text: {
        quote: 'icons.lapki',
        heading: t('slider.slide6.heading'),
        body: t('slider.slide6.body'),
      },
    },
    {
      id: 7,
      imageOnly: false,
      image: 'gallery.image8',
      text: {
        quote: 'icons.lapki',
        heading: t('slider.slide7.heading'),
        body: t('slider.slide7.body'),
      },
    },
    {
      id: 8,
      imageOnly: false,
      image: 'gallery.image9',
      text: {
        quote: 'icons.lapki',
        heading: t('slider.slide8.heading'),
        body: t('slider.slide8.body'),
      },
    },
    {
      id: 10,
      imageOnly: false,
      image: 'gallery.image10',
      text: {
        quote: 'icons.lapki',
        heading: t('slider.slide9.heading'),
        body: t('slider.slide9.body'),
      },
    },
    {
      id: 11,
      imageOnly: false,
      image: 'gallery.image11',
      text: {
        quote: 'icons.lapki',
        heading: t('slider.slide10.heading'),
        body: t('slider.slide10.body'),
      },
    },
  ]
  const totalSlides = slides.length
  const [hasCycled, setHasCycled] = useState(false) // Track if we've cycled from last to first
  const [disableTransition, setDisableTransition] = useState(false)

  // Infinite loop: when on last slide, next goes to first slide (index 0)
  const nextSlide = useCallback(() => {
    const nextIndex = (currentSlide + 1) % totalSlides
    // If we're going from last to first, mark that we've cycled
    if (currentSlide === totalSlides - 1 && nextIndex === 0) {
      setHasCycled(true)
      setDisableTransition(true)
    }
    navigateToSlide(nextIndex)
  }, [currentSlide, totalSlides, navigateToSlide])

  // Infinite loop: when on first slide, prev goes to last slide
  const prevSlide = useCallback(() => {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides
    navigateToSlide(prevIndex)
  }, [currentSlide, totalSlides, navigateToSlide])

  // Determine arrow visibility
  // Show only next arrow if: we're at first slide AND haven't cycled yet
  const showOnlyNext = currentSlide === 0 && !hasCycled
  const showPrevArrow = !showOnlyNext
  const showNextArrow = true // Always show next arrow

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide()
      } else if (e.key === 'ArrowRight') {
        nextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [nextSlide, prevSlide])

  useEffect(() => {
    if (!disableTransition) return
    const frame = requestAnimationFrame(() => {
      setDisableTransition(false)
    })
    return () => cancelAnimationFrame(frame)
  }, [disableTransition])

  return (
    <section id="mi" className="bg-[#FBFBF9] pb-0 min-[756px]:pb-16">
      <div className="max-w-[1440px] mx-auto">
        {/* Heading */}
        <div className="flex flex-col items-start sm:items-center gap-2 p-4 sm:p-0 sm:px-6 md:px-8 lg:px-[100px] xl:px-[215px] mb-0 sm:mb-8 md:mb-12 lg:mb-16 border-b border-[rgba(17,17,17,0.11)] sm:border-b-0">
          <h2 className="font-alternates text-[#111111] text-[32px] sm:text-[36px] md:text-[48px] lg:text-[62px] font-medium leading-[1.1em] tracking-[-2%] text-center">
            {t('slider.title')}
          </h2>
          <p className="font-montserrat text-[#28694D] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-normal sm:font-medium leading-[1.3em] tracking-[1.5%] text-center">
            {t('slider.subtitle')}
          </p>
        </div>

        {/* Slider Container - desktop only */}
        <div className="hidden min-[756px]:block relative w-full max-w-[1360px] mx-auto min-[756px]:max-w-none min-[756px]:mx-0 bg-white px-4 sm:px-6 md:px-8 lg:px-[40px]">
          <div className="relative overflow-hidden w-full min-[756px]:aspect-[17/10] min-[756px]:h-auto min-[756px]:w-full min-[1024px]:max-[1440px]:aspect-[4/3] min-[1024px]:max-[1440px]:!h-auto">
            {/* Navigation Arrows - Positioned for all slides */}
            <div className={`absolute top-1/2 left-0 right-0 flex ${showOnlyNext ? 'justify-end' : 'justify-between'} px-2 sm:px-4 md:px-6 lg:px-10 -translate-y-1/2 pointer-events-none z-20`}>
              {showPrevArrow && (
                <button
                  onClick={prevSlide}
                  className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[64px] md:h-[64px] lg:w-[72px] lg:h-[72px] flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-lg transition-all pointer-events-auto"
                  aria-label={t('slider.prev')}
                >
                  <svg
                    className="w-[20px] h-[24px] sm:w-[24px] sm:h-[30px] md:w-[28px] md:h-[36px] text-[#404040]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              {showNextArrow && (
                <button
                  onClick={nextSlide}
                  className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[64px] md:h-[64px] lg:w-[72px] lg:h-[72px] flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-lg transition-all pointer-events-auto"
                  aria-label={t('slider.next')}
                >
                  <svg
                    className="w-[20px] h-[24px] sm:w-[24px] sm:h-[30px] md:w-[28px] md:h-[36px] text-[#404040]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Slides Wrapper */}
            <div 
              className={`flex h-full${disableTransition ? '' : ' transition-transform duration-500 ease-in-out'}`}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {/* Slide 1: Image only (full width) */}
              <div className="relative w-full h-full flex-shrink-0">
                <Image
                  src={`/images/slider/${slides[0].image.replace('gallery.image', '')}.png`}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized={true}
                />

                {/* Slide Counter - Bottom center */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end px-4 sm:px-6 md:px-8 lg:px-10 pb-4 sm:pb-6 md:pb-8 lg:pb-10 xl:pb-[40px] z-10">
                  <div className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-[1.3em] tracking-[1.5%]">
                    1 / {totalSlides}
                  </div>
                </div>
              </div>

              {/* Slide 2: Image covering whole slide with quote block at bottom right */}
              <div className="relative w-full h-full flex-shrink-0">
                    <Image
                      src={`/images/slider/${slides[1].image.replace('gallery.image', '')}.png`}
                      alt=""
                      fill
                  className="object-cover"
                      unoptimized={true}
                    />

                {/* Slide Counter - Bottom center */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end px-4 sm:px-6 md:px-8 lg:px-10 pb-4 sm:pb-6 md:pb-8 lg:pb-10 xl:pb-[40px] z-10">
                    <div className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold leading-[1.3em] tracking-[1.5%]">
                      2 / {totalSlides}
                  </div>
                </div>

                {/* Quote Block - Bottom right - Desktop only */}
                {slides[1].text && (
                  <div className="hidden min-[756px]:block absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-10 lg:right-10 xl:bottom-[40px] xl:right-[40px] z-20">
                    <div className="bg-white border border-[rgba(17,17,17,0.07)] p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-[526px] shadow-lg">
                      {/* Text Content */}
                      <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <Image
                              src="/images/about/lapki.svg"
                              alt={t('slider.quoteAlt')}
                              width={36}
                              height={36}
                              className="object-contain w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
                              unoptimized={true}
                            />
                          </div>
                          <h3 className="font-alternates text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-[1.1em] tracking-[-2%]">
                            {slides[1].text.heading}
                          </h3>
                        </div>
                        <p className="font-montserrat text-[#111111] text-[14px] sm:text-[15px] md:text-[16px] font-normal leading-[1.5em] tracking-[0.5%] ml-[calc(2rem+0.5rem)] sm:ml-[calc(2.25rem+0.75rem)] md:ml-[calc(2.5rem+0.75rem)]">
                          {slides[1].text.body}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Slide 3: Image covering whole slide with quote block at bottom right */}
              {renderSlideWithQuote(slides[2], 3, totalSlides, t('slider.quoteAlt'))}

              {/* Slide 4: Image covering whole slide with quote block at bottom right */}
              {renderSlideWithQuote(slides[3], 4, totalSlides, t('slider.quoteAlt'))}

              {/* Slide 5: Image covering whole slide with quote block at bottom right */}
              {renderSlideWithQuote(slides[4], 5, totalSlides, t('slider.quoteAlt'))}

              {/* Slide 6: Image covering whole slide with quote block at bottom right */}
              {renderSlideWithQuote(slides[5], 6, totalSlides, t('slider.quoteAlt'))}

              {/* Slide 7: Image covering whole slide with quote block at bottom right */}
              {renderSlideWithQuote(slides[6], 7, totalSlides, t('slider.quoteAlt'))}

              {/* Slide 8: Image covering whole slide with quote block at bottom right */}
              {renderSlideWithQuote(slides[7], 8, totalSlides, t('slider.quoteAlt'))}

              {/* Slide 9: Image covering whole slide with quote block at bottom right */}
              {renderSlideWithQuote(slides[8], 9, totalSlides, t('slider.quoteAlt'))}

              {/* Slide 10: Image covering whole slide with quote block at bottom right */}
              {renderSlideWithQuote(slides[9], 10, totalSlides, t('slider.quoteAlt'))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

