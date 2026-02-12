import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/admin/report')({
  component: AdminReport,
})

interface ReportItem {
  id: number
  period: string
  amount: string
  category: string
  period_en?: string | null
  amount_en?: string | null
  category_en?: string | null
  created_at: string
  updated_at: string
}

interface ReportSettings {
  updated_date: string | null
  incoming_amount: string | null
  outgoing_amount: string | null
  incoming_amount_en?: string | null
  outgoing_amount_en?: string | null
}

function AdminReport() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ email: string; name: string | null; role: string } | null>(null)
  const [items, setItems] = useState<ReportItem[]>([])
  const [settings, setSettings] = useState<ReportSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<ReportItem | null>(null)
  const [formData, setFormData] = useState({
    period: '',
    amount: '',
    category: '',
    period_en: '',
    amount_en: '',
    category_en: '',
  })
  const [updatedDateDraft, setUpdatedDateDraft] = useState<string>('')
  const [incomingAmountDraft, setIncomingAmountDraft] = useState<string>('')
  const [outgoingAmountDraft, setOutgoingAmountDraft] = useState<string>('')
  const [incomingAmountEnDraft, setIncomingAmountEnDraft] = useState<string>('')
  const [outgoingAmountEnDraft, setOutgoingAmountEnDraft] = useState<string>('')

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadData()
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
      console.error('Auth check error:', err)
      navigate({ to: '/admin/login' })
    }
  }

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [itemsResponse, settingsResponse] = await Promise.all([
        fetch('/api/admin/report-items', { credentials: 'include' }),
        fetch('/api/admin/report-settings', { credentials: 'include' }),
      ])

      if (!itemsResponse.ok || !settingsResponse.ok) {
        if (itemsResponse.status === 401 || settingsResponse.status === 401) {
          navigate({ to: '/admin/login' })
          return
        }
        throw new Error('Failed to load report data')
      }

      const itemsData = await itemsResponse.json()
      const settingsData = await settingsResponse.json()

      if (itemsData.success) {
        setItems(itemsData.items || [])
      }
      if (settingsData.success) {
        setSettings(settingsData.settings || null)
        setUpdatedDateDraft(settingsData.settings?.updated_date || '')
        setIncomingAmountDraft(settingsData.settings?.incoming_amount || '')
        setOutgoingAmountDraft(settingsData.settings?.outgoing_amount || '')
        setIncomingAmountEnDraft(settingsData.settings?.incoming_amount_en || '')
        setOutgoingAmountEnDraft(settingsData.settings?.outgoing_amount_en || '')
      }
    } catch (err) {
      console.error('Load report data error:', err)
      setError('Не вдалося завантажити дані звіту')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      period: '',
      amount: '',
      category: '',
      period_en: '',
      amount_en: '',
      category_en: '',
    })
  }

  const handleEdit = (item: ReportItem) => {
    setEditingItem(item)
    setFormData({
      period: item.period,
      amount: item.amount,
      category: item.category,
      period_en: item.period_en || '',
      amount_en: item.amount_en || '',
      category_en: item.category_en || '',
    })
  }

  const handleDelete = async (itemId: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цей рядок?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/report-items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete report item')
      }

      await loadData()
    } catch (err) {
      console.error('Delete report item error:', err)
      setError('Не вдалося видалити рядок')
    }
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const url = editingItem
        ? `/api/admin/report-items/${editingItem.id}`
        : '/api/admin/report-items'
      const method = editingItem ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save report item')
      }

      await loadData()
      resetForm()
    } catch (err) {
      console.error('Save report item error:', err)
      setError('Не вдалося зберегти рядок')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveDate = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/report-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          updated_date: updatedDateDraft || null,
          incoming_amount: incomingAmountDraft || null,
          outgoing_amount: outgoingAmountDraft || null,
          incoming_amount_en: incomingAmountEnDraft || null,
          outgoing_amount_en: outgoingAmountEnDraft || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update report settings')
      }

      await loadData()
    } catch (err) {
      console.error('Save report settings error:', err)
      setError('Не вдалося зберегти дату оновлення')
    } finally {
      setIsSaving(false)
    }
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
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Звіт — рядки таблиці</h1>
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
                onClick={() => navigate({ to: '/admin/services' })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Послуги
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Дата оновлення</h2>
              <p className="text-sm text-gray-500">Відображається у блоці “Оновлено”</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex gap-3">
              <input
                type="date"
                value={updatedDateDraft}
                onChange={(event) => setUpdatedDateDraft(event.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Вхідний залишок (UA)
                  </label>
                  <input
                    type="text"
                    value={incomingAmountDraft}
                    onChange={(event) => setIncomingAmountDraft(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="229 850, 00 ₴"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Вхідний залишок (EN)
                  </label>
                  <input
                    type="text"
                    value={incomingAmountEnDraft}
                    onChange={(event) => setIncomingAmountEnDraft(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="229 850.00 UAH"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Вихідний залишок (UA)
                  </label>
                  <input
                    type="text"
                    value={outgoingAmountDraft}
                    onChange={(event) => setOutgoingAmountDraft(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="160 036, 00 ₴"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Вихідний залишок (EN)
                  </label>
                  <input
                    type="text"
                    value={outgoingAmountEnDraft}
                    onChange={(event) => setOutgoingAmountEnDraft(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="160 036.00 UAH"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveDate}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-[#28694D] rounded-lg hover:bg-[#1f5a3f] disabled:opacity-50"
              >
                Зберегти
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingItem ? 'Редагування рядка' : 'Новий рядок'}
          </h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Період (UA)</label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(event) => setFormData({ ...formData, period: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Кошти UAH (UA)</label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(event) => setFormData({ ...formData, amount: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Стаття витрат (UA)</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Період (EN)</label>
                <input
                  type="text"
                  value={formData.period_en}
                  onChange={(event) => setFormData({ ...formData, period_en: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (EN)</label>
                <input
                  type="text"
                  value={formData.amount_en}
                  onChange={(event) => setFormData({ ...formData, amount_en: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expense category (EN)</label>
                <input
                  type="text"
                  value={formData.category_en}
                  onChange={(event) => setFormData({ ...formData, category_en: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  placeholder="Optional"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-end">
              {editingItem && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Скасувати
                </button>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-[#28694D] rounded-lg hover:bg-[#1f5a3f] disabled:opacity-50"
              >
                {editingItem ? 'Оновити' : 'Додати'}
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Поточні рядки</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.id} className="p-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-sm text-gray-500">{item.period}</div>
                  <div className="text-base font-medium text-gray-900">{item.amount}</div>
                  <div className="text-sm text-gray-700">{item.category}</div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Редагувати
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                Рядків немає. Додайте перший рядок.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
