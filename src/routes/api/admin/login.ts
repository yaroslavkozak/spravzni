import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { verifyAdminLogin, createAdminSession } from '@/src/lib/database/admin-auth'

export const Route = createFileRoute('/api/admin/login')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        try {
          const body = await request.json() as { email: string; password: string }

          // Validate input
          if (!body.email || !body.password) {
            return new Response(
              JSON.stringify({ success: false, error: 'Email and password are required' }),
              {
                status: 400,
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

          // Verify credentials
          const user = await verifyAdminLogin(env.DB, {
            email: body.email,
            password: body.password,
          })

          if (!user) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'Invalid email or password' 
              }),
              {
                status: 401,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Extract request metadata
          const ipAddress = request.headers.get('cf-connecting-ip') || 
                           request.headers.get('x-forwarded-for') || 
                           request.headers.get('x-real-ip') || 
                           null
          const userAgent = request.headers.get('user-agent') || null

          // Create session
          const session = await createAdminSession(
            env.DB,
            user.id,
            ipAddress,
            userAgent
          )

          // Return success with session token
          // In production, you might want to set this as an HttpOnly cookie
          return new Response(
            JSON.stringify({ 
              success: true,
              session: {
                id: session.id,
                expiresAt: session.expires_at,
              },
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              },
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                // Set session cookie
                'Set-Cookie': `admin_session=${session.id}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Secure`,
              },
            }
          )
        } catch (error) {
          console.error('Error processing admin login:', error)
          return new Response(
            JSON.stringify({ 
              success: false,
              error: 'Failed to process login',
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
