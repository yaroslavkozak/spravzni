import type { StaticTranslator } from '@/src/lib/i18n-static'

interface StaticAboutSectionProps {
  t: StaticTranslator
}

export default function StaticAboutSection({ t }: StaticAboutSectionProps) {
  return (
    <section id="about" className="bg-white overflow-x-clip">
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-16 xl:px-20 pb-10 border-b border-[rgba(17,17,17,0.11)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-12 lg:gap-16 xl:gap-20">
          <div className="relative w-full">
            {/* Quote - mobile: top-right of column; desktop: in flex row */}
            <span className="lg:hidden absolute -top-[3px] right-0 z-10">
              <img
                src="/images/about/lapki.svg"
                alt="Quote mark"
                width={108}
                height={108}
                className="object-contain w-16 h-16"
              />
            </span>
            <div className="relative z-10 mb-4 sm:mb-5 md:mb-6 flex flex-row-reverse lg:flex-row items-start gap-2 sm:gap-3">
              <span className="hidden lg:inline-flex flex-shrink-0 mt-1">
                <img
                  src="/images/about/lapki.svg"
                  alt="Quote mark"
                  width={108}
                  height={108}
                  className="object-contain w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
                />
              </span>
              <p className="font-montserrat font-normal text-[#111111] text-[16px] leading-[1.5em] tracking-[0.5%] flex-1 min-w-0 mt-[51px] lg:mt-0">
                {t('about.p1')}
              </p>
            </div>

            <p className="relative z-10 font-montserrat font-normal text-[#111111] text-[16px] leading-[1.5em] tracking-[0.5%] ml-0 sm:ml-[calc(5rem+0.75rem)] md:ml-[calc(6rem+0.75rem)] lg:ml-[calc(7rem+0.75rem)]">
              {t('about.p2')}
            </p>

            {/* Mobile-only full-bleed image */}
            <div className="lg:hidden w-screen relative left-1/2 -translate-x-1/2 mt-6">
              <img
                src="/about-mob.jpg"
                alt=""
                className="w-full aspect-[375/221] object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col w-full">
            <p className="font-montserrat font-normal text-[#111111] text-[16px] leading-[1.5em] tracking-[0.5%] mb-4 sm:mb-5 md:mb-6 max-w-none sm:max-w-[calc(100%-5rem-0.75rem)] md:max-w-[calc(100%-6rem-0.75rem)] lg:max-w-[calc(100%-7rem-0.75rem)]">
              {t('about.p3')}
            </p>

            <p className="font-montserrat font-normal text-[#111111] text-[16px] leading-[1.5em] tracking-[0.5%] mb-4 max-w-none sm:max-w-[calc(100%-5rem-0.75rem)] md:max-w-[calc(100%-6rem-0.75rem)] lg:max-w-[calc(100%-7rem-0.75rem)]">
              {t('about.p4')}
            </p>

            <div className="hidden lg:flex mt-auto justify-end lg:justify-start">
              <a
                href="#mi"
                className="text-[#28694D] text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] font-medium hover:opacity-80 transition-opacity inline-block underline"
              >
                {t('about.readMore')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
