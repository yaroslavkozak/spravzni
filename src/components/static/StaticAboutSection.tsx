import type { Translator } from '@/src/lib/translator'
import { useSlider } from '@/src/contexts/SliderContext'

interface StaticAboutSectionProps {
  t: Translator
}

export default function StaticAboutSection({ t }: StaticAboutSectionProps) {
  const { navigateToSlide } = useSlider()

  const handleReadMoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    // Go to second slide (index 1) in the shared slider
    navigateToSlide(1)
    // Smooth scroll to the slider section
    const sliderSection = document.getElementById('mi')
    if (sliderSection) {
      sliderSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  return (
    <section id="about" className="bg-white overflow-x-clip">
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 min-[756px]:px-16 xl:px-20 pb-10 min-[756px]:pb-0 lg:pb-10 border-b border-[rgba(17,17,17,0.11)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-12 min-[756px]:gap-y-0 min-[756px]:gap-x-16 lg:gap-y-16 lg:gap-x-16 xl:gap-20">
          <div className="relative w-full">
            {/* Quote - mobile: top-right of column; desktop: in flex row */}
            <span className="min-[756px]:hidden absolute -top-[3px] right-0 z-10">
              <img
                src="/images/about/lapki.svg"
                alt="Quote mark"
                width={108}
                height={108}
                className="object-contain w-16 h-16"
              />
            </span>
            <div className="relative z-10 mb-4 sm:mb-5 md:mb-6 flex flex-row-reverse min-[756px]:flex-row items-start min-[756px]:items-end lg:items-start gap-2 sm:gap-3">
              <span className="hidden min-[756px]:inline-flex flex-shrink-0 mt-1">
                <img
                  src="/images/about/lapki.svg"
                  alt="Quote mark"
                  width={108}
                  height={108}
                  className="object-contain w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 min-[756px]:w-28 min-[756px]:h-28 lg:w-28 lg:h-28"
                />
              </span>
              <p className="font-montserrat font-normal text-[#111111] text-[16px] leading-[1.5em] tracking-[0.5%] flex-1 min-w-0 mt-[80px] min-[756px]:mt-0">
                {t('about.p1')}
              </p>
            </div>

            <p className="relative z-10 font-montserrat font-normal text-[#111111] text-[16px] leading-[1.5em] tracking-[0.5%] ml-0 min-[1024px]:ml-[calc(7rem+0.75rem)]">
              {t('about.p2')}
            </p>

            {/* Mobile-only full-bleed image */}
            <div className="min-[756px]:hidden w-screen relative left-1/2 -translate-x-1/2 mt-6">
              <img
                src="/about-mob.jpg"
                alt=""
                className="w-full aspect-[375/221] object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col w-full">
            <p className="font-montserrat font-normal text-[#111111] text-[16px] leading-[1.5em] tracking-[0.5%] mb-4 sm:mb-5 md:mb-6 max-w-none min-[756px]:max-w-none lg:max-w-[calc(100%-7rem-0.75rem)]">
              {t('about.p3')}
            </p>

            <p className="font-montserrat font-normal text-[#111111] text-[16px] leading-[1.5em] tracking-[0.5%] mb-4 max-w-none min-[756px]:max-w-none lg:max-w-[calc(100%-7rem-0.75rem)]">
              {t('about.p4')}
            </p>

            <div className="hidden min-[756px]:flex mt-auto justify-end min-[756px]:justify-start">
              <a
                href="#mi"
                onClick={handleReadMoreClick}
                className="font-montserrat text-[#28694D] text-[16px] font-medium hover:opacity-80 transition-opacity inline-block underline underline-offset-4"
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
