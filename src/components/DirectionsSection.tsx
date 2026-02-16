'use client'

import BackgroundMedia from '@/src/components/BackgroundMedia'
import MediaImage from '@/src/components/MediaImage'
import { useI18n } from '@/src/contexts/I18nContext'

const detailTextClass =
  'font-montserrat text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] lg:text-[1.0625rem] text-[#111111] leading-[1.6] tracking-[0.45%]'

export default function DirectionsSection() {
  const { t, language } = useI18n()
  const mapSrc = language === 'en' ? '/images/map/map-eng.webp' : '/images/map/map-ua.png'

  return (
    <section id="location" className="bg-[#FBFBF9]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[20px] items-stretch w-full border-y border-[#1111111C] xl:h-[700px]">
        <div className="order-1 lg:order-1 flex flex-col">
          <div className="w-full pl-8 sm:pl-12 md:pl-16 lg:pl-24 xl:pl-[215px] pr-0 ml-0 sm:ml-6 md:ml-8 lg:ml-0 pt-0 pb-0">
            <h3 className="font-alternates text-[#111111] text-[2rem] sm:text-[2.375rem] md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem] font-medium leading-[1.1] tracking-[-0.02em] pt-6 mb-[40px] lg:break-inside-avoid">
              {t('directions.title')}
            </h3>
            <p className={`${detailTextClass} mb-6 lg:break-inside-avoid`}>
              {t('directions.body')}
            </p>

            <div className="space-y-6 lg:break-inside-avoid">
              <div>
                <p className="font-montserrat text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] font-semibold text-[#111111] mb-2">
                  {t('directions.address.label')}
                </p>
                <div className="flex items-center gap-2 sm:gap-3 text-[#2d2d2d] leading-[1.6] tracking-[0.45%]">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 relative flex-shrink-0">
                    <MediaImage src="/images/directions/locat.svg" alt="Location icon" fill className="object-contain" />
                  </span>
                  <a 
                    href="https://maps.app.goo.gl/z4d33r87E1eAJ6rs9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${detailTextClass} font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity cursor-pointer`}
                  >
                    {t('directions.address.value')}
                  </a>
                </div>
              </div>

              <div>
                <p className="font-montserrat text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] font-semibold text-[#111111] mb-2">
                  {t('directions.byCar.label')}
                </p>
                <p className={`${detailTextClass} mb-2`}>
                  {t('directions.byCar.p1')}
                </p>
                <p className={detailTextClass}>
                  {t('directions.byCar.p2')}
                </p>
              </div>

              <div className="pb-[30px]">
                <p className="font-montserrat text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] font-semibold text-[#111111] mb-2">
                  {t('directions.transfer.label')}
                </p>
                <p className={detailTextClass}>
                  {t('directions.transfer.p1')}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative order-2 lg:order-2 h-full hidden sm:block lg:w-full">
          <div className="relative w-full aspect-square overflow-hidden bg-[#f8f8f5] sm:aspect-[4/3] lg:aspect-square xl:w-[700px] xl:h-[700px] xl:mx-auto">
            <MediaImage
              src={mapSrc}
              alt="Map near the center"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
      <div className="block sm:hidden">
        <div className="relative w-full min-h-[375px] overflow-hidden">
          <BackgroundMedia
            src="/map-mobile.webp"
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          />
        </div>
      </div>
    </section>
  )
}

