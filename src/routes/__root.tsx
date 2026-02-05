import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import '../styles.css'
import { ContactPopupProvider } from '@/src/contexts/ContactPopupContext'
import { VacationOptionsPopupProvider } from '@/src/contexts/VacationOptionsPopupContext'
import VacationOptionsPopupWrapper from '@/src/components/VacationOptionsPopupWrapper'
import { ChatWindowProvider } from '@/src/contexts/ChatWindowContext'
import ChatButton from '@/src/components/ChatButton'
import { I18nProvider } from '@/src/contexts/I18nContext'
import SmoothScroll from '@/src/components/SmoothScroll'
import { PreloadProvider } from '@/src/contexts/PreloadContext'
import { SliderProvider } from '@/src/contexts/SliderContext'
import { useI18n } from '@/src/contexts/I18nContext'

function NotFound() {
  const { t } = useI18n()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FBFBF9] px-4">
      <div className="text-center">
        <h1 className="font-alternates text-[#111111] text-[48px] md:text-[64px] lg:text-[80px] font-medium leading-[1.1em] tracking-[-2%] mb-4">
          {t('404.title')}
        </h1>
        <p className="font-montserrat text-[#404040] text-[18px] md:text-[20px] lg:text-[24px] leading-[1.5em] tracking-[0.5%] mb-8">
          {t('404.description')}
        </p>
        <a
          href="/"
          className="inline-block font-montserrat text-[#28694D] text-[16px] md:text-[18px] font-medium hover:underline transition-colors"
        >
          {t('404.backToHome')}
        </a>
      </div>
    </div>
  )
}

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
      },
      {
        name: 'description',
        content: 'Центр відновлення Справжні - Вдихни тишу, Видихни війну. Професійна допомога в реабілітації та відновленні після травм та стресів.',
      },
      {
        name: 'keywords',
        content: 'центр відновлення, реабілітація, відновлення, справжні, психологічна допомога, реабілітаційний центр, Україна',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:locale',
        content: 'uk_UA',
      },
      {
        property: 'og:site_name',
        content: 'Центр відновлення Справжні',
      },
      {
        property: 'og:title',
        content: 'Центр відновлення Справжні - Вдихни тишу, Видихни війну',
      },
      {
        property: 'og:description',
        content: 'Центр відновлення Справжні - Вдихни тишу, Видихни війну. Професійна допомога в реабілітації та відновленні після травм та стресів.',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'Центр відновлення Справжні - Вдихни тишу, Видихни війну',
      },
      {
        name: 'twitter:description',
        content: 'Центр відновлення Справжні - Вдихни тишу, Видихни війну. Професійна допомога в реабілітації та відновленні після травм та стресів.',
      },
      {
        name: 'robots',
        content: 'index, follow',
      },
      {
        name: 'googlebot',
        content: 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1',
      },
      { title: 'Центр відновлення Справжні - Вдихни тишу, Видихни війну' },
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,700;0,800;1,300;1,400;1,500;1,700;1,800&family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
      },
      {
        rel: 'preload',
        href: '/images/hero/hero.png',
        as: 'image',
      },
      {
        rel: 'preload',
        href: '/images/header/logo.svg',
        as: 'image',
      },
    ],
  }),
  component: RootLayout,
})

function RootLayout() {
  return (
    <html lang="uk" className="font-alternates antialiased">
      <head>
        <HeadContent />
      </head>
      <body>
        <SmoothScroll>
          <PreloadProvider>
            <I18nProvider>
              <SliderProvider>
                <ContactPopupProvider>
                  <VacationOptionsPopupProvider>
                    <ChatWindowProvider>
                      <Outlet />
                      <VacationOptionsPopupWrapper />
                      <ChatButton />
                    </ChatWindowProvider>
                  </VacationOptionsPopupProvider>
                </ContactPopupProvider>
              </SliderProvider>
            </I18nProvider>
          </PreloadProvider>
        </SmoothScroll>
        <Scripts />
      </body >
    </html >
  )
}
