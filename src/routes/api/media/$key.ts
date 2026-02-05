import { createFileRoute } from '@tanstack/react-router'
import { getMedia } from '@/src/lib/database'
import type { Env } from '@/types/cloudflare'

export const Route = createFileRoute('/api/media/$key')({
  server: {
    handlers: {
      GET: async ({ request, context, params }) => {
        try {
          const key = decodeURIComponent(params.key)

          // Get Cloudflare context
          let db
          try {
            const env = context.env as Env
            db = env.DB
          } catch (error) {
            // Fallback if Cloudflare context is not available (e.g., in local development)
            console.warn('Cloudflare context not available, returning 404 for media:', key)
            return new Response(
              JSON.stringify({ error: 'Media not found (Cloudflare context unavailable)' }),
              {
                status: 404,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Fetch media from D1
          const media = await getMedia(db, key)

          if (!media) {
            return new Response(
              JSON.stringify({ error: 'Media not found' }),
              {
                status: 404,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          return new Response(
            JSON.stringify({ media }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
              },
            }
          )
        } catch (error) {
          console.error('Error fetching media:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to fetch media' }),
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        }
      },
    },
  },
})
