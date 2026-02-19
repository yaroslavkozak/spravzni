import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getAdminUserFromSession } from '@/src/lib/database/admin-auth'
import { createMedia, deleteMedia, getMedia, updateMedia } from '@/src/lib/database'

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

async function getBucketFromContext(context: unknown): Promise<Env['BUCKET']> {
  const env = (context as { env?: Env }).env
  if (!env?.BUCKET) {
    throw new Error('Bucket not available')
  }
  return env.BUCKET
}

export const Route = createFileRoute('/api/admin/media/upload')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
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

          const formData = await request.formData()
          const file = formData.get('file') as File | null
          const key = formData.get('key') as string | null
          const type = (formData.get('type') as 'image' | 'video') || 'image'

          if (!file || !key) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Missing file or key',
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          // Upload to R2
          const bucket = await getBucketFromContext(context)
          const r2Key = `uploads/${Date.now()}-${file.name}`
          await bucket.put(r2Key, file, {
            httpMetadata: {
              contentType: file.type,
            },
          })

          // Create or update media reference by key
          const trimmedKey = key.trim()
          const existingMedia = await getMedia(db, trimmedKey)
          const media = existingMedia
            ? await updateMedia(db, trimmedKey, {
                r2_key: r2Key,
                mime_type: file.type,
                size: file.size,
                is_public: true,
              })
            : await createMedia(db, {
                key: trimmedKey,
                type,
                r2_key: r2Key,
                mime_type: file.type,
                size: file.size,
                is_public: true,
              })

          if (!media) {
            throw new Error('Failed to save media reference')
          }

          return new Response(
            JSON.stringify({
              success: true,
              media,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error uploading media:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to upload media',
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

          if (!key) {
            return new Response(
              JSON.stringify({ success: false, error: 'Media key is required' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const existingMedia = await getMedia(db, key)
          if (!existingMedia) {
            return new Response(
              JSON.stringify({ success: false, error: 'Media not found' }),
              {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const deleted = await deleteMedia(db, key)
          if (!deleted) {
            return new Response(
              JSON.stringify({ success: false, error: 'Failed to delete media' }),
              {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }

          const bucket = await getBucketFromContext(context)
          await bucket.delete(existingMedia.r2_key)

          return new Response(
            JSON.stringify({ success: true }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error deleting media:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to delete media',
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
