import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import type { SupportedLanguage } from '@/src/lib/i18n'
import {
  getReportItems,
  getReportSettings,
  localizeReportItem,
  localizeReportSettings,
} from '@/src/lib/database/report'

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
      GET: async ({ request, context }) => {
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

          const url = new URL(request.url)
          const lang = (url.searchParams.get('lang') || 'uk') as SupportedLanguage

          const [rawItems, rawSettings] = await Promise.all([
            getReportItems(db),
            getReportSettings(db),
          ])

          const items = rawItems.map((item) => localizeReportItem(item, lang))
          const localizedSettings = localizeReportSettings(rawSettings, lang)

          return new Response(
            JSON.stringify({
              success: true,
              items,
              updatedDate: localizedSettings.updatedDate,
              incomingAmount: localizedSettings.incomingAmount,
              outgoingAmount: localizedSettings.outgoingAmount,
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
