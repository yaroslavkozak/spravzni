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
import { createText, deleteText } from '@/src/lib/database'
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

async function syncServiceToTranslations(
  db: Env['DB'],
  serviceId: number,
  payload: {
    heading_uk: string
    paragraphs_uk: string[]
    primary_button_text_uk: string
    secondary_button_text_uk: string
    overlay_text_uk?: string | null
  }
): Promise<void> {
  await createText(db, {
    key: `services.service${serviceId}.title`,
    language: 'uk',
    value: payload.heading_uk,
  })

  for (let i = 0; i < payload.paragraphs_uk.length; i += 1) {
    await createText(db, {
      key: `services.service${serviceId}.p${i + 1}`,
      language: 'uk',
      value: payload.paragraphs_uk[i],
    })
  }

  for (let i = payload.paragraphs_uk.length + 1; i <= 20; i += 1) {
    await Promise.all([
      deleteText(db, `services.service${serviceId}.p${i}`, 'uk'),
      deleteText(db, `services.service${serviceId}.p${i}`, 'en'),
      deleteText(db, `services.service${serviceId}.p${i}`, 'pl'),
    ])
  }

  await createText(db, {
    key: `services.service${serviceId}.primaryButton`,
    language: 'uk',
    value: payload.primary_button_text_uk || '',
  })

  await createText(db, {
    key: `services.service${serviceId}.secondaryButton`,
    language: 'uk',
    value: payload.secondary_button_text_uk || '',
  })

  await createText(db, {
    key: `services.service${serviceId}.overlay`,
    language: 'uk',
    value: payload.overlay_text_uk || '',
  })
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

          await syncServiceToTranslations(db, service.id, {
            heading_uk: service.heading_uk,
            paragraphs_uk: parseServiceParagraphs(service.paragraphs_uk),
            primary_button_text_uk: service.primary_button_text_uk,
            secondary_button_text_uk: service.secondary_button_text_uk,
            overlay_text_uk: service.overlay_text_uk,
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
