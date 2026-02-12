import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import Header from '@/src/components/Header'
import { useI18n } from '@/src/contexts/I18nContext'
import PageClientShell from '@/src/components/PageClientShell'

const FooterSection = lazy(() => import('@/src/components/FooterSection'))

const LoadingFallback = () => {
  const { t } = useI18n()
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-400">{t('common.loading')}</div>
    </div>
  )
}

export const Route = createFileRoute('/terms')({
  component: TermsPage,
})

function TermsPage() {
  return (
    <PageClientShell>
      <TermsPageContent />
    </PageClientShell>
  )
}

function TermsPageContent() {
  const { t, language } = useI18n()

  return (
      <main className="min-h-screen bg-[#FBFBF9]">
      <style>{`
        .terms-page header.header-fade-in {
          animation: none !important;
          opacity: 1 !important;
          transform: translateY(0) !important;
          pointer-events: auto !important;
          position: sticky !important;
          top: 0 !important;
          background: rgba(242, 242, 241, 0.8) !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
        }
        .terms-page header .text-white:not(button[class*="28694D"] *),
        .terms-page header svg.text-white:not(button[class*="28694D"] *),
        .terms-page header a.text-white:not(button[class*="28694D"] *),
        .terms-page header span.text-white:not(button[class*="28694D"] *),
        .terms-page header button.text-white:not([class*="28694D"]) {
          color: #111111 !important;
        }
        .terms-page header svg.icon-stroke-hover,
        .terms-page header svg[stroke="currentColor"] {
          stroke: #111111 !important;
        }
        .terms-page header img[alt="Logo"] {
          filter: brightness(0) !important;
        }
        .terms-page header img[alt="Menu"] {
          filter: brightness(0) !important;
        }
        .terms-page header button[aria-label="Toggle menu"] {
          color: #111111 !important;
        }
        .terms-page header button[aria-label="Toggle menu"] svg {
          stroke: #111111 !important;
          color: #111111 !important;
        }
        .terms-page header button[aria-label="Toggle menu"] img {
          filter: brightness(0) !important;
        }
        .terms-page header .backdrop-blur-header {
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
        }
        .terms-page header > div > div[class*="max-w"] {
          background: transparent !important;
        }
        .terms-page header svg {
          stroke: #111111 !important;
          color: #111111 !important;
        }
        .terms-page header svg path {
          stroke: #111111 !important;
          fill: #111111 !important;
        }
        .terms-page header img[src*="icon"],
        .terms-page header img[src*="Icon"] {
          filter: brightness(0) !important;
        }
        .terms-page header button:not([class*="28694D"]) span {
          color: #111111 !important;
        }
      `}</style>
      <div className="terms-page">
        <Header />
      </div>
      {/* Breadcrumbs */}
      <div className="bg-[#FBFBF9] pt-4">
        <div className="max-w-[90rem] mx-auto pl-[2.25rem] pr-[2.25rem] md:pl-[2.5rem] md:pr-[2.5rem] xl:pl-10 xl:pr-10">
          <a href="/" className="font-montserrat font-normal text-[16px] leading-[150%] tracking-[0.5%] hover:underline" style={{ color: 'hsla(154, 45%, 28%, 1)' }}>
            &lt; На головну
          </a>
        </div>
      </div>
      <section className="border-b border-[#1111111C] mb-6 sm:mb-8 xl:mb-[45px] w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto pb-[24px] pt-8 xl:pt-12">
            <h1 className="font-alternates text-[#111111] text-[32px] font-medium leading-[1.1em] tracking-[-2%]">
              {t('terms.title')}
            </h1>
          </div>
        </div>
      </section>
      
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none font-montserrat text-[#111111] text-[16px] leading-[1.6em] space-y-6">
            <section>
              <h2 className="font-bold text-[16px] mb-4">{t('terms.section1.title')}</h2>
              <p>
                {t('terms.section1.body')}
              </p>
            </section>

            <section>
              <h2 className="font-bold text-[16px] mb-4">{t('terms.section2.title')}</h2>
              <p>
                {t('terms.section2.body')}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{t('terms.section2.item1')}</li>
                <li>{t('terms.section2.item2')}</li>
                <li>{t('terms.section2.item3')}</li>
                <li>{t('terms.section2.item4')}</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-[16px] mb-4">{t('terms.section3.title')}</h2>
              <p>
                {t('terms.section3.body')}
              </p>
            </section>

            <section>
              <h2 className="font-bold text-[16px] mb-4">{t('terms.section4.title')}</h2>
              <p>
                {t('terms.section4.body')}
              </p>
            </section>

            <section>
              <h2 className="font-bold text-[16px] mb-4">{t('terms.section5.title')}</h2>
              <p>
                {t('terms.section5.body')}
              </p>
            </section>

            <section>
              <h2 className="font-bold text-[16px] mb-4">{t('terms.section6.title')}</h2>
              <p>
                {t('terms.section6.body')}
              </p>
            </section>

            <section>
              <h2 className="font-bold text-[16px] mb-4">{t('terms.section7.title')}</h2>
              <p>
                {t('terms.section7.body')}
              </p>
            </section>

            <section>
              <h2 className="font-bold text-[16px] mb-4">{t('terms.section8.title')}</h2>
              <p>
                {t('terms.section8.body')}
              </p>
              <p className="mt-2">
                {t('terms.section8.emailLabel')} <a href="mailto:spravzhni.lviv@gmail.com" className="text-[#28694D] hover:underline">spravzhni.lviv@gmail.com</a>
              </p>
              <p>
                {t('terms.section8.phoneLabel')} <a href="tel:+380673708336" className="text-[#28694D] hover:underline">+38 (067) 370 83 36</a>
              </p>
            </section>

            <section>
              <h2 className="font-bold text-[16px] mb-4">{t('terms.section9.title')}</h2>
              <p>
                {t('terms.section9.body')}
              </p>
              <p className="mt-4 text-[14px] text-[#666]">
                {t('terms.lastUpdated')} {new Date().toLocaleDateString(language === 'uk' ? 'uk-UA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </section>
          </div>
        </div>
      </div>

      <Suspense fallback={<LoadingFallback />}>
        <FooterSection />
      </Suspense>
      </main>
  )
}
