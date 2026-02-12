'use client'

import { useRef, useState, useEffect } from 'react'
import { useI18n } from '@/src/contexts/I18nContext'


interface VacationOptionsPopupProps {
  isOpen: boolean
  onClose: () => void
  serviceId: number | null
}

interface ServiceOption {
  id: number
  title: string
  description: string
  image: string
}

export default function VacationOptionsPopup({
  isOpen,
  onClose,
  serviceId,
}: VacationOptionsPopupProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const { t, language } = useI18n()
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([])
  const loopCopies = 3

  const getItemsPerView = () => {
    if (typeof window === 'undefined') return 1
    return window.innerWidth >= 1440 ? 3 : 1
  }

  const isDesktopThreeUp = () => {
    if (typeof window === 'undefined') return false
    return window.innerWidth >= 1440
  }

  // Load service options from API
  useEffect(() => {
    if (!isOpen || !serviceId) return

    const loadOptions = async () => {
      try {
        setServiceOptions([])
        const response = await fetch(
          `/api/service-options?serviceId=${serviceId}&lang=${language}`
        )
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data.options)) {
            setServiceOptions(data.options)
            return
          }
        }
      } catch (error) {
        console.warn('Failed to load service options from API:', error)
      }
      setServiceOptions([])
    }

    loadOptions()
  }, [isOpen, language, serviceId])

  const getLoopSegmentWidth = () => {
    const container = scrollRef.current
    if (!container || serviceOptions.length === 0) return 0
    return container.scrollWidth / loopCopies
  }

  const recenterLoopIfNeeded = () => {
    const container = scrollRef.current
    if (!container || serviceOptions.length <= 1) return

    const segmentWidth = getLoopSegmentWidth()
    if (!segmentWidth) return

    // Keep the viewport in the middle copy to create an infinite loop illusion.
    if (container.scrollLeft < segmentWidth * 0.5) {
      container.scrollLeft += segmentWidth
    } else if (container.scrollLeft > segmentWidth * 1.5) {
      container.scrollLeft -= segmentWidth
    }
  }

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current
    if (!container) return

    const firstCard = container.firstElementChild as HTMLElement | null
    if (!firstCard) return

    const computedStyles = window.getComputedStyle(container)
    const gap = parseFloat(computedStyles.columnGap || computedStyles.gap || '0')
    const cardWidth = firstCard.getBoundingClientRect().width
    const itemsPerView = getItemsPerView()
    const scrollAmount = (cardWidth + gap) * itemsPerView
    const offset = direction === 'left' ? -scrollAmount : scrollAmount
    container.scrollBy({ left: offset, behavior: 'smooth' })

    // Update scroll buttons after a short delay
    setTimeout(() => {
      if (container) {
        recenterLoopIfNeeded()
        checkScrollButtons()
      }
    }, 100)
  }

  const checkScrollButtons = () => {
    const container = scrollRef.current
    if (!container) return

    // In loop mode both buttons stay available when we have multiple cards.
    const hasLoopableContent = serviceOptions.length > 1
    setCanScrollLeft(hasLoopableContent)
    setCanScrollRight(hasLoopableContent)
  }

  // Initialize scroll button states when popup opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        checkScrollButtons()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Re-check buttons when options load/update.
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => {
      const container = scrollRef.current
      if (container && serviceOptions.length > 1) {
        const segmentWidth = getLoopSegmentWidth()
        if (segmentWidth) {
          // Start from the middle copy so users can move in both directions immediately.
          container.scrollLeft = segmentWidth
        }
      }
      checkScrollButtons()
    }, 100)
    return () => clearTimeout(timer)
  }, [isOpen, serviceOptions.length])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-[#FBFBF9] w-full max-h-[104.5vh] overflow-hidden relative my-12">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors z-20"
          aria-label={t('vacationOptions.close')}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Carousel Container */}
        <div className="relative py-12 px-4 md:px-8">
          <div
            ref={scrollRef}
            onScroll={() => {
              recenterLoopIfNeeded()
              checkScrollButtons()
            }}
            className="flex gap-10 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[...Array(loopCopies)].flatMap((_, copyIndex) =>
              serviceOptions.map((option) => (
              <div
                key={`${copyIndex}-${option.id}`}
                className="flex-shrink-0 w-[320px] md:w-[380px] xl:w-[400px] bg-[#FBFBF9] overflow-hidden border border-[#28694D1A]"
              >
                {/* Image */}
                <div className="relative w-full aspect-square bg-gray-200 overflow-hidden">
                  <img
                    src={option.image}
                    alt={option.title}
                    className="object-cover w-full h-full absolute inset-0"
                  />

                  {/* Overlay Text */}
                  <div className="absolute top-0 left-0 right-0 w-full text-white px-6 z-20 h-[68px] md:h-[80px] xl:h-[80px]" style={{ backgroundColor: 'rgba(17, 17, 17, 0.6)' }}>
                    <div className="flex items-center justify-center h-full w-full">
                      <p className="font-montserrat text-[15px] md:text-[16px] font-medium text-center">
                        {t('vacationOptions.overlay')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer with white background */}
                <div className="bg-[#FBFBF9] pl-10 pr-4 py-4">
                  <h3 className="font-montserrat text-[#111111] text-base font-bold mb-2">
                    {option.title}
                  </h3>
                  <p className="font-montserrat text-[#111111] text-base leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </div>
              ))
            )}
          </div>

          {/* Navigation Arrow - Right */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-4 top-[calc(3rem+160px)] md:top-[calc(3rem+190px)] xl:top-[calc(3rem+200px)] -translate-y-1/2 z-10 w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[64px] md:h-[64px] lg:w-[72px] lg:h-[72px] flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-lg transition-all"
              aria-label={t('vacationOptions.scrollRight')}
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

          {/* Navigation Arrow - Left */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-4 top-[calc(3rem+160px)] md:top-[calc(3rem+190px)] xl:top-[calc(3rem+200px)] -translate-y-1/2 z-10 w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[64px] md:h-[64px] lg:w-[72px] lg:h-[72px] flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-lg transition-all"
              aria-label={t('vacationOptions.scrollLeft')}
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
        </div>
      </div>
    </div>
  )
}

