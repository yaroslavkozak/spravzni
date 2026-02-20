import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import AdminShell from '@/src/components/admin/AdminShell'

export const Route = createFileRoute('/admin/report')({
  component: AdminReport,
})

interface ReportItem {
  id: number
  period: string
  amount: string
  category: string
  created_at: string
  updated_at: string
}

function AdminReport() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ email: string; name: string | null; role: string } | null>(null)
  const [items, setItems] = useState<ReportItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<ReportItem | null>(null)
  const [formData, setFormData] = useState({
    period: '',
    amount: '',
    category: '',
  })
  const [updatedDateDraft, setUpdatedDateDraft] = useState<string>('')
  const [incomingAmountDraft, setIncomingAmountDraft] = useState<string>('')
  const [outgoingAmountDraft, setOutgoingAmountDraft] = useState<string>('')

  useEffect(() => {
    void checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      void loadData()
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
        setUpdatedDateDraft(settingsData.settings?.updated_date || '')
        setIncomingAmountDraft(settingsData.settings?.incoming_amount || '')
        setOutgoingAmountDraft(settingsData.settings?.outgoing_amount || '')
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
    })
  }

  const handleEdit = (item: ReportItem) => {
    setEditingItem(item)
    setFormData({
      period: item.period,
      amount: item.amount,
      category: item.category,
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

  const handleSaveSettings = async () => {
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
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to update report settings')
      }
      await loadData()
    } catch (err) {
      console.error('Save report settings error:', err)
      setError('Не вдалося зберегти налаштування звіту')
    } finally {
      setIsSaving(false)
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
      title="Звіт — рядки таблиці"
      subtitle="Додавайте, редагуйте та видаляйте рядки. Українські значення автоматично синхронізуються в переклади."
      userEmail={user?.email}
      onLogout={handleLogout}
    >
      <main className="mx-auto max-w-6xl space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Налаштування блоку</h2>
              <p className="text-sm text-gray-500">
                Вхідний/вихідний залишок та дата. Зберігаються українською, переклади редагуються у розділі Переклади.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Дата оновлення</label>
                <input
                  type="date"
                  value={updatedDateDraft}
                  onChange={(event) => setUpdatedDateDraft(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Вхідний залишок</label>
                <input
                  type="text"
                  value={incomingAmountDraft}
                  onChange={(event) => setIncomingAmountDraft(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="229 850, 00 ₴"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Вихідний залишок</label>
                <input
                  type="text"
                  value={outgoingAmountDraft}
                  onChange={(event) => setOutgoingAmountDraft(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="160 036, 00 ₴"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => void handleSaveSettings()}
                disabled={isSaving}
                className="rounded-lg bg-[#28694D] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f5a3f] disabled:opacity-50"
              >
                Зберегти налаштування
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {editingItem ? 'Редагування рядка' : 'Новий рядок'}
          </h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Період</label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(event) => setFormData({ ...formData, period: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Кошти UAH</label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(event) => setFormData({ ...formData, amount: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Стаття витрат</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  required
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              {editingItem && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Скасувати
                </button>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-[#28694D] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f5a3f] disabled:opacity-50"
              >
                {editingItem ? 'Оновити рядок' : 'Додати рядок'}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">Поточні рядки ({items.length})</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
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
                    onClick={() => void handleDelete(item.id)}
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
    </AdminShell>
  )
}
