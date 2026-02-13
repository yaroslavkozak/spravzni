import { createFileRoute } from '@tanstack/react-router'
import { useState, lazy, Suspense, useEffect } from 'react'
import { cn } from '@/src/lib/utils'
import Header from '@/src/components/Header'
import { useI18n } from '@/src/contexts/I18nContext'
import PageClientShell from '@/src/components/PageClientShell'
import MediaImage from '@/src/components/MediaImage'

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
    return (
        <PageClientShell>
            <DonatePageContent />
        </PageClientShell>
    )
}

function DonatePageContent() {
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

    const CopyIcon = ({ isCopied, className }: { isCopied: boolean; className?: string }) => (
        isCopied ? (
            <svg className={cn('w-5 h-5 flex-shrink-0 transition-colors text-[#165731]', className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ) : (
            <svg className={cn('w-5 h-5 flex-shrink-0 transition-colors text-[#CBCBCB] group-hover:text-[#165731]', className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4H18C19.1046 4 20 4.89543 20 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 8H6C4.89543 8 4 8.89543 4 10V20C4 21.1046 4.89543 22 6 22H16C17.1046 22 18 21.1046 18 20V10C18 8.89543 17.1046 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    )

    return (
        <main className="min-h-screen bg-[#F5F6F3]">
            <style>{`
                .donate-page header.header-fade-in {
                    animation: none !important;
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                    pointer-events: auto !important;
                    position: sticky !important;
                    top: 0 !important;
                    background: rgba(242, 242, 241, 0.8) !important;
                    backdrop-filter: blur(10px) !important;
                    -webkit-backdrop-filter: blur(10px) !important;
                }
                .donate-page header .text-white,
                .donate-page header svg.text-white,
                .donate-page header a.text-white,
                .donate-page header span.text-white,
                .donate-page header button.text-white {
                    color: #111111 !important;
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
                    backdrop-filter: blur(10px) !important;
                    -webkit-backdrop-filter: blur(10px) !important;
                }
                .donate-page header > div > div[class*="max-w"] {
                    background: transparent !important;
                }
                .donate-title-container {
                    margin-left: 0;
                    padding-left: 20px;
                }
                .donate-title-container h1 {
                    font-size: 32px;
                    text-align: left;
                }
                .donate-title-container p {
                    font-size: 16px;
                    text-align: left;
                    padding-right: 20px;
                }
                .donate-breadcrumbs {
                    margin-left: 0;
                }
                @media (min-width: 768px) {
                    .donate-title-container h1 {
                        font-size: 62px !important;
                        text-align: left !important;
                    }
                    .donate-title-container p {
                        font-size: 24px !important;
                    }
                }
                @media (min-width: 1440px) {
                    .donate-title-container {
                        padding-left: 215px;
                        margin-left: 0;
                    }
                    .donate-breadcrumbs {
                        padding-left: 40px;
                        margin-left: 0;
                    }
                }
            `}</style>
            <div className="donate-page">
                <Header />
            </div>
            
            {/* Breadcrumbs */}
            <div className="bg-[#fbfbf9] border-b border-[#FBFBF9]" style={{ borderBottom: '1px solid #0000001A' }}>
                <div className="max-w-[1200px] mx-auto px-4 py-2 donate-breadcrumbs">
                    <a href="/" className="font-montserrat text-[16px] hover:underline" style={{ fontWeight: 400, fontSize: '16px', color: 'hsla(154, 45%, 28%, 1)' }}>
                        &lt; {t('donate.back')}
                    </a>
                </div>
            </div>
            
            <div className="bg-[#fbfbf9] pt-8 pb-12 sm:pt-10 sm:pb-16">
                {/* Title Section */}
                <div className="max-w-[1200px] mx-auto mb-6 donate-title-container">
                    <h1 className="font-alternates leading-[1.1] font-medium text-[#111]" style={{ fontWeight: 500, lineHeight: '110%', letterSpacing: '-0.02em' }}>
                        {t('donate.title')}
                    </h1>
                    <p className="font-montserrat text-[#28694D] font-medium leading-[1.3]" style={{ fontWeight: 500, lineHeight: '130%', letterSpacing: '0.015em', color: '#28694D' }}>
                        {t('donate.subtitle')}
                    </p>
                </div>

                {/* Donation Section */}
                <div className="w-full border-y border-[#1111111C] mt-6 pt-2 lg:pt-0">
                    {/* Desktop layout */}
                    <div className="hidden lg:flex items-stretch gap-0 min-w-0">
                        <div className="w-[clamp(0px,14.93vw,215px)] flex-shrink-0" />
                        <div className="w-[485px] flex-shrink-0 flex flex-col pt-[clamp(24px,4.44vw,64px)] pb-[clamp(9px,calc(4.44vw-15px),49px)]">
                            {/* First Block - Info Paragraph */}
                            <div className="mb-8">
                                <p className="font-montserrat text-[hsla(0,0%,7%,1)]" style={{ fontSize: '16px', fontWeight: 400, lineHeight: '150%', letterSpacing: '0.5%' }}>
                                    {t('donate.infoParagraph')}
                                </p>
                                <p className="font-montserrat text-[hsla(0,0%,7%,1)] lg:mt-4" style={{ fontSize: '16px', fontWeight: 400, lineHeight: '150%', letterSpacing: '0.5%' }}>
                                    {t('donate.reportMonthly')} <a href="/report" className="underline underline-offset-4" style={{ color: '#000000E5' }}>{t('donate.reportLink')}</a>
                                </p>
                            </div>

                            {/* Second Block - Title, Button, Terms */}
                            <div className="mb-8">
                                <h3 className="font-montserrat text-[#111111] mb-2" style={{ fontSize: '20px', fontWeight: 700, lineHeight: '150%', letterSpacing: '0.5%' }}>
                                    {t('donate.bankDetailsTitle')}
                                </h3>
                                <a
                                    href="https://send.monobank.ua/jar/8XQeqKnrET"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center w-full bg-[#28694D] rounded-[2rem] px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 mb-2 transition-all duration-300 hover:opacity-95"
                                >
                                    <span className="font-montserrat text-white text-center" style={{ fontSize: '20px', fontWeight: 400, lineHeight: '150%', letterSpacing: '0.5%' }}>
                                        {t('donate.payButton')}
                                    </span>
                                </a>
                                <p className="font-montserrat" style={{ fontSize: '14px', fontWeight: 400, lineHeight: '150%', letterSpacing: '0.5%', color: '#28694D' }}>
                                    {t('donate.termsPrefix')} <a href="/terms" className="underline underline-offset-4">{t('donate.termsLink')}</a> {t('donate.termsAnd')} <a href="/privacy" className="underline underline-offset-4">{t('donate.privacyLink')}</a>.
                                </p>
                            </div>

                            {/* Third Block - Bank Details */}
                            <div>
                                <h3 className="font-montserrat mb-2" style={{ fontSize: '20px', fontWeight: 700, lineHeight: '150%', letterSpacing: '0.5%', color: '#111' }}>
                                    {t('donate.bankDetailsSectionTitle')}
                                </h3>
                                <div className="font-montserrat space-y-2">
                                    <div className="flex items-start group cursor-pointer relative" onClick={() => copyToClipboard('UA24 3003 3500 0000 0260 0323 9362 5', 'iban')}>
                                        <CopyIcon isCopied={copiedItem === 'iban'} className="mr-2" />
                                        <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111' }}>
                                            <span style={{ fontWeight: 700 }}>{t('donate.ibanLabel')}</span> UA24 3003 3500 0000 0260 0323 9362 5
                                        </div>
                                    </div>

                                    <div className="flex items-start group cursor-pointer relative" onClick={() => copyToClipboard(t('donate.bankNameValue'), 'bank')}>
                                        <CopyIcon isCopied={copiedItem === 'bank'} className="mr-2" />
                                        <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111' }}>
                                            <span style={{ fontWeight: 700 }}>{t('donate.bankNameLabel')}</span> {t('donate.bankNameValue')}
                                        </div>
                                    </div>

                                    <div onClick={() => copyToClipboard(t('donate.recipientValue'), 'recipient')} className="cursor-pointer group flex items-start relative">
                                        <CopyIcon isCopied={copiedItem === 'recipient'} className="mr-2" />
                                        <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111' }}><span style={{ fontWeight: 700 }}>{t('donate.recipientLabel')}</span> {t('donate.recipientValue')}</div>
                                    </div>

                                    <div onClick={() => copyToClipboard('45793627', 'edrpou')} className="cursor-pointer group flex items-start relative">
                                        <CopyIcon isCopied={copiedItem === 'edrpou'} className="mr-2" />
                                        <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111' }}><span style={{ fontWeight: 700 }}>{t('donate.edrpouLabel')}</span> 45793627</div>
                                    </div>

                                    <div className="flex items-start group cursor-pointer relative" onClick={() => copyToClipboard(t('donate.purposeValue'), 'purpose')}>
                                        <CopyIcon isCopied={copiedItem === 'purpose'} className="mr-2" />
                                        <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111' }}>
                                            <span style={{ fontWeight: 700 }}>{t('donate.purposeLabel')}</span> {t('donate.purposeValue')}
                                        </div>
                                    </div>

                                    <div className="flex items-start group cursor-pointer relative" onClick={() => copyToClipboard('UAH', 'currency')}>
                                        <CopyIcon isCopied={copiedItem === 'currency'} className="mr-2" />
                                        <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111' }}>
                                            <span style={{ fontWeight: 700 }}>{t('donate.currencyLabel')}</span> UAH
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-[clamp(0px,4.17vw,60px)] flex-shrink-0" />
                        <div className="relative flex-1 h-full min-w-0 flex justify-end">
                            <div className="relative w-[clamp(320px,45.83vw,660px)] aspect-square bg-gray-300 overflow-hidden">
                                <MediaImage
                                    src="/donate.png"
                                    alt="Donate"
                                    fill
                                    className="object-cover object-right"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Mobile layout */}
                    <div className="lg:hidden pt-8 pb-8">
                        <div className="space-y-8">
                            {/* First Block - Info Paragraph */}
                            <div className="px-5">
                                <p className="font-montserrat text-[hsla(0,0%,7%,1)]" style={{ fontSize: '16px', fontWeight: 400, lineHeight: '150%', letterSpacing: '0.5%' }}>
                                    {t('donate.infoParagraph')} {t('donate.reportMonthly')} <a href="/report" className="underline underline-offset-4" style={{ fontWeight: 400, fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#000000E5' }}>{t('donate.reportLink')}</a>
                                </p>
                            </div>

                            {/* Image */}
                            <div className="w-full h-[400px] relative -mx-5" style={{ width: 'calc(100% + 40px)', marginLeft: '-20px', marginRight: '-20px' }}>
                                <MediaImage
                                    src="/donate.png"
                                    alt="Donate"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Second Block - Title, Button, Terms */}
                            <div className="px-5">
                                <h3 className="font-montserrat text-[#111111] text-[clamp(18px,_calc(15.887px+0.563vw),_24px)] font-bold leading-[1.3em] tracking-[-1.5%] mb-2">
                                    {t('donate.bankDetailsTitle')}
                                </h3>
                                <a
                                    href="https://send.monobank.ua/jar/8XQeqKnrET"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center w-full bg-[#28694D] rounded-[2rem] px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 mb-2 transition-all duration-300 hover:opacity-95"
                                >
                                    <span className="font-montserrat text-white text-[clamp(1rem,_calc(0.912rem+0.375vw),_1.25rem)] font-normal leading-[1.5em] tracking-[0.5%]">
                                        {t('donate.payButton')}
                                    </span>
                                </a>
                                <p className="font-montserrat" style={{ fontSize: '14px', fontWeight: 400, lineHeight: '150%', letterSpacing: '0.5%', color: '#28694D' }}>
                                    {t('donate.termsPrefix')} <a href="/terms" className="underline underline-offset-4">{t('donate.termsLink')}</a> {t('donate.termsAnd')} <a href="/privacy" className="underline underline-offset-4">{t('donate.privacyLink')}</a>.
                                </p>
                            </div>

                            {/* Third Block - Bank Details */}
                            <div className="px-5">
                                <h3 className="font-montserrat mb-2" style={{ fontSize: '20px', fontWeight: 700, lineHeight: '150%', letterSpacing: '0.5%', color: '#111' }}>
                                    {t('donate.bankDetailsSectionTitle')}
                                </h3>
                                <div className="font-montserrat space-y-2">
                                    <div className="flex items-start justify-between group cursor-pointer relative" onClick={() => copyToClipboard('UA24 3003 3500 0000 0260 0323 9362 5', 'iban')}>
                                        <div className="flex-1">
                                            <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111' }}>
                                                <span style={{ fontWeight: 700 }}>{t('donate.ibanLabel')}</span>
                                            </div>
                                            <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111', fontWeight: 400 }}>
                                                UA24 3003 3500 0000 0260 0323 9362 5
                                            </div>
                                        </div>
                                        <CopyIcon isCopied={copiedItem === 'iban'} className="ml-2" />
                                    </div>

                                    <div className="flex items-start justify-between group cursor-pointer relative" onClick={() => copyToClipboard(t('donate.bankNameValue'), 'bank')}>
                                        <div className="flex-1">
                                            <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111' }}>
                                                <span style={{ fontWeight: 700 }}>{t('donate.bankNameLabel')}</span>
                                            </div>
                                            <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111', fontWeight: 400 }}>
                                                {t('donate.bankNameValue')}
                                            </div>
                                        </div>
                                        <CopyIcon isCopied={copiedItem === 'bank'} className="ml-2" />
                                    </div>

                                    <div onClick={() => copyToClipboard(t('donate.recipientValue'), 'recipient')} className="cursor-pointer group flex items-start justify-between relative">
                                        <div className="flex-1">
                                            <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111' }}>
                                                <span style={{ fontWeight: 700 }}>{t('donate.recipientLabel')}</span>
                                            </div>
                                            <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111', fontWeight: 400 }}>
                                                {t('donate.recipientValue')}
                                            </div>
                                        </div>
                                        <CopyIcon isCopied={copiedItem === 'recipient'} className="ml-2" />
                                    </div>

                                    <div onClick={() => copyToClipboard('45793627', 'edrpou')} className="cursor-pointer group flex items-start justify-between relative">
                                        <div className="flex-1">
                                            <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111' }}>
                                                <span style={{ fontWeight: 700 }}>{t('donate.edrpouLabel')}</span>
                                            </div>
                                            <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111', fontWeight: 400 }}>
                                                45793627
                                            </div>
                                        </div>
                                        <CopyIcon isCopied={copiedItem === 'edrpou'} className="ml-2" />
                                    </div>

                                    <div className="flex items-start justify-between group cursor-pointer relative" onClick={() => copyToClipboard(t('donate.purposeValue'), 'purpose')}>
                                        <div className="flex-1">
                                            <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111' }}>
                                                <span style={{ fontWeight: 700 }}>{t('donate.purposeLabel')}</span>
                                            </div>
                                            <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111', fontWeight: 400 }}>
                                                {t('donate.purposeValue')}
                                            </div>
                                        </div>
                                        <CopyIcon isCopied={copiedItem === 'purpose'} className="ml-2" />
                                    </div>

                                    <div className="flex items-start justify-between group cursor-pointer relative" onClick={() => copyToClipboard('UAH', 'currency')}>
                                        <div className="flex-1">
                                            <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111' }}>
                                                <span style={{ fontWeight: 700 }}>{t('donate.currencyLabel')}</span>
                                            </div>
                                            <div style={{ fontSize: '16px', lineHeight: '150%', letterSpacing: '0.5%', color: '#111', fontWeight: 400 }}>
                                                UAH
                                            </div>
                                        </div>
                                        <CopyIcon isCopied={copiedItem === 'currency'} className="ml-2" />
                                    </div>
                                </div>
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
