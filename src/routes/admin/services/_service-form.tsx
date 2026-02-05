import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export interface Service {
  id: number
  display_order: number
  heading_uk: string
  heading_en?: string | null
  paragraphs_uk: string[]
  paragraphs_en?: string[] | null
  primary_button_text_uk: string
  primary_button_text_en?: string | null
  secondary_button_text_uk: string
  secondary_button_text_en?: string | null
  primary_action: 'vacationOptions' | 'none'
  secondary_action: 'contact' | 'none'
  image_key?: string | null
  overlay_text_uk?: string | null
  overlay_text_en?: string | null
  show_primary_button: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

type ServiceFormVariant = 'page' | 'embedded'

interface ServiceFormProps {
  serviceId: number | null
  variant?: ServiceFormVariant
  onSaved?: (service: Service) => void
}

export default function ServiceForm({ serviceId, variant = 'page', onSaved }: ServiceFormProps) {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ email: string; name: string | null; role: string } | null>(null)
  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [editLanguage, setEditLanguage] = useState<'uk' | 'en'>('uk')
  const isEmbedded = variant === 'embedded'
  const formId = isEmbedded ? `service-form-${serviceId ?? 'new'}` : undefined

  const [formData, setFormData] = useState<Partial<Service>>({
    heading_uk: '',
    heading_en: '',
    paragraphs_uk: [],
    paragraphs_en: [],
    primary_button_text_uk: '',
    primary_button_text_en: '',
    secondary_button_text_uk: '',
    secondary_button_text_en: '',
    primary_action: 'none',
    secondary_action: 'none',
    overlay_text_uk: '',
    overlay_text_en: '',
    show_primary_button: true,
    is_active: true,
    display_order: 0,
    image_key: '',
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user && serviceId) {
      loadService()
    } else if (user && !serviceId) {
      setIsLoading(false)
    }
  }, [user, serviceId])

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

  const applyServiceData = (nextService: Service) => {
    setService(nextService)
    setFormData({
      heading_uk: nextService.heading_uk,
      heading_en: nextService.heading_en || '',
      paragraphs_uk: nextService.paragraphs_uk || [],
      paragraphs_en: nextService.paragraphs_en || [],
      primary_button_text_uk: nextService.primary_button_text_uk,
      primary_button_text_en: nextService.primary_button_text_en || '',
      secondary_button_text_uk: nextService.secondary_button_text_uk,
      secondary_button_text_en: nextService.secondary_button_text_en || '',
      primary_action: nextService.primary_action,
      secondary_action: nextService.secondary_action,
      overlay_text_uk: nextService.overlay_text_uk || '',
      overlay_text_en: nextService.overlay_text_en || '',
      show_primary_button: nextService.show_primary_button,
      is_active: nextService.is_active,
      display_order: nextService.display_order,
      image_key: nextService.image_key || '',
    })
  }

  const loadService = async () => {
    if (!serviceId) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to load service')
      }

      const data = await response.json()
      if (data.success && data.service) {
        applyServiceData(data.service)
      }
    } catch (err) {
      console.error('Load service error:', err)
      setError('Не вдалося завантажити послугу')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('key', `services.service${serviceId || Date.now()}`)
      formData.append('type', 'image')

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
        setFormData((prev) => ({ ...prev, image_key: data.media.key }))
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Не вдалося завантажити зображення')
    } finally {
      setUploadingImage(false)
    }
  }

  const normalizeButtonText = (value?: string | null) => {
    if (!value) return ''
    const trimmed = value.trim()
    if (trimmed === '' || trimmed === '0' || trimmed === '-') {
      return ''
    }
    return trimmed
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const url = serviceId ? `/api/admin/services/${serviceId}` : '/api/admin/services'
      const method = serviceId ? 'PATCH' : 'POST'
      const primaryButtonTextUk = normalizeButtonText(formData.primary_button_text_uk)
      const primaryButtonTextEn = normalizeButtonText(formData.primary_button_text_en)
      const shouldShowPrimary = primaryButtonTextUk !== ''
      const payload: Partial<Service> = {
        ...formData,
        primary_button_text_uk: primaryButtonTextUk,
        primary_button_text_en: primaryButtonTextEn || '',
        primary_action: shouldShowPrimary ? formData.primary_action : 'none',
        show_primary_button: shouldShowPrimary,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok || !data?.success) {
        throw new Error('Failed to save service')
      }

      if (data.service) {
        applyServiceData(data.service)
        onSaved?.(data.service)
      }

      if (!isEmbedded) {
        navigate({ to: '/admin/services' })
      }
    } catch (err) {
      console.error('Save service error:', err)
      setError('Не вдалося зберегти послугу')
    } finally {
      setIsSaving(false)
    }
  }

  const addParagraph = (lang: 'uk' | 'en') => {
    const key = `paragraphs_${lang}` as keyof typeof formData
    const current = (formData[key] as string[]) || []
    setFormData({ ...formData, [key]: [...current, ''] })
  }

  const updateParagraph = (lang: 'uk' | 'en', index: number, value: string) => {
    const key = `paragraphs_${lang}` as keyof typeof formData
    const current = (formData[key] as string[]) || []
    const updated = [...current]
    updated[index] = value
    setFormData({ ...formData, [key]: updated })
  }

  const removeParagraph = (lang: 'uk' | 'en', index: number) => {
    const key = `paragraphs_${lang}` as keyof typeof formData
    const current = (formData[key] as string[]) || []
    const updated = current.filter((_, i) => i !== index)
    setFormData({ ...formData, [key]: updated })
  }

  if (isLoading) {
    if (isEmbedded) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-gray-600">Завантаження...</div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Завантаження...</div>
      </div>
    )
  }

  const formContent = (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className={isEmbedded ? 'space-y-6' : 'bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6'}
    >
          {/* Heading */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {editLanguage === 'uk' ? 'Назва (Українська) *' : 'Назва (English)'}
            </label>
            <input
              type="text"
              value={editLanguage === 'uk' ? (formData.heading_uk || '') : (formData.heading_en || '')}
              onChange={(e) => setFormData({ 
                ...formData, 
                [editLanguage === 'uk' ? 'heading_uk' : 'heading_en']: e.target.value 
              })}
              className="w-full rounded-lg border border-gray-300 p-2"
              required={editLanguage === 'uk'}
            />
          </div>

          {/* Paragraphs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {editLanguage === 'uk' ? 'Параграфи (Українська) *' : 'Параграфи (English)'}
              </label>
              <button
                type="button"
                onClick={() => addParagraph(editLanguage)}
                className="text-sm text-[#28694D] hover:text-[#1f5a3f]"
              >
                + Додати параграф
              </button>
            </div>
            {((editLanguage === 'uk' ? formData.paragraphs_uk : formData.paragraphs_en) || []).map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <textarea
                  value={p}
                  onChange={(e) => updateParagraph(editLanguage, i, e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 p-2"
                  rows={2}
                  required={editLanguage === 'uk'}
                />
                <button
                  type="button"
                  onClick={() => removeParagraph(editLanguage, i)}
                  className="text-red-600 hover:text-red-800"
                >
                  Видалити
                </button>
              </div>
            ))}
            {((editLanguage === 'uk' ? formData.paragraphs_uk : formData.paragraphs_en) || []).length === 0 && (
              <button
                type="button"
                onClick={() => addParagraph(editLanguage)}
                className="text-sm text-[#28694D] hover:text-[#1f5a3f]"
              >
                + Додати перший параграф
              </button>
            )}
          </div>

          {/* Primary Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {editLanguage === 'uk' ? 'Основна кнопка (Українська)' : 'Основна кнопка (English)'}
            </label>
            <input
              type="text"
              value={editLanguage === 'uk' ? (formData.primary_button_text_uk || '') : (formData.primary_button_text_en || '')}
              onChange={(e) =>
                setFormData({ 
                  ...formData, 
                  [editLanguage === 'uk' ? 'primary_button_text_uk' : 'primary_button_text_en']: e.target.value 
                })
              }
              className="w-full rounded-lg border border-gray-300 p-2"
            />
          </div>

          {/* Secondary Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {editLanguage === 'uk' ? 'Другорядна кнопка (Українська) *' : 'Другорядна кнопка (English)'}
            </label>
            <input
              type="text"
              value={editLanguage === 'uk' ? (formData.secondary_button_text_uk || '') : (formData.secondary_button_text_en || '')}
              onChange={(e) =>
                setFormData({ 
                  ...formData, 
                  [editLanguage === 'uk' ? 'secondary_button_text_uk' : 'secondary_button_text_en']: e.target.value 
                })
              }
              className="w-full rounded-lg border border-gray-300 p-2"
              required={editLanguage === 'uk'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дія основної кнопки
              </label>
              <select
                value={formData.primary_action || 'none'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    primary_action: e.target.value as 'vacationOptions' | 'none',
                  })
                }
                className="w-full rounded-lg border border-gray-300 p-2"
              >
                <option value="none">Немає</option>
                <option value="vacationOptions">Варіанти відпочинку</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дія другорядної кнопки
              </label>
              <select
                value={formData.secondary_action || 'none'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    secondary_action: e.target.value as 'contact' | 'none',
                  })
                }
                className="w-full rounded-lg border border-gray-300 p-2"
              >
                <option value="none">Немає</option>
                <option value="contact">Контакт</option>
              </select>
            </div>
          </div>

          {/* Overlay Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {editLanguage === 'uk' ? 'Overlay текст (Українська)' : 'Overlay текст (English)'}
            </label>
            <input
              type="text"
              value={editLanguage === 'uk' ? (formData.overlay_text_uk || '') : (formData.overlay_text_en || '')}
              onChange={(e) => setFormData({ 
                ...formData, 
                [editLanguage === 'uk' ? 'overlay_text_uk' : 'overlay_text_en']: e.target.value 
              })}
              className="w-full rounded-lg border border-gray-300 p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Порядок відображення
              </label>
              <input
                type="number"
                value={formData.display_order || 0}
                onChange={(e) =>
                  setFormData({ ...formData, display_order: parseInt(e.target.value, 10) })
                }
                className="w-full rounded-lg border border-gray-300 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Зображення
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
                {uploadingImage && (
                  <p className="text-sm text-gray-500">Завантаження...</p>
                )}
                {formData.image_key && (
                  <p className="text-sm text-gray-600">Ключ: {formData.image_key}</p>
                )}
                <input
                  type="text"
                  value={formData.image_key || ''}
                  onChange={(e) => setFormData({ ...formData, image_key: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2"
                  placeholder="Або введіть ключ вручну"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.show_primary_button ?? true}
                onChange={(e) =>
                  setFormData({ ...formData, show_primary_button: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Показати основну кнопку</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active ?? true}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Активна</span>
            </label>
          </div>

          {!isEmbedded && (
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate({ to: '/admin/services' })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Скасувати
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-[#28694D] rounded-lg hover:bg-[#1f5a3f] disabled:opacity-50"
              >
                {isSaving ? 'Збереження...' : 'Зберегти'}
              </button>
            </div>
          )}
        </form>
  )

  if (isEmbedded) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {service ? service.heading_uk : serviceId ? 'Редагувати послугу' : 'Додати послугу'}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditLanguage(editLanguage === 'uk' ? 'en' : 'uk')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {editLanguage === 'uk' ? 'English' : 'Українська'}
            </button>
            <button
              type="submit"
              form={formId}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-[#28694D] rounded-lg hover:bg-[#1f5a3f] disabled:opacity-50"
            >
              {isSaving ? 'Збереження...' : 'Зберегти'}
            </button>
          </div>
        </div>
        {formContent}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {serviceId ? 'Редагувати послугу' : 'Додати послугу'}
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditLanguage(editLanguage === 'uk' ? 'en' : 'uk')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {editLanguage === 'uk' ? 'English' : 'Українська'}
              </button>
              <button
                onClick={() => navigate({ to: '/admin/services' })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Назад до списку
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {formContent}
      </main>
    </div>
  )
}
