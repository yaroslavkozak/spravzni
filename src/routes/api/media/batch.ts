import { createFileRoute } from '@tanstack/react-router'
import { getMedia } from '@/src/lib/database'
import type { Env } from '@/types/cloudflare'

export const Route = createFileRoute('/api/media/batch')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        try {
          const body = await request.json()
          const { keys }: { keys: string[] } = body

          if (!Array.isArray(keys) || keys.length === 0) {
            return new Response(
              JSON.stringify({ error: 'Invalid request. Expected array of keys.' }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Limit batch size to prevent abuse
          if (keys.length > 50) {
            return new Response(
              JSON.stringify({ error: 'Too many keys. Maximum 50 keys per request.' }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Get Cloudflare context
          let db
          try {
            const env = context.env as Env
            db = env.DB
          } catch (error) {
            console.warn('Cloudflare context not available:', error)
            return new Response(
              JSON.stringify({ error: 'Database unavailable' }),
              {
                status: 503,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Fetch all media in parallel
          const mediaPromises = keys.map(key => getMedia(db, key))
          const mediaResults = await Promise.all(mediaPromises)

          // Build response object with keys as keys
          const mediaMap: Record<string, any> = {}
          keys.forEach((key, index) => {
            if (mediaResults[index]) {
              mediaMap[key] = mediaResults[index]
            }
          })

          return new Response(
            JSON.stringify({ media: mediaMap }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
              },
            }
          )
        } catch (error) {
          console.error('Error fetching batch media:', error)
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
