import type { StaticTranslator } from '@/src/lib/i18n-static'

const detailTextClass =
  'font-montserrat text-[16px] font-normal text-[#111111] leading-[150%] tracking-[0.5%]'

interface StaticDirectionsSectionProps {
  t: StaticTranslator
}

export default function StaticDirectionsSection({ t }: StaticDirectionsSectionProps) {
  return (
    <section id="location" className="bg-[#FBFBF9]">
      <div className="w-full border-y-0 lg:border-y border-[#1111111C] mt-0 lg:mt-16 pt-2 lg:pt-0 bg-[#FBFBF9]">
        {/* Desktop layout aligned with ServiceItem */}
        <div className="hidden lg:flex items-stretch gap-0 min-w-0">
          <div className="w-[clamp(0px,14.93vw,215px)] flex-shrink-0" />
          <div className="w-[485px] flex-shrink-0 flex flex-col pt-[clamp(24px,4.44vw,64px)] pb-0">
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
          <div className="relative flex-1 h-full min-w-0 flex justify-end">
            <div className="relative w-[700px] h-[700px] overflow-hidden bg-[#f8f8f5]">
              <img
                src="/images/map/map.webp"
                alt="Map near the center"
                className="w-full h-full object-cover"
              />
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
            <img
              src="/map-mobile.jpg"
              alt="Map near the center"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

    </section>
  )
}
