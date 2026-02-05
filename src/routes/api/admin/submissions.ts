import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getAdminUserFromSession } from '@/src/lib/database/admin-auth'
import { getFormSubmissions, getFormSubmissionCounts } from '@/src/lib/database/form-submissions'
import type { FormType, FormStatus } from '@/src/lib/database/form-submissions'

export const Route = createFileRoute('/api/admin/submissions')({
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

          // Get query parameters
          const url = new URL(request.url)
          const formType = url.searchParams.get('form_type') as FormType | null
          const status = url.searchParams.get('status') as FormStatus | null
          const limit = parseInt(url.searchParams.get('limit') || '100', 10)
          const offset = parseInt(url.searchParams.get('offset') || '0', 10)

          // Get submissions
          const submissions = await getFormSubmissions(env.DB, {
            form_type: formType || undefined,
            status: status || undefined,
            limit,
            offset,
            orderBy: 'created_at',
            orderDirection: 'DESC',
          })

          // Get counts
          const counts = await getFormSubmissionCounts(env.DB, formType || undefined)

          // Parse form_data JSON for each submission
          const submissionsWithParsedData = submissions.map(sub => ({
            ...sub,
            form_data: JSON.parse(sub.form_data),
          }))

          return new Response(
            JSON.stringify({
              success: true,
              submissions: submissionsWithParsedData,
              counts,
              total: submissions.length,
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        } catch (error) {
          console.error('Error fetching form submissions:', error)
          return new Response(
            JSON.stringify({ 
              success: false,
              error: 'Failed to fetch submissions',
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
