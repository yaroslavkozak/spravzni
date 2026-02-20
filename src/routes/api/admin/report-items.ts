import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getAdminUserFromSession } from '@/src/lib/database/admin-auth'
import { getReportItems, createReportItem } from '@/src/lib/database/report'
import { createText } from '@/src/lib/database'
import type { CreateReportItemInput } from '@/types/database'

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

export const Route = createFileRoute('/api/admin/report-items')({
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

          const items = await getReportItems(db)
          return new Response(
            JSON.stringify({ success: true, items }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error fetching report items:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to fetch report items',
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

          const body = (await request.json()) as CreateReportItemInput
          if (!body.period || !body.amount || !body.category) {
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

          const item = await createReportItem(db, body)
          await syncReportRowToTranslations(db, item.id, {
            period: item.period,
            amount: item.amount,
            category: item.category,
          })
          return new Response(
            JSON.stringify({ success: true, item }),
            {
              status: 201,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error creating report item:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to create report item',
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
