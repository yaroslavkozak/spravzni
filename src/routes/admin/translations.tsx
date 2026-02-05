import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import type { SupportedLanguage } from '@/src/lib/i18n'
import { translationsByLanguage, type TranslationKey } from '@/src/i18n/translations'

export const Route = createFileRoute('/admin/translations')({
  component: AdminTranslations,
})

function AdminTranslations() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ email: string; name: string | null; role: string } | null>(null)
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en')
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set())
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({})

  const baseUk = translationsByLanguage.uk || {}
  const baseSelected = translationsByLanguage[selectedLanguage] || {}

  const allKeys = useMemo(() => {
    const keys = Object.keys(baseUk) as TranslationKey[]
    return keys.sort((a, b) => a.localeCompare(b))
  }, [baseUk])

  const filteredKeys = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return allKeys
    }
    return allKeys.filter((key) => {
      const ukValue = String((baseUk as Record<TranslationKey, string | undefined>)[key] || '').toLowerCase()
      const selectedValue = String((baseSelected as Record<TranslationKey, string | undefined>)[key] || '').toLowerCase()
      const overrideValue = String(overrides[key] || '').toLowerCase()
      return (
        key.toLowerCase().includes(query) ||
        ukValue.includes(query) ||
        selectedValue.includes(query) ||
        overrideValue.includes(query)
      )
    })
  }, [allKeys, baseUk, baseSelected, overrides, search])

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadOverrides()
    }
  }, [user, selectedLanguage])

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

  const loadOverrides = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/translations?lang=${selectedLanguage}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          navigate({ to: '/admin/login' })
          return
        }
        throw new Error('Failed to load translations')
      }

      const data = await response.json()
      if (data.success && data.translations) {
        setOverrides(data.translations)
      }
    } catch (err) {
      console.error('Load translations error:', err)
      setError('Не вдалося завантажити переклади')
    } finally {
      setIsLoading(false)
    }
  }

  const updateDraft = (key: TranslationKey, value: string) => {
    setDrafts((prev) => ({ ...prev, [key]: value }))
  }

  const getCurrentValue = (key: TranslationKey) => {
    if (drafts[key] !== undefined) {
      return drafts[key]
    }
    if (overrides[key] !== undefined) {
      return overrides[key]
    }
    return (baseSelected as Record<TranslationKey, string | undefined>)[key] || ''
  }

  const handleSave = async (key: TranslationKey) => {
    const value = getCurrentValue(key)
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
        throw new Error('Failed to save translation')
      }

      setOverrides((prev) => ({ ...prev, [key]: value }))
    } catch (err) {
      console.error('Save translation error:', err)
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

  const handleReset = async (key: TranslationKey) => {
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
        throw new Error('Failed to delete translation')
      }

      setOverrides((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
      setDrafts((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    } catch (err) {
      console.error('Reset translation error:', err)
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
      console.error('Logout error:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Переклади ({selectedLanguage.toUpperCase()})
            </h1>
            <p className="text-sm text-gray-500">
              Тут можна редагувати переклади поверх значень із файлів
            </p>
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
                  setDrafts({})
                  setOverrides({})
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              >
                <option value="en">English (EN)</option>
                <option value="uk">Українська (UK)</option>
                <option value="pl">Polski (PL)</option>
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
              const ukValue = (baseUk as Record<TranslationKey, string | undefined>)[key] || ''
              const selectedValue = (baseSelected as Record<TranslationKey, string | undefined>)[key] || ''
              const overrideValue = overrides[key]
              const isSaving = savingKeys.has(key)
              const errorMessage = saveErrors[key]
              const currentValue = getCurrentValue(key)

              return (
                <div key={key} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3 lg:max-w-[48%]">
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {key}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-400">UA (з файлу)</div>
                        <div className="text-sm text-gray-800">{ukValue}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-400">
                          {selectedLanguage.toUpperCase()} (з файлу)
                        </div>
                        <div className="text-sm text-gray-800">{selectedValue}</div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="text-xs font-semibold text-gray-400">
                        {selectedLanguage.toUpperCase()} (override)
                      </div>
                      <textarea
                        value={currentValue}
                        onChange={(event) => updateDraft(key, event.target.value)}
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
                          disabled={isSaving || !overrideValue}
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Скинути override
                        </button>
                        {overrideValue && (
                          <span className="text-xs text-[#28694D]">Override активний</span>
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
    </div>
  )
}
