'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import LanguageSwitcher from '@/src/components/LanguageSwitcher'
import { useContactPopup } from '@/src/contexts/ContactPopupContext'
import { usePreload } from '@/src/contexts/PreloadContext'
import { useI18n } from '@/src/contexts/I18nContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isBannerClosed, setIsBannerClosed] = useState(false)
  const { openPopup } = useContactPopup()
  const { isPreloadComplete } = usePreload()
  const { t } = useI18n()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Prevent body scroll when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      // Explicitly restore scrolling
      document.body.style.overflow = ''
      document.body.style.overflowY = 'auto'
    }
    return () => {
      // Always restore scrolling on cleanup
      document.body.style.overflow = ''
      document.body.style.overflowY = 'auto'
    }
  }, [isMenuOpen])

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <header 
        className={`absolute top-0 left-0 right-0 z-50 backdrop-blur-header bg-black/30 header-fade-in`}
        style={{
          WebkitBackdropFilter: 'blur(4px)',
          backdropFilter: 'blur(4px)',
        }}
      >
        {/* Header 1 - Top Banner */}
        {!isBannerClosed && (
          <div className="bg-[#fbfbf9] backdrop-blur-md h-[2.25rem] md:h-[2.5rem] flex items-center relative">
            <div className="max-w-[90rem] mx-auto px-8 flex items-center justify-center">
              <p className="font-montserrat font-bold leading-[150%] tracking-[0.5%] text-[#28694D] text-sm md:text-[15px] xl:text-base" style={{ fontWeight: 700 }}>
                {t('header.banner.openingSummer')}
              </p>
              <button
                onClick={() => setIsBannerClosed(true)}
                className="absolute right-[10px] flex-shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
                aria-label="Close banner"
              >
                <Image
                  src="/images/header/X.svg"
                  alt="Close"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </button>
            </div>
          </div>
        )}

        {/* Header 2 - Main Navigation */}
        <div 
          className="transition-all duration-300 h-[5.625rem] md:h-[6.5rem]"
        >
          <div className="max-w-[90rem] mx-auto pl-[2.25rem] pr-[2.25rem] md:pl-[2.5rem] md:pr-[2.5rem] xl:pl-10 xl:pr-10 flex items-center h-full relative">
          {/* Logo - Left */}
          <a
            href="/"
            className={`flex flex-col items-center justify-center transition-all duration-300 flex-shrink-0 ${
              isScrolled 
                ? 'w-[8.75rem] h-[3.75rem]' 
                : 'w-[7.625rem] h-[3.375rem] md:w-[12.4375rem] md:h-[5.5rem] lg:w-[11.3125rem] lg:h-[5rem] xl:w-[10.75rem] xl:h-[4.75rem]'
            }`}
            aria-label="Go to homepage"
          >
            <div className={`w-full flex items-center justify-center transition-all duration-300 ${
              isScrolled 
                ? 'h-[3.75rem]' 
                : 'h-[3.375rem] md:h-[5.5rem] lg:h-[5rem] xl:h-[4.75rem]'
            }`}>
              <Image 
                src="/images/header/logo.svg"
                alt="Logo" 
                width={199} 
                height={88}
                className="object-contain transition-all duration-300 w-full h-full"
                unoptimized={true}
                priority={true}
              />
            </div>
          </a>

          {/* Right Side Items Container - Shown for 1024-1440px only (completely hidden at 1440px+) */}
          <div className="hidden lg:flex xl:!hidden items-center gap-4 ml-auto">
            {/* Contact Icons */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="relative flex items-center group">
                <div className="cursor-default">
                  <Image
                    src="/icons/phone icon header.svg"
                    alt="Phone"
                    width={20}
                    height={20}
                    className="w-[20px] h-[20px]"
                    unoptimized={true}
                  />
                </div>
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto"
                >
                  <a
                    href="tel:+380673708336"
                    className="font-montserrat font-normal leading-[1.5em] tracking-[0.5%] text-white whitespace-nowrap hover:font-semibold px-2 py-1"
                    style={{ fontSize: '1rem' }}
                  >
                    +38 (067) 370 83 36
                  </a>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/z4d33r87E1eAJ6rs9"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer transition-all"
              >
                <Image
                  src="/icons/location icon.svg"
                  alt="Location"
                  width={18}
                  height={18}
                  className="w-[18px] h-[18px]"
                  unoptimized={true}
                />
              </a>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>

            {/* CTA Button - Inside right container for 1024-1440px only */}
            <button 
              onClick={() => openPopup()}
              className={`bg-[#28694D] rounded-[2rem] items-center justify-center transition-all duration-300 whitespace-nowrap flex xl:hidden ${
                isScrolled 
                  ? 'h-10 px-14 max-[1254px]:px-[1.5625rem] max-[1024px]:px-11' 
                  : 'h-12 px-16 max-[1254px]:h-[2.625rem] max-[1254px]:px-[1.5625rem] max-[1024px]:h-[2.4375rem] max-[1024px]:px-13'
              }`}
            >
              <span className={`hover-bold-no-shift font-montserrat text-white font-normal leading-[1.5em] tracking-[0.5%] transition-all duration-300`} style={{ fontSize: isScrolled ? 'clamp(0.9375rem, 0.9375rem + (100vw - 64rem) * 0.0072, 1.125rem)' : 'clamp(1rem, 1rem + (100vw - 64rem) * 0.0077, 1.25rem)' }} data-text={t('header.cta.whenStart')}>
                <span>{t('header.cta.whenStart')}</span>
              </span>
            </button>

            {/* Burger Menu - Inside right container for 1024-1440px only */}
            <button
              className="flex xl:hidden text-white z-50 relative w-[1.5rem] h-[1.25rem] mr-[1.75rem] lg:mr-[1.75rem]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <Image
                  src="/images/header/burger.svg"
                  alt="Menu"
                  width={24}
                  height={20}
                  className="w-[24px] h-[20px]"
                />
              )}
            </button>
          </div>

          {/* Navigation - Menu Items next to logo - Only shown above 1440px */}
          <nav className="hidden xl:flex items-center gap-4 ml-6">
            <a href="#mi" className="hover-bold-no-shift font-montserrat text-white font-medium leading-[1.5em] tracking-[0.5%] whitespace-nowrap" style={{ fontSize: '1rem' }} data-text={t('header.nav.us')}>
              <span>{t('header.nav.us')}</span>
            </a>
            <a href="#services" className="hover-bold-no-shift font-montserrat text-white font-medium leading-[1.5em] tracking-[0.5%] whitespace-nowrap" style={{ fontSize: '1rem' }} data-text={t('header.nav.services')}>
              <span>{t('header.nav.services')}</span>
            </a>
            <a href="#social" className="hover-bold-no-shift font-montserrat text-white font-medium leading-[1.5em] tracking-[0.5%] whitespace-nowrap" style={{ fontSize: '1rem' }} data-text={t('header.nav.socialRole')}>
              <span>{t('header.nav.socialRole')}</span>
            </a>
            <a href="#contribute" className="hover-bold-no-shift font-montserrat text-white font-medium leading-[1.5em] tracking-[0.5%] whitespace-nowrap" style={{ fontSize: '1rem' }} data-text={t('header.nav.contribute')}>
              <span>{t('header.nav.contribute')}</span>
            </a>
            <a href="#location" className="hover-bold-no-shift font-montserrat text-white font-medium leading-[1.5em] tracking-[0.5%] whitespace-nowrap" style={{ fontSize: '1rem' }} data-text={t('header.nav.location')}>
              <span>{t('header.nav.location')}</span>
            </a>
          </nav>

          {/* Right Side Items - Icons, Language, CTA - Only shown above 1440px */}
          <div className="hidden xl:flex items-center gap-4 ml-auto">
            {/* Phone Number and Icon */}
            <div className="flex items-center gap-2 group">
              <a
                href="tel:+380673708336"
                className="font-montserrat text-white font-normal leading-[1.5em] tracking-[0.5%] whitespace-nowrap hover:font-semibold transition-all opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
                style={{ fontSize: '1rem' }}
              >
                +38 (067) 370 83 36
              </a>
              <a
                href="tel:+380673708336"
                className="cursor-pointer transition-all"
              >
                <Image
                  src="/icons/phone icon header.svg"
                  alt="Phone"
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px]"
                  unoptimized={true}
                />
              </a>
            </div>

            {/* Location Icon */}
            <a
              href="https://maps.app.goo.gl/z4d33r87E1eAJ6rs9"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer transition-all"
            >
              <Image
                src="/icons/location icon.svg"
                alt="Location"
                width={18}
                height={18}
                className="w-[18px] h-[18px]"
                unoptimized={true}
              />
            </a>

            {/* Language Switcher */}
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>

            {/* CTA Button - Inside right container for xl */}
            <button 
              onClick={() => openPopup()}
              className={`bg-[#28694D] rounded-[2rem] items-center justify-center transition-all duration-300 whitespace-nowrap flex ${
                isScrolled 
                  ? 'h-10 px-14 max-[1254px]:px-[1.5625rem] max-[1024px]:px-11' 
                  : 'h-12 px-16 max-[1254px]:h-[2.625rem] max-[1254px]:px-[1.5625rem] max-[1024px]:h-[2.4375rem] max-[1024px]:px-13'
              }`}
            >
              <span className={`hover-bold-no-shift font-montserrat text-white font-normal leading-[1.5em] tracking-[0.5%] transition-all duration-300`} style={{ fontSize: isScrolled ? 'clamp(0.9375rem, 0.9375rem + (100vw - 64rem) * 0.0072, 1.125rem)' : 'clamp(1rem, 1rem + (100vw - 64rem) * 0.0077, 1.25rem)' }} data-text={t('header.cta.whenStart')}>
                <span>{t('header.cta.whenStart')}</span>
              </span>
            </button>
          </div>
          

          {/* Mobile Menu Button - Shown for <1024px only (xs, md) */}
          <button
            className="flex lg:hidden text-white ml-auto z-50 relative w-[1.5rem] h-[1.25rem] mr-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <Image
                src="/images/header/burger.svg"
                alt="Menu"
                width={24}
                height={20}
                className="w-[24px] h-[20px]"
              />
            )}
          </button>
        </div>
      </div>
    </header>

    {/* Mobile Menu Sidebar - Outside header for proper fixed positioning */}
    {/* Backdrop Overlay */}
    <div
      className={`flex fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ease-in-out ${
        isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setIsMenuOpen(false)}
    />

    {/* Sidebar */}
    <div
      className={`flex fixed top-0 right-0 h-full w-full max-w-[400px] bg-[rgba(17,17,17,1)] backdrop-blur-md z-[70] transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Close Button */}
      <button
        onClick={() => setIsMenuOpen(false)}
        className="absolute top-6 right-6 z-[80] text-white hover:text-white/80 transition-colors"
        aria-label="Close menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <nav className="flex flex-col gap-3 p-6 pt-24 h-full overflow-y-auto">
        <a 
          href="#mi" 
          onClick={handleLinkClick}
          className="hover-bold-no-shift font-montserrat text-white font-medium py-2" 
          style={{ fontSize: '1rem' }}
          data-text={t('header.nav.us')}
        >
          <span>{t('header.nav.us')}</span>
        </a>
        <a 
          href="#services" 
          onClick={handleLinkClick}
          className="hover-bold-no-shift font-montserrat text-white font-medium py-2" 
          style={{ fontSize: '1rem' }}
          data-text={t('header.nav.services')}
        >
          <span>{t('header.nav.services')}</span>
        </a>
        <a 
          href="#social" 
          onClick={handleLinkClick}
          className="hover-bold-no-shift font-montserrat text-white font-medium py-2" 
          style={{ fontSize: '1rem' }}
          data-text={t('header.nav.socialRole')}
        >
          <span>{t('header.nav.socialRole')}</span>
        </a>
        <a 
          href="#contribute" 
          onClick={handleLinkClick}
          className="hover-bold-no-shift font-montserrat text-white font-medium py-2" 
          style={{ fontSize: '1rem' }}
          data-text={t('header.nav.contribute')}
        >
          <span>{t('header.nav.contribute')}</span>
        </a>
        <a 
          href="#location" 
          onClick={handleLinkClick}
          className="hover-bold-no-shift font-montserrat text-white font-medium py-2" 
          style={{ fontSize: '1rem' }}
          data-text={t('header.nav.location')}
        >
          <span>{t('header.nav.location')}</span>
        </a>
        
        {/* Mobile Language Switcher */}
        <div className="flex items-center justify-start pt-4 pb-4 border-t border-white/20 mt-4">
          <LanguageSwitcher />
        </div>
        
        {/* Mobile Contact Icons */}
        <div className="flex items-center gap-4 pt-2 pb-2">
          <a href="tel:+380673708336" className="cursor-pointer transition-all" onClick={handleLinkClick}>
            <Image
              src="/icons/phone icon header.svg"
              alt="Phone"
              width={24}
              height={24}
              className="w-6 h-6"
              unoptimized={true}
            />
          </a>
          <a
            href="https://maps.app.goo.gl/z4d33r87E1eAJ6rs9"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer transition-all"
            onClick={handleLinkClick}
          >
            <Image
              src="/icons/location icon.svg"
              alt="Location"
              width={24}
              height={24}
              className="w-6 h-6"
              unoptimized={true}
            />
          </a>
        </div>
        
        <button 
          onClick={() => {
            openPopup()
            handleLinkClick()
          }}
          className="hover-bold-no-shift font-montserrat bg-[#28694D] rounded-[2rem] px-8 py-3 text-white font-normal mt-4" 
          style={{ fontSize: '1rem' }}
          data-text={t('header.cta.whenStart')}
        >
          <span>{t('header.cta.whenStart')}</span>
        </button>
      </nav>
    </div>
    </>
  )
}
