import { createFileRoute } from '@tanstack/react-router'
import { getTextsByLanguage } from '@/src/lib/database'
import type { SupportedLanguage } from '@/src/lib/i18n'
import type { Env } from '@/types/cloudflare'

export const Route = createFileRoute('/api/translations')({
  server: {
    handlers: {
      GET: async ({ request, context }) => {
        try {
          const url = new URL(request.url)
          const lang = (url.searchParams.get('lang') || 'uk') as SupportedLanguage

          // Validate language
          const supportedLanguages: SupportedLanguage[] = ['uk', 'en', 'pl']
          const language = supportedLanguages.includes(lang) ? lang : 'uk'

          // Get Cloudflare context
          let db
          try {
            const env = context.env as Env
            db = env.DB
          } catch (error) {
            // Fallback if Cloudflare context is not available (e.g., in development)
            console.warn('Cloudflare context not available, returning empty translations')
            return new Response(
              JSON.stringify({
                language,
                translations: {},
              }),
              {
                status: 200,
                headers: {
                  'Content-Type': 'application/json',
                  'Cache-Control': 'no-store',
                },
              }
            )
          }

          // Fetch translations from D1
          const texts = await getTextsByLanguage(db, language)

          // Convert to key-value object
          const translations: Record<string, string> = {}
          for (const text of texts) {
            translations[text.key] = text.value
          }

          return new Response(
            JSON.stringify({
              language,
              translations,
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
              },
            }
          )
        } catch (error) {
          console.error('Error fetching translations:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to fetch translations' }),
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        }
      },
    },
  },
})
