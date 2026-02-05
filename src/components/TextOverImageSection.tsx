'use client'

import BackgroundMedia from '@/src/components/BackgroundMedia'
import { useI18n } from '@/src/contexts/I18nContext'

export default function TextOverImageSection() {
  const { t } = useI18n()

  return (
    <section className="relative w-full h-[660px] sm:h-[120vh] overflow-hidden">
      {/* Background Image */}
      <BackgroundMedia
        src="/images/other/girl.png"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      />

      {/* Text Content */}
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        <div className="text-center mx-4 sm:mx-6 md:mx-8 px-4">
          <p className="text-white font-montserrat text-[16px] sm:text-[28px] md:text-[32px] lg:text-[36px] font-semibold leading-tight tracking-[-0.5%] xl:text-[32px] xl:font-bold xl:leading-[1.3] xl:tracking-[-2%] drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
            {t('textOverImage.line1')}
          </p>
          <p className="text-white font-montserrat text-[16px] sm:text-[28px] md:text-[32px] lg:text-[36px] font-light leading-tight tracking-[-0.5%] xl:text-[24px] xl:font-medium xl:leading-[1.3] xl:tracking-[-1.5%] drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)] mt-2">
            {t('textOverImage.line2')}
          </p>
        </div>
      </div>
    </section>
  )
}

