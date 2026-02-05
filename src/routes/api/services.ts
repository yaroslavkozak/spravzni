import { createFileRoute } from '@tanstack/react-router'
import { getServices, parseServiceParagraphs } from '@/src/lib/database/services'
import type { Env } from '@/types/cloudflare'
import type { SupportedLanguage } from '@/src/lib/i18n'

export const Route = createFileRoute('/api/services')({
  server: {
    handlers: {
      GET: async ({ request, context }) => {
        try {
          const url = new URL(request.url)
          const lang = (url.searchParams.get('lang') || 'uk') as SupportedLanguage

          // Get Cloudflare context
          let db
          try {
            const env = context.env as Env
            db = env.DB
          } catch (error) {
            console.warn('Cloudflare context not available, returning empty services')
            return new Response(
              JSON.stringify({
                language: lang,
                services: [],
              }),
              {
                status: 200,
                headers: {
                  'Content-Type': 'application/json',
                  'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
                },
              }
            )
          }

          // Fetch active services from D1
          const services = await getServices(db, { activeOnly: true })

          // Transform services for frontend with language-specific fields
          const normalizeButtonText = (value?: string | null): string | undefined => {
            if (!value) return undefined
            const trimmed = value.trim()
            if (trimmed === '' || trimmed === '0' || trimmed === '-') {
              return undefined
            }
            return trimmed
          }
          const transformedServices = services.map((service) => {
            const heading = lang === 'en' && service.heading_en ? service.heading_en : service.heading_uk
            const paragraphs = lang === 'en' && service.paragraphs_en
              ? parseServiceParagraphs(service.paragraphs_en)
              : parseServiceParagraphs(service.paragraphs_uk)
            const primaryButtonText = normalizeButtonText(
              lang === 'en' ? service.primary_button_text_en : service.primary_button_text_uk
            )
            const secondaryButtonText = normalizeButtonText(
              lang === 'en' ? service.secondary_button_text_en : service.secondary_button_text_uk
            )
            const overlayText =
              lang === 'en' && service.overlay_text_en
                ? service.overlay_text_en
                : service.overlay_text_uk

            // Build the service object, only including fields that have values
            const serviceObj: Record<string, unknown> = {
              id: service.id,
              heading,
              paragraphs,
              primaryAction: service.primary_action,
              secondaryAction: service.secondary_action,
              imageSrc: service.image_key || `services.service${service.id}`,
              showPrimaryButton: service.show_primary_button,
            }

            // Only include button text if it's not undefined
            if (primaryButtonText !== undefined) {
              serviceObj.primaryButtonText = primaryButtonText
            }
            if (secondaryButtonText !== undefined) {
              serviceObj.secondaryButtonText = secondaryButtonText
            }
            if (overlayText) {
              serviceObj.overlayText = overlayText
            }

            return serviceObj
          })

          return new Response(
            JSON.stringify({
              language: lang,
              services: transformedServices,
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
          console.error('Error fetching services:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to fetch services' }),
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
