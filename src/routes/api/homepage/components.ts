import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getTextsByKey, getMedia } from '@/src/lib/database'
import type { SupportedLanguage } from '@/src/lib/i18n'
import { homepageComponents } from '@/src/lib/homepage-components'

async function getDatabaseFromContext(context: unknown): Promise<Env['DB'] | null> {
  try {
    const env = (context as { env?: Env }).env
    return env?.DB || null
  } catch {
    return null
  }
}

export const Route = createFileRoute('/api/homepage/components')({
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
          const componentName = url.searchParams.get('name')
          const lang = (url.searchParams.get('lang') || 'uk') as SupportedLanguage

          if (!componentName) {
            return new Response(
              JSON.stringify({ success: false, error: 'Component name is required' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const component = homepageComponents.find((c) => c.name === componentName)
          if (!component) {
            return new Response(
              JSON.stringify({ success: false, error: 'Component not found' }),
              {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          // Load texts for this component in the requested language
          const texts: Record<string, string> = {}
          for (const field of component.textFields || []) {
            const text = await getTextsByKey(db, field.key)
            const textForLang = text.find((t) => t.language === lang)
            if (textForLang) {
              texts[field.key] = textForLang.value
            }
          }

          // Load media for this component
          const media: Record<string, { r2_key: string; type: string; alt_text?: string }> = {}
          for (const field of component.imageFields || []) {
            const mediaEntry = await getMedia(db, field.key)
            if (mediaEntry) {
              media[field.key] = {
                r2_key: mediaEntry.r2_key,
                type: mediaEntry.type,
                alt_text: mediaEntry.alt_text || undefined,
              }
            }
          }

          return new Response(
            JSON.stringify({
              success: true,
              component: {
                name: component.name,
                texts,
                media,
              },
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
              },
            }
          )
        } catch (error) {
          console.error('Error fetching component:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to fetch component',
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
