import type { Translator } from '@/src/lib/translator'

interface StaticImagineSectionProps {
  t: Translator
}

export default function StaticImagineSection({ t }: StaticImagineSectionProps) {
  return (
    <section
      id="imagine"
      className="bg-[#FBFBF9] py-[38.4px] sm:py-[51.2px] md:py-16 xl:py-16 flex flex-col justify-center"
    >
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-8">
        <div className="flex flex-col">
          <div className="max-w-[671px] w-full mx-auto text-left px-4">
            <h2 className="font-alternates text-[#111111] text-[28px] sm:text-[40px] md:text-[52px] lg:text-[64px] font-bold leading-[1.1em] tracking-[-2%] break-words">
              {t('imagine.title')}
            </h2>
            <p className="font-alternates text-[#000000] text-[28px] sm:text-[40px] md:text-[52px] lg:text-[64px] font-normal leading-[1.1em] tracking-[-2%] break-words">
              {t('imagine.line1')}
            </p>
            <p className="font-alternates text-[#000000] text-[28px] sm:text-[40px] md:text-[52px] lg:text-[64px] font-normal leading-[1.1em] tracking-[-2%] break-words">
              {t('imagine.line2')}
            </p>
          </div>
        </div>

        <div className="flex flex-col flex-wrap gap-4 sm:gap-5 md:gap-6 pr-0 md:pr-[280px] lg:pr-[400px] pl-[4.875rem] md:pl-0 lg:pl-0 mx-auto md:mx-0 items-start md:items-end mt-6 md:mt-0 py-8 sm:py-10 md:py-12 lg:py-16">
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 md:ml-[17.125rem] lg:ml-[24.375rem] xl:ml-[28.75rem]">
            <div className="flex flex-col justify-end gap-8 sm:gap-12 md:gap-16 w-full md:w-[350px] lg:w-[392px]">
              <p className="font-montserrat text-[#404040] text-[1rem] sm:text-[24px] font-light leading-[1.3em] tracking-[1.5%] text-left">
                {t('imagine.p1.line1')}
                <br />
                {t('imagine.p1.line2')}
              </p>
            </div>
            <div className="flex flex-col justify-end gap-8 sm:gap-12 md:gap-16 w-full md:w-[350px] lg:w-[392px]">
              <p className="font-montserrat text-[#404040] text-[1rem] sm:text-[24px] font-light leading-[1.3em] tracking-[1.5%] text-left">
                {t('imagine.p2')}
              </p>
            </div>
            <div className="flex flex-col justify-end gap-8 sm:gap-12 md:gap-16 w-full md:w-[350px] lg:w-[392px]">
              <p className="font-montserrat text-[#404040] text-[1rem] sm:text-[24px] font-light leading-[1.3em] tracking-[1.5%] text-left">
                {t('imagine.p3.line1')}
                <br />
                {t('imagine.p3.line2')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
