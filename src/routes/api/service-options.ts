import { createFileRoute } from '@tanstack/react-router'
import { getServiceOptions } from '@/src/lib/database/services'
import { getText } from '@/src/lib/database'
import type { Env } from '@/types/cloudflare'
import type { SupportedLanguage } from '@/src/lib/i18n'

export const Route = createFileRoute('/api/service-options')({
  server: {
    handlers: {
      GET: async ({ request, context }) => {
        try {
          const url = new URL(request.url)
          const serviceId = url.searchParams.get('serviceId')
          const lang = (url.searchParams.get('lang') || 'uk') as SupportedLanguage

          if (!serviceId) {
            return new Response(
              JSON.stringify({ error: 'Missing serviceId parameter' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const serviceIdNum = parseInt(serviceId, 10)
          if (isNaN(serviceIdNum)) {
            return new Response(
              JSON.stringify({ error: 'Invalid serviceId parameter' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          // Get Cloudflare context
          let db
          try {
            const env = context.env as Env
            db = env.DB
          } catch (error) {
            console.warn('Cloudflare context not available, returning empty options')
            return new Response(
              JSON.stringify({
                language: lang,
                options: [],
              }),
              {
                status: 200,
                headers: {
                  'Content-Type': 'application/json',
                  'Cache-Control': 'public, max-age=300',
                },
              }
            )
          }

          // Fetch active service options from D1
          const options = await getServiceOptions(db, serviceIdNum, { activeOnly: true })
          const defaultOverlay = await getText(db, 'vacationOptions.overlay', lang)

          // Transform options for frontend with language-specific fields
          const transformedOptions = await Promise.all(
            options.map(async (option) => {
              const titleKey = `vacationOptions.option${option.id}.title`
              const descKey = `vacationOptions.option${option.id}.desc`
              const overlayKey = `vacationOptions.option${option.id}.overlay`
              const translatedTitle = await getText(db, titleKey, lang)
              const translatedDesc = await getText(db, descKey, lang)
              const translatedOverlay = await getText(db, overlayKey, lang)

              return {
                id: option.id,
                title:
                  translatedTitle?.value ||
                  (lang === 'en' && option.title_en ? option.title_en : option.title_uk),
                description:
                  translatedDesc?.value ||
                  (lang === 'en' && option.description_en ? option.description_en : option.description_uk),
                image: option.image_path,
                overlayText: translatedOverlay?.value || defaultOverlay?.value || '',
              }
            })
          )

          return new Response(
            JSON.stringify({
              language: lang,
              options: transformedOptions,
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
          console.error('Error fetching service options:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to fetch service options' }),
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
