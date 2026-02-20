import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getAdminUserFromSession } from '@/src/lib/database/admin-auth'
import {
  getReportItemById,
  updateReportItem,
  deleteReportItem,
} from '@/src/lib/database/report'
import { createText, deleteText } from '@/src/lib/database'
import type { UpdateReportItemInput } from '@/types/database'

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

async function syncReportRowToTranslations(
  db: Env['DB'],
  rowId: number,
  values: { period: string; amount: string; category: string }
): Promise<void> {
  await Promise.all([
    createText(db, { key: `report.rows.${rowId}.period`, language: 'uk', value: values.period }),
    createText(db, { key: `report.rows.${rowId}.amount`, language: 'uk', value: values.amount }),
    createText(db, { key: `report.rows.${rowId}.category`, language: 'uk', value: values.category }),
  ])
}

async function deleteReportRowFromTranslations(db: Env['DB'], rowId: number): Promise<void> {
  const keys = [
    `report.rows.${rowId}.period`,
    `report.rows.${rowId}.amount`,
    `report.rows.${rowId}.category`,
  ]

  for (const key of keys) {
    await Promise.all([
      deleteText(db, key, 'uk'),
      deleteText(db, key, 'en'),
      deleteText(db, key, 'pl'),
    ])
  }
}

export const Route = createFileRoute('/api/admin/report-items/$id')({
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

          const itemId = parseInt(params.id, 10)
          if (isNaN(itemId)) {
            return new Response(
              JSON.stringify({ success: false, error: 'Invalid item ID' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const item = await getReportItemById(db, itemId)
          if (!item) {
            return new Response(
              JSON.stringify({ success: false, error: 'Report item not found' }),
              {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          return new Response(
            JSON.stringify({ success: true, item }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error fetching report item:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to fetch report item',
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

          const itemId = parseInt(params.id, 10)
          if (isNaN(itemId)) {
            return new Response(
              JSON.stringify({ success: false, error: 'Invalid item ID' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const body = (await request.json()) as UpdateReportItemInput
          const updated = await updateReportItem(db, itemId, body)
          if (!updated) {
            return new Response(
              JSON.stringify({ success: false, error: 'Report item not found' }),
              {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          await syncReportRowToTranslations(db, itemId, {
            period: updated.period,
            amount: updated.amount,
            category: updated.category,
          })

          return new Response(
            JSON.stringify({ success: true, item: updated }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error updating report item:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to update report item',
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

          const itemId = parseInt(params.id, 10)
          if (isNaN(itemId)) {
            return new Response(
              JSON.stringify({ success: false, error: 'Invalid item ID' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const deleted = await deleteReportItem(db, itemId)
          if (deleted) {
            await deleteReportRowFromTranslations(db, itemId)
          }
          return new Response(
            JSON.stringify({ success: true, deleted }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error deleting report item:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to delete report item',
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
