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

const renderSlideWithQuote = (slide: Slide, slideNumber: number, totalSlides: number, quoteAlt: string) => (
  <div key={slide.id} className="relative w-full h-full flex-shrink-0">
    <Image
      src={`/images/slider/${slide.image.replace('gallery.image', '')}.png`}
      alt={`Slide ${slide.id}`}
      fill
      className="object-cover"
      unoptimized={true}
    />
    <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end px-4 pb-4 z-10">
      <div className="font-montserrat text-white text-[16px] font-normal leading-[1.5em] tracking-[0.5%]">
        {slideNumber} / {totalSlides}
      </div>
    </div>
  </div>
)

export default function MobileSliderBlock() {
  const { currentSlide, navigateToSlide } = useSlider()
  const { t } = useI18n()
  const [disableTransition, setDisableTransition] = useState(false)

  const allSlides: Slide[] = [
    { id: 1, imageOnly: true, image: 'gallery.image2' },
    { id: 2, imageOnly: false, image: 'gallery.image3', text: { quote: 'icons.lapki', heading: t('slider.slide2.heading'), body: t('slider.slide2.body') } },
    { id: 3, imageOnly: false, image: 'gallery.image4', text: { quote: 'icons.lapki', heading: t('slider.slide3.heading'), body: t('slider.slide3.body') } },
    { id: 4, imageOnly: false, image: 'gallery.image5', text: { quote: 'icons.lapki', heading: t('slider.slide4.heading'), body: t('slider.slide4.body') } },
    { id: 5, imageOnly: false, image: 'gallery.image6', text: { quote: 'icons.lapki', heading: t('slider.slide5.heading'), body: t('slider.slide5.body') } },
    { id: 6, imageOnly: false, image: 'gallery.image7', text: { quote: 'icons.lapki', heading: t('slider.slide6.heading'), body: t('slider.slide6.body') } },
    { id: 7, imageOnly: false, image: 'gallery.image8', text: { quote: 'icons.lapki', heading: t('slider.slide7.heading'), body: t('slider.slide7.body') } },
    { id: 8, imageOnly: false, image: 'gallery.image9', text: { quote: 'icons.lapki', heading: t('slider.slide8.heading'), body: t('slider.slide8.body') } },
    { id: 10, imageOnly: false, image: 'gallery.image10', text: { quote: 'icons.lapki', heading: t('slider.slide9.heading'), body: t('slider.slide9.body') } },
    { id: 11, imageOnly: false, image: 'gallery.image11', text: { quote: 'icons.lapki', heading: t('slider.slide10.heading'), body: t('slider.slide10.body') } },
  ]
  // Mobile excludes slide 1 because it is displayed separately in the About section.
  const mobileSlides = allSlides.slice(1)
  const mobileTotalSlides = mobileSlides.length
  const mobileStateIndex = currentSlide === 0 ? 1 : currentSlide
  const mobileIndex = mobileStateIndex - 1

  const nextSlide = useCallback(() => {
    const nextIndex = mobileStateIndex === 9 ? 1 : mobileStateIndex + 1
    if (mobileStateIndex === 9 && nextIndex === 1) {
      setDisableTransition(true)
    }
    navigateToSlide(nextIndex)
  }, [mobileStateIndex, navigateToSlide])

  const prevSlide = useCallback(() => {
    const prevIndex = mobileStateIndex === 1 ? 9 : mobileStateIndex - 1
    navigateToSlide(prevIndex)
  }, [mobileStateIndex, navigateToSlide])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide()
      else if (e.key === 'ArrowRight') nextSlide()
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [nextSlide, prevSlide])

  useEffect(() => {
    if (!disableTransition) return
    const frame = requestAnimationFrame(() => setDisableTransition(false))
    return () => cancelAnimationFrame(frame)
  }, [disableTransition])

  const showOnlyNext = false

  return (
    <div className="min-[756px]:hidden bg-white overflow-x-clip">
      <div className="relative w-screen left-1/2 -translate-x-1/2 bg-white">
        <div className="relative overflow-hidden h-[375px] min-[600px]:h-[70vh]">
          <div className={`absolute bottom-4 left-0 right-0 flex ${showOnlyNext ? 'justify-end' : 'justify-between'} px-2 pointer-events-none z-20`}>
            {!showOnlyNext && (
              <button onClick={prevSlide} className="w-[48px] h-[48px] flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-lg pointer-events-auto" aria-label={t('slider.prev')}>
                <svg className="w-[20px] h-[24px] text-[#404040]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}
            <button onClick={nextSlide} className="w-[48px] h-[48px] flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-lg pointer-events-auto" aria-label={t('slider.next')}>
              <svg className="w-[20px] h-[24px] text-[#404040]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className={`flex h-full${disableTransition ? '' : ' transition-transform duration-500 ease-in-out'}`} style={{ transform: `translateX(-${mobileIndex * 100}%)` }}>
            {mobileSlides.map((slide, i) =>
              renderSlideWithQuote(slide, i + 1, mobileTotalSlides, t('slider.quoteAlt'))
            )}
          </div>
        </div>
      </div>
      {allSlides[mobileStateIndex]?.text && (
        <div className="pl-5 pr-4 py-6 border-t border-[rgba(17,17,17,0.11)] max-w-[1440px] mx-auto h-[225px] overflow-y-auto">
          <div className="flex flex-col gap-3 max-w-[526px]">
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="flex-shrink-0 mt-1 pr-4">
                <img src="/images/about/lapki.svg" alt={t('slider.quoteAlt')} width={53} height={48} className="object-contain w-[53px] h-[48px]" />
              </span>
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <h3 className="font-alternates text-[#111111] text-[16px] font-medium leading-[1.1em] tracking-[-2%]">
                  {allSlides[mobileStateIndex].text!.heading}
                </h3>
                <p className="font-montserrat text-[#111111] text-[16px] font-normal leading-[1.5em] tracking-[0.5%]">
                  {allSlides[mobileStateIndex].text!.body}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
