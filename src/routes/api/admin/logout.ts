import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { deleteAdminSession } from '@/src/lib/database/admin-auth'

export const Route = createFileRoute('/api/admin/logout')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        try {
          // Get session ID from cookie
          const cookies = request.headers.get('Cookie') || ''
          const sessionMatch = cookies.match(/admin_session=([^;]+)/)
          const sessionId = sessionMatch ? sessionMatch[1] : null

          if (sessionId) {
            // Get environment
            let env: Env | null = null
            try {
              env = context.env as Env
            } catch (error) {
              console.warn('Cloudflare context not available:', error)
            }

            if (env?.DB) {
              // Delete session from database
              await deleteAdminSession(env.DB, sessionId)
            }
          }

          // Return success and clear cookie
          return new Response(
            JSON.stringify({ 
              success: true,
              message: 'Logged out successfully'
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                // Clear session cookie
                'Set-Cookie': 'admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
              },
            }
          )
        } catch (error) {
          console.error('Error processing admin logout:', error)
          return new Response(
            JSON.stringify({ 
              success: false,
              error: 'Failed to process logout'
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
