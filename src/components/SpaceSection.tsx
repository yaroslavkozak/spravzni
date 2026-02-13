'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import MediaImage from '@/src/components/MediaImage'
import { useI18n } from '@/src/contexts/I18nContext'

export default function SpaceSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasCycled, setHasCycled] = useState(false) // Track if we've cycled from last to first
  const totalImages = 8
  const { t } = useI18n()

  const features = [
    { id: 1, icon: 'sparks', text: t('space.feature1') },
    { id: 2, icon: 'people-safe-one', text: t('space.feature2') },
    { id: 3, icon: 'wheelchair', text: t('space.feature3') },
    { id: 4, icon: 'Coordinator', text: t('space.feature4') },
    { id: 5, icon: 'fork-spoon', text: t('space.feature5') },
    { id: 6, icon: 'bus-one', text: t('space.feature6') },
    { id: 7, icon: 'Wi FI', text: t('space.feature7') },
    { id: 8, icon: 'rotate', text: t('space.feature8') },
  ]

  // Image sources - gallery images from prostir folder
  const imageSources = [
    '/images/prostir/1.webp',
    '/images/prostir/2.webp',
    '/images/prostir/3.webp',
    '/images/prostir/4.webp',
    '/images/prostir/5.webp',
    '/images/prostir/6.webp',
    '/images/prostir/7.webp',
    '/images/prostir/8.webp',
  ]

  const handleImageClick = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  // Close modal on ESC key
  useEffect(() => {
    if (!isModalOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isModalOpen])

  const nextImage = () => {
    setCurrentImageIndex((prev) => {
      const next = (prev + 1) % totalImages
      // If we're going from last to first, mark that we've cycled
      if (prev === totalImages - 1 && next === 0) {
        setHasCycled(true)
      }
      return next
    })
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = (prev - 1 + totalImages) % totalImages
      // If we're going from first to last, mark that we've cycled
      if (prev === 0 && newIndex === totalImages - 1) {
        setHasCycled(true)
      }
      return newIndex
    })
  }

  // Determine arrow visibility
  // Show only next arrow if: we're at first image AND haven't cycled yet
  const showOnlyNext = currentImageIndex === 0 && !hasCycled
  const showPrevArrow = !showOnlyNext
  const showNextArrow = true // Always show next arrow

  return (
    <section className="bg-[#FBFBF9] pt-0 pb-16 md:py-20 lg:pt-20 lg:pb-24">
      {/* Title Section - Desktop only, above border */}
      <div className="hidden lg:block max-w-[90rem] mx-auto px-5 sm:px-6 md:px-8 lg:px-[215px] mb-8">
        <h2 className="font-alternates text-[#111111] text-[2.25rem] sm:text-[2.625rem] md:text-[3rem] lg:text-[3.5rem] xl:text-[4rem] font-medium leading-[1.1em] tracking-[-2%] mb-2">
          {t('space.title')}
        </h2>
        <p className="font-montserrat text-[#28694D] text-[1rem] sm:text-[1.125rem] md:text-[1.25rem] lg:text-[1.5rem] font-medium leading-[1.3em] tracking-[1.5%]">
          {t('space.subtitle')}
        </p>
      </div>
      
      {/* Full-width wrapper with borders */}
      <div className="w-full border-t lg:border-b border-[#1111111C]">
        <div className="max-w-[90rem] mx-auto px-5 sm:px-6 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20 items-stretch">
            {/* Title Section - Mobile only */}
            <div className="mb-8 sm:mb-10 md:mb-12 lg:hidden order-2 px-0 sm:px-0">
              <h2 className="font-alternates text-[#111111] text-[2.25rem] sm:text-[2.625rem] md:text-[3rem] lg:text-[3.5rem] xl:text-[4rem] font-medium leading-[1.1em] tracking-[-2%] mb-2">
                {t('space.title')}
              </h2>
              <p className="font-montserrat text-[#28694D] text-[1rem] sm:text-[1.125rem] md:text-[1.25rem] lg:text-[1.5rem] font-medium leading-[1.3em] tracking-[1.5%]">
                {t('space.subtitle')}
              </p>
            </div>
            {/* Image Gallery - Mobile only (no modal on click; zoom shown from 1024px+ only) */}
            <div className="relative h-[18.75rem] sm:h-[25rem] md:h-[31.25rem] lg:hidden w-screen left-1/2 -translate-x-1/2 sm:w-auto sm:left-0 sm:translate-x-0 sm:-ml-6 md:-ml-8 order-1">
            <div 
              className="relative w-full h-full bg-gray-300 overflow-hidden cursor-default group"
            >
              {/* Actual Image */}
              <MediaImage
                src={imageSources[currentImageIndex]}
                alt={t('space.imageAlt', { index: currentImageIndex + 1 })}
                fill
                className="object-cover"
              />
              
              {/* Enumeration - Bottom Center */}
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium">
                {currentImageIndex + 1} / {totalImages}
              </div>

              {/* Navigation Arrows */}
              {showPrevArrow && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10"
                aria-label={t('space.prev')}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#404040]"
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
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10"
                aria-label={t('space.next')}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#404040]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

            {/* Desktop Left Column: Image Gallery - 700x621px, sticks to left edge */}
            <div className="hidden lg:block order-1 lg:order-1 lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:-ml-16">
              {/* Image Gallery - Desktop only */}
              <div className="relative lg:w-[700px] lg:h-[621px]">
                <div 
                  className="relative w-full h-full bg-gray-300 overflow-hidden cursor-pointer group"
                  onClick={handleImageClick}
                >
                  {/* Actual Image */}
                  <MediaImage
                    src={imageSources[currentImageIndex]}
                    alt={t('space.imageAlt', { index: currentImageIndex + 1 })}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Zoom Icon - Top Right - Clickable */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleImageClick()
                    }}
                    className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 lg:opacity-100 z-10"
                    aria-label={t('space.zoom')}
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#404040]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                      />
                    </svg>
                  </button>

                  {/* Enumeration - Bottom Center */}
                  <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium">
                    {currentImageIndex + 1} / {totalImages}
                  </div>

                  {/* Navigation Arrows */}
                  {showPrevArrow && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        prevImage()
                      }}
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 lg:opacity-100 z-10"
                    aria-label={t('space.prev')}
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-[#404040]"
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
                      onClick={(e) => {
                        e.stopPropagation()
                        nextImage()
                      }}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 lg:opacity-100 z-10"
                    aria-label={t('space.next')}
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-[#404040]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Features List */}
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-7 h-full ml-0 sm:ml-6 md:ml-8 lg:ml-12 xl:ml-16 pt-0 pb-8 lg:py-8 order-3 lg:order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-start gap-2 sm:gap-3 md:gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 flex items-center justify-center">
                  <Image
                    src={`/images/space/icons/${feature.icon}.svg`}
                    alt=""
                    width={32}
                    height={32}
                    className="object-contain w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9"
                    unoptimized={true}
                  />
                </div>
                
                {/* Text */}
                <p className="font-montserrat text-[#111111] text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] lg:text-[1.0625rem] leading-[1.5em] tracking-[0.5%] flex-1 pt-0.5 sm:pt-1">
                  {feature.text}
                </p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal/Lightbox */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all z-20"
            aria-label={t('space.close')}
          >
            <svg
              className="w-6 h-6 text-[#404040]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Image */}
          <div 
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <MediaImage
              src={imageSources[currentImageIndex]}
              alt={t('space.imageAltEnlarged', { index: currentImageIndex + 1 })}
              width={1200}
              height={900}
              className="object-contain max-w-full max-h-full rounded-lg"
            />
          </div>

          {/* Enumeration - Bottom Center */}
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white px-3 py-2 rounded text-sm font-medium z-20 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            {currentImageIndex + 1} / {totalImages}
          </div>

          {/* Navigation Arrows in Modal */}
          {showPrevArrow && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all z-20"
              aria-label={t('space.prev')}
            >
              <svg
                className="w-6 h-6 text-[#404040]"
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
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all z-20"
              aria-label={t('space.next')}
            >
              <svg
                className="w-6 h-6 text-[#404040]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </section>
  )
}

