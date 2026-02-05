import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getAdminUserFromSession } from '@/src/lib/database/admin-auth'
import {
  getServiceOptions,
  createServiceOption,
} from '@/src/lib/database/services'
import type { CreateServiceOptionInput } from '@/types/database'

function getSessionId(request: Request): string | null {
  const cookies = request.headers.get('Cookie') || ''
  const sessionMatch = cookies.match(/admin_session=([^;]+)/)
  return sessionMatch ? sessionMatch[1] : null
}

async function getDatabaseFromContext(context: unknown): Promise<Env['DB']> {
  const env = (context as { env?: Env }).env
  if (!env?.DB) {
    throw new Error('Database not available')
  }
  return env.DB
}

export const Route = createFileRoute('/api/admin/service-options')({
  server: {
    handlers: {
      GET: async ({ request, context }) => {
        try {
          const sessionId = getSessionId(request)
          if (!sessionId) {
            return new Response(
              JSON.stringify({ success: false, error: 'Unauthorized' }),
              {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const db = await getDatabaseFromContext(context)
          const user = await getAdminUserFromSession(db, sessionId)
          if (!user) {
            return new Response(
              JSON.stringify({ success: false, error: 'Unauthorized' }),
              {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const url = new URL(request.url)
          const serviceId = url.searchParams.get('serviceId')
          const activeOnly = url.searchParams.get('activeOnly') === 'true'

          if (!serviceId) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Missing serviceId parameter',
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const serviceIdNum = parseInt(serviceId, 10)
          if (isNaN(serviceIdNum)) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Invalid serviceId parameter',
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const options = await getServiceOptions(db, serviceIdNum, {
            activeOnly,
          })

          return new Response(
            JSON.stringify({
              success: true,
              options,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error fetching service options:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to fetch service options',
              details: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }
      },
      POST: async ({ request, context }) => {
        try {
          const sessionId = getSessionId(request)
          if (!sessionId) {
            return new Response(
              JSON.stringify({ success: false, error: 'Unauthorized' }),
              {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const db = await getDatabaseFromContext(context)
          const user = await getAdminUserFromSession(db, sessionId)
          if (!user) {
            return new Response(
              JSON.stringify({ success: false, error: 'Unauthorized' }),
              {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const body = (await request.json()) as CreateServiceOptionInput

          if (
            !body.service_id ||
            !body.title_uk ||
            !body.description_uk ||
            !body.image_path
          ) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Missing required fields',
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const option = await createServiceOption(db, body)

          return new Response(
            JSON.stringify({
              success: true,
              option,
            }),
            {
              status: 201,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error creating service option:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to create service option',
              details: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }
      },
    },
  },
})
