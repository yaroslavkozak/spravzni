'use client'

import { useEffect, useState } from 'react'
import { getR2Url } from '@/src/lib/r2-media'

export interface HomepageMediaCollectionItem {
  id: number
  section: string
  media_key: string
  sort_order: number
  media_type: 'image' | 'video'
  media_r2_key: string
  media_alt_text?: string | null
}

export function useHomepageMediaCollection(section: 'brand_logos' | 'space_gallery') {
  const [items, setItems] = useState<HomepageMediaCollectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/homepage/media-collections?section=${encodeURIComponent(section)}`)
        if (!response.ok) {
          throw new Error(`Failed to load media collection: ${response.status}`)
        }
        const data = await response.json()
        if (!data.success) {
          throw new Error(data.error || 'Failed to load media collection')
        }
        if (!cancelled) {
          setItems(data.items || [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [section])

  const getImageUrls = () =>
    items
      .filter((item) => item.media_type === 'image' && item.media_r2_key)
      .map((item) => getR2Url(item.media_r2_key))

  return {
    items,
    loading,
    error,
    getImageUrls,
  }
}
