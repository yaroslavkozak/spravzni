'use client'

import { useState, useEffect, forwardRef } from 'react';
import { getMediaMetadata, getR2Url } from '@/src/lib/r2-media';

interface MediaVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  mediaKey: string;
  fallback?: string; // Deprecated - not used, kept for backwards compatibility
  autoLoad?: boolean; // Whether to automatically load the video URL
}

/**
 * MediaVideo component that fetches video from R2 via D1
 * Never uses fallback paths - only loads from R2
 */
const MediaVideo = forwardRef<HTMLVideoElement, MediaVideoProps>(({
  mediaKey,
  fallback,
  autoLoad = true,
  ...videoProps
}, ref) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!autoLoad) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadMedia() {
      try {
        console.log(`[MediaVideo] Fetching media: ${mediaKey}`);
        // Fetch media metadata using utility
        const mediaData = await getMediaMetadata(mediaKey);
        
        if (!isMounted) return;
        
        if (!mediaData) {
          throw new Error(`Media not found: ${mediaKey}`);
        }
        
        console.log(`[MediaVideo] Media found:`, { key: mediaData.key, type: mediaData.type, r2_key: mediaData.r2_key });
        
        if (mediaData.type === 'video') {
          // Generate R2 URL using utility
          if (mediaData.r2_key) {
            const r2Url = getR2Url(mediaData.r2_key);
            console.log(`[MediaVideo] Setting R2 URL: ${r2Url}`);
            if (isMounted) {
              setVideoUrl(r2Url);
            }
          } else {
            throw new Error(`No r2_key found for ${mediaKey}`);
          }
        } else {
          throw new Error(`Media ${mediaKey} is not a video (type: ${mediaData.type})`);
        }
      } catch (err) {
        console.error(`[MediaVideo] Failed to load video media ${mediaKey}:`, err);
        if (isMounted) {
          setError(true);
          // Never use fallback - prevents 404 errors from /images/videoone.mp4
          setVideoUrl(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMedia();

    return () => {
      isMounted = false;
    };
  }, [mediaKey, autoLoad]);

  // Initialize video as muted and paused on mount - Safari-specific handling
  useEffect(() => {
    if (!videoUrl) return;

    const initializeVideo = () => {
      if (!ref) return;
      if (typeof ref === 'function') return;
      const videoElement = ref.current;
      if (!videoElement) return;

      // Safari-specific: Ensure playsInline is set
      videoElement.setAttribute('playsinline', 'true');
      videoElement.setAttribute('webkit-playsinline', 'true');
      
      // Ensure video is muted and paused on initial load (required for Safari autoplay)
      videoElement.muted = true;
      videoElement.pause();

      // Safari error handling
      const handleError = (e: Event) => {
        console.error('[MediaVideo] Video error:', e);
        const video = e.target as HTMLVideoElement;
        if (video.error) {
          console.error('[MediaVideo] Video error code:', video.error.code, 'Message:', video.error.message);
        }
      };

      const handleLoadedMetadata = () => {
        console.log('[MediaVideo] Video metadata loaded successfully');
      };

      videoElement.addEventListener('error', handleError);
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        videoElement.removeEventListener('error', handleError);
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    };

    // Try immediately, then retry after a short delay if element not ready
    const cleanup = initializeVideo();
    const timeoutId = setTimeout(() => {
      const delayedCleanup = initializeVideo();
      if (delayedCleanup) {
        delayedCleanup();
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (cleanup) cleanup();
    };
  }, [videoUrl, ref]);

  // Intersection Observer for autoplay when in viewport
  // Safari-specific: Keep video muted for autoplay (Safari blocks unmuted autoplay)
  useEffect(() => {
    if (!videoUrl) return;

    // Wait for video element to be available
    const setupObserver = () => {
      if (!ref) return null;
      if (typeof ref === 'function') return null;
      const videoElement = ref.current;
      if (!videoElement) return null;

      // Safari requires muted autoplay - ensure video is muted
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.setAttribute('playsinline', 'true');
      videoElement.setAttribute('webkit-playsinline', 'true');
      
      // Initialize as paused
      videoElement.pause();

      // Track if user has interacted (for unmuting)
      let userInteracted = false;
      
      // Listen for user interaction to allow unmuting
      const handleUserInteraction = () => {
        userInteracted = true;
        // User interacted, can now unmute if needed
        if (!videoElement.paused) {
          videoElement.muted = false;
        }
      };

      // Add event listeners for user interaction
      const events = ['click', 'touchstart', 'keydown'];
      events.forEach(event => {
        document.addEventListener(event, handleUserInteraction, { once: true, passive: true });
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Video is in viewport - play it (muted for Safari compatibility)
              // Only unmute if user has interacted
              if (userInteracted) {
                videoElement.muted = false;
              } else {
                videoElement.muted = true; // Keep muted for autoplay
              }
              
              videoElement.play().catch((err) => {
                console.warn('[MediaVideo] Autoplay blocked:', err);
                // If autoplay fails, try muted play (Safari requirement)
                if (!videoElement.muted) {
                  videoElement.muted = true;
                  videoElement.play().catch((mutedErr) => {
                    console.warn('[MediaVideo] Muted autoplay also blocked:', mutedErr);
                  });
                }
              });
            } else {
              // Video is out of viewport - pause it
              videoElement.pause();
            }
          });
        },
        {
          threshold: 0.3, // Play when 30% of video is visible
          rootMargin: '0px', // No margin for Safari compatibility
        }
      );

      observer.observe(videoElement);

      return () => {
        observer.disconnect();
        events.forEach(event => {
          document.removeEventListener(event, handleUserInteraction);
        });
      };
    };

    // Try immediately, then retry after a short delay if element not ready
    let cleanup: (() => void) | null = setupObserver();
    if (!cleanup) {
      const timeoutId = setTimeout(() => {
        cleanup = setupObserver();
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        if (cleanup) cleanup();
      };
    }

    return cleanup;
  }, [videoUrl, ref]);

  // CRITICAL: Only render video element when we have a valid R2 URL
  // Never render with empty/undefined src to prevent browser from trying relative paths
  if (loading || !videoUrl) {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <div className="text-white" suppressHydrationWarning>
          {loading ? 'Loading video...' : 'Video unavailable'}
        </div>
      </div>
    );
  }

  // Validate R2 URL format
  if (!videoUrl.startsWith('https://')) {
    console.error(`[MediaVideo] Invalid video URL format: ${videoUrl}. Must be HTTPS R2 URL.`);
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <div className="text-white text-sm">Video unavailable</div>
      </div>
    );
  }

  console.log(`[MediaVideo] Rendering video with R2 URL: ${videoUrl}`);

  // Safari-specific: Handle video load errors
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    console.error('[MediaVideo] Video load error:', {
      error: video.error,
      networkState: video.networkState,
      readyState: video.readyState,
      src: video.src,
    });
    
    if (video.error) {
      console.error('[MediaVideo] Error details:', {
        code: video.error.code,
        message: video.error.message,
      });
    }
  };

  // Remove crossOrigin to avoid CORS issues with R2
  // Safari requires proper CORS headers for range requests, but R2 doesn't have CORS configured
  // The video will work without crossOrigin attribute
  return (
    <video
      ref={ref}
      src={videoUrl}
      muted
      preload="auto"
      playsInline
      onError={handleVideoError}
      onLoadedMetadata={() => {
        console.log('[MediaVideo] Video metadata loaded');
      }}
      onCanPlay={() => {
        console.log('[MediaVideo] Video can play');
      }}
      {...videoProps}
    />
  );
});

MediaVideo.displayName = 'MediaVideo';

export default MediaVideo;
