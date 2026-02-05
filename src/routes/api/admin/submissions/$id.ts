import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getAdminUserFromSession } from '@/src/lib/database/admin-auth'
import { updateFormSubmissionStatus } from '@/src/lib/database/form-submissions'
import type { FormStatus } from '@/src/lib/database/form-submissions'

export const Route = createFileRoute('/api/admin/submissions/$id')({
  server: {
    handlers: {
      PATCH: async ({ request, context, params }) => {
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

          // Parse request body
          const body = await request.json() as { 
            status: FormStatus
            notes?: string | null
          }

          // Validate input
          if (!body.status) {
            return new Response(
              JSON.stringify({ success: false, error: 'Status is required' }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          const submissionId = parseInt(params.id, 10)
          if (isNaN(submissionId)) {
            return new Response(
              JSON.stringify({ success: false, error: 'Invalid submission ID' }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Update submission status
          const success = await updateFormSubmissionStatus(
            env.DB,
            submissionId,
            body.status,
            body.notes || null
          )

          if (!success) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'Failed to update submission' 
              }),
              {
                status: 500,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          return new Response(
            JSON.stringify({
              success: true,
              message: 'Submission updated successfully',
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        } catch (error) {
          console.error('Error updating submission:', error)
          return new Response(
            JSON.stringify({ 
              success: false,
              error: 'Failed to update submission',
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
