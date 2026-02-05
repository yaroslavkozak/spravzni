import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { SupportedLanguage } from '@/src/lib/i18n'
import { homepageComponents } from '@/src/lib/homepage-components'
import { getR2Url } from '@/src/lib/r2-media'

export const Route = createFileRoute('/admin/homepage')({
  component: AdminHomepage,
})

interface ComponentData {
  name: string
  displayName: string
  texts: Record<string, Record<string, string>> // { key: { language: value } }
  media: Record<string, { key: string; r2_key: string; type: string; alt_text?: string }>
}

function AdminHomepage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ email: string; name: string | null; role: string } | null>(null)
  const [components, setComponents] = useState<Array<{ name: string; displayName: string }>>([])
  const [selectedComponent, setSelectedComponent] = useState<string>('')
  const [componentData, setComponentData] = useState<ComponentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('uk')
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({})
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadComponents()
    }
  }, [user])

  useEffect(() => {
    if (user && selectedComponent) {
      loadComponentData()
      // Clear drafts when component changes
      setDrafts({})
    }
  }, [user, selectedComponent])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/me', {
        credentials: 'include',
      })

      if (!response.ok) {
        navigate({ to: '/admin/login' })
        return
      }

      const data = await response.json()
      if (data.success && data.user) {
        setUser(data.user)
      } else {
        navigate({ to: '/admin/login' })
      }
    } catch (err) {
      console.error('Auth check error:', err)
      navigate({ to: '/admin/login' })
    }
  }

  const loadComponents = async () => {
    try {
      const response = await fetch('/api/admin/homepage/components', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to load components')
      }

      const data = await response.json()
      if (data.success && data.components) {
        setComponents(data.components)
        if (data.components.length > 0 && !selectedComponent) {
          setSelectedComponent(data.components[0].name)
        }
      }
    } catch (err) {
      console.error('Load components error:', err)
      setError('Не вдалося завантажити компоненти')
    } finally {
      setIsLoading(false)
    }
  }

  const loadComponentData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/homepage/components?name=${encodeURIComponent(selectedComponent)}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to load component data')
      }

      const data = await response.json()
      if (data.success && data.component) {
        setComponentData(data.component)
        // Don't clear drafts here - only clear when component changes
        // This allows user to keep editing while data reloads
      }
    } catch (err) {
      console.error('Load component data error:', err)
      setError('Не вдалося завантажити дані компонента')
    } finally {
      setIsLoading(false)
    }
  }

  const updateDraft = (key: string, language: SupportedLanguage, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [language]: value,
      },
    }))
  }

  const getCurrentValue = (key: string, language: SupportedLanguage) => {
    // Check drafts first (user edits)
    if (drafts[key]?.[language] !== undefined) {
      return drafts[key][language]
    }
    // Check loaded component data
    if (componentData?.texts && componentData.texts[key] && componentData.texts[key][language] !== undefined) {
      return componentData.texts[key][language]
    }
    return ''
  }

  const handleSave = async () => {
    if (!selectedComponent) return

    setIsSaving(true)
    setError(null)

    try {
      // Merge drafts with existing data
      const textsToSave: Record<string, Record<string, string>> = {}
      
      // Get component definition
      const component = homepageComponents.find((c) => c.name === selectedComponent)
      if (!component) {
        throw new Error('Component not found')
      }

      // Collect all text values (drafts + existing)
      for (const field of component.textFields || []) {
        const translations: Record<string, string> = {}
        for (const lang of ['uk', 'en', 'pl'] as SupportedLanguage[]) {
          const value = getCurrentValue(field.key, lang)
          if (value) {
            translations[lang] = value
          }
        }
        if (Object.keys(translations).length > 0) {
          textsToSave[field.key] = translations
        }
      }

      const response = await fetch('/api/admin/homepage/components', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          componentName: selectedComponent,
          texts: textsToSave,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save component')
      }

      // Reload component data
      await loadComponentData()
    } catch (err) {
      console.error('Save error:', err)
      setError('Не вдалося зберегти компонент')
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (fieldKey: string, file: File) => {
    setUploadingImages((prev) => new Set(prev).add(fieldKey))
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('key', fieldKey)
      formData.append('type', file.type.startsWith('video/') ? 'video' : 'image')

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      if (data.success && data.media) {
        // Reload component data to show new image
        await loadComponentData()
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Не вдалося завантажити зображення')
    } finally {
      setUploadingImages((prev) => {
        const next = new Set(prev)
        next.delete(fieldKey)
        return next
      })
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      })
      navigate({ to: '/admin/login' })
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const component = homepageComponents.find((c) => c.name === selectedComponent)
  const currentMedia = componentData?.media || {}

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Редагування компонентів головної сторінки</h1>
            <p className="text-sm text-gray-500">Редагуйте тексти та зображення компонентів</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate({ to: '/admin/dashboard' })}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              До панелі
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Вийти
            </button>
          </div>
        </header>

        {/* Component Selector */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Виберіть компонент:
          </label>
          <select
            value={selectedComponent}
            onChange={(e) => {
              setSelectedComponent(e.target.value)
              setDrafts({})
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          >
            {components.map((comp) => (
              <option key={comp.name} value={comp.name}>
                {comp.displayName}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-lg bg-white p-6 text-sm text-gray-500 shadow-sm">
            Завантаження...
          </div>
        ) : component ? (
          <div className="space-y-6">
            {/* Language Tabs */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex gap-2 border-b border-gray-200">
                {(['uk', 'en', 'pl'] as SupportedLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      selectedLanguage === lang
                        ? 'border-b-2 border-[#28694D] text-[#28694D]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Fields */}
            {component.textFields && component.textFields.length > 0 && (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Тексти</h2>
                <div className="space-y-4">
                  {component.textFields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={getCurrentValue(field.key, selectedLanguage)}
                          onChange={(e) => updateDraft(field.key, selectedLanguage, e.target.value)}
                          rows={4}
                          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-gray-500 focus:outline-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={getCurrentValue(field.key, selectedLanguage)}
                          onChange={(e) => updateDraft(field.key, selectedLanguage, e.target.value)}
                          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-gray-500 focus:outline-none"
                        />
                      )}
                      {field.description && (
                        <p className="mt-1 text-xs text-gray-500">{field.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Fields */}
            {component.imageFields && component.imageFields.length > 0 && (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Зображення та іконки</h2>
                <div className="space-y-4">
                  {component.imageFields.map((field) => {
                    const media = currentMedia[field.key]
                    const isUploading = uploadingImages.has(field.key)
                    const imageUrl = media ? getR2Url(media.r2_key) : null

                    return (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                        </label>
                        {imageUrl && (
                          <div className="mb-2">
                            {media.type === 'video' ? (
                              <video
                                src={imageUrl}
                                controls
                                className="max-w-full h-auto max-h-48 rounded-lg"
                              />
                            ) : (
                              <img
                                src={imageUrl}
                                alt={field.label}
                                className="max-w-full h-auto max-h-48 rounded-lg"
                              />
                            )}
                          </div>
                        )}
                        <input
                          type="file"
                          accept={field.accept || 'image/*'}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleImageUpload(field.key, file)
                            }
                          }}
                          disabled={isUploading}
                          className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-gray-500 focus:outline-none disabled:opacity-50"
                        />
                        {isUploading && (
                          <p className="mt-1 text-xs text-gray-500">Завантаження...</p>
                        )}
                        {field.description && (
                          <p className="mt-1 text-xs text-gray-500">{field.description}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-lg bg-[#28694D] px-6 py-2 text-sm font-medium text-white hover:bg-[#1f5238] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? 'Збереження...' : 'Зберегти зміни'}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-6 text-sm text-gray-500 shadow-sm">
            Виберіть компонент для редагування
          </div>
        )}
      </div>
    </div>
  )
}
