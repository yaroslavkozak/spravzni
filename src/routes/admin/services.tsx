import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import AdminShell from '@/src/components/admin/AdminShell'
import { getMediaR2Url, getR2Url } from '@/src/lib/r2-media'

export const Route = createFileRoute('/admin/services')({
  component: AdminServices,
})

interface Service {
  id: number
  display_order: number
  heading_uk: string
  paragraphs_uk: string[]
  primary_button_text_uk: string
  secondary_button_text_uk: string
  primary_action: 'vacationOptions' | 'none'
  secondary_action: 'contact' | 'none'
  image_key?: string | null
  overlay_text_uk?: string | null
  show_primary_button: boolean
  is_active: boolean
}

interface ServiceOption {
  id: number
  service_id: number
  display_order: number
  title_uk: string
  description_uk: string
  overlay_text_uk?: string
  image_path: string
  is_active: boolean
}

function AdminServices() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ email: string; name: string | null; role: string } | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingOption, setIsSavingOption] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingOptionImage, setUploadingOptionImage] = useState(false)
  const [isDraggingImage, setIsDraggingImage] = useState(false)
  const [isDraggingOptionImage, setIsDraggingOptionImage] = useState(false)
  const [serviceImagePreviewUrl, setServiceImagePreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([])
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    heading_uk: '',
    paragraphs_uk: [''],
    primary_button_text_uk: '',
    secondary_button_text_uk: '',
    primary_action: 'none' as 'vacationOptions' | 'none',
    secondary_action: 'contact' as 'contact' | 'none',
    overlay_text_uk: '',
    display_order: 0,
    image_key: '',
    show_primary_button: true,
    is_active: true,
  })
  const [optionFormData, setOptionFormData] = useState({
    title_uk: '',
    description_uk: '',
    overlay_text_uk: '',
    image_path: '',
    display_order: 0,
    is_active: true,
  })

  useEffect(() => {
    void checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      void loadServices()
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

  const loadServices = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/services', {
        credentials: 'include',
      })
      if (!response.ok) {
        if (response.status === 401) {
          navigate({ to: '/admin/login' })
          return
        }
        throw new Error('Failed to load services')
      }

      const data = await response.json()
      if (data.success && data.services) {
        setServices(data.services)
        if (!selectedServiceId && data.services.length > 0) {
          selectService(data.services[0])
        }
      }
    } catch (err) {
      console.error('Load services error:', err)
      setError('Не вдалося завантажити послуги')
    } finally {
      setIsLoading(false)
    }
  }

  const loadServiceOptions = async (serviceId: number) => {
    try {
      const response = await fetch(`/api/admin/service-options?serviceId=${serviceId}`, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to load service options')
      }

      const data = await response.json()
      if (data.success && data.options) {
        setServiceOptions(data.options as ServiceOption[])
      } else {
        setServiceOptions([])
      }
      setSelectedOptionId(null)
      setOptionFormData({
        title_uk: '',
        description_uk: '',
        overlay_text_uk: '',
        image_path: '',
        display_order: 0,
        is_active: true,
      })
    } catch (err) {
      console.error('Load service options error:', err)
      setError('Не вдалося завантажити варіанти відпочинку')
      setServiceOptions([])
    }
  }

  // Resolve service image_key to preview URL for thumbnail
  useEffect(() => {
    const key = formData.image_key?.trim()
    if (!key) {
      setServiceImagePreviewUrl(null)
      return
    }
    let cancelled = false
    getMediaR2Url(key).then((url) => {
      if (!cancelled) setServiceImagePreviewUrl(url)
    })
    return () => {
      cancelled = true
    }
  }, [formData.image_key])

  const selectService = (service: Service) => {
    setSelectedServiceId(service.id)
    setFormData({
      heading_uk: service.heading_uk || '',
      paragraphs_uk: service.paragraphs_uk && service.paragraphs_uk.length > 0 ? service.paragraphs_uk : [''],
      primary_button_text_uk: service.primary_button_text_uk || '',
      secondary_button_text_uk: service.secondary_button_text_uk || '',
      primary_action: service.primary_action || 'none',
      secondary_action: service.secondary_action || 'contact',
      overlay_text_uk: service.overlay_text_uk || '',
      display_order: service.display_order || 0,
      image_key: service.image_key || '',
      show_primary_button: service.show_primary_button ?? true,
      is_active: service.is_active ?? true,
    })
    void loadServiceOptions(service.id)
  }

  const resetFormForNew = () => {
    setSelectedServiceId(null)
    setFormData({
      heading_uk: '',
      paragraphs_uk: [''],
      primary_button_text_uk: '',
      secondary_button_text_uk: '',
      primary_action: 'none',
      secondary_action: 'contact',
      overlay_text_uk: '',
      display_order: services.length,
      image_key: '',
      show_primary_button: true,
      is_active: true,
    })
    setServiceOptions([])
    setSelectedOptionId(null)
    setOptionFormData({
      title_uk: '',
      description_uk: '',
      overlay_text_uk: '',
      image_path: '',
      display_order: 0,
      is_active: true,
    })
  }

  const resetOptionFormForNew = () => {
    setSelectedOptionId(null)
    setOptionFormData({
      title_uk: '',
      description_uk: '',
      overlay_text_uk: '',
      image_path: '',
      display_order: serviceOptions.length,
      is_active: true,
    })
  }

  const selectOption = (option: ServiceOption) => {
    setSelectedOptionId(option.id)
    setOptionFormData({
      title_uk: option.title_uk || '',
      description_uk: option.description_uk || '',
      overlay_text_uk: option.overlay_text_uk || '',
      image_path: option.image_path || '',
      display_order: option.display_order || 0,
      is_active: option.is_active ?? true,
    })
  }

  const updateParagraph = (index: number, value: string) => {
    setFormData((prev) => {
      const next = [...prev.paragraphs_uk]
      next[index] = value
      return { ...prev, paragraphs_uk: next }
    })
  }

  const addParagraph = () => {
    setFormData((prev) => ({ ...prev, paragraphs_uk: [...prev.paragraphs_uk, ''] }))
  }

  const removeParagraph = (index: number) => {
    setFormData((prev) => {
      const next = prev.paragraphs_uk.filter((_, i) => i !== index)
      return { ...prev, paragraphs_uk: next.length > 0 ? next : [''] }
    })
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('key', `services.service${selectedServiceId || Date.now()}`)
      form.append('type', 'image')

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        credentials: 'include',
        body: form,
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image')
      }

      setFormData((prev) => ({ ...prev, image_key: data.media.key }))
    } catch (err) {
      console.error('Upload image error:', err)
      setError('Не вдалося завантажити зображення')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImageSelect = (file?: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Можна завантажувати лише зображення')
      return
    }
    void handleImageUpload(file)
  }

  const handleOptionImageUpload = async (file: File) => {
    if (!selectedServiceId) return
    setUploadingOptionImage(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append(
        'key',
        `services.option${selectedOptionId || Date.now()}.service${selectedServiceId}`
      )
      form.append('type', 'image')

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        credentials: 'include',
        body: form,
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload option image')
      }

      if (data.media?.r2_key) {
        setOptionFormData((prev) => ({ ...prev, image_path: getR2Url(data.media.r2_key as string) }))
      }
    } catch (err) {
      console.error('Upload option image error:', err)
      setError('Не вдалося завантажити зображення для опції')
    } finally {
      setUploadingOptionImage(false)
    }
  }

  const handleOptionImageSelect = (file?: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Можна завантажувати лише зображення')
      return
    }
    void handleOptionImageUpload(file)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        paragraphs_uk: formData.paragraphs_uk.map((p) => p.trim()).filter((p) => p !== ''),
      }

      const isEdit = selectedServiceId !== null
      const response = await fetch(
        isEdit ? `/api/admin/services/${selectedServiceId}` : '/api/admin/services',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      )
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save service')
      }

      await loadServices()
      if (data.service) {
        selectService(data.service as Service)
      }
    } catch (err) {
      console.error('Save service error:', err)
      setError('Не вдалося зберегти послугу')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цю послугу?')) return

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete service')
      }
      await loadServices()
      if (selectedServiceId === id) {
        resetFormForNew()
      }
    } catch (err) {
      console.error('Delete service error:', err)
      setError('Не вдалося видалити послугу')
    }
  }

  const handleSaveOption = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedServiceId) {
      setError('Спочатку оберіть або збережіть послугу')
      return
    }

    setIsSavingOption(true)
    setError(null)
    try {
      const payload = {
        service_id: selectedServiceId,
        title_uk: optionFormData.title_uk.trim(),
        description_uk: optionFormData.description_uk.trim(),
        overlay_text_uk: optionFormData.overlay_text_uk.trim(),
        image_path: optionFormData.image_path.trim(),
        display_order: optionFormData.display_order,
        is_active: optionFormData.is_active,
      }

      const isEdit = selectedOptionId !== null
      const response = await fetch(
        isEdit ? `/api/admin/service-options/${selectedOptionId}` : '/api/admin/service-options',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      )
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save service option')
      }

      await loadServiceOptions(selectedServiceId)
      if (data.option) {
        selectOption(data.option as ServiceOption)
      }
    } catch (err) {
      console.error('Save service option error:', err)
      setError('Не вдалося зберегти варіант відпочинку')
    } finally {
      setIsSavingOption(false)
    }
  }

  const handleDeleteOption = async (id: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цей варіант відпочинку?')) return
    if (!selectedServiceId) return

    try {
      const response = await fetch(`/api/admin/service-options/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete service option')
      }

      await loadServiceOptions(selectedServiceId)
    } catch (err) {
      console.error('Delete service option error:', err)
      setError('Не вдалося видалити варіант відпочинку')
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F7F5] flex items-center justify-center font-montserrat">
        <div className="text-gray-600">Завантаження...</div>
      </div>
    )
  }

  return (
    <AdminShell
      title="Послуги"
      subtitle="Повний CRUD українською. Переклади EN/PL редагуються у вкладці Переклади."
      userEmail={user?.email}
      onLogout={handleLogout}
    >
      <main className="mx-auto max-w-7xl">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-lg border border-gray-200 bg-white shadow-sm lg:col-span-1">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Список послуг</h2>
              <button
                onClick={resetFormForNew}
                className="rounded-lg bg-[#28694D] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#1f5a3f]"
              >
                + Нова
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {services.map((service) => (
                <div key={service.id} className={`p-4 ${selectedServiceId === service.id ? 'bg-[#28694D]/10' : ''}`}>
                  <button
                    type="button"
                    onClick={() => selectService(service)}
                    className="w-full text-left"
                  >
                    <div className="font-medium text-gray-900">{service.heading_uk}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      ID: {service.id} · Порядок: {service.display_order} · {service.is_active ? 'Активна' : 'Неактивна'}
                    </div>
                  </button>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => void handleDelete(service.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              ))}
              {services.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">Поки немає послуг</div>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {selectedServiceId ? `Редагування послуги #${selectedServiceId}` : 'Нова послуга'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Назва (UK)</label>
                <input
                  type="text"
                  value={formData.heading_uk}
                  onChange={(e) => setFormData((prev) => ({ ...prev, heading_uk: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  required
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Параграфи (UK)</label>
                  <button type="button" onClick={addParagraph} className="text-sm text-[#28694D] hover:underline">
                    + Додати параграф
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.paragraphs_uk.map((paragraph, index) => (
                    <div key={index} className="flex gap-2">
                      <textarea
                        value={paragraph}
                        onChange={(e) => updateParagraph(index, e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeParagraph(index)}
                        className="px-2 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Основна кнопка (UK)</label>
                  <input
                    type="text"
                    value={formData.primary_button_text_uk}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, primary_button_text_uk: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Другорядна кнопка (UK)</label>
                  <input
                    type="text"
                    value={formData.secondary_button_text_uk}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, secondary_button_text_uk: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Дія основної кнопки</label>
                  <select
                    value={formData.primary_action}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        primary_action: e.target.value as 'vacationOptions' | 'none',
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  >
                    <option value="none">Немає</option>
                    <option value="vacationOptions">Vacation Options</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Дія другорядної кнопки</label>
                  <select
                    value={formData.secondary_action}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        secondary_action: e.target.value as 'contact' | 'none',
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  >
                    <option value="contact">Contact</option>
                    <option value="none">Немає</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Overlay текст (UK)</label>
                  <input
                    type="text"
                    value={formData.overlay_text_uk}
                    onChange={(e) => setFormData((prev) => ({ ...prev, overlay_text_uk: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Порядок відображення</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, display_order: parseInt(e.target.value, 10) || 0 }))
                    }
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Зображення</label>
                <div className="space-y-2">
                  <label
                    onDragOver={(event) => {
                      event.preventDefault()
                      if (!uploadingImage) setIsDraggingImage(true)
                    }}
                    onDragLeave={(event) => {
                      event.preventDefault()
                      setIsDraggingImage(false)
                    }}
                    onDrop={(event) => {
                      event.preventDefault()
                      setIsDraggingImage(false)
                      if (uploadingImage) return
                      handleImageSelect(event.dataTransfer.files?.[0])
                    }}
                    className={`group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
                      uploadingImage
                        ? 'cursor-not-allowed border-gray-200 bg-gray-50'
                        : isDraggingImage
                          ? 'border-[#28694D] bg-[#28694D]/5'
                          : 'border-gray-300 bg-gray-50/70 hover:border-[#28694D]/70 hover:bg-[#28694D]/5'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageSelect(event.target.files?.[0])}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    {serviceImagePreviewUrl ? (
                      <img
                        src={serviceImagePreviewUrl}
                        alt=""
                        className="mb-2 max-h-32 w-auto max-w-full rounded-lg object-contain"
                      />
                    ) : (
                      <div className="mb-2 text-2xl leading-none">🖼️</div>
                    )}
                    <p className="text-sm font-medium text-gray-800">
                      {uploadingImage ? 'Завантаження...' : 'Перетягніть зображення сюди'}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      або натисніть, щоб вибрати файл з комп’ютера
                    </p>
                  </label>
                  <input
                    type="text"
                    value={formData.image_key}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image_key: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                    placeholder="Або введіть media key вручну"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.show_primary_button}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, show_primary_button: e.target.checked }))
                    }
                  />
                  Показувати основну кнопку
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                  />
                  Активна
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetFormForNew}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Скинути
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-[#28694D] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f5a3f] disabled:opacity-50"
                >
                  {isSaving ? 'Збереження...' : selectedServiceId ? 'Оновити послугу' : 'Додати послугу'}
                </button>
              </div>
            </form>
          </section>
        </div>

        <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Варіанти відпочинку (попап)</h2>
            <button
              type="button"
              onClick={resetOptionFormForNew}
              disabled={!selectedServiceId}
              className="rounded-lg bg-[#28694D] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#1f5a3f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Нова опція
            </button>
          </div>

          {!selectedServiceId ? (
            <p className="text-sm text-gray-500">Спочатку створіть або оберіть послугу, щоб керувати її опціями.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-lg border border-gray-200">
                <div className="divide-y divide-gray-200">
                  {serviceOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`p-4 ${selectedOptionId === option.id ? 'bg-[#28694D]/10' : ''}`}
                    >
                      <button
                        type="button"
                        onClick={() => selectOption(option)}
                        className="w-full text-left"
                      >
                        <div className="font-medium text-gray-900">{option.title_uk || `Опція #${option.id}`}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          ID: {option.id} · Порядок: {option.display_order} ·{' '}
                          {option.is_active ? 'Активна' : 'Неактивна'}
                        </div>
                      </button>
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => void handleDeleteOption(option.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Видалити
                        </button>
                      </div>
                    </div>
                  ))}
                  {serviceOptions.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500">Поки немає опцій</div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2">
                <h3 className="mb-3 text-base font-semibold text-gray-900">
                  {selectedOptionId ? `Редагування опції #${selectedOptionId}` : 'Нова опція'}
                </h3>
                <form onSubmit={handleSaveOption} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Назва (UK)</label>
                    <input
                      type="text"
                      value={optionFormData.title_uk}
                      onChange={(e) =>
                        setOptionFormData((prev) => ({ ...prev, title_uk: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Опис (UK)</label>
                    <textarea
                      value={optionFormData.description_uk}
                      onChange={(e) =>
                        setOptionFormData((prev) => ({ ...prev, description_uk: e.target.value }))
                      }
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Текст плашки зверху (UK)</label>
                    <input
                      type="text"
                      value={optionFormData.overlay_text_uk}
                      onChange={(e) =>
                        setOptionFormData((prev) => ({ ...prev, overlay_text_uk: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                      placeholder="Напр. Чекаємо влітку"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Порядок відображення</label>
                      <input
                        type="number"
                        value={optionFormData.display_order}
                        onChange={(e) =>
                          setOptionFormData((prev) => ({
                            ...prev,
                            display_order: parseInt(e.target.value, 10) || 0,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                      />
                    </div>
                    <label className="mt-6 flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={optionFormData.is_active}
                        onChange={(e) =>
                          setOptionFormData((prev) => ({ ...prev, is_active: e.target.checked }))
                        }
                      />
                      Активна
                    </label>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Зображення опції</label>
                    <div className="space-y-2">
                      <label
                        onDragOver={(event) => {
                          event.preventDefault()
                          if (!uploadingOptionImage) setIsDraggingOptionImage(true)
                        }}
                        onDragLeave={(event) => {
                          event.preventDefault()
                          setIsDraggingOptionImage(false)
                        }}
                        onDrop={(event) => {
                          event.preventDefault()
                          setIsDraggingOptionImage(false)
                          if (uploadingOptionImage) return
                          handleOptionImageSelect(event.dataTransfer.files?.[0])
                        }}
                        className={`group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
                          uploadingOptionImage
                            ? 'cursor-not-allowed border-gray-200 bg-gray-50'
                            : isDraggingOptionImage
                              ? 'border-[#28694D] bg-[#28694D]/5'
                              : 'border-gray-300 bg-gray-50/70 hover:border-[#28694D]/70 hover:bg-[#28694D]/5'
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => handleOptionImageSelect(event.target.files?.[0])}
                          className="hidden"
                          disabled={uploadingOptionImage}
                        />
                        {optionFormData.image_path ? (
                          <img
                            src={optionFormData.image_path}
                            alt=""
                            className="mb-2 max-h-32 w-auto max-w-full rounded-lg object-contain"
                          />
                        ) : (
                          <div className="mb-2 text-2xl leading-none">🖼️</div>
                        )}
                        <p className="text-sm font-medium text-gray-800">
                          {uploadingOptionImage ? 'Завантаження...' : 'Перетягніть зображення сюди'}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          або натисніть, щоб вибрати файл з комп’ютера
                        </p>
                      </label>

                      <input
                        type="text"
                        value={optionFormData.image_path}
                        onChange={(e) =>
                          setOptionFormData((prev) => ({ ...prev, image_path: e.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                        placeholder="URL або шлях до зображення"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={resetOptionFormForNew}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Скинути
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingOption}
                      className="rounded-lg bg-[#28694D] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f5a3f] disabled:opacity-50"
                    >
                      {isSavingOption ? 'Збереження...' : selectedOptionId ? 'Оновити опцію' : 'Додати опцію'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      </main>
    </AdminShell>
  )
}
