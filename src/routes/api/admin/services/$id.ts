import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getAdminUserFromSession } from '@/src/lib/database/admin-auth'
import {
  getServiceById,
  updateService,
  deleteService,
  parseServiceParagraphs,
} from '@/src/lib/database/services'
import type { UpdateServiceInput } from '@/types/database'

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

export const Route = createFileRoute('/api/admin/services/$id')({
  server: {
    handlers: {
      GET: async ({ request, context, params }) => {
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

          const serviceId = parseInt(params.id, 10)
          if (isNaN(serviceId)) {
            return new Response(
              JSON.stringify({ success: false, error: 'Invalid service ID' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const service = await getServiceById(db, serviceId)
          if (!service) {
            return new Response(
              JSON.stringify({ success: false, error: 'Service not found' }),
              {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          // Parse paragraphs for response
          const serviceWithParsedParagraphs = {
            ...service,
            paragraphs_uk: parseServiceParagraphs(service.paragraphs_uk),
            paragraphs_en: service.paragraphs_en
              ? parseServiceParagraphs(service.paragraphs_en)
              : null,
          }

          return new Response(
            JSON.stringify({
              success: true,
              service: serviceWithParsedParagraphs,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error fetching service:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to fetch service',
              details: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }
      },
      PATCH: async ({ request, context, params }) => {
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

          const serviceId = parseInt(params.id, 10)
          if (isNaN(serviceId)) {
            return new Response(
              JSON.stringify({ success: false, error: 'Invalid service ID' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const body = (await request.json()) as UpdateServiceInput
          const normalizeButtonText = (value?: string | null) => {
            if (value === undefined || value === null) return undefined
            const trimmed = value.trim()
            if (trimmed === '' || trimmed === '0' || trimmed === '-') {
              return ''
            }
            return trimmed
          }
          const normalizedPrimaryUk = normalizeButtonText(body.primary_button_text_uk)
          const normalizedPrimaryEn = normalizeButtonText(body.primary_button_text_en)
          const shouldShowPrimary =
            normalizedPrimaryUk !== undefined ? normalizedPrimaryUk !== '' : undefined
          const updated = await updateService(db, serviceId, {
            ...body,
            primary_button_text_uk: normalizedPrimaryUk ?? body.primary_button_text_uk,
            primary_button_text_en: normalizedPrimaryEn ?? body.primary_button_text_en,
            primary_action:
              shouldShowPrimary === false
                ? 'none'
                : body.primary_action,
            show_primary_button:
              shouldShowPrimary === false ? false : body.show_primary_button,
          })

          if (!updated) {
            return new Response(
              JSON.stringify({ success: false, error: 'Service not found' }),
              {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          // Parse paragraphs for response
          const serviceWithParsedParagraphs = {
            ...updated,
            paragraphs_uk: parseServiceParagraphs(updated.paragraphs_uk),
            paragraphs_en: updated.paragraphs_en
              ? parseServiceParagraphs(updated.paragraphs_en)
              : null,
          }

          return new Response(
            JSON.stringify({
              success: true,
              service: serviceWithParsedParagraphs,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error updating service:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to update service',
              details: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }
      },
      DELETE: async ({ request, context, params }) => {
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

          const serviceId = parseInt(params.id, 10)
          if (isNaN(serviceId)) {
            return new Response(
              JSON.stringify({ success: false, error: 'Invalid service ID' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const deleted = await deleteService(db, serviceId)
          return new Response(
            JSON.stringify({ success: true, deleted }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error deleting service:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to delete service',
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
