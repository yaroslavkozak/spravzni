import type { Translator } from '@/src/lib/translator'
import type { SupportedLanguage } from '@/src/lib/i18n'

const detailTextClass =
  'font-montserrat text-[16px] font-normal text-[#111111] leading-[150%] tracking-[0.5%]'

const ENGLISH_MAP = '/images/map/map-eng.webp'
const UKRAINIAN_MAP = '/images/map/map-ua.png'

interface StaticDirectionsSectionProps {
  t: Translator
  language?: SupportedLanguage
}

export default function StaticDirectionsSection({ t, language }: StaticDirectionsSectionProps) {
  const mapSrc = language === 'en' ? ENGLISH_MAP : UKRAINIAN_MAP
  return (
    <section id="location" className="bg-[#FBFBF9]">
      <div className="w-full border-y-0 lg:border-y border-[#1111111C] min-[1024px]:max-[1199px]:!border-t-0 min-[1200px]:max-[1300px]:!border-t-0 mt-0 lg:mt-16 pt-2 lg:pt-0 bg-[#FBFBF9]">
        {/* Desktop layout aligned with ServiceItem */}
        <div className="hidden lg:flex items-stretch min-[1024px]:max-[1199px]:items-center gap-0 min-w-0 min-[1024px]:max-[1199px]:justify-between">
          <div className="w-[clamp(0px,14.93vw,215px)] min-[1024px]:max-[1350px]:w-0 flex-shrink-0" />
          <div className="w-[485px] min-[1024px]:max-[1199px]:!w-[384px] min-[1024px]:max-[1199px]:!min-w-[384px] min-[1200px]:max-[1300px]:!w-[455px] min-[1200px]:max-[1300px]:!min-w-[455px] flex-shrink-0 flex flex-col pt-[clamp(24px,4.44vw,64px)] min-[1200px]:max-[1300px]:!pt-0 pb-0 min-[1024px]:max-[1350px]:pl-[40px] min-[1200px]:max-[1300px]:pl-[80px]">
            <h3 className="font-alternates text-[#111111] text-[2rem] sm:text-[2.375rem] md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem] font-medium leading-[1.1] tracking-[-0.02em] mb-[40px]">
              {t('directions.title')}
            </h3>
            <p className={`${detailTextClass} mb-6`}>{t('directions.body')}</p>

            <div className="space-y-6 pb-6">
              <div>
                <p className="font-montserrat text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] font-semibold text-[#111111] mb-2">
                  {t('directions.address.label')}
                </p>
                <div className="flex items-center gap-2 sm:gap-3 text-[#2d2d2d] leading-[1.6] tracking-[0.45%]">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 relative flex-shrink-0">
                    <img
                      src="/images/directions/locat.svg"
                      alt="Location icon"
                      className="w-full h-full object-contain"
                    />
                  </span>
                  <a
                    href="https://maps.app.goo.gl/z4d33r87E1eAJ6rs9"
                    className={`${detailTextClass} font-normal underline underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer`}
                  >
                    {t('directions.address.value')}
                  </a>
                </div>
              </div>

              <div>
                <p className="font-montserrat text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] font-semibold text-[#111111] mb-2">
                  {t('directions.byCar.label')}
                </p>
                <p className={`${detailTextClass} mb-2`}>{t('directions.byCar.p1')}</p>
                <p className={detailTextClass}>{t('directions.byCar.p2')}</p>
              </div>

              <div>
                <p className="font-montserrat text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] font-semibold text-[#111111] mb-2">
                  {t('directions.transfer.label')}
                </p>
                <p className={detailTextClass}>{t('directions.transfer.p1')}</p>
              </div>
            </div>
          </div>
          <div className="w-0 flex-shrink-0" />
          <div className="relative flex-1 h-full min-w-0 flex justify-end min-[1024px]:max-[1199px]:w-[640px] min-[1024px]:max-[1199px]:flex-none min-[1024px]:max-[1199px]:h-auto min-[1024px]:max-[1199px]:justify-end min-[1024px]:max-[1199px]:self-start min-[1024px]:max-[1199px]:mt-[calc(clamp(24px,4.44vw,64px)+3.575rem+40px)]">
            <div className="relative w-[700px] h-[700px] min-[1024px]:max-[1199px]:w-[600px] min-[1024px]:max-[1199px]:h-[600px] min-[1024px]:max-[1199px]:aspect-square min-[1024px]:max-[1199px]:max-w-full overflow-hidden bg-[#f8f8f5]">
              <img src={mapSrc} alt="Map near the center" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Mobile/tablet layout */}
        <div className="lg:hidden grid grid-cols-1 gap-0 bg-[#FBFBF9]">
          <h3 className="font-alternates text-[#111111] text-[2rem] sm:text-[2.375rem] md:text-[2.75rem] font-medium leading-[1.1] tracking-[-0.02em] mb-2 max-w-[90rem] mx-auto px-0 sm:px-6 md:px-8 pl-5 sm:pl-12 md:pl-16 ml-0 sm:ml-6 md:ml-8 pt-0 sm:pt-6">
            {t('directions.title')}
          </h3>
          <div className="max-w-[90rem] mx-auto px-0 sm:px-6 md:px-8 pl-5 sm:pl-12 md:pl-16 ml-0 sm:ml-6 md:ml-8 pt-0 h-full flex flex-col pb-8">
            <p className={`${detailTextClass} mb-6`}>{t('directions.body')}</p>
            <div className="space-y-6">
              <div>
                <p className="font-montserrat text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] font-semibold text-[#111111] mb-2">
                  {t('directions.address.label')}
                </p>
                <div className="flex items-center gap-2 sm:gap-3 text-[#2d2d2d] leading-[1.6] tracking-[0.45%]">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 relative flex-shrink-0">
                    <img
                      src="/images/directions/locat.svg"
                      alt="Location icon"
                      className="w-full h-full object-contain"
                    />
                  </span>
                  <a
                    href="https://maps.app.goo.gl/z4d33r87E1eAJ6rs9"
                    className={`${detailTextClass} font-normal underline underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer`}
                  >
                    {t('directions.address.value')}
                  </a>
                </div>
              </div>

              <div>
                <p className="font-montserrat text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] font-semibold text-[#111111] mb-2">
                  {t('directions.byCar.label')}
                </p>
                <p className={`${detailTextClass} mb-2`}>{t('directions.byCar.p1')}</p>
                <p className={detailTextClass}>{t('directions.byCar.p2')}</p>
              </div>

              <div>
                <p className="font-montserrat text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] font-semibold text-[#111111] mb-2">
                  {t('directions.transfer.label')}
                </p>
                <p className={detailTextClass}>{t('directions.transfer.p1')}</p>
              </div>
            </div>
          </div>
          <div className="relative w-screen aspect-square overflow-hidden bg-[#f8f8f5] ml-[calc(50%-50vw)]">
            <img src={mapSrc} alt="Map near the center" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

    </section>
  )
}
