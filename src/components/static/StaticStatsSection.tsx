import type { Translator } from '@/src/lib/translator'

interface StaticStatsSectionProps {
  t: Translator
  amount?: string
}

export default function StaticStatsSection({ t, amount = '229 850' }: StaticStatsSectionProps) {
  const cards: Array<{ id: number; body: string; link?: string }> = [
    { id: 1, body: t('stats.card1') },
    { id: 2, body: t('stats.card2') },
    { id: 3, body: t('stats.card3') },
  ]

  return (
    <section id="social" className="bg-[#FBFBF9] py-16 md:py-20 lg:py-24">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[140px]">
        <div className="text-center">
          <p className="text-[#111111] text-[clamp(1rem,_calc(0.824rem+0.751vw),_1.5rem)] font-montserrat font-light mb-4 sm:mb-5">
            {t('stats.title')}
          </p>
          <p className="text-[#111111] text-[clamp(2.75rem,_calc(0.329rem+10.328vw),_9.625rem)] font-alternates font-light leading-[1] flex items-center justify-center">
            <span className="inline-flex tracking-[0.02em]">{amount}</span>
            <span className="ml-2 sm:ml-3 text-[clamp(2.75rem,_calc(0.329rem+10.328vw),_9.625rem)]">{t('stats.currency')}</span>
          </p>
          <p className="text-[#111111] text-[clamp(1rem,_calc(0.824rem+0.751vw),_1.5rem)] font-montserrat font-light mt-3 sm:mt-4">
            {t('stats.subtitle')}
          </p>
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 grid gap-4 sm:gap-5 md:gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-[#F0F3F0] border border-[#E9E9E6] px-6 sm:px-7 md:px-8 pt-[2.5rem] sm:pt-[3.125rem] md:pt-[3.75rem] lg:pt-[4.375rem] xl:pt-[5rem] pb-[2.5rem] sm:pb-[3.125rem] md:pb-[3.75rem] lg:pb-[4.375rem] xl:pb-[5rem] min-h-[11.25rem] sm:min-h-[12.5rem] md:min-h-[13.75rem] lg:min-h-[15rem] flex items-start"
            >
              <p className="text-[#111111] text-[16px] font-montserrat font-normal leading-[1.6] tracking-[0.45%] text-center max-w-[85%] mx-auto">
                {card.body}
                {card.link && (
                  <>
                    {' '}
                    <span className="underline font-medium cursor-pointer">{card.link}</span>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
