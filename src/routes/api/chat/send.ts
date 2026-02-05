import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { ChatRoom } from '@/src/workers/chat-room'

export const Route = createFileRoute('/api/chat/send')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        try {
          const env = context.env as Env
          const body = await request.json() as {
            sessionId: string
            text: string
          }

          if (!body.sessionId || !body.text) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'sessionId and text are required',
              }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Validate message length
          if (body.text.length > 1000) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Message too long (max 1000 characters)',
              }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Check if Durable Object is available
          if (!env.CHAT_ROOM) {
            // Fallback: Save message directly to database
            const { createChatMessage } = await import('@/src/lib/chat-database')
            const messageId = crypto.randomUUID()
            const chatMessage = await createChatMessage(env.DB, {
              id: messageId,
              session_id: body.sessionId,
              sender_type: 'user',
              message_text: body.text.trim(),
            })

            return new Response(
              JSON.stringify({
                success: true,
                message: chatMessage,
              }),
              {
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          // Get Durable Object for this session
          const id = env.CHAT_ROOM.idFromName(body.sessionId)
          const chatRoom = env.CHAT_ROOM.get(id)

          // Forward the request to the Durable Object
          return chatRoom.fetch(
            new Request(request.url, {
              method: 'POST',
              headers: request.headers,
              body: JSON.stringify({ text: body.text }),
            })
          )
        } catch (error) {
          console.error('Error sending chat message:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to send message',
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
