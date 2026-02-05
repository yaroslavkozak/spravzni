'use client'

import { useState } from 'react'
import MediaImage from '@/src/components/MediaImage'

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="bg-[#FBFBF9] py-16 md:py-20 lg:py-24">
      <div className="w-full">
        <div className="relative w-full aspect-video overflow-hidden bg-[#FBFBF9]">
          {isPlaying ? (
            <iframe
              className="w-full h-full bg-[#FBFBF9]"
              src="https://www.youtube.com/embed/yecz6zovLO8?autoplay=1&rel=0"
              title="Spravzhni video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 w-full h-full"
              aria-label="Play video"
            >
              <MediaImage
                src="/image.png"
                alt="Spravzhni video preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
