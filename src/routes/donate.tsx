import { createFileRoute } from '@tanstack/react-router'
import { useState, lazy, Suspense, useEffect } from 'react'
import { cn } from '@/src/lib/utils'
import Header from '@/src/components/Header'
import { useI18n } from '@/src/contexts/I18nContext'

// Lazy load FooterSection for better performance
const FooterSection = lazy(() => import('@/src/components/FooterSection'))

// Loading fallback component
const LoadingFallback = () => {
  const { t } = useI18n()
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-400">{t('donate.loading')}</div>
    </div>
  )
}

export const Route = createFileRoute('/donate')({
    component: DonatePage,
})

function DonatePage() {
    const { t } = useI18n()
    const [amount, setAmount] = useState<string>('100')
    const [isRecurring, setIsRecurring] = useState(false)
    const [recurringInterval, setRecurringInterval] = useState<string>('1m')
    const [recurringCount, setRecurringCount] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [recurringErrors, setRecurringErrors] = useState<{
        interval?: string
        count?: string
    }>({})
    const [copiedItem, setCopiedItem] = useState<string | null>(null)

    // Amounts for quick selection
    const presets = [100, 300, 500, 1000, 2000]
    
    // Payment frequency options (matching Monobank API format)
    const intervalOptions = [
        { value: '1d', label: t('donate.interval.daily') },
        { value: '2w', label: t('donate.interval.biweekly') },
        { value: '1m', label: t('donate.interval.monthly') },
        { value: '1y', label: t('donate.interval.yearly') },
    ]

    // Scroll to top when page loads or navigates to it
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        }
    }, [])

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value === '' || /^\d*$/.test(value)) {
            // Check if value exceeds maximum
            if (value && parseInt(value) > 499999) {
                setAmount('499999')
                setError(t('donate.error.maxAmount'))
            } else {
            setAmount(value)
            setError(null)
            }
        }
    }

    const handleDonate = async () => {
        if (!amount || parseInt(amount) < 1) {
            setError(t('donate.error.minAmount'))
            return
        }

        // Check maximum amount
        const amountValue = parseInt(amount)
        if (amountValue > 499999) {
            setAmount('499999')
            setError(t('donate.error.maxAmount'))
            return
        }

        // Validate recurring payment fields if enabled
        if (isRecurring) {
            const errors: { interval?: string; count?: string } = {}
            
            if (!recurringInterval) {
                errors.interval = t('donate.error.intervalRequired')
            }
            
            if (!recurringCount || parseInt(recurringCount) < 1) {
                errors.count = t('donate.error.countRequired')
            }
            
            if (Object.keys(errors).length > 0) {
                setRecurringErrors(errors)
                setError(t('donate.error.fillRequired'))
                return
            }
            
            setRecurringErrors({})
        }

        setLoading(true)
        setError(null)
        try {
            // Logic for payment processing
            // Re-using logic from DonationPopup mostly, but adapted
            // We'll default to LiqPay or open a selector if needed, 
            // but based on the UI flow, standard "Donate" usually goes to a payment page.
            // For now, let's assume we want to offer the choice or default.
            // Given the previous popup had choices, I will implement a small selector OR just trigger the API
            // The API call usually returns a URL.
            // Let's implement the API call here.

            const payload = {
                amount: parseInt(amount),
                currency: 'UAH',
                description: t('donate.description', { amount }),
                // gateway: 'liqpay' // defaulting for now or we can add a selector
            }

            // NOTE: The previous popup had gateway selection. 
            // I'll show a small modal or buttons for gateway selection upon clicking "Zrobyty perekaz" 
            // OR I'll add the buttons to the UI. 
            // To match the screenshot strictly (one button), 
            // I will open a gateway selection modal OR just pick one.
            // Let's try to fetch the donation URL with a default gateway (LiqPay) first, 
            // or check if the API requires it. (DonationPopup did: gateway: 'liqpay' | 'monobank')

            // I'll add a simple gateway selector ABOVE the button or in a modal.
            // For simplicity and better UX matching the screenshot:
            // I'll make the "Зробити переказ" button trigger the API with 'liqpay' for now, 
            // BUT a better approach is to ask the user.
            // However, to stick to the visual, I'll add a hidden state or a small selector.

            // Create dynamic description based on amount
            const amountValue = parseFloat(amount)
            const description = t('donate.description', { amount: amountValue })
            
            // Let's implement the fetch:
            const response = await fetch('/api/donations/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    gateway: 'monobank',
                    amount: amountValue,
                    currency: 'UAH',
                    description: description,
                    is_recurring: isRecurring,
                    recurring_interval: isRecurring ? recurringInterval : undefined,
                    recurring_count: isRecurring && recurringCount ? parseInt(recurringCount) : undefined,
                }),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                const errorMessage = data.error || t('donate.error.createDonation')
                
                // Check if it's an h2h error and provide a user-friendly message
                if (errorMessage.includes('h2h') || errorMessage.includes('Host-to-host')) {
                    throw new Error(t('donate.error.recurringUnavailable'))
                }
                
                throw new Error(errorMessage)
            }

            if (data.donation?.payment_url) {
                window.location.href = data.donation.payment_url
            }
        } catch (err) {
            console.error(err)
            const errorMessage = err instanceof Error ? err.message : t('donate.error.generic')
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = async (text: string, itemId: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedItem(itemId)
            // Reset after 2 seconds
            setTimeout(() => {
                setCopiedItem(null)
            }, 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        <main className="min-h-screen bg-[#F5F6F3]">
            <style>{`
                .donate-page header.header-fade-in {
                    animation: none !important;
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                    pointer-events: auto !important;
                    background: #fbfbf9 !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                }
                .donate-page header .text-white,
                .donate-page header svg.text-white,
                .donate-page header a.text-white,
                .donate-page header span.text-white,
                .donate-page header button.text-white {
                    color: #111111 !important;
                }
                .donate-page header button[class*="28694D"] span.text-white,
                .donate-page header button[class*="28694D"] .text-white {
                    color: #ffffff !important;
                }
                .donate-page header svg.icon-stroke-hover,
                .donate-page header svg[stroke="currentColor"] {
                    stroke: #111111 !important;
                }
                .donate-page header img[alt="Logo"] {
                    filter: brightness(0) !important;
                }
                .donate-page header img[alt="Menu"] {
                    filter: brightness(0) !important;
                }
                .donate-page header button[aria-label="Toggle menu"] {
                    color: #111111 !important;
                }
                .donate-page header button[aria-label="Toggle menu"] svg {
                    stroke: #111111 !important;
                    color: #111111 !important;
                }
                .donate-page header button[aria-label="Toggle menu"] img {
                    filter: brightness(0) !important;
                }
                .donate-page header .backdrop-blur-header {
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                }
                .donate-page header > div > div[class*="max-w"] {
                    background: #fbfbf9 !important;
                }
            `}</style>
            <div className="donate-page">
                <Header />
            </div>
            
            {/* Breadcrumbs */}
            <div className="bg-[#fbfbf9] border-b border-[#FBFBF9] pt-[8rem] md:pt-[9rem]" style={{ borderBottom: '1px solid #0000001A' }}>
                <div className="max-w-[1200px] mx-auto px-4 py-4">
                    <a href="/" className="font-montserrat font-semibold text-[16px] hover:underline" style={{ fontWeight: 600, fontSize: '16px', color: 'hsla(154, 45%, 28%, 1)' }}>
                        &lt; {t('donate.back')}
                    </a>
                </div>
            </div>
            
            <div className="bg-[#fbfbf9] pt-8 pb-12 sm:pt-12 sm:pb-16">
                <div className="max-w-[1200px] mx-auto px-4">
                    {/* Title Section */}
                    <div className="mb-12">
                        <h1 className="font-alternates text-[62px] leading-[1.1] font-medium text-[#111] text-left mb-4" style={{ fontSize: '62px', fontWeight: 500 }}>
                            {t('donate.title')}
                        </h1>
                        <p className="font-montserrat text-[24px] text-[#28694D] font-medium leading-[1.1]" style={{ fontSize: '24px', fontWeight: 500 }}>
                            {t('donate.subtitle')}
                        </p>
                    </div>
                </div>

                {/* Donation Section - Full Width */}
                <div className="bg-[#F0F3F0] border-t border-b py-8 lg:py-12 mb-12" style={{ borderColor: 'rgba(17, 17, 17, 0.12)' }}>
                    <div className="max-w-[1200px] mx-auto px-4 lg:px-12">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Right Column - Info Text */}
                            <div className="lg:col-span-2 lg:pb-16 lg:pl-16 lg:pr-16">
                                <div className="flex flex-col">
                                    <p className="font-montserrat leading-[1.6] mb-6" style={{ fontWeight: 400, fontSize: '16px', color: 'hsla(0, 0%, 0%, 0.9)' }}>
                                        {t('donate.info1')}
                                    </p>
                                    <p className="font-montserrat leading-[1.6] mb-6" style={{ fontWeight: 400, fontSize: '16px', color: 'hsla(0, 0%, 0%, 0.9)' }}>
                                        {t('donate.info2')}{' '}
                                        <a
                                            href="/report"
                                            className="font-medium text-[#28694D] underline"
                                        >
                                            {t('donate.reportLink')}
                                        </a>
                                    </p>
                                </div>
                                <a
                                    href="https://send.monobank.ua/jar/8XQeqKnrET"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center w-[310px] h-[60px] bg-[#2E5C46] text-white font-montserrat rounded-[32px] hover:bg-[#254A38] transition-colors"
                                    style={{ fontWeight: 400, fontSize: '20px' }}
                                >
                                    Зробити переказ
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bank Details Section */}
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="mb-12">
                        <h3 className="font-alternates text-2xl text-[#111] font-medium mb-6">
                            {t('donate.bankDetailsTitle')}
                        </h3>

                        <div className="space-y-4 font-montserrat text-sm sm:text-base text-[#111]">
                            <div className="flex items-start justify-between gap-4 group cursor-pointer relative" onClick={() => copyToClipboard('UA24 3003 3500 0000 0260 0323 9362 5', 'iban')}>
                                <div>
                                    <span className="font-bold">{t('donate.ibanLabel')}</span> UA24 3003 3500 0000 0260 0323 9362 5
                                </div>
                                {copiedItem === 'iban' ? (
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-[#165731] text-xs font-medium">{t('donate.copied')}</span>
                                        <svg className="w-5 h-5 text-[#165731] transition-colors" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                ) : (
                                    <svg className="w-5 h-5 text-[#CBCBCB] group-hover:text-[#165731] transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 4H18C19.1046 4 20 4.89543 20 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 8H6C4.89543 8 4 8.89543 4 10V20C4 21.1046 4.89543 22 6 22H16C17.1046 22 18 21.1046 18 20V10C18 8.89543 17.1046 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                )}
                            </div>

                            <div className="flex items-start justify-between gap-4 group cursor-pointer relative" onClick={() => copyToClipboard(t('donate.bankNameValue'), 'bank')}>
                                <div>
                                    <span className="font-bold">{t('donate.bankNameLabel')}</span> {t('donate.bankNameValue')}
                                </div>
                                {copiedItem === 'bank' ? (
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-[#165731] text-xs font-medium">{t('donate.copied')}</span>
                                        <svg className="w-5 h-5 text-[#165731] transition-colors" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                ) : (
                                    <svg className="w-5 h-5 text-[#CBCBCB] group-hover:text-[#165731] transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 4H18C19.1046 4 20 4.89543 20 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 8H6C4.89543 8 4 8.89543 4 10V20C4 21.1046 4.89543 22 6 22H16C17.1046 22 18 21.1046 18 20V10C18 8.89543 17.1046 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                )}
                            </div>

                            <div onClick={() => copyToClipboard(t('donate.recipientValue'), 'recipient')} className="cursor-pointer group flex justify-between items-start gap-4 relative">
                                <div><span className="font-bold">{t('donate.recipientLabel')}</span> {t('donate.recipientValue')}</div>
                                {copiedItem === 'recipient' ? (
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-[#165731] text-xs font-medium">{t('donate.copied')}</span>
                                        <svg className="w-5 h-5 text-[#165731] transition-colors" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                ) : (
                                    <svg className="w-5 h-5 text-[#CBCBCB] group-hover:text-[#165731] transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 4H18C19.1046 4 20 4.89543 20 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 8H6C4.89543 8 4 8.89543 4 10V20C4 21.1046 4.89543 22 6 22H16C17.1046 22 18 21.1046 18 20V10C18 8.89543 17.1046 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                )}
                            </div>

                            <div onClick={() => copyToClipboard('45793627', 'edrpou')} className="cursor-pointer group flex justify-between items-start gap-4 relative">
                                <div><span className="font-bold">{t('donate.edrpouLabel')}</span> 45793627</div>
                                {copiedItem === 'edrpou' ? (
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-[#165731] text-xs font-medium">{t('donate.copied')}</span>
                                        <svg className="w-5 h-5 text-[#165731] transition-colors" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                ) : (
                                    <svg className="w-5 h-5 text-[#CBCBCB] group-hover:text-[#165731] transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 4H18C19.1046 4 20 4.89543 20 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 8H6C4.89543 8 4 8.89543 4 10V20C4 21.1046 4.89543 22 6 22H16C17.1046 22 18 21.1046 18 20V10C18 8.89543 17.1046 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                )}
                            </div>

                            <div className="flex items-start justify-between gap-4 group cursor-pointer relative" onClick={() => copyToClipboard(t('donate.purposeValue'), 'purpose')}>
                                <div>
                                    <span className="font-bold">{t('donate.purposeLabel')}</span> {t('donate.purposeValue')}
                                </div>
                                {copiedItem === 'purpose' ? (
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-[#165731] text-xs font-medium">{t('donate.copied')}</span>
                                        <svg className="w-5 h-5 text-[#165731] transition-colors" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                ) : (
                                    <svg className="w-5 h-5 text-[#CBCBCB] group-hover:text-[#165731] transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 4H18C19.1046 4 20 4.89543 20 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 8H6C4.89543 8 4 8.89543 4 10V20C4 21.1046 4.89543 22 6 22H16C17.1046 22 18 21.1046 18 20V10C18 8.89543 17.1046 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                )}
                            </div>

                            <div className="flex items-start justify-between gap-4 group cursor-pointer relative" onClick={() => copyToClipboard('UAH', 'currency')}>
                                <div>
                                    <span className="font-bold">{t('donate.currencyLabel')}</span> UAH
                                </div>
                                {copiedItem === 'currency' ? (
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-[#165731] text-xs font-medium">{t('donate.copied')}</span>
                                        <svg className="w-5 h-5 text-[#165731] transition-colors" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                ) : (
                                    <svg className="w-5 h-5 text-[#CBCBCB] group-hover:text-[#165731] transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 4H18C19.1046 4 20 4.89543 20 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 8H6C4.89543 8 4 8.89543 4 10V20C4 21.1046 4.89543 22 6 22H16C17.1046 22 18 21.1046 18 20V10C18 8.89543 17.1046 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Suspense fallback={<LoadingFallback />}>
                <FooterSection />
            </Suspense>
        </main>
    )
}
