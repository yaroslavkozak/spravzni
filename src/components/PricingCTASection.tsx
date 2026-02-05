'use client'

import { useContactPopup } from '@/src/contexts/ContactPopupContext'
import { useI18n } from '@/src/contexts/I18nContext'

export default function PricingCTASection() {
  const { openPopup } = useContactPopup()
  const { t } = useI18n()

  return (
    <section className="bg-[#092112] min-h-[clamp(240px,23vw,338px)] py-[80px] sm:py-10 md:py-12 lg:py-16 xl:py-0 xl:min-h-[338px] flex items-center justify-center">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[140px] w-full">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h2 className="font-montserrat text-white font-bold leading-[1.3em] tracking-[-1%] mb-4 sm:mb-5 md:mb-6" style={{ fontSize: 'clamp(1rem, 0.875rem + 0.5vw, 1.25rem)' }}>
            {t('pricingCta.title')}
          </h2>

          {/* Subheading */}
          <p className="font-montserrat text-white/85 font-normal leading-[1.5em] tracking-[0.5%] mb-8 sm:mb-10 md:mb-12 lg:mb-16" style={{ fontSize: 'clamp(0.875rem, 0.8125rem + 0.25vw, 1rem)' }}>
            {t('pricingCta.subtitle')}
          </p>

          {/* CTA Button */}
          <button 
            onClick={() => openPopup(true)}
            className="bg-white text-[#28694D] border-2 border-[#28694D] rounded-[2rem] px-6 sm:px-8 md:px-10 lg:px-14 xl:px-[4.5rem] py-2.5 sm:py-3 md:py-3.5 flex items-center justify-center transition-all duration-300 shadow-lg hover:opacity-95 w-full sm:w-auto"
          >
            <span className={`hover-bold-no-shift font-montserrat font-normal text-[#28694D] leading-[1.5em] tracking-[0.5%] transition-all duration-300`} style={{ fontSize: 'clamp(0.875rem, 0.75rem + 0.5vw, 1.25rem)' }} data-text={t('pricingCta.button')}>
              <span>{t('pricingCta.button')}</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

