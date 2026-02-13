'use client'

import { useEffect, useState, useMemo } from 'react'
import MediaImage from '@/src/components/MediaImage'
import ServicesHighlightSection from '@/src/components/ServicesHighlightSection'
import { useContactPopup } from '@/src/contexts/ContactPopupContext'
import { useVacationOptionsPopup } from '@/src/contexts/VacationOptionsPopupContext'
import { useI18n } from '@/src/contexts/I18nContext'

interface ServiceItemProps {
  id: number
  heading: string
  paragraphs: string[]
  primaryButtonText?: string
  secondaryButtonText?: string
  primaryAction?: 'vacationOptions' | 'none'
  secondaryAction?: 'contact' | 'none'
  imageSrc: string
  overlayText?: string
  showPrimaryButton?: boolean
  showBorder?: boolean
}

const ServiceItem = ({
  id,
  heading,
  paragraphs,
  primaryButtonText,
  secondaryButtonText,
  primaryAction = 'none',
  secondaryAction = 'none',
  imageSrc,
  overlayText,
  showPrimaryButton = true,
  showBorder = false,
}: ServiceItemProps) => {
  const { openPopup } = useContactPopup()
  const { openPopup: openVacationOptionsPopup } = useVacationOptionsPopup()
  
  // Sanitize text to prevent rendering invalid values
  const sanitizeText = (text: string | undefined | null): string | undefined => {
    if (!text) return undefined
    const normalized = text.trim()
    // Reject empty strings, "0", "-", "null" (as string), and any falsy values
    if (normalized === '' || normalized === '0' || normalized === '-' || normalized.toLowerCase() === 'null') {
      return undefined
    }
    return normalized
  }
  
  const isValidButtonText = (text: string | undefined) => {
    return sanitizeText(text) !== undefined
  }
  
  // Sanitize all text values before using them
  const safePrimaryButtonText = sanitizeText(primaryButtonText)
  const safeSecondaryButtonText = sanitizeText(secondaryButtonText)
  const safeOverlayText = sanitizeText(overlayText)
  
  const hasPrimaryButton = showPrimaryButton && isValidButtonText(primaryButtonText)
  const hasSecondaryButton = isValidButtonText(secondaryButtonText)
  return (
    <div className="w-full border-y border-[#1111111C] mt-16 pt-2 lg:pt-0">
      {/* Desktop layout */}
      <div className="hidden lg:flex items-stretch gap-0 min-w-0">
        <div className="w-[clamp(0px,14.93vw,215px)] min-[1024px]:max-[1100px]:w-[3.90625%] min-[1100px]:max-[1200px]:w-0 min-[1200px]:max-[1300px]:w-0 min-[1300px]:max-[1440px]:w-0 flex-shrink-0" />
        <div className="w-[clamp(320px,30.4vw,438px)] min-[1024px]:max-[1100px]:w-[42.96875%] min-[1100px]:max-[1200px]:w-[39.8181%] min-[1100px]:max-[1200px]:pt-10 min-[1100px]:max-[1200px]:pl-10 min-[1200px]:max-[1300px]:w-[39.8181%] min-[1200px]:max-[1300px]:pt-10 min-[1200px]:max-[1300px]:pl-20 min-[1300px]:max-[1440px]:w-[46%] min-[1300px]:max-[1440px]:pt-10 min-[1300px]:max-[1440px]:pl-[160px] flex-shrink-0 flex flex-col h-[clamp(320px,45.83vw,660px)] pt-[clamp(24px,4.44vw,64px)] min-[1024px]:max-[1100px]:pt-10 justify-between">
          <div>
            <h3 className="font-montserrat text-[#111111] text-[clamp(18px,_calc(15.887px+0.563vw),_24px)] font-bold leading-[1.3em] tracking-[-1.5%]">
              {heading}
            </h3>
            <div className="space-y-3 sm:space-y-4 md:space-y-5 pt-4">
              {paragraphs
                .filter((paragraph) => {
                  if (!paragraph) return false
                  const normalized = paragraph.trim()
                  return normalized !== '' && normalized !== '0' && normalized !== '-' && normalized.toLowerCase() !== 'null'
                })
                .map((paragraph, index) => (
                  <p
                    key={index}
                    className="font-montserrat text-[hsla(0,0%,7%,1)] text-[16px] font-normal leading-[1.5em] tracking-[0.5%]"
                  >
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>
          {hasPrimaryButton || hasSecondaryButton ? (
            <div className="flex flex-col gap-2 w-full pt-[clamp(16px,2.78vw,40px)] pb-[24px] min-[1024px]:max-[1100px]:pt-[62px]">
              {hasPrimaryButton && safePrimaryButtonText && (
                <button
                  onClick={
                    primaryAction === 'vacationOptions'
                      ? () => openVacationOptionsPopup(id)
                      : undefined
                  }
                  className="w-full bg-[#28694D] rounded-[2rem] px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 flex items-center justify-center transition-all duration-300 hover:opacity-95"
                >
                  <span className="hover-bold-no-shift font-montserrat text-white text-[clamp(1rem,_calc(0.912rem+0.375vw),_1.25rem)] font-normal leading-[1.5em] tracking-[0.5%] transition-all duration-300" data-text={safePrimaryButtonText}>
                    <span>{safePrimaryButtonText}</span>
                  </span>
                </button>
              )}
              {hasSecondaryButton && safeSecondaryButtonText && (
                <button
                  onClick={secondaryAction === 'contact' ? () => {
                    openPopup(false, id)
                  } : undefined}
                  className="w-full bg-white text-[#28694D] border border-[#1111111A] rounded-[2rem] px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 flex items-center justify-center transition-all duration-300 hover:opacity-95"
                >
                  <span className="hover-bold-no-shift font-montserrat text-[clamp(1rem,_calc(0.912rem+0.375vw),_1.25rem)] font-normal leading-[1.5em] tracking-[0.5%] transition-all duration-300" data-text={safeSecondaryButtonText}>
                    <span>{safeSecondaryButtonText}</span>
                  </span>
                </button>
              )}
            </div>
          ) : null}
        </div>
        <div className="w-[clamp(0px,4.17vw,60px)] min-[1024px]:max-[1100px]:w-0 min-[1100px]:max-[1200px]:w-10 min-[1200px]:max-[1300px]:w-10 min-[1300px]:max-[1440px]:w-10 flex-shrink-0" />
        <div className="relative flex-1 h-full min-w-0 flex justify-end min-[1024px]:max-[1100px]:min-w-[500px] min-[1100px]:max-[1200px]:min-w-[600px] min-[1200px]:max-[1440px]:min-w-[660px]">
          <div className="relative w-[clamp(320px,45.83vw,660px)] aspect-square min-[1024px]:max-[1100px]:w-[500px] min-[1024px]:max-[1100px]:aspect-[500/660] min-[1100px]:max-[1200px]:w-[600px] min-[1100px]:max-[1200px]:aspect-[600/660] min-[1200px]:max-[1300px]:w-[660px] min-[1200px]:max-[1300px]:aspect-square min-[1300px]:max-[1440px]:w-[660px] min-[1300px]:max-[1440px]:aspect-square bg-gray-300 overflow-hidden">
            <MediaImage
              src={
                imageSrc.startsWith('/')
                  ? imageSrc
                  : `/images/services/s${imageSrc.replace('services.service', '')}.png`
              }
              alt={heading}
              fill
              className="object-cover object-right"
            />
            {safeOverlayText && (
              <div className="absolute bottom-0 left-0 right-0 bg-[#111111]/60 text-white px-4 sm:px-6 z-10">
              <div className="flex items-center justify-center min-h-[104px]">
                  <p className="font-montserrat text-[16px] text-[hsla(0,0%,100%,1)] text-center">
                    {safeOverlayText}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden grid grid-cols-1 gap-4 pr-5 min-[375px]:max-[900px]:pr-0 min-[900px]:pr-0">
        <h3 className="font-montserrat text-[#111111] text-[clamp(18px,_calc(15.887px+0.563vw),_24px)] font-bold leading-[1.3em] tracking-[-1.5%] mb-2 max-w-[90rem] mx-auto px-0 sm:px-6 md:px-8 lg:px-16 pl-5 sm:pl-12 md:pl-16 lg:pl-24 xl:pl-32 ml-0 sm:ml-6 md:ml-8 lg:ml-16 pt-0 sm:pt-16 min-[375px]:max-[900px]:!ml-[8.89%] min-[375px]:max-[900px]:!mr-[8.89%] min-[375px]:max-[900px]:!pl-0 min-[375px]:max-[900px]:!pr-0 min-[375px]:max-[900px]:!pt-2 min-[375px]:max-[900px]:text-[24px] min-[375px]:max-[900px]:leading-[130%] min-[375px]:max-[900px]:tracking-[0.015em] min-[900px]:max-[1023px]:!ml-[17.78%] min-[900px]:max-[1023px]:!mr-[8.89%] min-[900px]:max-[1023px]:!pl-0 min-[900px]:max-[1023px]:!pr-0 min-[900px]:max-[1023px]:!pt-2 min-[900px]:max-[1023px]:text-[24px] min-[900px]:max-[1023px]:leading-[130%] min-[900px]:max-[1023px]:tracking-[0.015em]">
          {heading}
        </h3>
        <div className="relative h-full min-h-[335px] max-w-[90rem] mx-auto px-0 sm:px-6 md:px-8 lg:px-16 pl-5 sm:pl-12 md:pl-16 lg:pl-24 xl:pl-32 ml-0 sm:ml-6 md:ml-8 lg:ml-16 sm:pr-12 md:pr-16 lg:pr-24 xl:pr-32 min-[375px]:max-[900px]:!ml-[8.89%] min-[375px]:max-[900px]:!mr-[8.89%] min-[375px]:max-[900px]:!pl-0 min-[375px]:max-[900px]:!pr-0 min-[900px]:max-[1023px]:!ml-[17.78%] min-[900px]:max-[1023px]:!mr-[8.89%] min-[900px]:max-[1023px]:!pl-0 min-[900px]:max-[1023px]:!pr-0">
          <div className="relative aspect-square bg-gray-300 overflow-hidden mx-auto w-[clamp(280px,89.33vw,335px)] min-[375px]:max-[900px]:!w-full min-[375px]:max-[900px]:!mx-0 min-[900px]:max-[1023px]:!w-full min-[900px]:max-[1023px]:!mx-0">
            <MediaImage
              src={
                imageSrc.startsWith('/')
                  ? imageSrc
                  : `/images/services/s${imageSrc.replace('services.service', '')}.png`
              }
              alt={heading}
              fill
              className="object-cover object-right"
            />
            {safeOverlayText && (
              <div className="absolute bottom-0 left-0 right-0 bg-[#111111]/60 text-white px-4 sm:px-6 z-10">
                <div className="flex items-center justify-center min-h-[80px]">
                  <p className="font-montserrat text-[16px] text-[hsla(0,0%,100%,1)] text-center">
                    {safeOverlayText}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="max-w-[90rem] mx-auto px-0 sm:px-6 md:px-8 lg:px-16 pl-5 sm:pl-12 md:pl-16 lg:pl-24 xl:pl-32 ml-0 sm:ml-6 md:ml-8 lg:ml-16 pt-0 h-full flex flex-col min-[375px]:max-[900px]:!ml-[8.89%] min-[375px]:max-[900px]:!mr-[8.89%] min-[375px]:max-[900px]:!pl-0 min-[375px]:max-[900px]:!pr-0 min-[900px]:max-[1023px]:!ml-[17.78%] min-[900px]:max-[1023px]:!mr-[8.89%] min-[900px]:max-[1023px]:!pl-0 min-[900px]:max-[1023px]:!pr-0">
          <div className="space-y-3 sm:space-y-4 md:space-y-5 pb-[38px] min-[375px]:max-[900px]:pb-4 min-[900px]:max-[1023px]:pb-4">
            {paragraphs
              .filter((paragraph) => {
                if (!paragraph) return false
                const normalized = paragraph.trim()
                return normalized !== '' && normalized !== '0' && normalized !== '-' && normalized.toLowerCase() !== 'null'
              })
              .map((paragraph, index) => (
                <p
                  key={index}
                  className="font-montserrat text-[hsla(0,0%,7%,1)] text-[16px] font-normal leading-[1.5em] tracking-[0.5%]"
                >
                  {paragraph}
                </p>
              ))}
          </div>
          {hasPrimaryButton || hasSecondaryButton ? (
            <div className="flex flex-col gap-2 w-full mt-4 mt-auto pb-6 min-[375px]:max-[900px]:pb-10 min-[900px]:max-[1023px]:pb-10">
              {hasPrimaryButton && safePrimaryButtonText && (
                <button
                  onClick={
                    primaryAction === 'vacationOptions'
                      ? () => openVacationOptionsPopup(id)
                      : undefined
                  }
                  className="w-full bg-[#28694D] rounded-[2rem] px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 flex items-center justify-center transition-all duration-300 hover:opacity-95"
                >
                  <span className="hover-bold-no-shift font-montserrat text-white text-[clamp(1rem,_calc(0.912rem+0.375vw),_1.25rem)] font-normal leading-[1.5em] tracking-[0.5%] transition-all duration-300" data-text={safePrimaryButtonText}>
                    <span>{safePrimaryButtonText}</span>
                  </span>
                </button>
              )}
              {hasSecondaryButton && safeSecondaryButtonText && (
                <button
                  onClick={secondaryAction === 'contact' ? () => {
                    openPopup(false, id)
                  } : undefined}
                  className="w-full bg-white text-[#28694D] border border-[#1111111A] rounded-[2rem] px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 flex items-center justify-center transition-all duration-300 hover:opacity-95"
                >
                  <span className="hover-bold-no-shift font-montserrat text-[clamp(1rem,_calc(0.912rem+0.375vw),_1.25rem)] font-normal leading-[1.5em] tracking-[0.5%] transition-all duration-300" data-text={safeSecondaryButtonText}>
                    <span>{safeSecondaryButtonText}</span>
                  </span>
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function ServicesSection() {
  const { t, language } = useI18n()
  const [servicesData, setServicesData] = useState<ServiceItemProps[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fallback services data from translations (for backward compatibility)
  const fallbackServices: ServiceItemProps[] = useMemo(() => [
    {
      id: 1,
      heading: t('services.service1.title'),
      paragraphs: [
        t('services.service1.p1'),
        t('services.service1.p2'),
        t('services.service1.p3'),
      ],
      primaryButtonText: t('services.button.vacationOptions'),
      secondaryButtonText: t('services.button.notify'),
      primaryAction: 'vacationOptions',
      secondaryAction: 'contact',
      imageSrc: 'services.service1',
      overlayText: t('services.overlay.may'),
    },
    {
      id: 2,
      heading: t('services.service2.title'),
      paragraphs: [
        t('services.service2.p1'),
        t('services.service2.p2'),
        t('services.service2.p3'),
        t('services.service2.p4'),
      ],
      primaryButtonText: t('services.button.learnMore'),
      secondaryButtonText: t('services.button.notify'),
      secondaryAction: 'contact',
      imageSrc: 'services.service2',
      showPrimaryButton: false,
      overlayText: t('services.overlay.june'),
    },
    {
      id: 3,
      heading: t('services.service3.title'),
      paragraphs: [
        t('services.service3.p1'),
        t('services.service3.p2'),
        t('services.service3.p3'),
      ],
      primaryButtonText: t('services.button.learnMore'),
      secondaryButtonText: t('services.button.notify'),
      secondaryAction: 'contact',
      imageSrc: 'services.service3',
      showPrimaryButton: false,
      overlayText: t('services.overlay.may'),
    },
    {
      id: 4,
      heading: t('services.service4.title'),
      paragraphs: [
        t('services.service4.p1'),
        t('services.service4.p2'),
        t('services.service4.p3'),
        t('services.service4.p4'),
      ],
      primaryButtonText: t('services.button.learnMore'),
      secondaryButtonText: t('services.button.notify'),
      secondaryAction: 'contact',
      imageSrc: 'services.service4',
      showPrimaryButton: false,
      overlayText: t('services.overlay.june'),
    },
    {
      id: 5,
      heading: t('services.service5.title'),
      paragraphs: [
        t('services.service5.p1'),
        t('services.service5.p2'),
        t('services.service5.p3'),
      ],
      primaryButtonText: t('services.button.learnMore'),
      secondaryButtonText: t('services.button.notify'),
      secondaryAction: 'contact',
      imageSrc: 'services.service5',
      showPrimaryButton: false,
      overlayText: t('services.overlay.june'),
    },
  ], [t])

  // Load services from API
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch(`/api/services?lang=${language}`)
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data.services)) {
            setServicesData(data.services)
            setIsLoading(false)
            return
          }
        }
      } catch (error) {
        console.warn('Failed to load services from API, using fallback:', error)
      }
      // Fallback to translations if API fails
      setServicesData(fallbackServices)
      setIsLoading(false)
    }

    loadServices()
  }, [language, fallbackServices])

  useEffect(() => {
    const handleScrollToService = () => {
      // Get hash from URL
      const hash = window.location.hash
      if (!hash || !hash.startsWith('#service-')) return

      const serviceId = hash.replace('#service-', '')
      const serviceContainer = document.getElementById(`service-${serviceId}`)
      if (!serviceContainer) return

      // Calculate header height dynamically
      const header = document.querySelector('header')
      const headerHeight = header ? header.getBoundingClientRect().height : 0

      // Find the service title (h3 element)
      // The h3 is inside: serviceContainer > grid div > text column > content div > h3
      const gridContainer = serviceContainer.querySelector('.grid')
      let targetElement: HTMLElement | null = null

      if (gridContainer) {
        // Find the h3 heading element
        const titleElement = gridContainer.querySelector('h3.font-montserrat')
        if (titleElement) {
          targetElement = titleElement as HTMLElement
        } else {
          // Fallback to grid container if title not found
          targetElement = gridContainer as HTMLElement
        }
      }

      // Fallback to service container if target not found
      if (!targetElement) {
        targetElement = serviceContainer
      }

      // Get element's position relative to document
      const elementTop = targetElement.getBoundingClientRect().top + window.scrollY

      // Calculate target scroll position (element top minus header height)
      // This positions the title at the top of the viewport, accounting for the header
      const targetScroll = elementTop - headerHeight

      // Use smooth scroll
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      })
    }

    // Handle initial hash on mount
    if (window.location.hash && window.location.hash.startsWith('#service-')) {
      // Small delay to ensure DOM is ready
      setTimeout(handleScrollToService, 100)
    }

    // Handle hash changes
    const handleHashChange = () => {
      if (window.location.hash && window.location.hash.startsWith('#service-')) {
        setTimeout(handleScrollToService, 50)
      }
    }

    // Handle anchor link clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#service-"]') as HTMLAnchorElement
      
      if (anchor) {
        e.preventDefault()
        const href = anchor.getAttribute('href')
        if (href) {
          window.history.pushState(null, '', href)
          handleScrollToService()
        }
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    document.addEventListener('click', handleAnchorClick)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [])

  return (
    <section id="services" className="bg-white py-16 md:py-20 lg:py-24">
      <div className="w-full px-4 sm:px-6 md:px-8 min-[375px]:max-[900px]:!ml-[8.89%] min-[375px]:max-[900px]:!mr-[8.89%] min-[375px]:max-[900px]:!pl-0 min-[375px]:max-[900px]:!pr-0 min-[900px]:max-[1023px]:!ml-[17.78%] min-[900px]:max-[1023px]:!mr-[8.89%] min-[900px]:max-[1023px]:!pl-0 min-[900px]:max-[1023px]:!pr-0 min-[1024px]:max-[1100px]:!pl-[3.90625%] min-[1100px]:max-[1200px]:!pl-10 min-[1200px]:max-[1300px]:!pl-20 min-[1300px]:max-[1440px]:!pl-[160px] min-[1440px]:!pl-[clamp(0px,14.93vw,215px)] min-[1024px]:!pr-16">
        <div className="space-y-2 md:space-y-3 mb-8 sm:mb-10 md:mb-12 lg:mb-14">
            <h2 className="font-alternates text-[#111111] text-[clamp(2rem,_calc(1.34rem+2.817vw),_3.875rem)] font-medium leading-[1.1em] tracking-[-2%] min-[375px]:max-[900px]:text-[62px] min-[375px]:max-[900px]:leading-[110%] min-[375px]:max-[900px]:tracking-[-2%] min-[900px]:max-[1023px]:text-[62px] min-[900px]:max-[1023px]:leading-[110%] min-[900px]:max-[1023px]:tracking-[-2%]">
              {t('services.title')}
            </h2>
            <p className="font-montserrat text-[#28694D] text-[clamp(1rem,_calc(0.824rem+0.751vw),_1.5rem)] font-medium leading-[1.3em] tracking-[1.5%] min-[375px]:max-[900px]:text-[24px] min-[375px]:max-[900px]:leading-[130%] min-[375px]:max-[900px]:tracking-[0.015em] min-[900px]:max-[1023px]:text-[24px] min-[900px]:max-[1023px]:leading-[130%] min-[900px]:max-[1023px]:tracking-[0.015em]">
              {t('services.subtitle')}
            </p>
        </div>
      </div>

      {/* <ServicesHighlightSection /> */}

      <div className="w-full">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Завантаження послуг...</div>
        ) : servicesData.length > 0 ? (
          servicesData.map((service, index) => (
            <div key={service.id} id={`service-${service.id}`}>
              <ServiceItem
                {...service}
                showBorder={index > 0}
                showPrimaryButton={index === 0 ? service.showPrimaryButton !== false : false}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">Немає доступних послуг</div>
        )}
      </div>
    </section>
  )
}

