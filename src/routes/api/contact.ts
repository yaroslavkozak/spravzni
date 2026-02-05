import { createFileRoute } from '@tanstack/react-router'
import type { Env, NotificationMessage } from '@/types/cloudflare'
import { createFormSubmission } from '@/src/lib/database/form-submissions'

interface ContactFormData {
  name: string
  phone: string
  email: string
  contactPreference: 'phone' | 'whatsapp' | 'email' | null
  selectedInterests: string[]
  comment?: string
  wantsPriceList: boolean
}

export const Route = createFileRoute('/api/contact')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        try {
          const body = await request.json() as ContactFormData

          // Validate required fields
          if (!body.name || !body.phone || !body.email) {
            return new Response(
              JSON.stringify({ error: 'Name, phone, and email are required' }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Get environment variables with error handling
          let env: Env | null = null
          try {
            env = context.env as Env
          } catch (error) {
            console.warn('Cloudflare context not available:', error)
            // In development or when context is unavailable, still return success
            // but log that notifications won't be sent
            return new Response(
              JSON.stringify({ 
                success: true, 
                message: 'Form submitted successfully. We will contact you soon!',
                warning: 'Notification service unavailable in development mode'
              }),
              {
                status: 200,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Save form submission to database
          if (env?.DB) {
            try {
              // Extract request metadata
              const ipAddress = request.headers.get('cf-connecting-ip') || 
                               request.headers.get('x-forwarded-for') || 
                               request.headers.get('x-real-ip') || 
                               null
              const userAgent = request.headers.get('user-agent') || null
              const referrer = request.headers.get('referer') || null

              await createFormSubmission(env.DB, {
                form_type: 'contact',
                name: body.name,
                phone: body.phone,
                email: body.email || null,
                form_data: body,
                ip_address: ipAddress,
                user_agent: userAgent,
                referrer: referrer,
              })
            } catch (dbError) {
              console.error('Error saving form submission to database:', dbError)
              // Don't fail the request if database save fails
              // Form submission is still processed for notifications
            }
          }
          
          // Check if queue is available
          if (!env || !env.NOTIFICATIONS_QUEUE) {
            console.warn('NOTIFICATIONS_QUEUE is not configured')
            // Still return success, but notifications won't be sent
            return new Response(
              JSON.stringify({ 
                success: true, 
                message: 'Form submitted successfully. We will contact you soon!',
                warning: 'Notification service is not configured'
              }),
              {
                status: 200,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Send notification to queue for async processing
          // This allows immediate response to user while processing happens in background
          try {
            const notificationMessage: NotificationMessage = {
              type: 'contact-form',
              data: body,
              metadata: {
                timestamp: new Date().toISOString(),
              },
            }

            await env.NOTIFICATIONS_QUEUE.send(notificationMessage)
          } catch (queueError) {
            console.error('Error sending message to queue:', queueError)
            // Don't fail the request if queue is unavailable
            // User still gets success response, but notifications may not be sent
          }

          // Return immediate success response
          // Email and Telegram notifications will be processed by queue consumer
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'Form submitted successfully. We will contact you soon!'
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        } catch (error) {
          console.error('Error processing contact form:', error)
          return new Response(
            JSON.stringify({ 
              error: 'Failed to process request',
              details: error instanceof Error ? error.message : 'Unknown error'
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
