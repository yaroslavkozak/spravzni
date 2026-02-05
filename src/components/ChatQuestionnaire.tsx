'use client'

import { useState } from 'react'
import { useI18n } from '@/src/contexts/I18nContext'

interface ChatQuestionnaireProps {
  onSubmit: (data: { name: string; email: string; phone: string }) => Promise<void>
  isLoading?: boolean
}

export default function ChatQuestionnaire({ onSubmit, isLoading = false }: ChatQuestionnaireProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({})
  const { t } = useI18n()

  const validate = () => {
    const newErrors: { name?: string; email?: string; phone?: string } = {}

    if (!name.trim()) {
      newErrors.name = t('chatQuestionnaire.error.nameRequired')
    }

    if (!email.trim()) {
      newErrors.email = t('chatQuestionnaire.error.emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('chatQuestionnaire.error.emailInvalid')
    }

    if (!phone.trim()) {
      newErrors.phone = t('chatQuestionnaire.error.phoneRequired')
    } else if (!/^[\d\s\-\+\(\)]+$/.test(phone)) {
      newErrors.phone = t('chatQuestionnaire.error.phoneInvalid')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    })
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-[#404040] font-bold font-montserrat text-[16px] leading-[150%] tracking-[0.5%] mb-2">
          {t('chatQuestionnaire.title')}
        </h3>
        <p className="text-[#666] font-montserrat text-[16px] font-normal leading-[150%] tracking-[0.5%]">
          {t('chatQuestionnaire.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label htmlFor="chat-name" className="block font-montserrat text-[16px] font-normal leading-[150%] tracking-[0.5%] text-[#404040] mb-2">
            {t('chatQuestionnaire.field.name')} <span className="text-red-500">*</span>
          </label>
          <input
            id="chat-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#28694D] focus:border-transparent font-montserrat text-[16px] font-normal leading-[150%] tracking-[0.5%] text-[#404040] placeholder:text-gray-400 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder={t('chatQuestionnaire.placeholder.name')}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="chat-email" className="block font-montserrat text-[16px] font-normal leading-[150%] tracking-[0.5%] text-[#404040] mb-2">
            {t('chatQuestionnaire.field.email')} <span className="text-red-500">*</span>
          </label>
          <input
            id="chat-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#28694D] focus:border-transparent font-montserrat text-[16px] font-normal leading-[150%] tracking-[0.5%] text-[#404040] placeholder:text-gray-400 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder={t('chatQuestionnaire.placeholder.email')}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Phone Input */}
        <div>
          <label htmlFor="chat-phone" className="block font-montserrat text-[16px] font-normal leading-[150%] tracking-[0.5%] text-[#404040] mb-2">
            {t('chatQuestionnaire.field.phone')} <span className="text-red-500">*</span>
          </label>
          <input
            id="chat-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#28694D] focus:border-transparent font-montserrat text-[16px] font-normal leading-[150%] tracking-[0.5%] text-[#404040] placeholder:text-gray-400 ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder={t('chatQuestionnaire.placeholder.phone')}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Submit Button */}
        <p className="text-xs text-gray-500 font-montserrat leading-[150%]">
          {t('form.consent.prefix')}{' '}
          <a
            href="https://spravzhni.com.ua/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#28694D] transition-colors"
          >
            {t('form.consent.terms')}
          </a>{' '}
          {t('form.consent.and')}{' '}
          <a
            href="https://spravzhni.com.ua/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#28694D] transition-colors"
          >
            {t('form.consent.privacy')}
          </a>
          .
        </p>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#28694D] text-white rounded-[32px] py-3 px-6 font-montserrat text-[20px] font-normal leading-[150%] tracking-[0.5%] hover:bg-[#1f5239] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#28694D]"
        >
          {isLoading ? t('chatQuestionnaire.sending') : t('chatQuestionnaire.submit')}
        </button>
      </form>
    </div>
  )
}
