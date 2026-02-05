import { useState, useEffect } from 'react'
import type { SupportedLanguage } from '@/src/lib/i18n'
import { getR2Url } from '@/src/lib/r2-media'

interface ComponentData {
  texts: Record<string, string>
  media: Record<string, { r2_key: string; type: string; alt_text?: string }>
}

interface UseHomepageComponentResult {
  data: ComponentData | null
  loading: boolean
  error: Error | null
  getText: (key: string) => string
  getImageUrl: (key: string) => string | null
}

/**
 * Hook to load homepage component data from the database
 * @param componentName - Name of the component (e.g., 'hero', 'about')
 * @param language - Language to load texts for
 */
export function useHomepageComponent(
  componentName: string,
  language: SupportedLanguage = 'uk'
): UseHomepageComponentResult {
  const [data, setData] = useState<ComponentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadComponent = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `/api/homepage/components?name=${encodeURIComponent(componentName)}&lang=${encodeURIComponent(language)}`
        )

        if (!response.ok) {
          throw new Error(`Failed to load component: ${response.status}`)
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to load component')
        }

        if (!cancelled) {
          setData(result.component)
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

    loadComponent()

    return () => {
      cancelled = true
    }
  }, [componentName, language])

  const getText = (key: string): string => {
    return data?.texts[key] || ''
  }

  const getImageUrl = (key: string): string | null => {
    const media = data?.media[key]
    if (!media) {
      return null
    }
    return getR2Url(media.r2_key)
  }

  return {
    data,
    loading,
    error,
    getText,
    getImageUrl,
  }
}
