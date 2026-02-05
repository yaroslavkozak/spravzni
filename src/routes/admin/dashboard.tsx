import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import type { FormSubmission, FormType, FormStatus } from '@/src/lib/database/form-submissions'

export const Route = createFileRoute('/admin/dashboard')({
  beforeLoad: async ({ context }) => {
    // Check authentication on server side
    // This will be handled by the component's useEffect for now
    // In a production app, you might want to add server-side auth check here
  },
  component: AdminDashboard,
})

interface SubmissionWithParsedData extends Omit<FormSubmission, 'form_data'> {
  form_data: any
}

function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ email: string; name: string | null; role: string } | null>(null)
  const [submissions, setSubmissions] = useState<SubmissionWithParsedData[]>([])
  const [counts, setCounts] = useState<Record<FormStatus, number>>({
    new: 0,
    viewed: 0,
    contacted: 0,
    resolved: 0,
    archived: 0,
  })
  const [selectedFormType, setSelectedFormType] = useState<'all' | 'contact' | 'chat'>('all')
  const [selectedStatus, setSelectedStatus] = useState<FormStatus | 'all'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedSubmissions, setExpandedSubmissions] = useState<Set<number>>(new Set())

  // Interest labels mapping
  const interestLabels: Record<string, string> = {
    all: 'Усі послуги',
    active: 'Активний відпочинок та тімбілдинг',
    cabin: 'Хатинка під соснами',
    spa: 'Безбар\'єрний СПА',
    program: 'Групова програма «Шлях сили»',
    events: 'Події під ключ',
  }

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadSubmissions()
    }
  }, [selectedFormType, selectedStatus, user])

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

  const loadSubmissions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      
      // For 'chat' type, we need to fetch all and filter client-side to include both chat and questionnaire
      // For 'contact', filter by contact type
      // For 'all', don't add form_type filter
      if (selectedFormType === 'contact') {
        params.append('form_type', 'contact')
      }
      // For 'chat' and 'all', don't add form_type to get all types, then filter client-side
      
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus)
      }

      const response = await fetch(`/api/admin/submissions?${params.toString()}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          navigate({ to: '/admin/login' })
          return
        }
        throw new Error('Failed to load submissions')
      }

      const data = await response.json()
      if (data.success) {
        // Filter submissions based on selected form type
        let filteredSubmissions = data.submissions
        if (selectedFormType === 'chat') {
          // Include both chat and questionnaire for "from chat"
          filteredSubmissions = data.submissions.filter(
            (sub: SubmissionWithParsedData) => sub.form_type === 'chat' || sub.form_type === 'questionnaire'
          )
        } else if (selectedFormType === 'contact') {
          filteredSubmissions = data.submissions.filter(
            (sub: SubmissionWithParsedData) => sub.form_type === 'contact'
          )
        }
        // If 'all', use all submissions as-is
        
        setSubmissions(filteredSubmissions)
        setCounts(data.counts)
      }
    } catch (err) {
      console.error('Load submissions error:', err)
      setError('Не вдалося завантажити форми')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (submissionId: number, newStatus: FormStatus) => {
    setUpdatingStatus(submissionId)
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      // Update local state
      setSubmissions(prev =>
        prev.map(sub =>
          sub.id === submissionId ? { ...sub, status: newStatus } : sub
        )
      )

      // Reload counts
      await loadSubmissions()
    } catch (err) {
      console.error('Update status error:', err)
      alert('Не вдалося оновити статус. Спробуйте ще раз.')
    } finally {
      setUpdatingStatus(null)
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

  const toggleSubmission = (submissionId: number) => {
    setExpandedSubmissions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(submissionId)) {
        newSet.delete(submissionId)
      } else {
        newSet.add(submissionId)
      }
      return newSet
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('uk-UA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadgeColor = (status: FormStatus) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      viewed: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-purple-100 text-purple-800',
      resolved: 'bg-[#28694D]/10 text-[#28694D]',
      archived: 'bg-gray-100 text-gray-800',
    }
    return colors[status]
  }

  const getStatusLabel = (status: FormStatus) => {
    const labels = {
      new: 'Нове',
      viewed: 'Переглянуто',
      contacted: 'Сконтактувались',
      resolved: 'Вирішено',
      archived: 'Архівовано',
    }
    return labels[status]
  }

  const getSubmissionTitle = (submission: SubmissionWithParsedData) => {
    const name = submission.name || ''
    const phone = submission.phone || ''
    const email = submission.email || ''
    
    if (name && phone) {
      return `${name} - ${phone}`
    } else if (name && email && !phone) {
      return `${name} - ${email}`
    } else if (name) {
      return name
    } else if (phone) {
      return phone
    } else if (email) {
      return email
    }
    return 'Без імені'
  }

  const renderFormDetails = (submission: SubmissionWithParsedData) => {
    const data = submission.form_data
    const details: React.ReactElement[] = []

    // Contact form details
    if (submission.form_type === 'contact') {
      if (data.contactPreference) {
        const preferenceLabels: Record<string, string> = {
          phone: 'Телефон',
          whatsapp: 'WhatsApp',
          email: 'Email',
        }
        details.push(
          <div key="preference" className="mb-2">
            <span className="text-xs font-medium text-gray-500">Спосіб зв'язку: </span>
            <span className="text-sm text-gray-900">{preferenceLabels[data.contactPreference] || data.contactPreference}</span>
          </div>
        )
      }
      if (data.selectedInterests && data.selectedInterests.length > 0) {
        const interestNames = data.selectedInterests.map((id: string) => interestLabels[id] || id)
        details.push(
          <div key="interests" className="mb-2">
            <span className="text-xs font-medium text-gray-500">Інтереси: </span>
            <span className="text-sm text-gray-900">{interestNames.join(', ')}</span>
          </div>
        )
      }
      if (data.comment) {
        details.push(
          <div key="comment" className="mb-2">
            <span className="text-xs font-medium text-gray-500">Коментар: </span>
            <span className="text-sm text-gray-900">{data.comment}</span>
          </div>
        )
      }
      if (data.wantsPriceList !== undefined) {
        details.push(
          <div key="priceList" className="mb-2">
            <span className="text-xs font-medium text-gray-500">Прайс-лист: </span>
            <span className="text-sm text-gray-900">{data.wantsPriceList ? 'Так' : 'Ні'}</span>
          </div>
        )
      }
    }

    // Chat form details
    if (submission.form_type === 'chat') {
      if (data.message) {
        details.push(
          <div key="message" className="mb-2">
            <span className="text-xs font-medium text-gray-500">Повідомлення: </span>
            <span className="text-sm text-gray-900">{data.message}</span>
          </div>
        )
      }
      if (data.responseMethod) {
        const methodLabels: Record<string, string> = {
          phone: 'Телефон',
          whatsapp: 'WhatsApp',
          email: 'Email',
        }
        details.push(
          <div key="responseMethod" className="mb-2">
            <span className="text-xs font-medium text-gray-500">Спосіб відповіді: </span>
            <span className="text-sm text-gray-900">{methodLabels[data.responseMethod] || data.responseMethod}</span>
          </div>
        )
      }
    }

    // Questionnaire details
    if (submission.form_type === 'questionnaire') {
      if (data.userIdentifier) {
        details.push(
          <div key="userIdentifier" className="mb-2">
            <span className="text-xs font-medium text-gray-500">ID користувача: </span>
            <span className="text-sm text-gray-900">{data.userIdentifier}</span>
          </div>
        )
      }
    }

    return details.length > 0 ? <div className="space-y-1">{details}</div> : null
  }

  const formTypes: Array<{ value: 'all' | 'contact' | 'chat'; label: string }> = [
    { value: 'all', label: 'Всі' },
    { value: 'contact', label: 'З форми' },
    { value: 'chat', label: 'З чату' },
  ]

  const statusOptions: Array<{ value: FormStatus; label: string }> = [
    { value: 'new', label: 'Нове' },
    { value: 'viewed', label: 'Переглянуто' },
    { value: 'contacted', label: 'Сконтактувались' },
    { value: 'resolved', label: 'Вирішено' },
    { value: 'archived', label: 'Архівовано' },
  ]

  return (
    <div className="min-h-screen bg-[#FBFBF9]">
      {/* Header - Mobile Responsive with Burger Menu */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-[#28694D] truncate">
                  Адмін панель
                </h1>
                {user && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
                    {user.name || user.email}
                  </p>
                )}
              </div>
              {/* Mobile Burger Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden ml-3 p-2 text-gray-600 hover:text-gray-900"
                aria-label="Меню"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => navigate({ to: '/admin/services' })}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Послуги
              </button>
              <button
                onClick={() => navigate({ to: '/admin/report' })}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Звіт
              </button>
              <button
                onClick={() => navigate({ to: '/admin/translations' })}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Переклади
              </button>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Вийти
              </button>
            </div>
          </div>
          
          {/* Mobile Menu - Form Types and Logout */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-col gap-2">
                {formTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setSelectedFormType(type.value)
                      setSelectedStatus('all')
                      setMobileMenuOpen(false)
                    }}
                    className={`
                      px-4 py-2 text-sm font-medium text-left rounded-lg transition-colors
                      ${
                        selectedFormType === type.value
                          ? 'bg-[#28694D] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {type.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    navigate({ to: '/admin/services' })
                    setMobileMenuOpen(false)
                  }}
                  className="px-4 py-2 text-sm font-medium text-left rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Послуги
                </button>
                <button
                  onClick={() => {
                    navigate({ to: '/admin/report' })
                    setMobileMenuOpen(false)
                  }}
                  className="px-4 py-2 text-sm font-medium text-left rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Звіт
                </button>
                <button
                  onClick={() => {
                    navigate({ to: '/admin/translations' })
                    setMobileMenuOpen(false)
                  }}
                  className="px-4 py-2 text-sm font-medium text-left rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Переклади
                </button>
                {/* Logout Button in Mobile Menu */}
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="px-4 py-2 text-sm font-medium text-left rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors mt-2"
                >
                  Вийти
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats Cards - Clickable */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
          {Object.entries(counts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => {
                setSelectedStatus(status === selectedStatus && selectedStatus !== 'all' ? 'all' : status as FormStatus)
              }}
              className={`
                bg-white rounded-lg shadow p-3 sm:p-4 text-left transition-all hover:shadow-md
                ${selectedStatus === status ? 'ring-2 ring-[#28694D]' : ''}
              `}
            >
              <div className="text-xs sm:text-sm font-medium text-gray-600 capitalize">
                {getStatusLabel(status as FormStatus)}
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#28694D] mt-1">
                {count}
              </div>
            </button>
          ))}
        </div>

        {/* Form Type Tabs - Desktop Only */}
        <div className="hidden sm:block bg-white rounded-lg shadow mb-4 sm:mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto -mb-px" aria-label="Tabs">
              {formTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setSelectedFormType(type.value)
                    setSelectedStatus('all')
                  }}
                  className={`
                    flex-1 sm:flex-none min-w-0 sm:min-w-[120px] px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-center border-b-2 transition-colors whitespace-nowrap
                    ${
                      selectedFormType === type.value
                        ? 'border-[#28694D] text-[#28694D]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {type.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Status Filter */}
        {selectedStatus !== 'all' && (
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                Фільтр: {getStatusLabel(selectedStatus)}
              </span>
              <button
                onClick={() => setSelectedStatus('all')}
                className="text-xs sm:text-sm text-[#28694D] hover:underline"
              >
                Очистити
              </button>
            </div>
          </div>
        )}

        {/* Submissions List - Collapsible */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Форми ({submissions.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Завантаження...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : submissions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Форми не знайдено</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {submissions.map((submission) => {
                const isExpanded = expandedSubmissions.has(submission.id)
                return (
                  <div
                    key={submission.id}
                    className="p-3 sm:p-4 lg:p-6 hover:bg-gray-50 transition-colors"
                  >
                    {/* Collapsed View - Always Visible */}
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSubmission(submission.id)}
                    >
                      <div className="flex-1 min-w-0 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                            {getSubmissionTitle(submission)}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getStatusBadgeColor(
                            submission.status
                          )}`}
                        >
                          {getStatusLabel(submission.status)}
                        </span>
                      </div>
                      {/* Expand/Collapse Icon */}
                      <div className="flex-shrink-0 ml-2">
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded View - Only when clicked */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className="text-xs sm:text-sm text-gray-600">
                            {formatDate(submission.created_at)}
                          </div>
                          {/* Status Selector */}
                          <div className="flex-shrink-0">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Змінити статус:
                            </label>
                            <select
                              value={submission.status}
                              onChange={(e) =>
                                handleUpdateStatus(submission.id, e.target.value as FormStatus)
                              }
                              disabled={updatingStatus === submission.id}
                              className="w-full sm:w-auto min-w-[140px] px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28694D] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                            >
                              {statusOptions.map((status) => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              ))}
                            </select>
                            {updatingStatus === submission.id && (
                              <div className="mt-1 text-xs text-gray-500">Оновлення...</div>
                            )}
                          </div>
                        </div>

                        {/* Contact Info - Mobile Responsive Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
                          {submission.name && (
                            <div>
                              <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                                Ім'я
                              </div>
                              <div className="text-sm text-gray-900 break-words">
                                {submission.name}
                              </div>
                            </div>
                          )}
                          {submission.email && (
                            <div>
                              <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                                Email
                              </div>
                              <div className="text-sm text-gray-900 break-all">
                                <a
                                  href={`mailto:${submission.email}`}
                                  className="text-[#28694D] hover:underline"
                                >
                                  {submission.email}
                                </a>
                              </div>
                            </div>
                          )}
                          {submission.phone && (
                            <div>
                              <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                                Телефон
                              </div>
                              <div className="text-sm text-gray-900 break-words">
                                <a
                                  href={`tel:${submission.phone}`}
                                  className="text-[#28694D] hover:underline"
                                >
                                  {submission.phone}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Form Details - Readable Format */}
                        {renderFormDetails(submission) && (
                          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                            {renderFormDetails(submission)}
                          </div>
                        )}

                        {/* Metadata */}
                        {submission.ip_address && (
                          <div className="mt-2 text-xs text-gray-500">
                            IP: {submission.ip_address}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
