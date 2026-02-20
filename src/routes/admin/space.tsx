import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { getR2Url } from '@/src/lib/r2-media'
import AdminShell from '@/src/components/admin/AdminShell'
import { homepageComponents } from '@/src/lib/homepage-components'

export const Route = createFileRoute('/admin/space')({
  component: AdminSpace,
})

interface ComponentData {
  name: string
  displayName: string
  texts: Record<string, Record<string, string>>
  media: Record<string, { key: string; r2_key: string; type: string; alt_text?: string }>
}

interface SpaceGalleryItem {
  id: number
  section: 'space_gallery'
  media_key: string
  sort_order: number
  media_type: 'image' | 'video'
  media_r2_key: string
  media_alt_text?: string | null
}

function AdminSpace() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ email: string; name: string | null; role: string } | null>(null)
  const [componentData, setComponentData] = useState<ComponentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingCollection, setIsUploadingCollection] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set())
  const [galleryItems, setGalleryItems] = useState<SpaceGalleryItem[]>([])
  const [isLoadingGallery, setIsLoadingGallery] = useState(false)
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null)

  const spaceComponent = useMemo(() => homepageComponents.find((c) => c.name === 'space'), [])
  const textFields = spaceComponent?.textFields || []
  const iconFields = (spaceComponent?.imageFields || []).filter((field) => field.key.includes('.icon'))

  useEffect(() => {
    void checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      void Promise.all([loadSpaceData(), loadGallery()])
    }
  }, [user])

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

  const loadSpaceData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/homepage/components?name=space', {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Не вдалося завантажити дані секції Простір')
      }
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Не вдалося завантажити дані секції Простір')
      }
      setComponentData(data.component)
      setDrafts({})
    } catch (err) {
      console.error('Помилка завантаження даних секції Простір:', err)
      setError('Не вдалося завантажити дані секції Простір')
    } finally {
      setIsLoading(false)
    }
  }

  const loadGallery = async () => {
    setIsLoadingGallery(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/homepage/media-collections?section=space_gallery', {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Не вдалося завантажити галерею Простору')
      }
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Не вдалося завантажити галерею Простору')
      }
      setGalleryItems(data.items || [])
    } catch (err) {
      console.error('Помилка завантаження галереї:', err)
      setError('Не вдалося завантажити галерею Простору')
    } finally {
      setIsLoadingGallery(false)
    }
  }

  const getCurrentValue = (key: string) => {
    if (drafts[key] !== undefined) {
      return drafts[key]
    }
    return componentData?.texts?.[key]?.uk || ''
  }

  const handleSaveTexts = async () => {
    setIsSaving(true)
    setError(null)
    try {
      const textsToSave: Record<string, Record<string, string>> = {}

      for (const field of textFields) {
        const value = getCurrentValue(field.key)
        if (value.trim() !== '') {
          textsToSave[field.key] = { uk: value }
        }
      }

      const response = await fetch('/api/admin/homepage/components', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          componentName: 'space',
          texts: textsToSave,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Не вдалося зберегти тексти')
      }

      await loadSpaceData()
    } catch (err) {
      console.error('Помилка збереження текстів Простору:', err)
      setError('Не вдалося зберегти тексти')
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
      formData.append('type', 'image')

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Не вдалося завантажити іконку')
      }

      await loadSpaceData()
    } catch (err) {
      console.error('Помилка завантаження іконки:', err)
      setError('Не вдалося завантажити іконку')
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
        throw new Error(data.error || 'Не вдалося видалити іконку')
      }

      await loadSpaceData()
    } catch (err) {
      console.error('Помилка видалення іконки:', err)
      setError('Не вдалося видалити іконку')
    } finally {
      setUploadingImages((prev) => {
        const next = new Set(prev)
        next.delete(fieldKey)
        return next
      })
    }
  }

  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setIsUploadingCollection(true)
    setError(null)

    try {
      const fileArray = Array.from(files)
      for (let index = 0; index < fileArray.length; index += 1) {
        const file = fileArray[index]
        const mediaKey = `space_gallery.${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`

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
          throw new Error(uploadData.error || 'Не вдалося завантажити зображення галереї')
        }

        const attachResponse = await fetch('/api/admin/homepage/media-collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ section: 'space_gallery', mediaKey }),
        })
        const attachData = await attachResponse.json()
        if (!attachResponse.ok || !attachData.success) {
          throw new Error(attachData.error || 'Не вдалося додати зображення до галереї')
        }
      }

      await loadGallery()
    } catch (err) {
      console.error('Помилка завантаження зображень галереї:', err)
      setError('Не вдалося завантажити зображення галереї')
    } finally {
      setIsUploadingCollection(false)
    }
  }

  const handleGalleryRemove = async (id: number) => {
    setError(null)
    try {
      const response = await fetch('/api/admin/homepage/media-collections', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ section: 'space_gallery', id }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Не вдалося видалити зображення галереї')
      }
      setGalleryItems(data.items || [])
    } catch (err) {
      console.error('Помилка видалення зображення галереї:', err)
      setError('Не вдалося видалити зображення')
    }
  }

  const handleGalleryDrop = async (targetId: number) => {
    if (!draggedItemId || draggedItemId === targetId) {
      setDraggedItemId(null)
      return
    }

    const draggedIndex = galleryItems.findIndex((item) => item.id === draggedItemId)
    const targetIndex = galleryItems.findIndex((item) => item.id === targetId)
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItemId(null)
      return
    }

    const reordered = [...galleryItems]
    const [moved] = reordered.splice(draggedIndex, 1)
    reordered.splice(targetIndex, 0, moved)
    const orderedIds = reordered.map((item) => item.id)

    setGalleryItems(reordered)
    setDraggedItemId(null)

    try {
      const response = await fetch('/api/admin/homepage/media-collections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ section: 'space_gallery', orderedIds }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Не вдалося змінити порядок галереї')
      }
      setGalleryItems(data.items || [])
    } catch (err) {
      console.error('Помилка зміни порядку галереї:', err)
      setError('Не вдалося зберегти порядок галереї')
      await loadGallery()
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

  return (
    <AdminShell
      title="Простір"
      subtitle="Керування текстами, іконками та галереєю секції Простір"
      userEmail={user?.email}
      onLogout={handleLogout}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        {isLoading ? (
          <div className="rounded-lg bg-white p-6 text-sm text-gray-500 shadow-sm">Завантаження...</div>
        ) : (
          <>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Тексти секції Простір</h2>
              <div className="space-y-4">
                {textFields.map((field) => (
                  <div key={field.key}>
                    <label className="mb-1 block text-sm font-medium text-gray-700">{field.label}</label>
                    <input
                      type="text"
                      value={getCurrentValue(field.key)}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-gray-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => void handleSaveTexts()}
                  disabled={isSaving}
                  className="rounded-lg bg-[#28694D] px-6 py-2 text-sm font-medium text-white hover:bg-[#1f5238] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? 'Збереження...' : 'Зберегти тексти'}
                </button>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Іконки переваг</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {iconFields.map((field) => {
                  const media = componentData?.media?.[field.key]
                  const imageUrl = media ? getR2Url(media.r2_key) : null
                  const isUploading = uploadingImages.has(field.key)

                  return (
                    <div key={field.key} className="rounded-lg border border-gray-200 p-3">
                      <p className="mb-2 text-sm font-medium text-gray-800">{field.label}</p>
                      {imageUrl && (
                        <img src={imageUrl} alt={field.label} className="mb-2 h-16 w-16 object-contain" />
                      )}
                      <input
                        type="file"
                        accept={field.accept || 'image/*'}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            void handleImageUpload(field.key, file)
                          }
                        }}
                        disabled={isUploading}
                        className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                      />
                      {media && (
                        <button
                          type="button"
                          onClick={() => void handleImageDelete(field.key)}
                          disabled={isUploading}
                          className="mt-2 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                          Видалити іконку
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Галерея Простору</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Перетягуйте для зміни порядку, видаляйте через іконку, додавайте через завантаження.
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
                      void handleGalleryUpload(e.target.files)
                      e.currentTarget.value = ''
                    }}
                    disabled={isUploadingCollection}
                  />
                </label>
              </div>

              {isLoadingGallery ? (
                <p className="text-sm text-gray-500">Завантаження галереї...</p>
              ) : galleryItems.length === 0 ? (
                <p className="text-sm text-gray-500">У галереї ще немає елементів</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {galleryItems.map((item, index) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => setDraggedItemId(item.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        void handleGalleryDrop(item.id)
                      }}
                      className={`group relative overflow-hidden rounded-lg border bg-gray-50 ${
                        draggedItemId === item.id ? 'opacity-60' : 'opacity-100'
                      }`}
                    >
                      <img
                        src={getR2Url(item.media_r2_key)}
                        alt={item.media_alt_text || `Зображення галереї Простору ${index + 1}`}
                        className="h-36 w-full object-cover"
                      />
                      <div className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                        #{index + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleGalleryRemove(item.id)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white opacity-90 transition hover:bg-red-700"
                        aria-label="Видалити фото"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminShell>
  )
}
