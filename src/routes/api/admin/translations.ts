import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getAdminUserFromSession } from '@/src/lib/database/admin-auth'
import {
  createText,
  deleteText,
  getAllTranslationRows,
  getText,
  updateText,
} from '@/src/lib/database'
import type { SupportedLanguage } from '@/src/lib/i18n'

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

export const Route = createFileRoute('/api/admin/translations')({
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
          const lang = (url.searchParams.get('lang') || 'en') as SupportedLanguage
          const language = supportedLanguages.includes(lang) ? lang : 'en'
          const rows = await getAllTranslationRows(db)
          const entries = rows.map((row) => ({
            key: row.key,
            uk: row.ua || '',
            en: row.en || '',
            pl: row.pl || '',
          }))

          return new Response(
            JSON.stringify({
              success: true,
              language,
              entries,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error fetching translations:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to fetch translations',
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
            key?: string
            value?: string
            language?: SupportedLanguage
          }

          const key = body.key?.trim()
          const value = body.value
          const lang = body.language || 'en'

          if (!key || typeof value !== 'string') {
            return new Response(
              JSON.stringify({ success: false, error: 'Invalid payload' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          if (!supportedLanguages.includes(lang)) {
            return new Response(
              JSON.stringify({ success: false, error: 'Unsupported language' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const existing = await getText(db, key, lang)
          const updated = existing
            ? await updateText(db, key, lang, { value })
            : await createText(db, { key, language: lang, value })

          return new Response(
            JSON.stringify({
              success: true,
              text: updated,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error updating translation:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to update translation',
              details: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }
      },
      DELETE: async ({ request, context }) => {
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
          const key = url.searchParams.get('key')?.trim()
          const lang = (url.searchParams.get('lang') || 'en') as SupportedLanguage

          if (!key) {
            return new Response(
              JSON.stringify({ success: false, error: 'Missing key' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          if (!supportedLanguages.includes(lang)) {
            return new Response(
              JSON.stringify({ success: false, error: 'Unsupported language' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const deleted = await deleteText(db, key, lang)
          return new Response(
            JSON.stringify({ success: true, deleted }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error deleting translation:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to delete translation',
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
