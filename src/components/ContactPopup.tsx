'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Modal from './Modal'
import { useI18n } from '@/src/contexts/I18nContext'

interface ContactPopupProps {
  isOpen: boolean
  onClose: () => void
  preselectPriceList?: boolean
  preselectedServiceId?: number
}

export default function ContactPopup({ isOpen, onClose, preselectPriceList = false, preselectedServiceId }: ContactPopupProps) {
  const modalContentRef = useRef<HTMLDivElement>(null)
  const [modalStyle, setModalStyle] = useState<React.CSSProperties>({})
  const [contactPreference, setContactPreference] = useState<string | null>(null)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [emailValue, setEmailValue] = useState<string>('')
  const [emailError, setEmailError] = useState<boolean>(false)
  const [emailFormatError, setEmailFormatError] = useState<boolean>(false)
  const [emailCyrillicError, setEmailCyrillicError] = useState<boolean>(false)
  const [phoneValue, setPhoneValue] = useState<string>('+380')
  const [phoneError, setPhoneError] = useState<boolean>(false)
  const [phoneTouched, setPhoneTouched] = useState<boolean>(false)
  const [phonePartialError, setPhonePartialError] = useState<boolean>(false)
  const [wantsPriceList, setWantsPriceList] = useState<boolean>(false)
  const [hoveredContact, setHoveredContact] = useState<string | null>(null)
  const [nameValue, setNameValue] = useState<string>('')
  const [commentValue, setCommentValue] = useState<string>('')
  const [nameError, setNameError] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [textareaHeight, setTextareaHeight] = useState<number>(70) // Default height for 2 rows
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const { t } = useI18n()
  const isEmailPreferred = contactPreference === 'email'

  // Email validation function
  const validateEmail = (email: string): boolean => {
    if (!email) return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Check if email contains Cyrillic letters
  const hasCyrillicLetters = (email: string): boolean => {
    if (!email) return false
    // Check for Cyrillic characters (including Ukrainian-specific letters)
    const cyrillicRegex = /[а-яА-ЯіІїЇєЄґҐ]/
    return cyrillicRegex.test(email)
  }

  // Check if email is incomplete (ends with @ or doesn't have proper domain)
  const isIncompleteEmail = (email: string): boolean => {
    if (!email) return false
    // Check if email ends with @ or has @ but no domain after it
    return email.endsWith('@') || (email.includes('@') && !email.split('@')[1]?.includes('.'))
  }

  // Phone validation function - checks if 9 digits are entered after +380
  const validatePhone = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '')
    const digitsAfter380 = digits.slice(3) // Remove "380" prefix
    return digitsAfter380.length === 9
  }

  // Phone formatting function: +380 XX XXX XX XX
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters except the leading +
    const digits = value.replace(/[^\d]/g, '')
    
    // Ensure we always start with +380
    if (!value.startsWith('+380')) {
      return '+380'
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
      formatted += ' ' + afterPrefix.slice(7, 9)
    }
    
    return formatted
  }

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    let value = input.value
    
    // If user tries to delete the prefix, prevent it
    if (!value.startsWith('+380')) {
      setPhoneValue('+380')
      if (phoneInputRef.current) {
        phoneInputRef.current.setSelectionRange(4, 4)
      }
      return
    }
    
    // Clear errors while typing to allow user to correct
    if (phoneError) {
      setPhoneError(false)
      setPhonePartialError(false)
    }
    
    // Get selection info before formatting
    const selectionStart = input.selectionStart || 0
    const selectionEnd = input.selectionEnd || 0
    
    // Count digits before selection start (excluding the +380 prefix)
    const beforeSelection = value.substring(0, selectionStart)
    const digitsBeforeSelection = Math.max(0, beforeSelection.replace(/[^\d]/g, '').length - 3)
    
    // Format the phone number
    const formatted = formatPhoneNumber(value)
    setPhoneValue(formatted)
    
    // Restore cursor position after formatting
    setTimeout(() => {
      if (phoneInputRef.current) {
        // Find position in formatted string that corresponds to the same number of digits
        let digitCount = 0
        let newPosition = 4 // Start after "+380"
        
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
        
        // Ensure cursor is at least at position 5 (after "+380 ")
        newPosition = Math.max(5, Math.min(newPosition, formatted.length))
        phoneInputRef.current.setSelectionRange(newPosition, newPosition)
      }
    }, 0)
  }

  // Handle phone input blur - validate on field exit
  const handlePhoneBlur = () => {
    setPhoneTouched(true)
    const digits = phoneValue.replace(/\D/g, '')
    const digitsAfter380 = digits.slice(3) // Remove "380" prefix
    
    // Check if phone is empty or just has +380
    if (digitsAfter380.length === 0) {
      setPhoneError(true) // Light grey error
      setPhonePartialError(false)
    } 
    // Check if there are some digits but not enough (partial)
    else if (digitsAfter380.length > 0 && digitsAfter380.length < 9) {
      setPhoneError(true) // Red error
      setPhonePartialError(true)
    }
    // Valid phone number
    else if (digitsAfter380.length === 9) {
      setPhoneError(false)
      setPhonePartialError(false)
    }
  }

  // Handle phone input keydown to prevent deletion of prefix
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const cursorPosition = input.selectionStart || 0
    const selectionEnd = input.selectionEnd ?? cursorPosition
    
    // Prevent deletion of "+380" prefix
    if (
      (e.key === 'Backspace' || e.key === 'Delete') &&
      cursorPosition <= 4 &&
      selectionEnd <= 4
    ) {
      e.preventDefault()
      return
    }
    
    // Allow only digits and navigation keys
    if (!/[\dArrowLeftArrowRightBackspaceDeleteTab]/.test(e.key) && !e.ctrlKey && !e.metaKey) {
      // Allow Ctrl/Cmd + A, C, V, X
      if (!['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
        e.preventDefault()
      }
    }
  }

  // Map service IDs to interest IDs
  const serviceIdToInterestId: Record<number, string> = {
    1: 'active',
    2: 'cabin',
    3: 'spa',
    4: 'events',
    5: 'program',
  }

  // Preselect price list checkbox when popup opens with preselectPriceList prop
  useEffect(() => {
    if (isOpen && preselectPriceList) {
      setWantsPriceList(true)
    }
  }, [isOpen, preselectPriceList])

  // Preselect service interest when popup opens with preselectedServiceId prop
  useEffect(() => {
    if (isOpen && preselectedServiceId && selectedInterests.length === 0) {
      const interestId = serviceIdToInterestId[preselectedServiceId]
      if (interestId) {
        setSelectedInterests([interestId])
      }
    }
  }, [isOpen, preselectedServiceId])

  // Handle textarea resize drag
  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!textareaRef.current) return
      
      const rect = textareaRef.current.getBoundingClientRect()
      const newHeight = e.clientY - rect.top
      const minHeight = 70 // Minimum height (2 rows)
      const maxHeight = 400 // Maximum height
      
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setTextareaHeight(newHeight)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ns-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  // Handle name input change - only allow letters and spaces
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow letters (including Ukrainian letters), spaces, hyphens, and apostrophes
    // Remove any digits or other symbols
    const filteredValue = value.replace(/[^a-zA-Zа-яА-ЯіІїЇєЄґҐ\s'-]/g, '')
    setNameValue(filteredValue)
  }

  // Handle name input paste - filter out digits and symbols
  const handleNamePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text/plain')
    // Only allow letters (including Ukrainian letters), spaces, hyphens, and apostrophes
    const filteredValue = pastedText.replace(/[^a-zA-Zа-яА-ЯіІїЇєЄґҐ\s'-]/g, '')
    setNameValue(filteredValue)
  }

  // Handle name input keydown - prevent digits and symbols
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow navigation keys, backspace, delete, tab, and Ctrl/Cmd combinations
    if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
      return
    }
    
    // Allow Ctrl/Cmd + A, C, V, X
    if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
      return
    }
    
    // Only allow letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s'-]$/.test(e.key)) {
      e.preventDefault()
    }
  }

  // Handle phone input paste
  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text/plain')
    
    // Extract only digits from pasted text
    const digits = pastedText.replace(/\D/g, '')
    
    // If pasted text contains 380, use digits after it, otherwise append all digits
    let digitsToAdd = digits
    if (digits.startsWith('380')) {
      digitsToAdd = digits.slice(3) // Remove "380" prefix
    }
    
    // Limit to 9 digits (format: +380 XX XXX XX XX = 9 digits after 380)
    digitsToAdd = digitsToAdd.slice(0, 9)
    
    // Combine with existing value
    const currentValue = phoneValue.replace(/\s/g, '') // Remove spaces
    const currentDigits = currentValue.replace(/\D/g, '').slice(3) // Get digits after 380
    const newDigits = (currentDigits + digitsToAdd).slice(0, 9) // Combine and limit to 9
    
    // Format the new value
    const newValue = formatPhoneNumber('+380' + newDigits)
    setPhoneValue(newValue)
    
    // Set cursor to end
    setTimeout(() => {
      if (phoneInputRef.current) {
        phoneInputRef.current.setSelectionRange(newValue.length, newValue.length)
      }
    }, 0)
  }

  // Check if "all" is selected
  const isAllSelected = selectedInterests.includes('all')
  // "All services" is always clickable (never disabled)
  const isAllServicesDisabled = false
  // Other services are NOT disabled - clicking them will automatically deselect "all"
  const areOtherServicesDisabled = false

  // Handle dynamic height for Safari mobile support
  useEffect(() => {
    if (!isOpen) return

    const updateModalHeight = () => {
      if (window.innerWidth < 640) {
        // Mobile: use dvh (dynamic viewport height) for full screen height
        setModalStyle({ height: '100dvh' })
      } else {
        // Desktop: keep current top offset (5vh) and stretch to the viewport bottom
        setModalStyle({ height: '95vh' })
      }
    }

    updateModalHeight()
    window.addEventListener('resize', updateModalHeight)
    return () => window.removeEventListener('resize', updateModalHeight)
  }, [isOpen])

  // Handle closing the modal - reset success state and close
  const handleClose = () => {
    setSubmitSuccess(false)
    setNameValue('')
    setPhoneValue('+380')
    setEmailValue('')
    setCommentValue('')
    setContactPreference(null)
    setSelectedInterests([])
    setWantsPriceList(false)
    setSubmitError(null)
    setPhoneError(false)
    setPhoneTouched(false)
    setPhonePartialError(false)
    setEmailError(false)
    setEmailFormatError(false)
    setEmailCyrillicError(false)
    setNameError(false)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('contact.title')}
      overlayClassName="bg-black/50 backdrop-blur-sm items-start justify-start sm:items-start sm:justify-center"
      className={
        submitSuccess
          ? "bg-transparent w-full sm:max-w-2xl sm:w-auto sm:mx-4 sm:mx-6 h-[100dvh] sm:h-[95vh] sm:mt-[5vh] sm:max-h-none overflow-hidden relative flex flex-col"
          : "bg-white w-full sm:max-w-2xl sm:w-auto sm:mx-4 sm:mx-6 h-[100dvh] sm:h-[95vh] sm:mt-[5vh] sm:max-h-none overflow-hidden relative flex flex-col"
      }
      style={modalStyle}
      closeOnOverlayClick={!isSubmitting}
      renderScreenReaderTitle={false}
    >
      {/* Form Content */}
      <div 
        className={submitSuccess ? "px-0 overflow-y-auto overscroll-contain flex-1" : "px-4 sm:px-5 md:px-6 pt-[3.125rem] sm:pt-[3.125rem] md:pt-[3.125rem] pb-12 sm:pb-16 md:pb-20 overflow-y-auto overscroll-contain flex-1"}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {submitSuccess ? (
          <div className="flex items-center justify-center">
            <div className="bg-[#F4F4F4] rounded-lg px-4 py-6 sm:px-6 sm:py-8 text-center w-full max-w-[480px] h-[232px] flex flex-col items-center justify-center mx-auto relative">
              {/* Close Button - positioned in top right of grey background */}
              <button
                onClick={handleClose}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors z-10"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <p className="text-[#111111] text-base font-normal font-montserrat leading-[1.5em] mb-3">
                {t('contact.success.title')}
              </p>
              <p className="text-[#111111] text-base font-normal font-montserrat leading-[1.5em]">
                {t('contact.success.body')}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors z-10"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Title */}
            <h2 id="modal-title" className="text-black text-sm sm:text-base font-semibold font-montserrat leading-[1.5em] mb-4 sm:mb-5 md:mb-6 text-left">
              {t('contact.title')}
            </h2>

          <form
            noValidate
            className="space-y-4 sm:space-y-5"
            onSubmit={async (e) => {
            e.preventDefault()
            
            // Reset previous states
            setSubmitError(null)
            setSubmitSuccess(false)
            
            // Validate name - should not be empty or only spaces
            if (!nameValue || !nameValue.trim()) {
              setNameError(true)
              nameInputRef.current?.focus()
              return
            }
            
            // Validate phone number
            if (!validatePhone(phoneValue)) {
              setPhoneTouched(true)
              const digits = phoneValue.replace(/\D/g, '')
              const digitsAfter380 = digits.slice(3) // Remove "380" prefix
              
              if (digitsAfter380.length === 0) {
                setPhoneError(true)
                setPhonePartialError(false)
              } else if (digitsAfter380.length > 0 && digitsAfter380.length < 9) {
                setPhoneError(true)
                setPhonePartialError(true)
              }
              phoneInputRef.current?.focus()
              return
            }
            
            // Validate email only when email is selected as response channel
            if (isEmailPreferred) {
              if (!emailValue) {
                setEmailError(true)
                setEmailFormatError(false)
                setEmailCyrillicError(false)
                emailInputRef.current?.focus()
                return
              }

              // Check for Cyrillic letters or incomplete email first
              if (hasCyrillicLetters(emailValue) || isIncompleteEmail(emailValue)) {
                setEmailCyrillicError(true)
                setEmailFormatError(false)
                setEmailError(false)
                emailInputRef.current?.focus()
                return
              }

              if (!validateEmail(emailValue)) {
                // Email format is invalid
                setEmailFormatError(true)
                setEmailError(false)
                setEmailCyrillicError(false)
                emailInputRef.current?.focus()
                return
              }
            } else {
              // Ensure no stale email errors are shown when email is not the selected channel.
              setEmailError(false)
              setEmailFormatError(false)
              setEmailCyrillicError(false)
            }
            
            // Validate that at least one interest is selected
            if (selectedInterests.length === 0) {
              setSubmitError(t('contact.error.selectInterest'))
              return
            }
            
            // All validations passed, proceed with submission
            setIsSubmitting(true)
            
            try {
              const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: nameValue.trim(),
                  phone: phoneValue,
                  email: emailValue || undefined,
                  contactPreference,
                  selectedInterests,
                  comment: commentValue || undefined,
                  wantsPriceList,
                }),
              })
              
              const data = await response.json()
              
              if (!response.ok) {
                throw new Error(data.error || 'Помилка при відправці форми')
              }
              
              // Success
              setSubmitSuccess(true)
            } catch (error) {
              console.error('Form submission error:', error)
              setSubmitError(error instanceof Error ? error.message : t('contact.error.submitDefault'))
            } finally {
              setIsSubmitting(false)
            }
            }}
          >
            {/* Top Row: Name and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-[#111111] text-base font-normal font-montserrat mb-1.5 sm:mb-2">
                  {t('contact.field.name')}<span className="text-black">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="name"
                  value={nameValue}
                  onChange={(e) => {
                    handleNameChange(e)
                    if (nameError && e.target.value.trim()) {
                      setNameError(false)
                    }
                  }}
                  onKeyDown={handleNameKeyDown}
                  onPaste={handleNamePaste}
                  onBlur={() => {
                    if (!nameValue || !nameValue.trim()) {
                      setNameError(true)
                    } else {
                      setNameError(false)
                    }
                  }}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border focus:outline-none focus:ring-2 focus:border-transparent text-[16px] sm:text-base font-montserrat ${
                    nameError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-[#11111126] focus:ring-[#28694D]'
                  }`}
                  placeholder={t('contact.field.namePlaceholder')}
                />
                {nameError && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-500 font-montserrat">
                    Будь ласка, вкажіть ваше ім&#39;я
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-[#111111] text-base font-normal font-montserrat mb-1.5 sm:mb-2">
                  {t('contact.field.phone')}<span className="text-black">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    id="phone"
                    required
                    value={phoneValue}
                    onChange={handlePhoneChange}
                    onKeyDown={handlePhoneKeyDown}
                    onPaste={handlePhonePaste}
                    onBlur={handlePhoneBlur}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border pr-10 focus:outline-none text-[16px] sm:text-base font-montserrat focus:ring-2 focus:border-transparent ${
                      phoneError
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-[#11111126] focus:ring-[#28694D]'
                    }`}
                    placeholder="+380"
                  />
                  {phoneError && phonePartialError && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {phoneError && phonePartialError && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-500 font-montserrat">
                    {t('contact.error.phoneInvalid')}
                  </p>
                )}
                {phoneError && !phonePartialError && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-500 font-montserrat">
                    Будь ласка, введіть свій номер
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Row: Email and Response Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-[#111111] text-base font-normal font-montserrat mb-1.5 sm:mb-2">
                  {t('contact.field.email')}{isEmailPreferred && <span className="text-[#111111]">*</span>}
                </label>
                <div className="relative">
                  <input
                    ref={emailInputRef}
                    type="email"
                    id="email"
                    value={emailValue}
                    onChange={(e) => {
                      const value = e.target.value
                      setEmailValue(value)

                      if (!isEmailPreferred) {
                        // Email is optional unless "email" channel is selected.
                        setEmailError(false)
                        setEmailFormatError(false)
                        setEmailCyrillicError(false)
                        return
                      }

                      // Check for Cyrillic letters or incomplete email
                      if (hasCyrillicLetters(value) || isIncompleteEmail(value)) {
                        setEmailCyrillicError(true)
                        setEmailFormatError(false)
                      } else {
                        setEmailCyrillicError(false)
                      }

                      // Clear other errors while typing to allow user to correct
                      if (value && emailError) {
                        setEmailError(false)
                      }
                      if (value && emailFormatError && !isIncompleteEmail(value)) {
                        setEmailFormatError(false)
                      }
                    }}
                    onBlur={() => {
                      if (!isEmailPreferred) {
                        setEmailError(false)
                        setEmailFormatError(false)
                        setEmailCyrillicError(false)
                        return
                      }

                      // Check for Cyrillic letters or incomplete email
                      if (emailValue && (hasCyrillicLetters(emailValue) || isIncompleteEmail(emailValue))) {
                        setEmailCyrillicError(true)
                        setEmailFormatError(false)
                        setEmailError(false)
                      } else if (!emailValue) {
                        setEmailError(true)
                        setEmailFormatError(false)
                        setEmailCyrillicError(false)
                      } else {
                        // Validate format if email is entered and doesn't have Cyrillic letters or incomplete format
                        const isValid = validateEmail(emailValue)
                        setEmailFormatError(!isValid)
                        setEmailError(false)
                        setEmailCyrillicError(false)
                      }
                    }}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border pr-10 focus:outline-none text-[16px] sm:text-base font-montserrat focus:ring-2 focus:border-transparent ${
                      isEmailPreferred && (emailError || emailFormatError || emailCyrillicError)
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-[#11111126] focus:ring-[#28694D]'
                    }`}
                    placeholder="example@mail.com"
                  />
                  {isEmailPreferred && (emailError || emailFormatError || emailCyrillicError) && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {isEmailPreferred && emailError && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-500 font-montserrat">
                    {t('contact.error.emailRequired')}
                  </p>
                )}
                {isEmailPreferred && emailCyrillicError && emailValue && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-500 font-montserrat">
                    {t('contact.error.emailFormatHint')}
                  </p>
                )}
                {isEmailPreferred && emailFormatError && emailValue && !emailCyrillicError && (
                  <p className="mt-1.5 text-xs sm:text-sm text-red-500 font-montserrat">
                    {t('contact.error.emailFormatHint')}
                  </p>
                )}
              </div>

              {/* Contact Preference */}
              <div>
                <label className="block text-[#111111] text-base font-normal font-montserrat mb-1.5 sm:mb-2">
                  {t('contact.field.responseChannel')}<span className="text-black">*</span>
                </label>
                <div className="flex gap-4 sm:gap-5 justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const newPreference = contactPreference === 'phone' ? null : 'phone'
                      setContactPreference(newPreference)
                    }}
                    onMouseEnter={() => setHoveredContact('phone')}
                    onMouseLeave={() => setHoveredContact(null)}
                    className={`w-20 h-12 flex items-center justify-center border transition-all ${
                      contactPreference === 'phone'
                        ? 'border border-[#28694D]'
                        : 'border border-[#11111126] hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={
                        contactPreference === 'phone'
                          ? '/images/contact/contact chanels states/phone-selected.svg'
                          : hoveredContact === 'phone'
                          ? '/images/contact/contact chanels states/phone-hover.svg'
                          : '/images/contact/contact chanels states/phone-normal.svg'
                      }
                      alt="Phone"
                      width={28}
                      height={26}
                      className="w-7 h-6"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newPreference = contactPreference === 'whatsapp' ? null : 'whatsapp'
                      setContactPreference(newPreference)
                    }}
                    onMouseEnter={() => setHoveredContact('whatsapp')}
                    onMouseLeave={() => setHoveredContact(null)}
                    className={`w-20 h-12 flex items-center justify-center border transition-all ${
                      contactPreference === 'whatsapp'
                        ? 'border border-[#28694D]'
                        : 'border border-[#11111126] hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={
                        contactPreference === 'whatsapp'
                          ? '/images/contact/contact chanels states/whatapp-selected.svg'
                          : hoveredContact === 'whatsapp'
                          ? '/images/contact/contact chanels states/whatsapp-hover.svg'
                          : '/images/contact/contact chanels states/whatsapp-normal.svg'
                      }
                      alt="WhatsApp"
                      width={28}
                      height={26}
                      className="w-7 h-6"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newPreference = contactPreference === 'email' ? null : 'email'
                      setContactPreference(newPreference)
                      if (newPreference !== 'email') {
                        setEmailError(false)
                        setEmailFormatError(false)
                        setEmailCyrillicError(false)
                      }
                    }}
                    onMouseEnter={() => setHoveredContact('email')}
                    onMouseLeave={() => setHoveredContact(null)}
                    className={`w-20 h-12 flex items-center justify-center border transition-all ${
                      contactPreference === 'email'
                        ? 'border border-[#28694D]'
                        : 'border border-[#11111126] hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={
                        contactPreference === 'email'
                          ? '/images/contact/contact chanels states/mail-selected.svg'
                          : hoveredContact === 'email'
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
              </div>
            </div>

            {/* Interest Selection */}
            <div>
            <label className="block text-[#111111] text-base font-normal font-montserrat mb-1.5 sm:mb-2">
                {t('contact.field.interests')}<span className="text-black">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[
                  { id: 'all', label: t('contact.interest.all'), icon: '/images/contact/list.svg' },
                  { id: 'active', label: t('contact.interest.active'), icon: '/images/contact/riding.svg' },
                  { id: 'cabin', label: t('contact.interest.cabin'), icon: '/images/contact/house.svg' },
                  { id: 'spa', label: t('contact.interest.spa'), icon: '/images/contact/tub copy.svg' },
                  { id: 'events', label: t('contact.interest.events'), icon: '/images/contact/sparks_1.svg' },
                  { id: 'program', label: t('contact.interest.program'), icon: '/images/contact/sunrise.svg' },
                ].map((interest) => {
                  const isAllOption = interest.id === 'all'
                  const isDisabled = isAllOption ? isAllServicesDisabled : areOtherServicesDisabled // "All" is never disabled, others are disabled when "All" is selected
                  const isSelected = selectedInterests.includes(interest.id)
                  
                  return (
                  <button
                    key={interest.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      if (isAllOption) {
                        // Toggle "all" on/off
                        if (isSelected) {
                          // If already selected, unselect it
                          setSelectedInterests([])
                        } else {
                          // If not selected, select it and clear all other selections
                          setSelectedInterests(['all'])
                        }
                      } else {
                        // If clicking any other service, remove "all" if present and toggle this one
                        setSelectedInterests(prev => {
                          const filtered = prev.filter(id => id !== 'all')
                          return filtered.includes(interest.id)
                            ? filtered.filter(id => id !== interest.id)
                            : [...filtered, interest.id]
                        })
                      }
                    }}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 border transition-all flex items-center gap-1 sm:gap-1.5 font-montserrat ${
                      isDisabled
                        ? 'text-[#c1c1c1] cursor-not-allowed'
                        : isSelected
                        ? 'text-[#28694D]'
                        : 'text-[#838383] group'
                    }`}
                    style={{
                      borderColor: isSelected 
                        ? 'rgba(40, 105, 77, 0.3)' 
                        : isDisabled
                        ? 'rgba(193, 193, 193, 0.3)'
                        : 'rgba(17, 17, 17, 0.07)',
                      borderWidth: '1px'
                    }}
                  >
                    {interest.id === 'spa' ? (
                      <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-6 h-6 flex-shrink-0 transition-all ${
                          isDisabled
                            ? 'text-[#c1c1c1]' 
                            : isSelected 
                            ? 'text-[#28694D]' 
                            : 'text-[#838383]'
                        }`}
                        style={{
                          color: isDisabled
                            ? '#c1c1c1' 
                            : isSelected 
                            ? '#28694D' 
                            : '#838383'
                        }}
                      >
                        <path 
                          d="M20 11.5V6C20 4.06701 18.433 2.5 16.5 2.5C14.567 2.5 13 4.06701 13 6V6.5" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round"
                        />
                        <path 
                          d="M20 14.5V11.5H4V14.5C4 16.7092 5.79085 18.5 8 18.5H16C18.2092 18.5 20 16.7092 20 14.5Z" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round"
                        />
                        <path 
                          d="M21.5 11.5H2.5" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round"
                        />
                        <path 
                          d="M8.5 18.5L6.5 21.5" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                        <path 
                          d="M15.5 18.5L17.5 21.5" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <Image
                        src={interest.icon}
                        alt=""
                        width={24}
                        height={24}
                        className={`w-6 h-6 object-contain flex-shrink-0 transition-all ${
                          isSelected ? 'opacity-100' : 'opacity-100'
                        }`}
                        style={isDisabled ? {
                          filter: 'brightness(0) saturate(100%) invert(76%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
                          WebkitFilter: 'brightness(0) saturate(100%) invert(76%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)'
                        } : isSelected ? { 
                          filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(1384%) hue-rotate(106deg) brightness(96%) contrast(89%)',
                          WebkitFilter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(1384%) hue-rotate(106deg) brightness(96%) contrast(89%)'
                        } : {
                          filter: 'brightness(0) saturate(100%) invert(51%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
                          WebkitFilter: 'brightness(0) saturate(100%) invert(51%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)'
                        }}
                      />
                    )}
                    <span className={`text-base whitespace-nowrap font-montserrat ${
                      isDisabled
                        ? 'font-normal'
                        : isSelected
                        ? 'font-bold'
                        : 'font-normal group-hover:font-bold'
                    }`}>{interest.label}</span>
                  </button>
                  )
                })}
              </div>
            </div>

            {/* Comment Section */}
            <div>
              <label htmlFor="comment" className="block text-[#111111] text-base font-normal font-montserrat mb-1.5 sm:mb-2">
                {t('contact.field.comment')}
              </label>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  id="comment"
                  rows={2}
                  value={commentValue}
                  onChange={(e) => setCommentValue(e.target.value)}
                  style={{ 
                    height: `${textareaHeight}px`,
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-[#11111126] focus:outline-none focus:ring-2 focus:ring-[#28694D] focus:border-transparent resize-none text-[16px] sm:text-base font-montserrat overflow-auto [&::-webkit-scrollbar]:hidden"
                  placeholder={t('contact.field.commentPlaceholder')}
                />
                <div 
                  className="absolute bottom-2 right-2 cursor-ns-resize select-none z-10"
                  onMouseDown={handleResizeStart}
                  style={{ pointerEvents: 'auto' }}
                >
                  <Image
                    src="/images/contact/resize handle.svg"
                    alt="Resize handle"
                    width={24}
                    height={24}
                    className="opacity-50 hover:opacity-75 transition-opacity"
                    unoptimized={true}
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWantsPriceList(!wantsPriceList)}
                className="flex-shrink-0"
                aria-label={t('contact.field.wantPrice')}
              >
                <Image
                  src={wantsPriceList 
                    ? '/images/contact/check_box_outline_blank.svg' 
                    : '/images/contact/check_box_outline_blank(1).svg'
                  }
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </button>
              <span 
                onClick={() => setWantsPriceList(!wantsPriceList)}
                className={`font-montserrat transition-colors cursor-pointer ${
                  wantsPriceList 
                    ? 'text-[#28694D] text-base font-semibold' 
                    : 'text-[#404040] text-xs sm:text-sm'
                }`}
              >
                {t('contact.field.wantPrice')}
              </span>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                <p className="text-red-600 text-sm sm:text-base font-montserrat">{submitError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || submitSuccess}
              className={`w-full bg-[#28694D] rounded-[32px] py-2.5 sm:py-3 px-6 sm:px-8 flex items-center justify-center transition-all duration-300 mb-2 ${
                isSubmitting || submitSuccess
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-[#28694D]/90'
              }`}
            >
              <span className={`hover-bold-no-shift font-montserrat text-white text-[20px] font-normal leading-[150%] tracking-[0.5%] transition-all duration-300`} data-text={isSubmitting ? t('contact.submit.sending') : t('contact.submit.send')}>
                <span>{isSubmitting ? t('contact.submit.sending') : submitSuccess ? t('contact.submit.sent') : t('contact.submit.send')}</span>
              </span>
            </button>
            {/* Consent Text */}
            <p className="font-montserrat text-left" style={{ fontSize: '14px', fontWeight: 400, lineHeight: '150%', letterSpacing: '0.5%', color: '#28694D' }}>
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
          </form>
          </>
        )}
      </div>
    </Modal>
  )
}

