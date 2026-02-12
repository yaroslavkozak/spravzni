'use client'

import { useRef, useEffect, useState } from 'react'
import MediaImage from '@/src/components/MediaImage'
import { useI18n } from '@/src/contexts/I18nContext'

interface InstagramPost {
  id: string
  imageUrl: string
  permalink: string
  caption: string
  timestamp: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
}

interface InstagramApiResponse {
  success: boolean
  posts: InstagramPost[]
  error?: string
}

export default function InstagramCarouselSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [useFallback, setUseFallback] = useState(false)
  const { t } = useI18n()

  // Fallback static posts (localized)
  const fallbackPosts = [
    { id: 1, title: t('instagram.fallback.1.title'), image: 'instagram.post1' },
    { id: 2, title: t('instagram.fallback.2.title'), image: 'instagram.post2' },
    { id: 3, title: t('instagram.fallback.3.title'), image: 'instagram.post3' },
    { id: 4, title: t('instagram.fallback.4.title'), image: 'instagram.post4' },
    { id: 5, title: t('instagram.fallback.5.title'), image: 'instagram.post5' },
  ]

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        const response = await fetch('/api/instagram/posts?limit=12')
        const data: InstagramApiResponse = await response.json()

        if (data.success && data.posts.length > 0) {
          setPosts(data.posts)
          setUseFallback(false)
        } else {
          // If API fails or returns no posts, use fallback
          setUseFallback(true)
        }
      } catch (error) {
        console.error('Failed to fetch Instagram posts:', error)
        setUseFallback(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInstagramPosts()
  }, [])

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current
    if (!container) return
    
    // Get the first child element to calculate item width
    const firstChild = container.firstElementChild as HTMLElement
    if (!firstChild) return
    
    // Calculate scroll amount: item width + gap (20px)
    const itemWidth = firstChild.offsetWidth
    const gap = 20
    const scrollAmount = itemWidth + gap
    const offset = direction === 'left' ? -scrollAmount : scrollAmount
    
    container.scrollBy({ left: offset, behavior: 'smooth' })
  }

  // Determine which posts to display
  const displayPosts = useFallback ? fallbackPosts : posts

  return (
    <section className="bg-[#FBFBF9] pt-[120px] pb-[80px]">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 text-center">
        <p className="text-[#28694D] text-[16px] leading-[150%] tracking-[0.5%] font-bold sm:font-normal sm:text-[1.25rem] md:text-[1.375rem] lg:text-[1.5rem] font-montserrat mb-1 text-center">
          {t('instagram.title')}
        </p>
        <p className="text-[#111111] text-[16px] font-normal font-montserrat leading-[150%] tracking-[0.5%] mb-[40px] text-center sm:text-[0.8125rem] md:text-[0.875rem] lg:text-[0.9375rem]">
          {t('instagram.subtitle')}
        </p>
        <a 
          href="https://www.instagram.com/spravzhni.lviv/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#404040] text-[0.875rem] sm:text-[0.9375rem] md:text-[1.0625rem] mb-[40px] flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="inline-flex w-6 h-6 sm:w-7 sm:h-7 relative">
            <MediaImage src="/images/instagram/instb.svg" alt="Instagram icon" fill className="object-contain" />
          </span>
          <span className="font-montserrat font-extrabold text-[16px] leading-[150%] tracking-[0.5%] text-[#404040] sm:font-semibold sm:text-[0.9375rem] md:text-[1.0625rem]">
            spravzhni.lviv
          </span>
        </a>
      </div>

      <div className="relative">
        <div className="max-w-[90rem] mx-auto px-5 sm:px-6 md:px-8 lg:pl-10 lg:pr-0 relative">
          <button
            onClick={() => handleScroll('left')}
            className="flex absolute left-2 md:left-4 lg:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white/80 border border-[#D1D1D1] rounded-full shadow-sm items-center justify-center text-lg md:text-xl text-[#111111] hover:bg-white transition-colors"
            aria-label={t('instagram.scrollLeft')}
          >
            ‹
          </button>

          <div className="overflow-hidden">
            <div
              ref={scrollRef}
              className="flex gap-[20px] overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
            >
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={`loading-${index}`}
                    className="flex-shrink-0 w-[289px] h-[387px] sm:w-[calc((100%-40px)/2)] sm:h-auto md:w-[calc((100%-80px)/3)] lg:w-[320px] lg:h-[384px] sm:aspect-[5/6] lg:aspect-auto bg-gray-200 animate-pulse rounded"
                  />
                ))
              ) : useFallback ? (
                // Fallback static posts
                fallbackPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex-shrink-0 w-[289px] h-[387px] sm:w-[calc((100%-40px)/2)] sm:h-auto md:w-[calc((100%-80px)/3)] lg:w-[320px] lg:h-[384px] sm:aspect-[5/6] lg:aspect-auto overflow-hidden relative group"
                  >
                    <MediaImage
                      src={`/images/instagram/inst${post.id}.jpg`}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))
              ) : (
                // Dynamic Instagram posts
                posts.map((post) => (
                  <a
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 w-[289px] h-[387px] sm:w-[calc((100%-40px)/2)] sm:h-auto md:w-[calc((100%-80px)/3)] lg:w-[320px] lg:h-[384px] sm:aspect-[5/6] lg:aspect-auto overflow-hidden relative group cursor-pointer"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.caption || t('instagram.postAlt')}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </a>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => handleScroll('right')}
            className="flex absolute right-2 md:right-4 lg:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white/80 border border-[#D1D1D1] rounded-full shadow-sm items-center justify-center text-lg md:text-xl text-[#111111] hover:bg-white transition-colors"
            aria-label={t('instagram.scrollRight')}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}

