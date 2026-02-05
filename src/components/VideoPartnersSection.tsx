import { useEffect, useRef, useState } from 'react'
import MediaImage from '@/src/components/MediaImage'
import MediaVideo from '@/src/components/MediaVideo'
import { useI18n } from '@/src/contexts/I18nContext'

// Partner logos - loading from public/images/brands/
const partners = [
  { id: 1, src: '/images/brands/fond.svg', alt: 'Fond', width: 200, height: 56 },
  { id: 2, src: '/images/brands/Group.svg', alt: 'Group', width: 200, height: 56 },
  { id: 3, src: '/images/brands/habilitationcenter.svg', alt: 'Habilitation Center', width: 200, height: 56 },
  { id: 4, src: '/images/brands/lvivskamiskarada.svg', alt: 'Lvivska Miska Rada', width: 200, height: 56 },
  { id: 5, src: '/images/brands/manivci.svg', alt: 'Manivci', width: 200, height: 56 },
  // { id: 6, src: '/images/brands/par.svg', alt: 'Partner', width: 200, height: 56 },
  { id: 7, src: '/images/brands/parr.svg', alt: 'Partner', width: 200, height: 56 },
  { id: 8, src: '/images/brands/parrr.svg', alt: 'Partner', width: 200, height: 56 },
  // { id: 9, src: '/images/brands/parrrrr.svg', alt: 'Partner', width: 200, height: 56 },
  { id: 10, src: '/images/brands/parrrrrrr.svg', alt: 'Partner', width: 200, height: 56 },
]

export default function VideoPartnersSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCenterHovered, setIsCenterHovered] = useState(false)
  const [volume, setVolume] = useState(1)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const { t } = useI18n()

  // Duplicate partners for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners]

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {
          // Handle play error if needed
        })
      } else {
        videoRef.current.pause()
      }
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      videoRef.current.muted = newVolume === 0
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      if (volume > 0) {
        setVolume(0)
        videoRef.current.volume = 0
        videoRef.current.muted = true
      } else {
        setVolume(1)
        videoRef.current.volume = 1
        videoRef.current.muted = false
      }
    }
  }

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    // Set video properties
    video.loop = true
    video.playsInline = true
    video.volume = volume
    // Set muted based on volume
    video.muted = volume === 0
  }, [volume])

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    
    // Set initial state based on video's actual state
    setIsPlaying(!video.paused)
    
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    
    // Also listen for loadedmetadata to set initial state correctly
    const handleLoadedMetadata = () => {
      setIsPlaying(!video.paused)
    }
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    // Attempt to play the video (autoplay)
    video.play().catch(() => {
      // Autoplay may be blocked, that's okay - state will be set correctly by event listeners
      setIsPlaying(false)
    })

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  return (
    <section className="bg-[#FBFBF9] pb-12 sm:pb-16 md:pb-20 lg:pb-[120px] min-h-[50vh] sm:min-h-[70vh] md:min-h-screen flex flex-col">
      {/* Video Section - Full Width */}
      <div 
        className="relative w-full h-[300px] sm:h-[400px] md:h-[550px] lg:h-[650px] xl:h-[784px] bg-gray-900 overflow-hidden"
      >
        <MediaVideo
          ref={videoRef}
          mediaKey="videos.hero"
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          loop
        />

        {/* Center Hover Area */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-10 pointer-events-auto"
          onMouseEnter={() => setIsCenterHovered(true)}
          onMouseLeave={() => setIsCenterHovered(false)}
        />

        {/* Play/Pause Button - Center (appears on hover over center) */}
        {isCenterHovered && (
          <button
            onClick={togglePlayPause}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-20 h-20 flex items-center justify-center transition-all pointer-events-auto"
            onMouseEnter={() => setIsCenterHovered(true)}
            aria-label={isPlaying ? t('videoPartners.pause') : t('videoPartners.play')}
          >
              <MediaImage
                src={isPlaying ? '/images/video/pause.svg' : '/images/video/play.svg'}
                alt={isPlaying ? t('videoPartners.pause') : t('videoPartners.play')}
                width={56}
                height={56}
                className="object-contain"
              />
          </button>
        )}

        {/* Volume Control - Bottom Right */}
        <div 
          className="absolute bottom-4 right-4 z-20 flex items-center gap-2"
          onMouseEnter={() => setShowVolumeControl(true)}
          onMouseLeave={() => setShowVolumeControl(false)}
        >
          {/* Volume Slider */}
          {showVolumeControl && (
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 md:w-24 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
                style={{
                  background: `linear-gradient(to right, white 0%, white ${volume * 100}%, rgba(255,255,255,0.3) ${volume * 100}%, rgba(255,255,255,0.3) 100%)`
                }}
              />
              <span className="text-white text-xs md:text-sm min-w-[2rem] text-center">
                {Math.round(volume * 100)}%
              </span>
            </div>
          )}
          
          {/* Volume Icon Button - Always visible */}
          <button
            onClick={toggleMute}
            className="w-16 h-16 flex items-center justify-center transition-all"
            aria-label={volume > 0 ? t('videoPartners.mute') : t('videoPartners.unmute')}
          >
            {volume > 0 ? (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Partner Carousel - Full Width with column layout for captions */}
      <div className="relative overflow-hidden sm:border-t border-[rgba(17,17,17,0.11)] w-full mt-8 sm:mt-12 md:mt-16 lg:mt-24">
        <div className="flex flex-col">
          {/* Caption container on the right, above carousel */}
          <div className="flex justify-end pr-4 sm:pr-8 md:pr-12 lg:pr-16 py-2">
            <h2 className="font-montserrat text-[#28694D] text-[14px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-medium sm:font-bold leading-[1.3em] tracking-[1.5%] text-right">
              {t('videoPartners.thanks')}
            </h2>
          </div>
          
          {/* Carousel Row */}
          <div className="relative overflow-hidden w-full">
            <div className="flex items-center py-[26px] sm:py-4 animate-scroll-left bg-[#FBFBF9] border border-[#1111111C] sm:bg-transparent sm:border-0" style={{ width: 'max-content' }}>
              {duplicatedPartners.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center mr-8 sm:mr-12 md:mr-16 lg:mr-20"
                  style={{
                    width: `clamp(180px, ${partner.width * 0.9}px, ${partner.width}px)`,
                    height: `clamp(50px, ${partner.height * 0.9}px, ${partner.height}px)`,
                  }}
                >
                  <img
                    src={partner.src}
                    alt={partner.alt}
                    width={partner.width}
                    height={partner.height}
                    className="object-contain w-full h-full"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
