'use client'

import { Link, useRouterState } from '@tanstack/react-router'
import MediaImage from '@/src/components/MediaImage'
import BackgroundMedia from '@/src/components/BackgroundMedia'
import { useI18n } from '@/src/contexts/I18nContext'

export default function FooterSection() {
  const { t, language } = useI18n()
  const logoSrc =
    language === 'en' ? '/logo-white.svg'
    : language === 'uk' ? '/logo-white-ua.svg'
    : '/images/header/logo.svg'
  const location = useRouterState({ select: (state) => state.location })
  const isHome = location.pathname === '/'

  const navHref = (id: string) => (isHome ? `#${id}` : `/?section=${id}`)

  const services = [
    { id: 1, label: t('services.service1.title'), href: navHref('service-1') },
    { id: 2, label: t('services.service2.title'), href: navHref('service-2') },
    { id: 3, label: t('services.service3.title'), href: navHref('service-3') },
    { id: 4, label: t('services.service4.title'), href: navHref('service-4') },
    { id: 5, label: t('services.service5.title'), href: navHref('service-5') },
  ]

  const navigation = [
    { label: t('header.nav.us'), href: navHref('mi') },
    { label: t('header.nav.services'), href: navHref('services') },
    { label: t('header.nav.socialRole'), href: navHref('social') },
    { label: t('header.nav.contribute'), href: navHref('contribute') },
    { label: t('header.nav.location'), href: navHref('location') },
  ]

  return (
    <section id="footer" className="relative bg-[#0b0b0b] text-white">
      <BackgroundMedia
        src="/footer.jpg"
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{ backgroundPosition: 'bottom center' }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#00000033] z-0" />

      <div className="relative z-10 max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 pt-[80px] pb-6 sm:pb-7 md:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-8 xl:gap-10">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <MediaImage
                src={logoSrc}
                alt="Logo"
                width={172}
                height={76}
                className="object-contain w-[132px] h-[58px] sm:w-[152px] sm:h-[67px] md:w-[172px] md:h-[76px]"
              />
            </div>
            <div className="mt-4 flex items-center gap-2 text-[#c7d0c8]">
            </div>
          </div>

          <div className="min-w-0">
            <p className="font-montserrat text-[16px] sm:text-[0.9375rem] md:text-[1rem] font-semibold tracking-[0.005em] mb-3 sm:mb-4 text-[#FBFBF9]">{t('footer.contacts')}</p>
            <div className="space-y-2 sm:space-y-3 text-[16px] leading-[1.5] tracking-[0.005em] text-[#FBFBF9] font-montserrat font-normal">
              <div className="flex flex-col items-start gap-1 sm:gap-2">
                <a href="tel:+380673708336" className="hover-bold-no-shift font-montserrat text-[#FBFBF9] transition-colors block break-words" data-text="+38 (067) 370 83 36">
                  <span>+38 (067) 370 83 36</span>
                </a>
                {/* <a href="tel:+380979551192" className="hover-bold-no-shift font-montserrat text-[#FBFBF9] transition-colors block break-words" data-text="+38 (097) 955 11 92">
                  <span>+38 (097) 955 11 92</span>
                </a> */}
                <a href="mailto:spravzhni.lviv@gmail.com" className="hover-bold-no-shift font-montserrat text-[#FBFBF9] transition-colors block break-words sm:inline-block" data-text="spravzhni@gmail.com">
                  <span>spravzhni.lviv@gmail.com</span>
                </a>
              </div>
              <p className="font-montserrat text-[#FBFBF9]">{t('footer.hours')}</p>
              <a href="https://maps.app.goo.gl/ezZ6YNghBLqv97D89" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#FBFBF9] transition-colors">
                <span className="w-[30px] h-[30px] relative hover:opacity-80 transition-opacity">
                  <MediaImage src="/images/footer/contact-map.svg" alt="Location" fill className="object-contain" />
                </span>
                <span className="hover-bold-no-shift font-montserrat font-normal underline underline-offset-2 text-[16px] leading-[1.5] tracking-[0.005em] whitespace-nowrap text-[#FBFBF9] transition-colors" data-text={t('directions.address.value')}>
                  <span>{t('directions.address.value')}</span>
                </span>
              </a>
              <div className="flex items-center gap-2 text-[#FBFBF9]">
                {/* <span className="w-4 h-4 sm:w-5 sm:h-5 relative flex-shrink-0">
                  <MediaImage src="/images/footer/chatf.svg" alt="Chat" fill className="object-contain" />
                </span> */}
                {/* <span className="hover-bold-no-shift font-montserrat text-[0.875rem] sm:text-[1rem] underline text-[#FBFBF9] transition-colors" data-text="Написати в чат">
                  <span>Написати в чат</span>
                </span> */}
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <p className="font-montserrat text-[16px] sm:text-[0.9375rem] md:text-[1rem] font-semibold tracking-[0.005em] mb-3 sm:mb-4 text-[#FBFBF9]">{t('footer.services')}</p>
            <ul className="space-y-2 text-[16px] leading-[1.5] tracking-[0.005em] text-[#FBFBF9] font-montserrat font-normal">
              {services.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover-bold-no-shift font-montserrat text-[#FBFBF9] transition-colors" data-text={item.label}>
                    {item.id === 1 ? (
                      <>
                        <span>{item.label.split('. ')[0]}.</span>
                        <br />
                        <span>{item.label.split('. ')[1]}</span>
                      </>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <p className="font-montserrat text-[16px] sm:text-[0.9375rem] md:text-[1rem] font-semibold tracking-[0.005em] mb-3 sm:mb-4 lg:whitespace-nowrap text-[#FBFBF9]">{t('footer.navigate')}</p>
            <ul className="space-y-2 text-[16px] leading-[1.5] tracking-[0.005em] text-[#FBFBF9] font-montserrat font-normal">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover-bold-no-shift font-montserrat text-[#FBFBF9] transition-colors" data-text={item.label}>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full pt-4 sm:pt-5 pb-[92px]">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col items-start">
              <a 
                href="https://spravzhni.com.ua/donate" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-montserrat text-left text-[16px] leading-[1.5] tracking-[0.005em] text-[#FBFBF9] underline underline-offset-4 mb-2 sm:mb-3 font-normal hover:opacity-80 transition-opacity"
              >
                {t('footer.supportProgram')}
              </a>
              <div className="flex items-center justify-start gap-2 sm:gap-3 pl-0 pr-5 md:px-0">
                <span className="font-montserrat text-[16px] md:text-[16px] leading-[1.5] tracking-[0.005em] text-[#FBFBF9] font-normal">{t('footer.followUs')}</span>
                <a 
                  href="https://www.instagram.com/spravzhni.lviv/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-[26px] h-[26px] relative hover:opacity-80 transition-opacity"
                >
                  <MediaImage src="/images/footer/instw.svg" alt="Instagram" fill className="object-contain" />
                </a>
                <a 
                  href="https://www.facebook.com/people/%D0%A1%D0%BF%D1%80%D0%B0%D0%B2%D0%B6%D0%BD%D1%96-%D1%86%D0%B5%D0%BD%D1%82%D1%80-%D0%B2%D1%96%D0%B4%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%BD%D1%8F-%D0%B9-%D0%B2%D1%96%D0%B4%D0%BF%D0%BE%D1%87%D0%B8%D0%BD%D0%BA%D1%83-%D1%83-%D1%81%D0%A1%D1%82%D1%96%D0%BB%D1%8C%D1%81%D1%8C%D0%BA%D0%B5/61580954819286/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-[26px] h-[26px] relative hover:opacity-80 transition-opacity"
                >
                  <MediaImage src="/images/footer/fbw.svg" alt="Facebook" fill className="object-contain" />
                </a>
                <a 
                  href="https://www.youtube.com/@spravzhni.tsentr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-[30px] h-[30px] relative hover:opacity-80 transition-opacity"
                >
                  <MediaImage src="/images/footer/youtube.svg" alt="YouTube" fill className="object-contain" />
                </a>
              </div>
            </div>
            
            <div className="flex flex-col items-start">
              <div className="flex flex-wrap items-center justify-start gap-1 mb-1">
                <Link
                  to="/privacy"
                  className="font-montserrat font-light text-[0.75rem] sm:text-[0.8125rem] md:text-[0.875rem] text-[#FBFBF9] hover:underline transition-colors"
                  style={{ fontWeight: 300 }}
                >
                  {t('footer.privacy')}
                </Link>
                <span className="font-montserrat font-light text-[0.75rem] sm:text-[0.8125rem] md:text-[0.875rem] text-[#FBFBF9]" style={{ fontWeight: 300 }}>.</span>
                <Link
                  to="/terms"
                  className="font-montserrat font-light text-[0.75rem] sm:text-[0.8125rem] md:text-[0.875rem] text-[#FBFBF9] hover:underline transition-colors"
                  style={{ fontWeight: 300 }}
                >
                  {t('footer.terms')}
                </Link>
              </div>
              <p className="font-montserrat font-light text-left text-[0.75rem] sm:text-[0.8125rem] md:text-[0.875rem] text-[#FBFBF9] leading-[1.3]" style={{ fontWeight: 300 }}>
                {t('footer.rights')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

