'use client'

import BackgroundMedia from '@/src/components/BackgroundMedia'
import { Link } from '@tanstack/react-router'
import { useI18n } from '@/src/contexts/I18nContext'

export default function ContributionSectionFullImage() {
  const { t } = useI18n()

  return (
    <section id="contribute" className="bg-[#F5F6F3] mb-[3vh] sm:mb-[4vh] md:mb-[5vh]">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-0 xl:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-[647px_484px] gap-[24px] sm:gap-6 lg:gap-x-[134px] lg:gap-y-0 min-h-[400px] sm:min-h-[500px] md:min-h-[550px] lg:h-[600px]">
          {/* Title - mobile only */}
          <h3 className="font-alternates text-[#111111] font-medium leading-[1.1] tracking-[-0.02em] mb-0 sm:mb-8 md:mb-10 mt-4 lg:hidden order-1" style={{ fontSize: 'clamp(1.5rem, 1.25rem + 1.25vw, 3.75rem)' }}>
            {t('contribution.title')}
          </h3>

          {/* Image - appears after title on mobile, first column on desktop */}
          <BackgroundMedia
            src="/make-donation.png"
            className="relative w-screen lg:w-[647px] h-[300px] sm:h-[400px] md:h-[450px] lg:h-[600px] bg-cover bg-center bg-no-repeat order-2 lg:col-start-1 lg:row-start-1 lg:row-span-1 -mx-4 sm:-mx-6 lg:mx-0"
          />

          {/* Content column – mobile only */}
          <div className="flex flex-col items-start justify-start text-[#111111] w-full px-0 lg:hidden order-3">
            <p className="font-montserrat leading-[1.6] tracking-[0.45%] mb-4 sm:mb-5 md:mb-6" style={{ fontSize: 'clamp(0.875rem, 0.8125rem + 0.25vw, 1.0625rem)' }}>
              {t('contribution.p1')}
            </p>
            <p className="font-montserrat leading-[1.6] tracking-[0.45%] mb-4 sm:mb-5 md:mb-6" style={{ fontSize: 'clamp(0.875rem, 0.8125rem + 0.25vw, 1.0625rem)' }}>
              {t('contribution.p2')}
            </p>
            <p className="font-montserrat leading-[1.6] tracking-[0.45%] mb-8 sm:mb-9 md:mb-10" style={{ fontSize: 'clamp(0.875rem, 0.8125rem + 0.25vw, 1.0625rem)' }}>
              {t('contribution.p3')}{' '}
              <Link
                to="/report"
                className="underline hover:opacity-80 transition-opacity"
              >
                {t('hero.subtitle.report')}
              </Link>
            </p>
            <Link
              to="/donate"
              className="font-montserrat inline-flex w-full sm:w-auto items-center justify-center bg-[#28694D] text-white font-normal leading-[150%] tracking-[0.5%] rounded-full px-8 sm:px-12 md:px-16 lg:px-[100px] py-3 sm:py-[9px] hover:opacity-95 transition whitespace-nowrap"
              style={{ fontWeight: 400, fontSize: 'clamp(0.875rem, 0.75rem + 0.5vw, 1.25rem)' }}
            >
              {t('contribution.cta')}
            </Link>
          </div>

          {/* Desktop content block - title, paragraph, button */}
          <div className="hidden lg:flex flex-col items-start justify-start text-[#111111] w-full lg:w-[484px] px-0 lg:pt-16 lg:col-start-2 lg:row-start-1">
            <h3 className="font-alternates text-[#111111] font-medium leading-[1.1] tracking-[-0.02em] mb-10" style={{ fontSize: 'clamp(1.5rem, 1.25rem + 1.25vw, 3.75rem)' }}>
              {t('contribution.title')}
            </h3>
            <p className="font-montserrat leading-[1.6] tracking-[0.45%] mb-4" style={{ fontSize: 'clamp(0.875rem, 0.8125rem + 0.25vw, 1.0625rem)' }}>
              {t('contribution.p1')}
            </p>
            <p className="font-montserrat leading-[1.6] tracking-[0.45%] mb-4" style={{ fontSize: 'clamp(0.875rem, 0.8125rem + 0.25vw, 1.0625rem)' }}>
              {t('contribution.p2')}
            </p>
            <p className="font-montserrat leading-[1.6] tracking-[0.45%] mb-8" style={{ fontSize: 'clamp(0.875rem, 0.8125rem + 0.25vw, 1.0625rem)' }}>
              {t('contribution.p3')}{' '}
              <Link
                to="/report"
                className="underline hover:opacity-80 transition-opacity"
              >
                {t('hero.subtitle.report')}
              </Link>
            </p>
            <Link
              to="/donate"
              className="font-montserrat inline-flex items-center justify-center bg-[#28694D] text-white font-normal leading-[150%] tracking-[0.5%] rounded-full px-[100px] py-[9px] hover:opacity-95 transition whitespace-nowrap"
              style={{ fontWeight: 400, fontSize: 'clamp(0.875rem, 0.75rem + 0.5vw, 1.25rem)' }}
            >
              {t('contribution.cta')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

