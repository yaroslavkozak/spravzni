import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import {
  getOrCreateChatSession,
  getActiveChatCount,
  getNextQueuePosition,
  updateChatSession,
  createChatSession,
} from '@/src/lib/chat-database'
import { createFormSubmission } from '@/src/lib/database/form-submissions'

export const Route = createFileRoute('/api/chat/questionnaire')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        try {
          const env = context.env as Env
          const body = await request.json() as {
            name: string
            email: string
            phone: string
            userIdentifier: string
          }

          // Validate required fields
          if (!body.name || !body.email || !body.phone) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Name, email, and phone are required',
              }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Check if there's an active chat
          const activeChatCount = await getActiveChatCount(env.DB)

          let session
          let queuePosition: number | null = null

          if (activeChatCount > 0) {
            // There's an active chat, put user in queue
            queuePosition = await getNextQueuePosition(env.DB)
            
            const sessionId = crypto.randomUUID()
            session = await createChatSession(env.DB, {
              id: sessionId,
              user_identifier: body.userIdentifier,
              status: 'queued',
              user_name: body.name,
              user_email: body.email,
              user_phone: body.phone,
              queue_position: queuePosition,
            })
          } else {
            // No active chat, make this user active
            const sessionId = crypto.randomUUID()
            session = await createChatSession(env.DB, {
              id: sessionId,
              user_identifier: body.userIdentifier,
              status: 'active',
              user_name: body.name,
              user_email: body.email,
              user_phone: body.phone,
              queue_position: null,
            })
          }

          // Save form submission to database
          if (env.DB) {
            try {
              // Extract request metadata
              const ipAddress = request.headers.get('cf-connecting-ip') || 
                               request.headers.get('x-forwarded-for') || 
                               request.headers.get('x-real-ip') || 
                               null
              const userAgent = request.headers.get('user-agent') || null
              const referrer = request.headers.get('referer') || null

              await createFormSubmission(env.DB, {
                form_type: 'questionnaire',
                name: body.name,
                phone: body.phone,
                email: body.email,
                form_data: body,
                ip_address: ipAddress,
                user_agent: userAgent,
                referrer: referrer,
              })
            } catch (dbError) {
              console.error('Error saving form submission to database:', dbError)
              // Don't fail the request if database save fails
            }
          }

          // Send notification to Telegram
          if (env.NOTIFICATIONS_QUEUE) {
            try {
              await env.NOTIFICATIONS_QUEUE.send({
                type: 'chat-message',
                data: {
                  sessionId: session.id,
                  messageText: session.status === 'queued' 
                    ? `Новий користувач в черзі (позиція ${queuePosition})` 
                    : 'Новий користувач почав чат',
                  senderType: 'user' as const,
                  userIdentifier: body.userIdentifier,
                  userName: body.name,
                  userEmail: body.email,
                  userPhone: body.phone,
                  queuePosition: queuePosition,
                },
                metadata: {
                  timestamp: new Date().toISOString(),
                },
              })
            } catch (error) {
              console.error('Error sending notification to queue:', error)
              // Don't fail the request if notification fails
            }
          }

          return new Response(
            JSON.stringify({
              success: true,
              session,
              queuePosition,
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        } catch (error) {
          console.error('Error processing questionnaire:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to process questionnaire',
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
