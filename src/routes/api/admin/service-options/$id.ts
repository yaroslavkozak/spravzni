import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getAdminUserFromSession } from '@/src/lib/database/admin-auth'
import {
  getServiceOptionById,
  updateServiceOption,
  deleteServiceOption,
} from '@/src/lib/database/services'
import { createText, deleteText, getText } from '@/src/lib/database'
import type { UpdateServiceOptionInput } from '@/types/database'

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

async function deleteServiceOptionFromTranslations(db: Env['DB'], optionId: number): Promise<void> {
  await Promise.all([
    deleteText(db, `vacationOptions.option${optionId}.title`, 'uk'),
    deleteText(db, `vacationOptions.option${optionId}.title`, 'en'),
    deleteText(db, `vacationOptions.option${optionId}.title`, 'pl'),
    deleteText(db, `vacationOptions.option${optionId}.desc`, 'uk'),
    deleteText(db, `vacationOptions.option${optionId}.desc`, 'en'),
    deleteText(db, `vacationOptions.option${optionId}.desc`, 'pl'),
    deleteText(db, `vacationOptions.option${optionId}.overlay`, 'uk'),
    deleteText(db, `vacationOptions.option${optionId}.overlay`, 'en'),
    deleteText(db, `vacationOptions.option${optionId}.overlay`, 'pl'),
  ])
}

export const Route = createFileRoute('/api/admin/service-options/$id')({
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

          const optionId = parseInt(params.id, 10)
          if (isNaN(optionId)) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Invalid option ID',
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const option = await getServiceOptionById(db, optionId)
          if (!option) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Service option not found',
              }),
              {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const overlay = await getText(db, `vacationOptions.option${optionId}.overlay`, 'uk')
          return new Response(
            JSON.stringify({
              success: true,
              option: {
                ...option,
                overlay_text_uk: overlay?.value || '',
              },
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error fetching service option:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to fetch service option',
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

          const optionId = parseInt(params.id, 10)
          if (isNaN(optionId)) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Invalid option ID',
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const body = (await request.json()) as UpdateServiceOptionInput & {
            overlay_text_uk?: string
          }
          const updated = await updateServiceOption(db, optionId, body)

          if (!updated) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Service option not found',
              }),
              {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          await syncServiceOptionToTranslations(db, optionId, {
            title_uk: updated.title_uk,
            description_uk: updated.description_uk,
            overlay_text_uk: body.overlay_text_uk?.trim() || '',
          })

          return new Response(
            JSON.stringify({
              success: true,
              option: updated,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error updating service option:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to update service option',
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

          const optionId = parseInt(params.id, 10)
          if (isNaN(optionId)) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Invalid option ID',
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const deleted = await deleteServiceOption(db, optionId)
          if (deleted) {
            await deleteServiceOptionFromTranslations(db, optionId)
          }
          return new Response(
            JSON.stringify({ success: true, deleted }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error deleting service option:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to delete service option',
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
