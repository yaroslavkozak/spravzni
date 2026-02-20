import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getAdminUserFromSession } from '@/src/lib/database/admin-auth'
import {
  createHomepageMediaItem,
  deleteHomepageMediaItem,
  getHomepageMediaItems,
  getMedia,
  reorderHomepageMediaItems,
} from '@/src/lib/database'

type SectionName = 'brand_logos' | 'space_gallery'

const allowedSections: SectionName[] = ['brand_logos', 'space_gallery']

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

function isAllowedSection(value: string | null): value is SectionName {
  return value !== null && allowedSections.includes(value as SectionName)
}

async function ensureSeededFromLegacy(db: Env['DB'], section: SectionName): Promise<void> {
  const existing = await getHomepageMediaItems(db, section)
  if (existing.length > 0) {
    return
  }

  const legacyKeys =
    section === 'brand_logos'
      ? Array.from({ length: 30 }, (_, i) => `videoPartners.partner${i + 1}`)
      : Array.from({ length: 8 }, (_, i) => `space.gallery${i + 1}`)

  for (const [index, key] of legacyKeys.entries()) {
    const media = await getMedia(db, key)
    if (!media) {
      continue
    }
    await createHomepageMediaItem(db, {
      section,
      media_key: key,
      sort_order: index,
    })
  }
}

export const Route = createFileRoute('/api/admin/homepage/media-collections')({
  server: {
    handlers: {
      GET: async ({ request, context }) => {
        try {
          const sessionId = getSessionId(request)
          if (!sessionId) {
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const db = await getDatabaseFromContext(context)
          const user = await getAdminUserFromSession(db, sessionId)
          if (!user) {
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const url = new URL(request.url)
          const section = url.searchParams.get('section')

          if (!isAllowedSection(section)) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid section' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          await ensureSeededFromLegacy(db, section)
          const items = await getHomepageMediaItems(db, section)

          return new Response(JSON.stringify({ success: true, items }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          console.error('Error loading homepage media collection:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to load media collection',
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
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const db = await getDatabaseFromContext(context)
          const user = await getAdminUserFromSession(db, sessionId)
          if (!user) {
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const body = (await request.json()) as { section?: string; mediaKey?: string }
          const section = body.section ?? null
          const mediaKey = body.mediaKey?.trim()

          if (!isAllowedSection(section) || !mediaKey) {
            return new Response(
              JSON.stringify({ success: false, error: 'section and mediaKey are required' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const media = await getMedia(db, mediaKey)
          if (!media) {
            return new Response(JSON.stringify({ success: false, error: 'Media not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          await createHomepageMediaItem(db, {
            section,
            media_key: mediaKey,
          })

          const items = await getHomepageMediaItems(db, section)
          return new Response(JSON.stringify({ success: true, items }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          console.error('Error adding media item to collection:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to add media item',
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
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const db = await getDatabaseFromContext(context)
          const user = await getAdminUserFromSession(db, sessionId)
          if (!user) {
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const body = (await request.json()) as { section?: string; orderedIds?: number[] }
          const section = body.section ?? null
          const orderedIds = body.orderedIds ?? []

          if (!isAllowedSection(section) || !Array.isArray(orderedIds)) {
            return new Response(
              JSON.stringify({ success: false, error: 'section and orderedIds are required' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          await reorderHomepageMediaItems(db, section, orderedIds)
          const items = await getHomepageMediaItems(db, section)

          return new Response(JSON.stringify({ success: true, items }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          console.error('Error reordering media collection:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to reorder media collection',
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
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const db = await getDatabaseFromContext(context)
          const user = await getAdminUserFromSession(db, sessionId)
          if (!user) {
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const body = (await request.json()) as { section?: string; id?: number }
          const section = body.section ?? null
          const id = Number(body.id)

          if (!isAllowedSection(section) || !Number.isFinite(id)) {
            return new Response(JSON.stringify({ success: false, error: 'section and id are required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const deleted = await deleteHomepageMediaItem(db, id)
          if (!deleted) {
            return new Response(JSON.stringify({ success: false, error: 'Item not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const items = await getHomepageMediaItems(db, section)
          return new Response(JSON.stringify({ success: true, items }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          console.error('Error deleting media collection item:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to delete media item',
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
