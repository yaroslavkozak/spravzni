import type { StaticTranslator } from '@/src/lib/i18n-static'

interface StaticSupportCaptionSectionProps {
  t: StaticTranslator
}

export default function StaticSupportCaptionSection({ t }: StaticSupportCaptionSectionProps) {
  return (
    <section
      id="social"
      className="relative w-full h-[562px] sm:max-lg:h-[600px] lg:h-[900px] overflow-hidden text-white sm:px-6 lg:px-8 lg:mt-[120px] lg:w-[calc(100%-80px)] lg:mx-auto"
    >
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-[60%_center] bg-no-repeat sm:bg-center sm:hidden"
        style={{ backgroundImage: "url('/backg.jpg')" }}
      />
      <div
        className="hidden sm:block lg:hidden absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/other/mangirl.png')" }}
      />
      <div
        className="hidden lg:block absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-team.webp')" }}
      />

      <div className="relative z-10 h-full flex items-start pt-[38px] sm:pt-12 md:pt-16 lg:pt-20 xl:pt-24 px-[22px] sm:px-0">
        <div className="max-w-[40rem] pl-0 sm:pl-6 md:pl-8 lg:pl-10 xl:pl-12 sm:max-lg:max-w-[600px] sm:max-lg:pl-[150px]">
          <p className="text-[1.5rem] xs:text-[1.75rem] sm:text-[2rem] md:text-[2.25rem] lg:text-[2.625rem] xl:text-[3rem] font-semibold leading-[1.15] tracking-[-0.01em] drop-shadow-[0_0.125rem_1.125rem_rgba(0,0,0,0.65)] sm:whitespace-nowrap">
            {t('support.caption.line1')}
          </p>
          <p className="font-montserrat mt-3 sm:mt-4 text-[1rem] sm:text-[1.125rem] md:text-[1.25rem] lg:text-[1.375rem] xl:text-[1.5rem] font-normal leading-[1.5] tracking-[0.02em] drop-shadow-[0_0.125rem_0.75rem_rgba(0,0,0,0.55)]">
            {t('support.caption.line2')} {t('support.caption.line3')}
          </p>
        </div>
      </div>
    </section>
  )
}
