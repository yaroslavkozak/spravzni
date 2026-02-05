import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import ServiceForm from './services/_service-form'

export const Route = createFileRoute('/admin/services')({
  component: AdminServices,
})

interface Service {
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

interface ServiceOption {
  id: number
  service_id: number
  display_order: number
  title_uk: string
  title_en?: string | null
  description_uk: string
  description_en?: string | null
  image_path: string
  is_active: boolean
  created_at: string
  updated_at: string
}

function AdminServices() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ email: string; name: string | null; role: string } | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showOptionForm, setShowOptionForm] = useState(false)
  const [editingOption, setEditingOption] = useState<ServiceOption | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadServices()
    }
  }, [user])

  useEffect(() => {
    if (selectedService) {
      setServiceOptions([]) // Clear previous options
      loadServiceOptions(selectedService.id)
    } else {
      setServiceOptions([]) // Clear when no service selected
    }
  }, [selectedService])

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
      setServiceOptions([]) // Clear options while loading
      const response = await fetch(`/api/admin/service-options?serviceId=${serviceId}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to load service options')
      }

      const data = await response.json()
      if (data.success && data.options) {
        setServiceOptions(data.options)
      } else {
        setServiceOptions([])
      }
    } catch (err) {
      console.error('Load service options error:', err)
      setServiceOptions([])
      setError('Не вдалося завантажити варіанти відпочинку')
    }
  }

  const handleDeleteService = async (id: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цю послугу?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete service')
      }

      await loadServices()
      if (selectedService?.id === id) {
        setSelectedService(null)
        setServiceOptions([])
      }
    } catch (err) {
      console.error('Delete service error:', err)
      setError('Не вдалося видалити послугу')
    }
  }

  const handleSaveOption = async (optionData: Partial<ServiceOption>) => {
    setIsSaving(true)
    setError(null)

    try {
      if (!selectedService) {
        throw new Error('No service selected')
      }

      const url = editingOption
        ? `/api/admin/service-options/${editingOption.id}`
        : '/api/admin/service-options'
      const method = editingOption ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...optionData,
          service_id: selectedService.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save service option')
      }

      await loadServiceOptions(selectedService.id)
      setShowOptionForm(false)
      setEditingOption(null)
    } catch (err) {
      console.error('Save option error:', err)
      setError('Не вдалося зберегти варіант')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteOption = async (id: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цей варіант?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/service-options/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete option')
      }

      if (selectedService) {
        await loadServiceOptions(selectedService.id)
      }
    } catch (err) {
      console.error('Delete option error:', err)
      setError('Не вдалося видалити варіант')
    }
  }

  const handleServiceSaved = (updatedService: Service) => {
    setSelectedService(updatedService)
    setServices((prev) =>
      prev.map((service) => (service.id === updatedService.id ? updatedService : service))
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Завантаження...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Управління послугами</h1>
              <p className="text-sm text-gray-600 mt-1">
                {user?.email} • {user?.role}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate({ to: '/admin/dashboard' })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Панель
              </button>
              <button
                onClick={() => navigate({ to: '/admin/translations' })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Переклади
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Послуги</h2>
                <button
                  onClick={() => navigate({ to: '/admin/services/new' })}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-[#28694D] rounded-lg hover:bg-[#1f5a3f]"
                >
                  + Додати
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedService?.id === service.id ? 'bg-[#28694D]/10' : ''
                    }`}
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{service.heading_uk}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Порядок: {service.display_order} •{' '}
                          {service.is_active ? 'Активна' : 'Неактивна'}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteService(service.id)
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Видалити
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {services.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    Немає послуг. Додайте першу послугу.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Service Details & Options */}
          <div className="lg:col-span-2">
            {selectedService ? (
              <div className="space-y-6">
                <ServiceForm
                  serviceId={selectedService.id}
                  variant="embedded"
                  onSaved={handleServiceSaved}
                />

                {/* Service Options */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Варіанти відпочинку</h2>
                    <button
                      onClick={() => {
                        setEditingOption(null)
                        setShowOptionForm(true)
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-[#28694D] rounded-lg hover:bg-[#1f5a3f]"
                    >
                      + Додати варіант
                    </button>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {serviceOptions.map((option) => (
                      <div key={option.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{option.title_uk}</h3>
                            <p className="text-sm text-gray-600 mt-1">{option.description_uk}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Порядок: {option.display_order} •{' '}
                              {option.is_active ? 'Активний' : 'Неактивний'}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => {
                                setEditingOption(option)
                                setShowOptionForm(true)
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Редагувати
                            </button>
                            <button
                              onClick={() => handleDeleteOption(option.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Видалити
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {serviceOptions.length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        Немає варіантів. Додайте перший варіант.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-500">Виберіть послугу для перегляду деталей</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Option Form Modal */}
      {showOptionForm && selectedService && (
        <OptionFormModal
          option={editingOption}
          serviceId={selectedService.id}
          onSave={handleSaveOption}
          onClose={() => {
            setShowOptionForm(false)
            setEditingOption(null)
          }}
          isSaving={isSaving}
        />
      )}
    </div>
  )
}

// Option Form Modal Component
function OptionFormModal({
  option,
  serviceId,
  onSave,
  onClose,
  isSaving,
}: {
  option: ServiceOption | null
  serviceId: number
  onSave: (data: Partial<ServiceOption>) => void
  onClose: () => void
  isSaving: boolean
}) {
  const [formData, setFormData] = useState<Partial<ServiceOption>>({
    title_uk: option?.title_uk || '',
    title_en: option?.title_en || '',
    description_uk: option?.description_uk || '',
    description_en: option?.description_en || '',
    image_path: option?.image_path || '',
    display_order: option?.display_order || 0,
    is_active: option?.is_active ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {option ? 'Редагувати варіант' : 'Додати варіант'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Назва (UK) *
              </label>
              <input
                type="text"
                value={formData.title_uk || ''}
                onChange={(e) => setFormData({ ...formData, title_uk: e.target.value })}
                className="w-full rounded-lg border border-gray-300 p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Назва (EN)
              </label>
              <input
                type="text"
                value={formData.title_en || ''}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                className="w-full rounded-lg border border-gray-300 p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Опис (UK) *
              </label>
              <textarea
                value={formData.description_uk || ''}
                onChange={(e) => setFormData({ ...formData, description_uk: e.target.value })}
                className="w-full rounded-lg border border-gray-300 p-2"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Опис (EN)
              </label>
              <textarea
                value={formData.description_en || ''}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                className="w-full rounded-lg border border-gray-300 p-2"
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Шлях до зображення *
              </label>
              <input
                type="text"
                value={formData.image_path || ''}
                onChange={(e) => setFormData({ ...formData, image_path: e.target.value })}
                className="w-full rounded-lg border border-gray-300 p-2"
                placeholder="/images/services/s1/1.webp"
                required
              />
            </div>
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
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active ?? true}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Активний</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
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
        </form>
      </div>
    </div>
  )
}
