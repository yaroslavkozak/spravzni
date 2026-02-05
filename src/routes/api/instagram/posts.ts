import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'

interface InstagramMedia {
  id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  caption?: string
  timestamp: string
  thumbnail_url?: string
}

interface InstagramResponse {
  data: InstagramMedia[]
  paging?: {
    cursors?: {
      before?: string
      after?: string
    }
    next?: string
  }
}

export const Route = createFileRoute('/api/instagram/posts')({
  server: {
    handlers: {
      GET: async ({ request, context }) => {
        try {
          const url = new URL(request.url)
          const limit = parseInt(url.searchParams.get('limit') || '12', 10)

          // Get Cloudflare context
          let env: Env | null = null
          try {
            env = context.env as Env
          } catch (error) {
            console.warn('Cloudflare context not available')
          }

          // Check for Instagram access token
          const instagramAccessToken = env?.INSTAGRAM_ACCESS_TOKEN
          const instagramUserId = env?.INSTAGRAM_USER_ID

          if (!instagramAccessToken || !instagramUserId) {
            console.warn('Instagram credentials not configured, returning empty array')
            return new Response(
              JSON.stringify({
                success: false,
                posts: [],
                error: 'Instagram API not configured',
              }),
              {
                status: 200, // Return 200 so frontend can handle gracefully
                headers: {
                  'Content-Type': 'application/json',
                  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                },
              }
            )
          }

          // Fetch posts from Instagram Graph API
          const apiUrl = `https://graph.instagram.com/${instagramUserId}/media?fields=id,media_type,media_url,permalink,caption,timestamp,thumbnail_url&limit=${limit}&access_token=${instagramAccessToken}`

          const response = await fetch(apiUrl)

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('Instagram API error:', errorData)
            throw new Error(`Instagram API error: ${response.status}`)
          }

          const data: InstagramResponse = await response.json()

          // Transform the data to match our frontend needs
          const posts = data.data.map((media) => ({
            id: media.id,
            imageUrl: media.media_type === 'VIDEO' ? media.thumbnail_url || media.media_url : media.media_url,
            permalink: media.permalink,
            caption: media.caption || '',
            timestamp: media.timestamp,
            mediaType: media.media_type,
          }))

          return new Response(
            JSON.stringify({
              success: true,
              posts,
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
              },
            }
          )
        } catch (error) {
          console.error('Error fetching Instagram posts:', error)
          return new Response(
            JSON.stringify({
              success: false,
              posts: [],
              error: error instanceof Error ? error.message : 'Failed to fetch Instagram posts',
            }),
            {
              status: 200, // Return 200 so frontend can handle gracefully
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
              },
            }
          )
        }
      },
    },
  },
})
