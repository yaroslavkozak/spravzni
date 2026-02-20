import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getR2Url } from '@/src/lib/r2-media'
import AdminShell from '@/src/components/admin/AdminShell'

export const Route = createFileRoute('/admin/partners')({
  component: AdminPartners,
})

interface BrandLogoItem {
  id: number
  section: 'brand_logos'
  media_key: string
  sort_order: number
  media_type: 'image' | 'video'
  media_r2_key: string
  media_alt_text?: string | null
}

function AdminPartners() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ email: string; name: string | null; role: string } | null>(null)
  const [items, setItems] = useState<BrandLogoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      void loadBrandLogos()
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

  const loadBrandLogos = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/homepage/media-collections?section=brand_logos', {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Не вдалося завантажити логотипи брендів')
      }
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Не вдалося завантажити логотипи брендів')
      }
      setItems(data.items || [])
    } catch (err) {
      console.error('Помилка завантаження логотипів брендів:', err)
      setError('Не вдалося завантажити логотипи брендів')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      const fileArray = Array.from(files)
      for (let index = 0; index < fileArray.length; index += 1) {
        const file = fileArray[index]
        const mediaKey = `brand_logos.${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`

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
          body: JSON.stringify({ section: 'brand_logos', mediaKey }),
        })
        const attachData = await attachResponse.json()
        if (!attachResponse.ok || !attachData.success) {
          throw new Error(attachData.error || 'Не вдалося додати медіа до колекції')
        }
      }

      await loadBrandLogos()
    } catch (err) {
      console.error('Помилка завантаження логотипів брендів:', err)
      setError('Не вдалося завантажити логотипи')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async (id: number) => {
    setError(null)
    try {
      const response = await fetch('/api/admin/homepage/media-collections', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ section: 'brand_logos', id }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Не вдалося видалити медіа')
      }
      setItems(data.items || [])
    } catch (err) {
      console.error('Помилка видалення логотипа бренду:', err)
      setError('Не вдалося видалити логотип')
    }
  }

  const handleDrop = async (targetId: number) => {
    if (!draggedItemId || draggedItemId === targetId) {
      setDraggedItemId(null)
      return
    }

    const draggedIndex = items.findIndex((item) => item.id === draggedItemId)
    const targetIndex = items.findIndex((item) => item.id === targetId)
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItemId(null)
      return
    }

    const reordered = [...items]
    const [moved] = reordered.splice(draggedIndex, 1)
    reordered.splice(targetIndex, 0, moved)
    const orderedIds = reordered.map((item) => item.id)

    setItems(reordered)
    setDraggedItemId(null)

    try {
      const response = await fetch('/api/admin/homepage/media-collections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ section: 'brand_logos', orderedIds }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Не вдалося змінити порядок елементів')
      }
      setItems(data.items || [])
    } catch (err) {
      console.error('Помилка зміни порядку логотипів брендів:', err)
      setError('Не вдалося зберегти порядок логотипів')
      await loadBrandLogos()
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
      title="Керування брендами"
      subtitle="Логотипи партнерів для секції «Відео та партнери»"
      userEmail={user?.email}
      onLogout={handleLogout}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Логотипи брендів</h2>
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
                  void handleUpload(e.target.files)
                  e.currentTarget.value = ''
                }}
                disabled={isUploading}
              />
            </label>
          </div>

          {isLoading ? (
            <p className="text-sm text-gray-500">Завантаження логотипів...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-500">Ще немає логотипів брендів</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => setDraggedItemId(item.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    void handleDrop(item.id)
                  }}
                  className={`group relative overflow-hidden rounded-lg border bg-gray-50 ${
                    draggedItemId === item.id ? 'opacity-60' : 'opacity-100'
                  }`}
                >
                  <img
                    src={getR2Url(item.media_r2_key)}
                    alt={item.media_alt_text || `Логотип бренду ${index + 1}`}
                    className="h-36 w-full object-contain bg-white p-2"
                  />
                  <div className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                    #{index + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleRemove(item.id)}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white opacity-90 transition hover:bg-red-700"
                    aria-label="Видалити логотип"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
