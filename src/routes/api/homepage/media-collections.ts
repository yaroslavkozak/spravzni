import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { createHomepageMediaItem, getHomepageMediaItems, getMedia } from '@/src/lib/database'

type SectionName = 'brand_logos' | 'space_gallery'

const allowedSections: SectionName[] = ['brand_logos', 'space_gallery']

function isAllowedSection(value: string | null): value is SectionName {
  return value !== null && allowedSections.includes(value as SectionName)
}

async function getDatabaseFromContext(context: unknown): Promise<Env['DB'] | null> {
  try {
    const env = (context as { env?: Env }).env
    return env?.DB || null
  } catch {
    return null
  }
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

export const Route = createFileRoute('/api/homepage/media-collections')({
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
          const section = url.searchParams.get('section')
          if (!isAllowedSection(section)) {
            return new Response(
              JSON.stringify({ success: false, error: 'Invalid section' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          await ensureSeededFromLegacy(db, section)
          const items = await getHomepageMediaItems(db, section)

          return new Response(
            JSON.stringify({ success: true, items }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300',
              },
            }
          )
        } catch (error) {
          console.error('Error loading public media collections:', error)
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
    },
  },
})
