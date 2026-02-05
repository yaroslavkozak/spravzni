import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getAdminUserFromSession } from '@/src/lib/database/admin-auth'

export const Route = createFileRoute('/api/admin/me')({
  server: {
    handlers: {
      GET: async ({ request, context }) => {
        try {
          // Get session ID from cookie
          const cookies = request.headers.get('Cookie') || ''
          const sessionMatch = cookies.match(/admin_session=([^;]+)/)
          const sessionId = sessionMatch ? sessionMatch[1] : null

          if (!sessionId) {
            return new Response(
              JSON.stringify({ success: false, error: 'Unauthorized' }),
              {
                status: 401,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Get environment
          let env: Env | null = null
          try {
            env = context.env as Env
          } catch (error) {
            console.warn('Cloudflare context not available:', error)
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'Server configuration error' 
              }),
              {
                status: 500,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          if (!env?.DB) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'Database not available' 
              }),
              {
                status: 500,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Verify session and get admin user
          const user = await getAdminUserFromSession(env.DB, sessionId)
          if (!user) {
            return new Response(
              JSON.stringify({ success: false, error: 'Unauthorized' }),
              {
                status: 401,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Return user info (without password)
          return new Response(
            JSON.stringify({
              success: true,
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                last_login_at: user.last_login_at,
              },
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        } catch (error) {
          console.error('Error fetching admin user:', error)
          return new Response(
            JSON.stringify({ 
              success: false,
              error: 'Failed to fetch user info',
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
