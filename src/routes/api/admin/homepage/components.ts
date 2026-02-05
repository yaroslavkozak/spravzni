import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getAdminUserFromSession } from '@/src/lib/database/admin-auth'
import { getText, getTextsByKey, createText, updateText, getMedia } from '@/src/lib/database'
import type { SupportedLanguage } from '@/src/lib/i18n'
import { homepageComponents } from '@/src/lib/homepage-components'

const supportedLanguages: SupportedLanguage[] = ['uk', 'en', 'pl']

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

export const Route = createFileRoute('/api/admin/homepage/components')({
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
          const componentName = url.searchParams.get('name')

          if (componentName) {
            // Get specific component data
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

            // Load all texts for this component
            const texts: Record<string, Record<string, string>> = {}
            for (const field of component.textFields || []) {
              const textEntries = await getTextsByKey(db, field.key)
              texts[field.key] = {}
              for (const entry of textEntries) {
                texts[field.key][entry.language] = entry.value
              }
            }

            // Load all media for this component
            const media: Record<string, any> = {}
            for (const field of component.imageFields || []) {
              const mediaEntry = await getMedia(db, field.key)
              if (mediaEntry) {
                media[field.key] = {
                  key: mediaEntry.key,
                  r2_key: mediaEntry.r2_key,
                  type: mediaEntry.type,
                  alt_text: mediaEntry.alt_text,
                }
              }
            }

            return new Response(
              JSON.stringify({
                success: true,
                component: {
                  name: component.name,
                  displayName: component.displayName,
                  texts,
                  media,
                },
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          } else {
            // List all components
            const components = homepageComponents.map((c) => ({
              name: c.name,
              displayName: c.displayName,
            }))

            return new Response(
              JSON.stringify({
                success: true,
                components,
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }
        } catch (error) {
          console.error('Error fetching components:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to fetch components',
              details: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }
      },
      PUT: async ({ request, context }) => {
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

          const body = await request.json() as {
            componentName: string
            texts?: Record<string, Record<string, string>> // { key: { language: value } }
          }

          const { componentName, texts } = body

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

          // Update texts
          if (texts) {
            for (const [key, translations] of Object.entries(texts)) {
              // Verify this key belongs to this component
              const field = component.textFields?.find((f) => f.key === key)
              if (!field) {
                continue // Skip invalid keys
              }

              for (const [language, value] of Object.entries(translations)) {
                if (!supportedLanguages.includes(language as SupportedLanguage)) {
                  continue
                }

                const existing = await getText(db, key, language)
                if (existing) {
                  await updateText(db, key, language, { value })
                } else {
                  await createText(db, { key, language: language as SupportedLanguage, value })
                }
              }
            }
          }

          return new Response(
            JSON.stringify({
              success: true,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error updating component:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to update component',
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
