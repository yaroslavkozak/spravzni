import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'

export const Route = createFileRoute('/api/media/proxy/$')({
  server: {
    handlers: {
      GET: async ({ request, context }) => {
        try {
          // Extract the path from the URL
          // The route is /api/media/proxy/*, so we need to get everything after /api/media/proxy/
          const url = new URL(request.url)
          const pathname = url.pathname
          const prefix = '/api/media/proxy/'
          const r2Key = pathname.startsWith(prefix) 
            ? pathname.slice(prefix.length)
            : ''

          if (!r2Key) {
            return new Response(
              JSON.stringify({ error: 'Invalid path' }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Get Cloudflare context
          let bucket
          try {
            const env = context.env as Env
            bucket = env.BUCKET
          } catch (error) {
            console.error('Cloudflare context not available:', error)
            return new Response(
              JSON.stringify({ error: 'Storage unavailable' }),
              {
                status: 503,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Get object from R2
          const object = await bucket.get(r2Key)

          if (!object) {
            return new Response(
              JSON.stringify({ error: 'Object not found' }),
              {
                status: 404,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Convert ReadableStream to ArrayBuffer
          const arrayBuffer = await object.arrayBuffer()

          // Return the file with appropriate headers
          return new Response(arrayBuffer, {
            headers: {
              'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
              'Cache-Control': 'public, max-age=31536000, immutable',
              'Content-Length': object.size.toString(),
            },
          })
        } catch (error) {
          console.error('Error proxying R2 object:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to fetch object' }),
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
