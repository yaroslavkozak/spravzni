import { createFileRoute } from '@tanstack/react-router'
import Header from '@/src/components/Header'
import Hero from '@/src/components/Hero'
import VideoPartnersSection from '@/src/components/VideoPartnersSection'
import SliderSection from '@/src/components/SliderSection'
import MobileSliderBlock from '@/src/components/MobileSliderBlock'
import SpaceSection from '@/src/components/SpaceSection'
import ServicesSection from '@/src/components/ServicesSection'
import PricingCTASection from '@/src/components/PricingCTASection'
import VideoSection from '@/src/components/VideoSection'
import InstagramCarouselSection from '@/src/components/InstagramCarouselSection'
import HomeClientShell from '@/src/components/HomeClientShell'
import TranslatedImagineSection from '@/src/components/translated/TranslatedImagineSection'
import TranslatedAboutSection from '@/src/components/translated/TranslatedAboutSection'
import TranslatedTextOverImageSection from '@/src/components/translated/TranslatedTextOverImageSection'
import TranslatedSupportCaptionSection from '@/src/components/translated/TranslatedSupportCaptionSection'
import TranslatedStatsSection from '@/src/components/translated/TranslatedStatsSection'
import TranslatedContributionSectionFullImage from '@/src/components/translated/TranslatedContributionSectionFullImage'
import TranslatedDirectionsSection from '@/src/components/translated/TranslatedDirectionsSection'
import TranslatedFooterSection from '@/src/components/translated/TranslatedFooterSection'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="min-h-screen bg-[#FBFBF9]">
      <HomeClientShell>
        <Header />
        <Hero />
        <TranslatedImagineSection />
        <VideoPartnersSection />
        <div className="flex flex-col">
          <div className="order-1">
            <SliderSection />
          </div>
          <div className="order-2">
            <TranslatedAboutSection />
          </div>
          <div className="order-3">
            <MobileSliderBlock />
          </div>
        </div>
        <SpaceSection />
        <TranslatedTextOverImageSection />
        <ServicesSection />
        <PricingCTASection />
        <TranslatedSupportCaptionSection />
        <TranslatedStatsSection />
        <div className="flex flex-col">
          <div className="order-1">
            <TranslatedContributionSectionFullImage />
          </div>
          <div className="order-2">
            <VideoSection />
          </div>
        </div>
        <TranslatedDirectionsSection />
        <InstagramCarouselSection />
        <TranslatedFooterSection />
      </HomeClientShell>
    </main>
  )
}
