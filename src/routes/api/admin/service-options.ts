import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getAdminUserFromSession } from '@/src/lib/database/admin-auth'
import {
  getServiceOptions,
  createServiceOption,
} from '@/src/lib/database/services'
import { createText, getText } from '@/src/lib/database'
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

async function syncServiceOptionToTranslations(
  db: Env['DB'],
  optionId: number,
  payload: { title_uk: string; description_uk: string; overlay_text_uk: string }
): Promise<void> {
  await Promise.all([
    createText(db, {
      key: `vacationOptions.option${optionId}.title`,
      language: 'uk',
      value: payload.title_uk,
    }),
    createText(db, {
      key: `vacationOptions.option${optionId}.desc`,
      language: 'uk',
      value: payload.description_uk,
    }),
    createText(db, {
      key: `vacationOptions.option${optionId}.overlay`,
      language: 'uk',
      value: payload.overlay_text_uk,
    }),
  ])
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
          const optionsWithOverlay = await Promise.all(
            options.map(async (option) => {
              const overlay = await getText(db, `vacationOptions.option${option.id}.overlay`, 'uk')
              return {
                ...option,
                overlay_text_uk: overlay?.value || '',
              }
            })
          )

          return new Response(
            JSON.stringify({
              success: true,
              options: optionsWithOverlay,
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

          const body = (await request.json()) as CreateServiceOptionInput & {
            overlay_text_uk?: string
          }

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
          await syncServiceOptionToTranslations(db, option.id, {
            title_uk: option.title_uk,
            description_uk: option.description_uk,
            overlay_text_uk: body.overlay_text_uk?.trim() || '',
          })

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
