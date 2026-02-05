import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getAdminUserFromSession } from '@/src/lib/database/admin-auth'
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  parseServiceParagraphs,
} from '@/src/lib/database/services'
import type {
  CreateServiceInput,
  UpdateServiceInput,
} from '@/types/database'

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

export const Route = createFileRoute('/api/admin/services')({
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
          const activeOnly = url.searchParams.get('activeOnly') === 'true'
          const services = await getServices(db, { activeOnly })

          // Parse paragraphs for each service
          const servicesWithParsedParagraphs = services.map((service) => ({
            ...service,
            paragraphs_uk: parseServiceParagraphs(service.paragraphs_uk),
            paragraphs_en: service.paragraphs_en
              ? parseServiceParagraphs(service.paragraphs_en)
              : null,
          }))

          return new Response(
            JSON.stringify({
              success: true,
              services: servicesWithParsedParagraphs,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error fetching services:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to fetch services',
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

          const body = (await request.json()) as CreateServiceInput
          const normalizeButtonText = (value?: string | null) => {
            if (!value) return ''
            const trimmed = value.trim()
            if (trimmed === '' || trimmed === '0' || trimmed === '-') {
              return ''
            }
            return trimmed
          }

          if (!body.heading_uk || !body.secondary_button_text_uk) {
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

          const primaryButtonTextUk = normalizeButtonText(body.primary_button_text_uk)
          const primaryButtonTextEn = normalizeButtonText(body.primary_button_text_en)
          const shouldShowPrimary = primaryButtonTextUk !== ''
          const service = await createService(db, {
            ...body,
            primary_button_text_uk: primaryButtonTextUk,
            primary_button_text_en: primaryButtonTextEn || undefined,
            primary_action: shouldShowPrimary ? body.primary_action : 'none',
            show_primary_button: shouldShowPrimary,
          })

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
              status: 201,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error creating service:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to create service',
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
