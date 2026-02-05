import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import Header from '@/src/components/Header'
import Hero from '@/src/components/Hero'
import ImagineSection from '@/src/components/ImagineSection'
import VideoPartnersSection from '@/src/components/VideoPartnersSection'

// Lazy load below-the-fold components for better performance
const SliderSection = lazy(() => import('@/src/components/SliderSection'))
const AboutSection = lazy(() => import('@/src/components/AboutSection'))
const SpaceSection = lazy(() => import('@/src/components/SpaceSection'))
const TextOverImageSection = lazy(() => import('@/src/components/TextOverImageSection'))
const ServicesSection = lazy(() => import('@/src/components/ServicesSection'))
const PricingCTASection = lazy(() => import('@/src/components/PricingCTASection'))
const VideoSection = lazy(() => import('@/src/components/VideoSection'))
const SupportCaptionSection = lazy(() => import('@/src/components/SupportCaptionSection'))
const StatsSection = lazy(() => import('@/src/components/StatsSection'))
const ContributionSectionFullImage = lazy(() => import('@/src/components/ContributionSectionFullImage'))
const DirectionsSection = lazy(() => import('@/src/components/DirectionsSection'))
const InstagramCarouselSection = lazy(() => import('@/src/components/InstagramCarouselSection'))
const FooterSection = lazy(() => import('@/src/components/FooterSection'))

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-gray-400">Loading...</div>
  </div>
)

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ImagineSection />
      <VideoPartnersSection />
      <Suspense fallback={<LoadingFallback />}>
        <SliderSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <AboutSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <SpaceSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <TextOverImageSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <ServicesSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <PricingCTASection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <SupportCaptionSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <StatsSection />
      </Suspense>
      <div className="flex flex-col">
        <div className="order-1">
          <Suspense fallback={<LoadingFallback />}>
            <ContributionSectionFullImage />
          </Suspense>
        </div>
        <div className="order-2">
          <Suspense fallback={<LoadingFallback />}>
            <VideoSection />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <DirectionsSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <InstagramCarouselSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <FooterSection />
      </Suspense>
    </main>
  )
}
