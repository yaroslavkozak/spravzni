'use client'

import BackgroundMedia from '@/src/components/BackgroundMedia'
import { Link } from '@tanstack/react-router'
import { useI18n } from '@/src/contexts/I18nContext'

export default function ContributionSection() {
  const { t } = useI18n()

  return (
    <section id="contribute" className="bg-[#F5F6F3] mb-[3vh] sm:mb-[4vh] md:mb-[5vh]">
      <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-[647px_484px] gap-6 lg:gap-[134px] h-[600px]">
        <BackgroundMedia
          src="/make-donation.png"
          className="relative bg-cover bg-[45px_center] bg-no-repeat w-[647px] h-[600px]"
          style={{ backgroundSize: 'cover', backgroundPosition: '45px center' }}
        />

        <div className="flex flex-col items-start justify-center text-[#111111] w-[484px]">
          <h3 className="font-alternates text-[#111111] text-[2rem] sm:text-[2.375rem] md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem] font-medium leading-[1.1] tracking-[-0.02em] mb-10">
            {t('contribution.title')}
          </h3>
          <p className="font-montserrat text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] lg:text-[1.0625rem] leading-[1.6] tracking-[0.45%] mb-4 sm:mb-5 md:mb-6">
            {t('contribution.p1')}
          </p>
          <p className="font-montserrat text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] lg:text-[1.0625rem] leading-[1.6] tracking-[0.45%] mb-4 sm:mb-5 md:mb-6">
            {t('contribution.p2')}
          </p>
          <p className="font-montserrat text-[0.875rem] sm:text-[0.9375rem] md:text-[1rem] lg:text-[1.0625rem] leading-[1.6] tracking-[0.45%] mb-8 sm:mb-9 md:mb-10">
            {t('contribution.p3')}
          </p>
          <Link
            to="/donate"
            className="font-montserrat inline-flex w-full max-w-[26.25rem] items-center justify-center bg-[#28694D] text-white text-[20px] font-normal leading-[150%] tracking-[0.5%] rounded-full px-[100px] py-[9px] hover:opacity-95 transition whitespace-nowrap"
            style={{ fontWeight: 400 }}
          >
            {t('contribution.cta')}
          </Link>
        </div>
      </div>
    </section>
  )
}

