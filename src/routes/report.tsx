import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense, useEffect, useState } from 'react'
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

export const Route = createFileRoute('/report')({
  component: ReportPage,
})

function ReportPage() {
  return (
    <PageClientShell>
      <ReportPageContent />
    </PageClientShell>
  )
}

function ReportPageContent() {
  const { t, language } = useI18n()
  const [reportRows, setReportRows] = useState<
    Array<{ period: string; amount: string; category: string }>
  >([])
  const [updatedDate, setUpdatedDate] = useState<string | null>(null)
  const [incomingAmount, setIncomingAmount] = useState<string>('229 850, 00 ₴')
  const [outgoingAmount, setOutgoingAmount] = useState<string>('160 036, 00 ₴')

  useEffect(() => {
    const loadReportData = async () => {
      try {
        const response = await fetch(`/api/report?lang=${language}`)
        if (!response.ok) {
          return
        }
        const data = await response.json()
        if (data.success) {
          setReportRows(data.items || [])
          setUpdatedDate(data.updatedDate || null)
          if (data.incomingAmount) {
            setIncomingAmount(data.incomingAmount)
          }
          if (data.outgoingAmount) {
            setOutgoingAmount(data.outgoingAmount)
          }
        }
      } catch (error) {
        console.error('Failed to load report data:', error)
      }
    }

    loadReportData()
  }, [language])

  const formatReportDate = (value: string | null) => {
    if (!value) return t('report.updatedDate')
    const parts = value.split('-')
    if (parts.length === 3) {
      const [year, month, day] = parts
      return `${day}.${month}.${year}`
    }
    return value
  }

  const formatAmountHeader = () => {
    const amountText = t('report.table.amount')
    const match = amountText.match(/^(.+?)(\(.+\))$/)
    if (match) {
      return { main: match[1], suffix: match[2] }
    }
    return { main: amountText, suffix: '' }
  }

  return (
      <main className="min-h-screen bg-[#FBFBF9]">
      <style>{`
        .report-page header.header-fade-in {
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
        .report-page header .text-white:not(button[class*="28694D"] *),
        .report-page header svg.text-white:not(button[class*="28694D"] *),
        .report-page header a.text-white:not(button[class*="28694D"] *),
        .report-page header span.text-white:not(button[class*="28694D"] *),
        .report-page header button.text-white:not([class*="28694D"]) {
          color: #111111 !important;
        }
        .report-page header svg.icon-stroke-hover,
        .report-page header svg[stroke="currentColor"] {
          stroke: #111111 !important;
        }
        .report-page header img[alt="Logo"] {
          filter: brightness(0) !important;
        }
        .report-page header img[alt="Menu"] {
          filter: brightness(0) !important;
        }
        .report-page header button[aria-label="Toggle menu"] {
          color: #111111 !important;
        }
        .report-page header button[aria-label="Toggle menu"] svg {
          stroke: #111111 !important;
          color: #111111 !important;
        }
        .report-page header button[aria-label="Toggle menu"] img {
          filter: brightness(0) !important;
        }
        .report-page header .backdrop-blur-header {
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
        }
        .report-page header > div > div[class*="max-w"] {
          background: transparent !important;
        }
        .report-page header svg {
          stroke: #111111 !important;
          color: #111111 !important;
        }
        .report-page header svg path {
          stroke: #111111 !important;
          fill: #111111 !important;
        }
        .report-page header img[src*="icon"],
        .report-page header img[src*="Icon"] {
          filter: brightness(0) !important;
        }
        .report-page header button:not([class*="28694D"]) span {
          color: #111111 !important;
        }
      `}</style>
      <div className="report-page">
        <Header />
      </div>

      <div className="bg-[#FBFBF9] py-2 md:pt-4 md:pb-0">
        <div className="max-w-[90rem] mx-auto px-5 md:pl-[2.5rem] md:pr-[2.5rem] xl:pl-10 xl:pr-10">
          <a
            href="/"
            className="font-montserrat font-normal text-[16px] leading-[150%] tracking-[0.5%] hover:underline"
            style={{ color: 'hsla(154, 45%, 28%, 1)' }}
          >
            &lt; {t('report.back')}
          </a>
      </div>
      </div>

      <section className="border-b-0 border-[#1111111C] mb-6 sm:mb-8 xl:mb-[45px] w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="max-w-[90rem] mx-auto px-5 sm:px-6 md:px-8 lg:px-16 border-t border-[#11111112]">
          <div className="max-w-5xl mx-auto pb-[24px] xl:pb-0 pt-8 xl:pt-12">
            <div className="pl-0 md:pl-0 xl:pl-0">
              <h1 className="font-alternates text-[#111111] text-[32px] xl:text-[62px] font-medium leading-[110%] tracking-[-2%]">
                {t('report.title')}
              </h1>
              <p className="font-montserrat text-[#28694D] text-[16px] xl:text-[24px] font-bold leading-[130%] tracking-[1.5%] mt-0 md:mt-2">
                {t('report.organization')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-12 sm:pb-16 md:pb-20">
        <section className="border-t border-[#1111111C] w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <div className="max-w-[90rem] mx-auto px-5 sm:px-6 md:px-8 lg:px-16 pt-8 xl:pt-12 pb-0">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row gap-y-6 md:gap-6 xl:gap-x-[80px] xl:items-end">
                <div className="bg-white rounded-xl px-0 py-0 md:px-6 md:pt-6 md:pb-0 flex flex-col items-start gap-1 xl:w-[246px] xl:h-[103px] xl:pl-0 xl:pr-0 xl:pt-6 xl:pb-0 xl:justify-end relative">
                  <div className="text-[#666] text-[14px] font-montserrat absolute top-0 right-0 md:hidden">
                    {t('report.updatedLabel')} {formatReportDate(updatedDate)}
                  </div>
                  <div className="text-[#28694D] pr-5 pl-0 md:px-0 xl:px-0">
                    <img
                      src="/icons/report/income.svg"
                      alt=""
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="text-[#111111] text-[18px] md:text-[28px] font-bold font-montserrat leading-[1.2] pr-5 pl-0 md:px-0 xl:px-0">
                    {incomingAmount}
                  </div>
                  <div className="text-[#111111] text-[16px] md:text-[18px] font-normal font-montserrat pr-5 pl-0 md:px-0 xl:px-0">
                    {t('report.incoming.label')}
                  </div>
                </div>
                <div className="bg-white rounded-xl px-0 py-0 md:px-6 md:pt-6 md:pb-0 flex flex-col items-start gap-1 xl:w-[246px] xl:h-[103px] xl:pl-0 xl:pr-0 xl:pt-6 xl:pb-0 xl:justify-end">
                  <div className="text-[#28694D] pr-5 pl-0 md:px-0 xl:px-0">
                    <img
                      src="/icons/report/funds.svg"
                      alt=""
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="text-[#28694D] text-[18px] md:text-[28px] font-bold font-montserrat leading-[1.2] pr-5 pl-0 md:px-0 xl:px-0">
                    {outgoingAmount}
                  </div>
                  <div className="text-[#111111] text-[16px] md:text-[18px] font-normal font-montserrat pr-5 pl-0 md:px-0 xl:px-0">
                    {t('report.outgoing.label')}
                  </div>
                </div>
                <div className="text-[#666] text-[14px] font-montserrat pr-0 pl-0 hidden md:flex md:flex-1 md:items-end md:justify-end md:text-right">
                  {t('report.updatedLabel')} {formatReportDate(updatedDate)}
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="max-w-[90rem] mx-auto px-5 sm:px-6 md:px-8 lg:px-16">
          <div className="max-w-5xl mx-auto mt-6 md:mt-12 space-y-10">

          <section className="bg-white rounded-xl pt-0 pb-6 pl-0 pr-0 md:px-0 md:pr-0">
            <div className="flex flex-col items-start gap-2 mb-4 px-0 md:pr-0">
              <div className="text-[#28694D]">
                <img
                  src="/icons/report/swipe.svg"
                  alt=""
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <h2 className="text-[#111111] text-[16px] font-bold font-montserrat">
                {t('report.section.usageTitle')}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-[#1111111C] text-left table-fixed w-full md:max-w-none">
                <thead className="bg-[#FBFBF9] text-[#656565] text-[14px] md:text-[16px] font-normal font-montserrat">
                  <tr>
                    <th className="px-[7px] py-[7px] border-b border-r border-[#1111111C] font-normal align-top md:align-middle w-[30.72%] md:w-[21.68%]">{t('report.table.period')}</th>
                    <th className="px-[7px] py-[7px] border-b border-r border-[#1111111C] font-normal align-top md:align-middle w-[23.20%] md:w-[16.26%]">
                      {(() => {
                        const { main, suffix } = formatAmountHeader()
                        return (
                          <>
                            <span className="block md:inline">{main}</span>
                            {suffix && <span className="block md:inline">{suffix}</span>}
                          </>
                        )
                      })()}
                    </th>
                    <th className="px-[7px] py-[7px] border-b border-[#1111111C] font-normal align-top md:align-middle w-[46.08%] md:w-[62.06%]">{t('report.table.category')}</th>
                  </tr>
                </thead>
                <tbody className="text-[#111111] font-normal font-montserrat">
                  {reportRows.map((row, index) => (
                    <tr key={`${row.period}-${index}`} className="border-b border-[#1111111C] last:border-b-0">
                      <td className="px-[7px] py-[7px] border-r border-[#1111111C] text-[14px] md:text-[16px]">{row.period}</td>
                      <td className="px-[7px] py-[7px] border-r border-[#1111111C] text-[14px] md:text-[16px]">{row.amount}</td>
                      <td className="px-[7px] py-[7px] text-[14px] md:text-[16px]">{row.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
