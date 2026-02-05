import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import {
  getOrCreateChatSession,
  getChatSession,
  createChatSession,
} from '@/src/lib/chat-database'

export const Route = createFileRoute('/api/chat/sessions')({
  server: {
    handlers: {
      // Create or get a chat session
      POST: async ({ request, context }) => {
        try {
          const env = context.env as Env
          const body = await request.json().catch(() => ({})) as {
            userIdentifier?: string
            sessionId?: string
          }

          let session

          if (body.sessionId) {
            // Get existing session
            session = await getChatSession(env.DB, body.sessionId)
            if (!session) {
              return new Response(
                JSON.stringify({
                  success: false,
                  error: 'Session not found',
                }),
                {
                  status: 404,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              )
            }
          } else {
            // Create new session or get existing for user
            const userIdentifier = body.userIdentifier || crypto.randomUUID()
            session = await getOrCreateChatSession(env.DB, userIdentifier)
          }

          return new Response(
            JSON.stringify({
              success: true,
              session,
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        } catch (error) {
          console.error('Error creating/getting chat session:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to create session',
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

      // Get session by ID
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

          const session = await getChatSession(env.DB, sessionId)

          if (!session) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Session not found',
              }),
              {
                status: 404,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          return new Response(
            JSON.stringify({
              success: true,
              session,
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        } catch (error) {
          console.error('Error getting chat session:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to get session',
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

      // Close a chat session and activate next queued user
      DELETE: async ({ request, context }) => {
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

          // Close the session
          const { updateChatSession } = await import('@/src/lib/chat-database')
          await updateChatSession(env.DB, sessionId, {
            status: 'closed',
          })

          // Activate next queued user
          const { activateNextQueuedUser } = await import('@/src/lib/chat-database')
          const nextUser = await activateNextQueuedUser(env.DB)

          // Notify manager about next user if exists
          if (nextUser && env.NOTIFICATIONS_QUEUE) {
            try {
              await env.NOTIFICATIONS_QUEUE.send({
                type: 'chat-message',
                data: {
                  sessionId: nextUser.id,
                  messageText: 'Користувач готовий до чату',
                  senderType: 'user' as const,
                  userIdentifier: nextUser.user_identifier || null,
                  userName: nextUser.user_name || null,
                  userEmail: nextUser.user_email || null,
                  userPhone: nextUser.user_phone || null,
                  queuePosition: null, // Now active
                },
                metadata: {
                  timestamp: new Date().toISOString(),
                },
              })
            } catch (error) {
              console.error('Error sending notification for next user:', error)
            }
          }

          return new Response(
            JSON.stringify({
              success: true,
              nextUserActivated: !!nextUser,
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        } catch (error) {
          console.error('Error closing chat session:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to close session',
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
