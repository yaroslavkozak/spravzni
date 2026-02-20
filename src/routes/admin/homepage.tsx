import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { SupportedLanguage } from '@/src/lib/i18n'
import { homepageComponents } from '@/src/lib/homepage-components'
import { getR2Url } from '@/src/lib/r2-media'
import AdminShell from '@/src/components/admin/AdminShell'

export const Route = createFileRoute('/admin/homepage')({
  component: AdminHomepage,
})

interface ComponentData {
  name: string
  displayName: string
  texts: Record<string, Record<string, string>> // { key: { language: value } }
  media: Record<string, { key: string; r2_key: string; type: string; alt_text?: string }>
}

type ManagedCollectionSection = 'brand_logos' | 'space_gallery'

interface HomepageMediaCollectionItem {
  id: number
  section: ManagedCollectionSection
  media_key: string
  sort_order: number
  media_type: 'image' | 'video'
  media_r2_key: string
  media_alt_text?: string | null
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
  const [mediaCollections, setMediaCollections] = useState<Record<ManagedCollectionSection, HomepageMediaCollectionItem[]>>({
    brand_logos: [],
    space_gallery: [],
  })
  const [loadingCollections, setLoadingCollections] = useState<Record<ManagedCollectionSection, boolean>>({
    brand_logos: false,
    space_gallery: false,
  })
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null)

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
      if (selectedComponent === 'videoPartners') {
        void loadMediaCollection('brand_logos')
      }
      if (selectedComponent === 'space') {
        void loadMediaCollection('space_gallery')
      }
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
      console.error('Помилка перевірки авторизації:', err)
      navigate({ to: '/admin/login' })
    }
  }

  const loadComponents = async () => {
    try {
      const response = await fetch('/api/admin/homepage/components', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Не вдалося завантажити компоненти')
      }

      const data = await response.json()
      if (data.success && data.components) {
        setComponents(data.components)
        if (data.components.length > 0 && !selectedComponent) {
          const preferred = data.components.find((comp: { name: string }) => comp.name === 'videoPartners')
          setSelectedComponent(preferred?.name || data.components[0].name)
        }
      }
    } catch (err) {
      console.error('Помилка завантаження компонентів:', err)
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
        throw new Error('Не вдалося завантажити дані компонента')
      }

      const data = await response.json()
      if (data.success && data.component) {
        setComponentData(data.component)
        // Don't clear drafts here - only clear when component changes
        // This allows user to keep editing while data reloads
      }
    } catch (err) {
      console.error('Помилка завантаження даних компонента:', err)
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
        throw new Error('Компонент не знайдено')
      }

      // Collect all text values (drafts + existing)
      const languagesToSave: SupportedLanguage[] =
        selectedComponent === 'videoPartners' || selectedComponent === 'space'
          ? ['uk']
          : ['uk', 'en', 'pl']

      for (const field of component.textFields || []) {
        const translations: Record<string, string> = {}
        for (const lang of languagesToSave) {
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
        throw new Error(data.error || 'Не вдалося зберегти компонент')
      }

      // Reload component data
      await loadComponentData()
    } catch (err) {
      console.error('Помилка збереження:', err)
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
        throw new Error('Не вдалося завантажити зображення')
      }

      const data = await response.json()
      if (data.success && data.media) {
        // Reload component data to show new image
        await loadComponentData()
      }
    } catch (err) {
      console.error('Помилка завантаження:', err)
      setError('Не вдалося завантажити зображення')
    } finally {
      setUploadingImages((prev) => {
        const next = new Set(prev)
        next.delete(fieldKey)
        return next
      })
    }
  }

  const handleImageDelete = async (fieldKey: string) => {
    setUploadingImages((prev) => new Set(prev).add(fieldKey))
    setError(null)

    try {
      const response = await fetch(`/api/admin/media/upload?key=${encodeURIComponent(fieldKey)}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Не вдалося видалити зображення')
      }

      await loadComponentData()
    } catch (err) {
      console.error('Помилка видалення зображення:', err)
      setError('Не вдалося видалити зображення')
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
      console.error('Помилка виходу:', err)
    }
  }

  const loadMediaCollection = async (section: ManagedCollectionSection) => {
    setLoadingCollections((prev) => ({ ...prev, [section]: true }))
    try {
      const response = await fetch(`/api/admin/homepage/media-collections?section=${encodeURIComponent(section)}`, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Не вдалося завантажити медіаколекцію')
      }
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Не вдалося завантажити медіаколекцію')
      }
      setMediaCollections((prev) => ({ ...prev, [section]: data.items || [] }))
    } catch (err) {
      console.error('Помилка завантаження медіаколекції:', err)
      setError('Не вдалося завантажити галерею')
    } finally {
      setLoadingCollections((prev) => ({ ...prev, [section]: false }))
    }
  }

  const handleCollectionUpload = async (section: ManagedCollectionSection, files: FileList | null) => {
    if (!files || files.length === 0) return

    const uploadKey = `collection:${section}`
    setUploadingImages((prev) => new Set(prev).add(uploadKey))
    setError(null)

    try {
      const fileArray = Array.from(files)
      for (let index = 0; index < fileArray.length; index += 1) {
        const file = fileArray[index]
        const mediaKey = `${section}.${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`

        const formData = new FormData()
        formData.append('file', file)
        formData.append('key', mediaKey)
        formData.append('type', 'image')

        const uploadResponse = await fetch('/api/admin/media/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })
        const uploadData = await uploadResponse.json()
        if (!uploadResponse.ok || !uploadData.success) {
          throw new Error(uploadData.error || 'Не вдалося завантажити медіа')
        }

        const attachResponse = await fetch('/api/admin/homepage/media-collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ section, mediaKey }),
        })
        const attachData = await attachResponse.json()
        if (!attachResponse.ok || !attachData.success) {
          throw new Error(attachData.error || 'Не вдалося додати медіа до колекції')
        }
      }

      await loadMediaCollection(section)
    } catch (err) {
      console.error('Помилка завантаження колекції:', err)
      setError('Не вдалося завантажити зображення у галерею')
    } finally {
      setUploadingImages((prev) => {
        const next = new Set(prev)
        next.delete(uploadKey)
        return next
      })
    }
  }

  const handleCollectionRemove = async (section: ManagedCollectionSection, id: number) => {
    setError(null)
    try {
      const response = await fetch('/api/admin/homepage/media-collections', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ section, id }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Не вдалося видалити медіа')
      }
      setMediaCollections((prev) => ({ ...prev, [section]: data.items || [] }))
    } catch (err) {
      console.error('Помилка видалення з колекції:', err)
      setError('Не вдалося видалити зображення з галереї')
    }
  }

  const handleCollectionDrop = async (section: ManagedCollectionSection, targetId: number) => {
    if (!draggedItemId || draggedItemId === targetId) {
      setDraggedItemId(null)
      return
    }

    const current = mediaCollections[section]
    const draggedIndex = current.findIndex((item) => item.id === draggedItemId)
    const targetIndex = current.findIndex((item) => item.id === targetId)
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItemId(null)
      return
    }

    const reordered = [...current]
    const [moved] = reordered.splice(draggedIndex, 1)
    reordered.splice(targetIndex, 0, moved)
    const orderedIds = reordered.map((item) => item.id)

    setMediaCollections((prev) => ({ ...prev, [section]: reordered }))
    setDraggedItemId(null)

    try {
      const response = await fetch('/api/admin/homepage/media-collections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ section, orderedIds }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Не вдалося змінити порядок елементів')
      }
      setMediaCollections((prev) => ({ ...prev, [section]: data.items || [] }))
    } catch (err) {
      console.error('Помилка зміни порядку колекції:', err)
      setError('Не вдалося зберегти порядок зображень')
      await loadMediaCollection(section)
    }
  }

  const component = homepageComponents.find((c) => c.name === selectedComponent)
  const currentMedia = componentData?.media || {}
  const isSingleLanguageSection = selectedComponent === 'videoPartners' || selectedComponent === 'space'
  const editingLanguage: SupportedLanguage = isSingleLanguageSection ? 'uk' : selectedLanguage
  const managedSection: ManagedCollectionSection | null =
    selectedComponent === 'videoPartners'
      ? 'brand_logos'
      : selectedComponent === 'space'
        ? 'space_gallery'
        : null

  return (
    <AdminShell
      title="Керування секціями"
      subtitle="Редагуйте тексти, іконки та медіа головної сторінки"
      userEmail={user?.email}
      onLogout={handleLogout}
    >
      <div className="mx-auto max-w-6xl space-y-6">

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
            {!isSingleLanguageSection && (
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
            )}

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
                          value={getCurrentValue(field.key, editingLanguage)}
                          onChange={(e) => updateDraft(field.key, editingLanguage, e.target.value)}
                          rows={4}
                          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-gray-500 focus:outline-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={getCurrentValue(field.key, editingLanguage)}
                          onChange={(e) => updateDraft(field.key, editingLanguage, e.target.value)}
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
                        {media && (
                          <button
                            type="button"
                            onClick={() => handleImageDelete(field.key)}
                            disabled={isUploading}
                            className="mt-2 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                          >
                            Видалити медіа
                          </button>
                        )}
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

            {/* Managed Image Collection */}
            {managedSection && (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {managedSection === 'brand_logos' ? 'Логотипи брендів' : 'Галерея Простору'}
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                      {managedSection === 'brand_logos'
                        ? 'Перетягуйте для зміни порядку, видаляйте через іконку, додавайте через завантаження.'
                        : 'Галерея фото для секції Простір: перетягування, видалення та додавання.'}
                    </p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center rounded-lg bg-[#28694D] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f5238]">
                    Додати фото
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        void handleCollectionUpload(managedSection, e.target.files)
                        e.currentTarget.value = ''
                      }}
                      disabled={uploadingImages.has(`collection:${managedSection}`)}
                    />
                  </label>
                </div>

                {loadingCollections[managedSection] ? (
                  <p className="text-sm text-gray-500">Завантаження галереї...</p>
                ) : mediaCollections[managedSection].length === 0 ? (
                  <p className="text-sm text-gray-500">У галереї ще немає елементів</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {mediaCollections[managedSection].map((item, index) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={() => setDraggedItemId(item.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          void handleCollectionDrop(managedSection, item.id)
                        }}
                        className={`group relative overflow-hidden rounded-lg border bg-gray-50 ${
                          draggedItemId === item.id ? 'opacity-60' : 'opacity-100'
                        }`}
                      >
                        <img
                          src={getR2Url(item.media_r2_key)}
                          alt={item.media_alt_text || `Зображення ${index + 1}`}
                          className="h-36 w-full object-cover"
                        />
                        <div className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                          #{index + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() => void handleCollectionRemove(managedSection, item.id)}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white opacity-90 transition hover:bg-red-700"
                          aria-label="Видалити зображення"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
    </AdminShell>
  )
}
