import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getReportItems, getReportSettings } from '@/src/lib/database/report'

async function getDatabaseFromContext(context: unknown): Promise<Env['DB'] | null> {
  try {
    const env = (context as { env?: Env }).env
    return env?.DB || null
  } catch {
    return null
  }
}

export const Route = createFileRoute('/api/report')({
  server: {
    handlers: {
      GET: async ({ context }) => {
        try {
          const db = await getDatabaseFromContext(context)
          if (!db) {
            return new Response(
              JSON.stringify({ success: false, error: 'Database not available' }),
              {
                status: 503,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const [items, settings] = await Promise.all([
            getReportItems(db),
            getReportSettings(db),
          ])

          return new Response(
            JSON.stringify({
              success: true,
              items,
              updatedDate: settings?.updated_date || null,
              incomingAmount: settings?.incoming_amount || null,
              outgoingAmount: settings?.outgoing_amount || null,
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300',
              },
            }
          )
        } catch (error) {
          console.error('Error fetching report data:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to fetch report data',
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
