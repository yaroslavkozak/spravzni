'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Modal from './Modal'
import ChatQuestionnaire from './ChatQuestionnaire'
import { useChatWindow } from '@/src/contexts/ChatWindowContext'
import { useI18n } from '@/src/contexts/I18nContext'

interface ChatWindowProps {
  isOpen: boolean
  onClose: () => void
}

type ResponseMethod = 'whatsapp' | 'phone' | 'email' | null

export default function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const { 
    messages, 
    sendMessage, 
    isConnected, 
    isLoading, 
    isConnecting, 
    sessionId,
    showQuestionnaire,
    queuePosition,
    submitQuestionnaire,
  } = useChatWindow()
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [responseMethod, setResponseMethod] = useState<ResponseMethod>(null)
  const [hoveredMethod, setHoveredMethod] = useState<ResponseMethod>(null)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<{ message?: string; phone?: string; email?: string; responseMethod?: string }>({})
  const { t, language } = useI18n()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const messageTextareaRef = useRef<HTMLTextAreaElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Scroll to bottom when chat opens
  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current?.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }, 100)
    }
  }, [isOpen])

  // Initialize phone with "+38 " when WhatsApp or Phone is selected
  useEffect(() => {
    if (responseMethod === 'phone' || responseMethod === 'whatsapp') {
      // Only set if phone doesn't already start with "+38 "
      if (!phone.startsWith('+380 ')) {
        setPhone('+380 ')
      }
      // Clear phone errors when switching to phone/whatsapp (will validate on blur)
      if (errors.phone) {
        setErrors({ ...errors, phone: undefined })
      }
    } else {
      // Clear phone when switching away from phone/whatsapp
      setPhone('')
      if (errors.phone) {
        setErrors({ ...errors, phone: undefined })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMethod])

  // Format phone number: +380 XX XXX XX XX (9 digits after +380)
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters except the leading +
    const digits = value.replace(/[^\d]/g, '')
    
    // Ensure we always start with +380
    if (!value.startsWith('+380')) {
      return '+380 '
    }
    
    // Extract digits after 380 and limit to 9 digits
    const afterPrefix = digits.slice(3, 12) // Remove "380" from digits and limit to 9 digits
    
    // Format: +380 XX XXX XX XX
    let formatted = '+380'
    if (afterPrefix.length > 0) {
      formatted += ' ' + afterPrefix.slice(0, 2)
    }
    if (afterPrefix.length > 2) {
      formatted += ' ' + afterPrefix.slice(2, 5)
    }
    if (afterPrefix.length > 5) {
      formatted += ' ' + afterPrefix.slice(5, 7)
    }
    if (afterPrefix.length > 7) {
      formatted += ' ' + afterPrefix.slice(7, 10)
    }
    
    return formatted
  }

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    let value = input.value
    
    // If user tries to delete the prefix, prevent it
    if (!value.startsWith('+380')) {
      setPhone('+380 ')
      if (phoneInputRef.current) {
        phoneInputRef.current.setSelectionRange(4, 4)
      }
      if (errors.phone) {
        setErrors({ ...errors, phone: undefined })
      }
      return
    }
    
    // Clear error while typing
    if (errors.phone) {
      setErrors({ ...errors, phone: undefined })
    }
    
    // Get selection info before formatting
    const selectionStart = input.selectionStart || 0
    const selectionEnd = input.selectionEnd || 0
    
    // Count digits before selection start (excluding the +38 prefix)
    const beforeSelection = value.substring(0, selectionStart)
    const digitsBeforeSelection = Math.max(0, beforeSelection.replace(/[^\d]/g, '').length - 2)
    
    // Format the phone number
    const formatted = formatPhoneNumber(value)
    setPhone(formatted)
    
    // Restore cursor position after formatting
    setTimeout(() => {
      if (phoneInputRef.current) {
        // Find position in formatted string that corresponds to the same number of digits
        let digitCount = 0
        let newPosition = 4 // Start after "+38 "
        
        for (let i = 4; i < formatted.length; i++) {
          if (/\d/.test(formatted[i])) {
            digitCount++
            if (digitCount > digitsBeforeSelection) {
              newPosition = i
              break
            }
            newPosition = i + 1
          } else {
            newPosition = i + 1
          }
        }
        
        // Ensure cursor is at least at position 4 (after "+38 ")
        newPosition = Math.max(4, Math.min(newPosition, formatted.length))
        phoneInputRef.current.setSelectionRange(newPosition, newPosition)
      }
    }, 0)
  }

  // Validate message field
  const validateMessage = (): string | undefined => {
    if (!message.trim()) {
      return t('chatWindow.error.messageRequired')
    }
    return undefined
  }

  // Validate phone field
  const validatePhone = (): string | undefined => {
    if (!phone.trim() || phone === '+380 ') {
      return t('chatWindow.error.phoneRequired')
    }
    // Extract digits after +380
    const digits = phone.replace(/\D/g, '')
    const digitsAfter380 = digits.slice(3) // Remove "380" prefix
    
    if (digitsAfter380.length !== 9) {
      return t('chatWindow.error.phoneInvalid')
    }
    return undefined
  }

  // Validate email field
  const validateEmail = (): string | undefined => {
    if (!email.trim()) {
      return t('chatWindow.error.emailRequired')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return t('chatWindow.error.emailInvalid')
    }
    return undefined
  }

  const validateForm = () => {
    const newErrors: { message?: string; phone?: string; email?: string; responseMethod?: string } = {}

    // Always validate message
    const messageError = validateMessage()
    if (messageError) {
      newErrors.message = messageError
    }

    if (!responseMethod) {
      newErrors.responseMethod = t('chatWindow.error.responseMethodRequired')
    }

    if (responseMethod === 'phone' || responseMethod === 'whatsapp') {
      const phoneError = validatePhone()
      if (phoneError) {
        newErrors.phone = phoneError
      }
    }

    if (responseMethod === 'email') {
      const emailError = validateEmail()
      if (emailError) {
        newErrors.email = emailError
      }
    }

    setErrors(newErrors)
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors }
  }

  // Handle message blur - validate when user leaves the field
  const handleMessageBlur = () => {
    const messageError = validateMessage()
    if (messageError) {
      setErrors({ ...errors, message: messageError })
    } else {
      setErrors({ ...errors, message: undefined })
    }
  }

  // Handle phone blur - validate when user leaves the field
  const handlePhoneBlur = () => {
    if (responseMethod === 'phone' || responseMethod === 'whatsapp') {
      const phoneError = validatePhone()
      if (phoneError) {
        setErrors({ ...errors, phone: phoneError })
      } else {
        setErrors({ ...errors, phone: undefined })
      }
    }
  }

  // Handle email blur - validate when user leaves the field
  const handleEmailBlur = () => {
    if (responseMethod === 'email') {
      const emailError = validateEmail()
      if (emailError) {
        setErrors({ ...errors, email: emailError })
      } else {
        setErrors({ ...errors, email: undefined })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSending) return

    // Validate form based on selected response method
    const validation = validateForm()
    if (!validation.isValid) {
      // Focus on the first field with an error (priority: message > phone > email)
      if (validation.errors.message && messageTextareaRef.current) {
        setTimeout(() => {
          messageTextareaRef.current?.focus()
          messageTextareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 0)
      } else if (validation.errors.phone && phoneInputRef.current) {
        setTimeout(() => {
          phoneInputRef.current?.focus()
          phoneInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 0)
      } else if (validation.errors.email && emailInputRef.current) {
        setTimeout(() => {
          emailInputRef.current?.focus()
          emailInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 0)
      }
      return
    }

    const messageText = message.trim()
    setIsSending(true)

    try {
      // Send to API endpoint
      const response = await fetch('/api/chat/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          responseMethod,
          phone: (responseMethod === 'phone' || responseMethod === 'whatsapp') ? phone.trim() : undefined,
          email: responseMethod === 'email' ? email.trim() : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || t('chatWindow.error.submit'))
      }

      // Show success popup
      setShowSuccess(true)
      
      // Reset form
      setMessage('')
      setPhone('')
      setEmail('')
      setResponseMethod(null)
      setErrors({})
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(error instanceof Error ? error.message : t('chatWindow.error.submitGeneric'))
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return t('chatWindow.time.justNow')
    if (minutes < 60) return t('chatWindow.time.minutesAgo', { count: minutes })
    if (minutes < 1440) return t('chatWindow.time.hoursAgo', { count: Math.floor(minutes / 60) })
    
    const locale = language === 'uk' ? 'uk-UA' : language === 'en' ? 'en-US' : 'uk-UA'
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('chatWindow.title')}
      description={t('chatWindow.description')}
      overlayClassName="bg-black/50 backdrop-blur-sm items-end justify-end p-4 sm:p-6"
      className="w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] bg-white shadow-2xl border border-gray-200 overflow-hidden relative mb-20 sm:mb-24 flex flex-col"
      closeOnOverlayClick={true}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors z-10"
        aria-label={t('chatWindow.closeChat')}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Questionnaire - only show if needed */}
      {showQuestionnaire && (
        <div className="flex-1 overflow-y-auto">
          <ChatQuestionnaire 
            onSubmit={submitQuestionnaire}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Main Chat Interface - show when not showing questionnaire */}
      {!showQuestionnaire && (
        <div className="flex-1 flex flex-col px-6 pb-6 pt-[50px]">
          {/* Greeting Message */}
          <div className="bg-gray-100 rounded-[16px] p-4 mb-4">
            <div className="flex items-start gap-3">
              {/* <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[#28694D] text-xl">
                
              </div> */}
              <div className="flex-1">
                <p className="text-[#404040] font-bold font-montserrat text-[16px] leading-[150%] tracking-[0.5%] mb-1">
                  {t('chatWindow.greetingTitle')}
                </p>
                <p className="text-[#404040] font-montserrat text-[16px] font-normal leading-[150%] tracking-[0.5%]">
                {t('chatWindow.greetingBody')}
                </p>
              </div>
            </div>
          </div>

          {/* Message Input Area */}
          <div className="mb-4">
            <div className="relative">
            <textarea
                ref={messageTextareaRef}
              value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  if (errors.message) {
                    setErrors({ ...errors, message: undefined })
                  }
                }}
                onBlur={handleMessageBlur}
              placeholder={t('chatWindow.placeholderMessage')}
              disabled={isSending}
              rows={4}
                className={`w-full px-4 py-3 pr-10 bg-white border rounded-[16px] focus:outline-none focus:ring-2 focus:border-transparent font-montserrat text-[16px] font-normal leading-[150%] tracking-[0.5%] text-[#404040] placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed resize-none ${
                  errors.message 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-[#28694D]'
                }`}
              />
              {errors.message && (
                <div className="absolute right-3 top-3 pointer-events-none">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {errors.message && (
              <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>
            )}
          </div>

          {/* Response Method Selection */}
          <div className="mb-4">
            <p className="text-[#404040] font-montserrat text-[16px] font-normal leading-[150%] tracking-[0.5%] mb-2">
              {t('chatWindow.responseLabel')}<span className="text-black">*</span>
            </p>
            <div className="flex gap-2 mb-3">
              {/* WhatsApp Button */}
              <button
                type="button"
                onClick={() => {
                  setResponseMethod(responseMethod === 'whatsapp' ? null : 'whatsapp')
                  if (errors.responseMethod) {
                    setErrors({ ...errors, responseMethod: undefined })
                  }
                }}
                onMouseEnter={() => setHoveredMethod('whatsapp')}
                onMouseLeave={() => setHoveredMethod(null)}
                className={`flex-1 h-12 flex items-center justify-center border rounded-lg transition-all ${
                  responseMethod === 'whatsapp'
                    ? 'border border-[#28694D]'
                    : 'border border-gray-300 hover:border-gray-400'
                }`}
              >
                <Image
                  src={
                    responseMethod === 'whatsapp'
                      ? '/images/contact/contact chanels states/whatapp-selected.svg'
                      : hoveredMethod === 'whatsapp'
                      ? '/images/contact/contact chanels states/whatsapp-hover.svg'
                      : '/images/contact/contact chanels states/whatsapp-normal.svg'
                  }
                  alt="WhatsApp"
                  width={28}
                  height={26}
                  className="w-7 h-6"
                />
              </button>

              {/* Phone Button */}
              <button
                type="button"
                onClick={() => {
                  setResponseMethod(responseMethod === 'phone' ? null : 'phone')
                  if (errors.responseMethod) {
                    setErrors({ ...errors, responseMethod: undefined })
                  }
                }}
                onMouseEnter={() => setHoveredMethod('phone')}
                onMouseLeave={() => setHoveredMethod(null)}
                className={`flex-1 h-12 flex items-center justify-center border rounded-lg transition-all ${
                  responseMethod === 'phone'
                    ? 'border border-[#28694D]'
                    : 'border border-gray-300 hover:border-gray-400'
                }`}
              >
                <Image
                  src={
                    responseMethod === 'phone'
                      ? '/images/contact/contact chanels states/phone-selected.svg'
                      : hoveredMethod === 'phone'
                      ? '/images/contact/contact chanels states/phone-hover.svg'
                      : '/images/contact/contact chanels states/phone-normal.svg'
                  }
                  alt="Phone"
                  width={28}
                  height={26}
                  className="w-7 h-6"
                />
              </button>

              {/* Email Button */}
              <button
                type="button"
                onClick={() => {
                  setResponseMethod(responseMethod === 'email' ? null : 'email')
                  if (errors.responseMethod) {
                    setErrors({ ...errors, responseMethod: undefined })
                  }
                }}
                onMouseEnter={() => setHoveredMethod('email')}
                onMouseLeave={() => setHoveredMethod(null)}
                className={`flex-1 h-12 flex items-center justify-center border rounded-lg transition-all ${
                  responseMethod === 'email'
                    ? 'border border-[#28694D]'
                    : 'border border-gray-300 hover:border-gray-400'
                }`}
              >
                <Image
                  src={
                    responseMethod === 'email'
                      ? '/images/contact/contact chanels states/mail-selected.svg'
                      : hoveredMethod === 'email'
                      ? '/images/contact/contact chanels states/mail-hover.svg'
                      : '/images/contact/contact chanels states/mail-normal.svg'
                  }
                  alt="Email"
                  width={28}
                  height={26}
                  className="w-7 h-6"
                />
              </button>
            </div>
            {errors.responseMethod && (
              <p className="mt-1 text-xs text-red-500">{errors.responseMethod}</p>
            )}

            {/* Phone Input - show when phone or whatsapp is selected */}
            {(responseMethod === 'phone' || responseMethod === 'whatsapp') && (
              <div className="mt-3">
                <div className="relative">
                <input
                    ref={phoneInputRef}
                  type="tel"
                  value={phone}
                    onChange={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                    onKeyDown={(e) => {
                      // Prevent deletion of "+380" prefix only (allow deleting the rest in one go)
                      if ((e.key === 'Backspace' || e.key === 'Delete') && phoneInputRef.current) {
                        const selectionStart = phoneInputRef.current.selectionStart || 0
                        const selectionEnd = phoneInputRef.current.selectionEnd ?? selectionStart
                        if (selectionStart <= 4 && selectionEnd <= 4) {
                          e.preventDefault()
                        }
                      }
                    }}
                    placeholder="+38 XX XXX XX XX"
                  disabled={isSending}
                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent font-montserrat text-[16px] font-normal leading-[150%] tracking-[0.5%] text-[#404040] placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.phone 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-[#28694D]'
                  }`}
                />
                  {errors.phone && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>
            )}

            {/* Email Input - show when email is selected */}
            {responseMethod === 'email' && (
              <div className="mt-3">
                <div className="relative">
                <input
                    ref={emailInputRef}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) {
                      setErrors({ ...errors, email: undefined })
                    }
                  }}
                    onBlur={handleEmailBlur}
                  placeholder="example@email.com"
                  disabled={isSending}
                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent font-montserrat text-[16px] font-normal leading-[150%] tracking-[0.5%] text-[#404040] placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-[#28694D]'
                  }`}
                />
                  {errors.email && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
            )}
          </div>

          {/* Send Button */}
          <form onSubmit={handleSubmit}>
            {/* Consent Text */}
            <p className="text-xs text-gray-600 mb-3 font-montserrat text-center">
              {t('form.consent.prefix')}{' '}
              <a 
                href="https://spravzhni.com.ua/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#28694D] hover:underline"
              >
                {t('form.consent.terms')}
              </a>
              {' '}{t('form.consent.and')}{' '}
              <a 
                href="https://spravzhni.com.ua/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#28694D] hover:underline"
              >
                {t('form.consent.privacy')}
              </a>
            </p>
            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-[#28694D] text-white rounded-[32px] py-3 px-6 font-montserrat text-[20px] font-normal leading-[150%] tracking-[0.5%] hover:bg-[#1f5239] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#28694D]"
            >
              {isSending ? t('chatWindow.sending') : t('chatWindow.send')}
            </button>
          </form>

          {/* Success Popup */}
          {showSuccess && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setShowSuccess(false)
                onClose()
              }}
            >
              <div 
                className="bg-white px-4 sm:px-5 md:px-6 mx-4 shadow-2xl flex flex-col items-center relative"
                style={{
                  width: 'clamp(280px, 33.33vw, 480px)',
                  aspectRatio: '480 / 256',
                  maxWidth: '480px',
                  maxHeight: '256px',
                  paddingTop: '44px',
                  paddingBottom: '64px',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    setShowSuccess(false)
                    onClose()
                  }}
                  className="absolute w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors z-10"
                  style={{
                    top: 'clamp(14px, 1.39vw, 20px)',
                    right: 'clamp(22px, 2.22vw, 32px)',
                  }}
                  aria-label={t('chatWindow.closePopup')}
                >
                  <svg className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex items-center justify-center mb-3 sm:mb-3.5 md:mb-4">
                  <Image
                    src="/check-one.svg"
                    alt="Success"
                    width={80}
                    height={80}
                    className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px]"
                  />
                </div>
                <h3 className="text-base text-[#111111] font-montserrat font-bold text-center mb-1.5 sm:mb-2">
                {t('chatWindow.successTitle')}
                </h3>
                <p className="text-base text-[#111111] font-normal font-montserrat text-center px-2">
                {t('chatWindow.successBody')}
                </p>
              </div>
            </div>
          )}

          {/* Messages Container - show if there are messages */}
          {messages.length > 0 && (
            <div
              ref={messagesContainerRef}
              className="mt-4 flex-1 overflow-y-auto space-y-4 min-h-0 border-t border-gray-200 pt-4"
              style={{ maxHeight: '300px' }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.senderType === 'user'
                        ? 'bg-[#28694D] text-white'
                        : 'bg-gray-100 text-[#404040]'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderType === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
