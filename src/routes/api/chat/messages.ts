import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getRecentChatMessages, getChatMessages } from '@/src/lib/chat-database'

export const Route = createFileRoute('/api/chat/messages')({
  server: {
    handlers: {
      GET: async ({ request, context }) => {
        try {
          const env = context.env as Env
          const url = new URL(request.url)
          const sessionId = url.searchParams.get('sessionId')

          if (!sessionId) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'sessionId is required',
              }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          const limit = parseInt(url.searchParams.get('limit') || '50')
          const offset = parseInt(url.searchParams.get('offset') || '0')
          const recent = url.searchParams.get('recent') === 'true'

          const messages = recent
            ? await getRecentChatMessages(env.DB, sessionId, limit)
            : await getChatMessages(env.DB, sessionId, limit, offset)

          return new Response(
            JSON.stringify({
              success: true,
              messages,
              sessionId,
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
              },
            }
          )
        } catch (error) {
          console.error('Error fetching chat messages:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to fetch messages',
              details: error instanceof Error ? error.message : 'Unknown error',
            }),
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
