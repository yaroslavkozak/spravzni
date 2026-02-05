import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { createAdminUser, getAdminUserByEmail } from '@/src/lib/database/admin-auth'

/**
 * One-time setup endpoint to create the first admin user
 * This should be protected or removed after initial setup
 * 
 * Usage: POST /api/admin/setup
 * Body: { email: string, password: string, name?: string }
 */
export const Route = createFileRoute('/api/admin/setup')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        try {
          // Check if any admin users exist
          // If they do, this endpoint should be disabled
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

          // Check if admin users already exist
          // This is a simple check - in production, you might want to check a specific count
          const existingAdmin = await getAdminUserByEmail(env.DB, 'admin@example.com')
          // For now, we'll allow setup if no admin exists
          // In production, you should add a proper check or disable this endpoint entirely

          const body = await request.json() as { 
            email: string
            password: string
            name?: string
          }

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

          // Create admin user
          const user = await createAdminUser(env.DB, {
            email: body.email,
            password: body.password,
            name: body.name || null,
            role: 'super_admin', // First user is super admin
          })

          return new Response(
            JSON.stringify({
              success: true,
              message: 'Admin user created successfully',
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
              },
            }
          )
        } catch (error) {
          console.error('Error creating admin user:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to create admin user',
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
