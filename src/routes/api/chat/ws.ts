import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { ChatRoom } from '@/src/workers/chat-room'

export const Route = createFileRoute('/api/chat/ws')({
  server: {
    handlers: {
      GET: async ({ request, context }) => {
        try {
          const env = context.env as Env
          const url = new URL(request.url)
          
          // Get session ID from query parameter or generate one
          let sessionId = url.searchParams.get('sessionId')
          
          if (!sessionId) {
            // Generate a new session ID
            sessionId = crypto.randomUUID()
          }

          // Check if Durable Object is available
          if (!env.CHAT_ROOM) {
            return new Response(
              JSON.stringify({
                error: 'WebSocket not available - Durable Object not configured',
              }),
              {
                status: 503,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Get or create Durable Object for this session
          const id = env.CHAT_ROOM.idFromName(sessionId)
          const chatRoom = env.CHAT_ROOM.get(id)

          // Create a new request URL for the Durable Object (use /ws path)
          const doUrl = new URL(request.url)
          doUrl.pathname = '/ws'
          doUrl.search = `?sessionId=${sessionId}`

          // Create a new request with WebSocket upgrade headers
          const headers = new Headers(request.headers)
          headers.set('Upgrade', 'websocket')
          headers.set('Connection', 'Upgrade')
          headers.set('Sec-WebSocket-Key', request.headers.get('Sec-WebSocket-Key') || '')
          headers.set('Sec-WebSocket-Version', request.headers.get('Sec-WebSocket-Version') || '13')
          if (request.headers.get('Sec-WebSocket-Protocol')) {
            headers.set('Sec-WebSocket-Protocol', request.headers.get('Sec-WebSocket-Protocol') || '')
          }

          const wsRequest = new Request(doUrl.toString(), {
            method: request.method,
            headers: headers,
          })

          // Forward the request to the Durable Object
          return chatRoom.fetch(wsRequest)
        } catch (error) {
          console.error('Error in WebSocket endpoint:', error)
          return new Response(
            JSON.stringify({
              error: 'Failed to establish WebSocket connection',
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
