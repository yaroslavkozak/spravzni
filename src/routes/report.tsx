import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense, useEffect, useState } from 'react'
import Header from '@/src/components/Header'
import { useI18n } from '@/src/contexts/I18nContext'

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
  const { t } = useI18n()
  const [reportRows, setReportRows] = useState<
    Array<{ period: string; amount: string; category: string }>
  >([])
  const [updatedDate, setUpdatedDate] = useState<string | null>(null)
  const [incomingAmount, setIncomingAmount] = useState<string>('229 850, 00 ₴')
  const [outgoingAmount, setOutgoingAmount] = useState<string>('160 036, 00 ₴')

  useEffect(() => {
    const loadReportData = async () => {
      try {
        const response = await fetch('/api/report')
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
  }, [])

  const formatReportDate = (value: string | null) => {
    if (!value) return t('report.updatedDate')
    const parts = value.split('-')
    if (parts.length === 3) {
      const [year, month, day] = parts
      return `${day}.${month}.${year}`
    }
    return value
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
        .report-page header button[class*="28694D"],
        .report-page header button[class*="28694D"] span,
        .report-page header button[class*="28694D"] .text-white,
        .report-page header button[class*="28694D"] * {
          color: #ffffff !important;
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

      <div className="bg-[#FBFBF9] pt-4">
        <div className="max-w-[90rem] mx-auto pl-[2.25rem] pr-[2.25rem] md:pl-[2.5rem] md:pr-[2.5rem] xl:pl-10 xl:pr-10">
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
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          <div className="max-w-5xl mx-auto pb-[24px] pt-8 xl:pt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-0 md:gap-3">
            <div className="pl-6 md:pl-0">
              <h1 className="font-alternates text-[#111111] text-[20px] font-semibold leading-[1.1em] tracking-[-2%]">
                {t('report.title')}
              </h1>
              <p className="font-montserrat text-[#333] text-[16px] leading-[1.5em] mt-0 md:mt-2">
                {t('report.organization')}
              </p>
            </div>
            <div className="text-[#666] text-[14px] font-montserrat pl-6 md:pl-0">
              {t('report.updatedLabel')} {formatReportDate(updatedDate)}
            </div>
          </div>
        </div>
      </section>

      <div className="pb-12 sm:pb-16 md:pb-20">
        <section className="border-y border-[#1111111C] w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <div className="max-w-[90rem] mx-auto px-0 md:px-6 lg:px-8 xl:px-16 py-6">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-6">
                <div className="bg-white rounded-xl px-0 py-0 md:px-6 md:py-6 flex flex-col items-start gap-1">
                  <div className="text-[#28694D] px-6 md:px-0">
                    <img
                      src="/icons/report/income.svg"
                      alt=""
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="text-[#111111] text-[28px] font-bold font-montserrat leading-[1.2] px-6 md:px-0">
                    {incomingAmount}
                  </div>
                  <div className="text-[#111111] text-[18px] font-normal font-montserrat px-6 md:px-0">
                    {t('report.incoming.label')}
                  </div>
                </div>
                <div className="bg-white rounded-xl px-0 py-0 md:px-6 md:py-6 flex flex-col items-start gap-1">
                  <div className="text-[#28694D] px-6 md:px-0">
                    <img
                      src="/icons/report/funds.svg"
                      alt=""
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="text-[#28694D] text-[28px] font-bold font-montserrat leading-[1.2] px-6 md:px-0">
                    {outgoingAmount}
                  </div>
                  <div className="text-[#111111] text-[18px] font-normal font-montserrat px-6 md:px-0">
                    {t('report.outgoing.label')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          <div className="max-w-5xl mx-auto mt-10 space-y-10">

          <section className="bg-white rounded-xl py-6 px-0 md:px-6">
            <div className="flex flex-col items-start gap-2 mb-4 px-0 md:px-6">
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
              <table className="min-w-full border border-[#1111111C] text-left table-fixed max-w-[400px] md:max-w-none">
                <thead className="bg-[#FBFBF9] text-[#656565] text-[14px] md:text-[16px] font-normal font-montserrat">
                  <tr>
                    <th className="px-[7px] py-[7px] border-b border-r border-[#1111111C] font-normal w-[30.72%] md:w-[21.68%]">{t('report.table.period')}</th>
                    <th className="px-[7px] py-[7px] border-b border-r border-[#1111111C] font-normal w-[23.20%] md:w-[16.26%]">{t('report.table.amount')}</th>
                    <th className="px-[7px] py-[7px] border-b border-[#1111111C] font-normal w-[46.08%] md:w-[62.06%]">{t('report.table.category')}</th>
                  </tr>
                </thead>
                <tbody className="text-[#111111] font-normal font-montserrat">
                  {reportRows.map((row, index) => (
                    <tr key={`${row.period}-${index}`} className="border-b border-[#1111111C] last:border-b-0">
                      <td className="px-[7px] py-[7px] border-r border-[#1111111C] text-[14px] md:text-[16px]">{row.period}</td>
                      <td className="px-[7px] py-[7px] border-r border-[#1111111C] text-[14px] md:text-[16px]">{row.amount} грн</td>
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
