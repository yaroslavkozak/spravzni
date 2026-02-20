import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import type { SupportedLanguage } from '@/src/lib/i18n'
import AdminShell from '@/src/components/admin/AdminShell'

export const Route = createFileRoute('/admin/translations')({
  component: AdminTranslations,
})

function AdminTranslations() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ email: string; name: string | null; role: string } | null>(null)
  const [entries, setEntries] = useState<Array<{ key: string; uk: string; en: string; pl: string }>>([])
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('uk')
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set())
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({})
  const languageToField: Record<SupportedLanguage, 'uk' | 'en' | 'pl'> = {
    uk: 'uk',
    en: 'en',
    pl: 'pl',
  }

  const allKeys = useMemo(() => {
    return entries.map((entry) => entry.key).sort((a, b) => a.localeCompare(b))
  }, [entries])

  const filteredKeys = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return allKeys
    }
    return allKeys.filter((key) => {
      const entry = entries.find((item) => item.key === key)
      const ukValue = String(entry?.uk || '').toLowerCase()
      const selectedValue = String(entry?.[languageToField[selectedLanguage]] || '').toLowerCase()
      const draftValue = String(drafts[`${key}:${selectedLanguage}`] || '').toLowerCase()
      return (
        key.toLowerCase().includes(query) ||
        ukValue.includes(query) ||
        selectedValue.includes(query) ||
        draftValue.includes(query)
      )
    })
  }, [allKeys, drafts, entries, languageToField, search, selectedLanguage])

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadEntries()
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

  const loadEntries = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/translations', {
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          navigate({ to: '/admin/login' })
          return
        }
        throw new Error('Не вдалося завантажити переклади з бази даних')
      }

      const data = await response.json()
      if (data.success && Array.isArray(data.entries)) {
        setEntries(data.entries)
      }
    } catch (err) {
      console.error('Помилка завантаження перекладів:', err)
      setError('Не вдалося завантажити переклади')
    } finally {
      setIsLoading(false)
    }
  }

  const updateDraft = (key: string, language: SupportedLanguage, value: string) => {
    setDrafts((prev) => ({ ...prev, [`${key}:${language}`]: value }))
  }

  const getCurrentValue = (key: string, language: SupportedLanguage) => {
    const draftKey = `${key}:${language}`
    const languageField = languageToField[language]
    if (drafts[draftKey] !== undefined) {
      return drafts[draftKey]
    }
    const entry = entries.find((item) => item.key === key)
    return entry?.[languageField] || ''
  }

  const handleSave = async (key: string) => {
    const value = getCurrentValue(key, selectedLanguage)
    setSavingKeys((prev) => new Set(prev).add(key))
    setSaveErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })

    try {
      const response = await fetch('/api/admin/translations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          key,
          language: selectedLanguage,
          value,
        }),
      })

      if (!response.ok) {
        throw new Error('Не вдалося зберегти переклад')
      }

      const languageField = languageToField[selectedLanguage]
      setEntries((prev) =>
        prev.map((entry) =>
          entry.key === key
            ? {
              ...entry,
              [languageField]: value,
            }
            : entry
        )
      )
    } catch (err) {
      console.error('Помилка збереження перекладу:', err)
      setSaveErrors((prev) => ({
        ...prev,
        [key]: 'Не вдалося зберегти переклад',
      }))
    } finally {
      setSavingKeys((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }

  const handleReset = async (key: string) => {
    setSavingKeys((prev) => new Set(prev).add(key))
    setSaveErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })

    try {
      const params = new URLSearchParams({ lang: selectedLanguage, key })
      const response = await fetch(`/api/admin/translations?${params.toString()}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Не вдалося видалити переклад')
      }

      const languageField = languageToField[selectedLanguage]
      setEntries((prev) =>
        prev.map((entry) =>
          entry.key === key
            ? {
              ...entry,
              [languageField]: '',
            }
            : entry
        )
      )
      setDrafts((prev) => {
        const next = { ...prev }
        delete next[`${key}:${selectedLanguage}`]
        return next
      })
    } catch (err) {
      console.error('Помилка скидання перекладу:', err)
      setSaveErrors((prev) => ({
        ...prev,
        [key]: 'Не вдалося скинути переклад',
      }))
    } finally {
      setSavingKeys((prev) => {
        const next = new Set(prev)
        next.delete(key)
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

  return (
    <AdminShell
      title={`Переклади (${selectedLanguage.toUpperCase()})`}
      subtitle="Редагування перекладів із таблиці `translations`"
      userEmail={user?.email}
      onLogout={handleLogout}
    >
      <div className="mx-auto max-w-6xl space-y-6">

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-500">
              Ключів: {filteredKeys.length} / {allKeys.length}
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <select
                value={selectedLanguage}
                onChange={(event) => {
                  setSelectedLanguage(event.target.value as SupportedLanguage)
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              >
                <option value="en">Англійська (EN)</option>
                <option value="uk">Українська (UK)</option>
                <option value="pl">Польська (PL)</option>
              </select>
              <div className="w-full sm:w-80">
              <input
                type="text"
                placeholder="Пошук по ключу або тексту"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              />
            </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-lg bg-white p-6 text-sm text-gray-500 shadow-sm">
            Завантаження перекладів...
          </div>
        ) : (
          <div className="space-y-4">
            {filteredKeys.map((key) => {
              const entry = entries.find((item) => item.key === key)
              const ukValue = entry?.uk || ''
              const selectedField = languageToField[selectedLanguage]
              const selectedValue = entry?.[selectedField] || ''
              const isSaving = savingKeys.has(key)
              const errorMessage = saveErrors[key]
              const currentValue = getCurrentValue(key, selectedLanguage)

              return (
                <div key={key} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3 lg:max-w-[48%]">
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {key}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-400">UK (з БД)</div>
                        <div className="text-sm text-gray-800">{ukValue}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-400">
                          {selectedLanguage.toUpperCase()} (з БД)
                        </div>
                        <div className="text-sm text-gray-800">{selectedValue}</div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="text-xs font-semibold text-gray-400">
                        {selectedLanguage.toUpperCase()} (внесене значення)
                      </div>
                      <textarea
                        value={currentValue}
                        onChange={(event) => updateDraft(key, selectedLanguage, event.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-gray-500 focus:outline-none"
                      />
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleSave(key)}
                          disabled={isSaving}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSaving ? 'Збереження...' : 'Зберегти'}
                        </button>
                        <button
                          onClick={() => handleReset(key)}
                          disabled={isSaving || !selectedValue}
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Очистити
                        </button>
                        {selectedValue && (
                          <span className="text-xs text-[#28694D]">Значення збережене</span>
                        )}
                      </div>
                      {errorMessage && (
                        <div className="text-xs text-red-600">{errorMessage}</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
