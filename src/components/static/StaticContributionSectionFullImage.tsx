import type { StaticTranslator } from '@/src/lib/i18n-static'

interface StaticContributionSectionFullImageProps {
  t: StaticTranslator
}

export default function StaticContributionSectionFullImage({
  t,
}: StaticContributionSectionFullImageProps) {
  return (
    <section id="contribute" className="bg-[#F5F6F3] min-[375px]:bg-[#FBFBF9] mb-[3vh] sm:mb-[4vh] md:mb-[5vh]">
      <style>{`
        /* Use 1024.0625px to avoid sub-pixel rounding (1023 showing desktop) */
        @media (min-width: 1024.0625px) and (max-width: 1100px) {
          #contribute .contribute-image-1024-1200 {
            width: 500px !important;
            height: 660px !important;
          }
        }
        @media (min-width: 1100px) and (max-width: 1200px) {
          #contribute .contribute-image-1024-1200 {
            width: 600px !important;
            height: 660px !important;
          }
        }
        @media (min-width: 1200px) {
          #contribute .contribute-image-1024-1200 {
            width: 660px !important;
            height: 660px !important;
          }
        }
        @media (min-width: 1024.0625px) {
          #contribute .contribute-grid-1024-1200 {
            column-gap: 0 !important;
          }
          #contribute .contribute-gap-spacer {
            width: 40px !important;
          }
          #contribute .contribute-content-1024-1200 {
            padding-bottom: 64px !important;
          }
          #contribute .contribute-title-1024-1200 {
            font-family: var(--font-alternates), sans-serif !important;
            font-weight: 500 !important;
            font-size: 62px !important;
            line-height: 110% !important;
            letter-spacing: -0.02em !important;
          }
        }
        @media (min-width: 1300px) and (max-width: 1440px) {
          #contribute .contribute-gap-spacer {
            width: clamp(120px, 9.23vw, 200px) !important;
          }
        }
      `}</style>
      <div className="max-w-[90rem] mx-auto px-4 min-[640px]:max-[1023.99px]:pl-[160px] min-[640px]:max-[1023.99px]:pr-[80px] min-[1024.01px]:pl-0 min-[1024.01px]:pr-0 min-[1024.01px]:max-[1100px]:pl-[3.90625%] min-[1024.01px]:max-[1100px]:pr-16 min-[1100px]:max-[1200px]:pl-10 min-[1100px]:max-[1200px]:pr-16 min-[1200px]:max-[1440px]:pl-20 min-[1200px]:max-[1440px]:pr-20">
        {/* 1024+: flex layout - image left, content right. min 1024.01px avoids 1023 showing desktop */}
        <div className="contribute-flex-1024-1200 hidden min-[1024.01px]:flex items-stretch justify-start gap-0 min-w-0">
          <div className="relative contribute-image-1024-1200 w-[500px] min-[1100px]:w-[600px] min-[1200px]:w-[660px] h-[660px] flex-shrink-0 bg-cover bg-center bg-no-repeat self-start min-[1024.01px]:max-[1100px]:-ml-[3.90625%] min-[1100px]:max-[1200px]:-ml-10 min-[1200px]:max-[1300px]:-ml-20" style={{ backgroundImage: "url('/make-donation.png')" }} />
          <div className="contribute-gap-spacer w-10 flex-shrink-0" />
          <div className="contribute-content-1024-1200 flex flex-col items-start justify-between text-[#111111] w-[440px] flex-shrink-0 pt-10 min-[1024.01px]:max-[1100px]:pt-10 min-[1100px]:max-[1200px]:pl-10 pb-[64px] min-h-[660px]">
            <div>
              <h3 className="contribute-title-1024-1200 font-alternates text-[#111111] font-medium leading-[1.1] tracking-[-0.02em] mb-10" style={{ fontSize: 'clamp(1.5rem, 1.25rem + 1.25vw, 3.75rem)' }}>
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
                <a href="/report" className="underline underline-offset-4 hover:opacity-80 transition-opacity">
                  {t('hero.subtitle.report')}
                </a>
              </p>
            </div>
            <a
              href="/donate"
              className="font-montserrat inline-flex items-center justify-center bg-[#28694D] text-white font-normal leading-[150%] tracking-[0.5%] rounded-full px-[100px] py-[9px] hover:opacity-95 transition whitespace-nowrap"
              style={{ fontWeight: 400, fontSize: 'clamp(0.875rem, 0.75rem + 0.5vw, 1.25rem)' }}
            >
              {t('contribution.cta')}
            </a>
          </div>
        </div>
        {/* Default: grid layout (mobile + 1200+) */}
        <div className="contribute-grid-1024-1200 grid grid-cols-1 min-[1024.01px]:grid-cols-[647px_484px] gap-[24px] sm:gap-6 min-[1024.01px]:gap-x-[134px] min-[1024.01px]:gap-y-0 min-h-[400px] sm:min-h-[500px] md:min-h-[550px] min-[1024.01px]:h-[600px] min-[1024.01px]:!hidden">
          <h3
            className="font-alternates text-[#111111] font-medium leading-[1.1] tracking-[-0.02em] mb-0 sm:mb-8 md:mb-10 mt-4 min-[1024.01px]:hidden order-1 text-[clamp(1.5rem,1.25rem+1.25vw,3.75rem)] min-[900px]:max-[1023.99px]:text-[62px] min-[900px]:max-[1023.99px]:leading-[1.1] min-[900px]:max-[1023.99px]:tracking-[-0.02em]"
          >
            {t('contribution.title')}
          </h3>

          <div
            className="contribute-image-1024-1200 relative w-full min-[1024.01px]:w-[647px] min-[1024.01px]:h-[600px] bg-cover bg-center bg-no-repeat order-2 min-[1024.01px]:col-start-1 min-[1024.01px]:row-start-1 min-[1024.01px]:row-span-1 min-[900px]:max-[1023.99px]:w-[660px] min-[900px]:max-[1023.99px]:!h-[660px] min-[900px]:max-[1023.99px]:!ml-0 min-[900px]:max-[1023.99px]:!mr-0 min-[900px]:max-[1023.99px]:justify-self-start min-[1024.01px]:mx-0"
            style={{ backgroundImage: "url('/make-donation.png')", aspectRatio: '1 / 1' }}
          />

          <div className="flex flex-col items-start justify-start text-[#111111] w-full px-0 min-[1024.01px]:hidden order-3 min-[900px]:max-[1023.99px]:pb-[40px]">
            <p
              className="font-montserrat leading-[1.6] tracking-[0.45%] mb-4 sm:mb-5 md:mb-6"
              style={{ fontSize: 'clamp(0.875rem, 0.8125rem + 0.25vw, 1.0625rem)' }}
            >
              {t('contribution.p1')}
            </p>
            <p
              className="font-montserrat leading-[1.6] tracking-[0.45%] mb-4 sm:mb-5 md:mb-6"
              style={{ fontSize: 'clamp(0.875rem, 0.8125rem + 0.25vw, 1.0625rem)' }}
            >
              {t('contribution.p2')}
            </p>
            <p
              className="font-montserrat leading-[1.6] tracking-[0.45%] mb-8 sm:mb-9 md:mb-10"
              style={{ fontSize: 'clamp(0.875rem, 0.8125rem + 0.25vw, 1.0625rem)' }}
            >
              {t('contribution.p3')}{' '}
              <a href="/report" className="underline underline-offset-4 hover:opacity-80 transition-opacity">
                {t('hero.subtitle.report')}
              </a>
            </p>
            <a
              href="/donate"
              className="font-montserrat inline-flex w-full sm:w-auto items-center justify-center bg-[#28694D] text-white font-normal leading-[150%] tracking-[0.5%] rounded-full px-8 sm:px-12 md:px-16 lg:px-[100px] py-3 sm:py-[9px] hover:opacity-95 transition whitespace-nowrap"
              style={{ fontWeight: 400, fontSize: 'clamp(0.875rem, 0.75rem + 0.5vw, 1.25rem)' }}
            >
              {t('contribution.cta')}
            </a>
          </div>

          <div className="hidden min-[1024.01px]:flex flex-col items-start justify-start text-[#111111] w-full min-[1024.01px]:w-[484px] min-[1024.01px]:max-[1200px]:w-[440px] px-0 min-[1024.01px]:pt-16 min-[1024.01px]:col-start-2 min-[1024.01px]:row-start-1">
            <h3
              className="font-alternates text-[#111111] font-medium leading-[1.1] tracking-[-0.02em] mb-10"
              style={{ fontSize: 'clamp(1.5rem, 1.25rem + 1.25vw, 3.75rem)' }}
            >
              {t('contribution.title')}
            </h3>
            <p
              className="font-montserrat leading-[1.6] tracking-[0.45%] mb-4"
              style={{ fontSize: 'clamp(0.875rem, 0.8125rem + 0.25vw, 1.0625rem)' }}
            >
              {t('contribution.p1')}
            </p>
            <p
              className="font-montserrat leading-[1.6] tracking-[0.45%] mb-4"
              style={{ fontSize: 'clamp(0.875rem, 0.8125rem + 0.25vw, 1.0625rem)' }}
            >
              {t('contribution.p2')}
            </p>
            <p
              className="font-montserrat leading-[1.6] tracking-[0.45%] mb-8"
              style={{ fontSize: 'clamp(0.875rem, 0.8125rem + 0.25vw, 1.0625rem)' }}
            >
              {t('contribution.p3')}{' '}
              <a href="/report" className="underline underline-offset-4 hover:opacity-80 transition-opacity">
                {t('hero.subtitle.report')}
              </a>
            </p>
            <a
              href="/donate"
              className="font-montserrat inline-flex items-center justify-center bg-[#28694D] text-white font-normal leading-[150%] tracking-[0.5%] rounded-full px-[100px] py-[9px] hover:opacity-95 transition whitespace-nowrap"
              style={{ fontWeight: 400, fontSize: 'clamp(0.875rem, 0.75rem + 0.5vw, 1.25rem)' }}
            >
              {t('contribution.cta')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
