/**
 * Utility functions for formatting messages to send via Telegram
 */

export interface ContactFormData {
  name: string
  phone: string
  email?: string
  contactPreference: 'phone' | 'whatsapp' | 'email' | null
  selectedInterests: string[]
  comment?: string
  wantsPriceList: boolean
}

/**
 * Map interest IDs to labels
 */
const interestLabels: Record<string, string> = {
  all: 'Усі послуги',
  active: 'Активний відпочинок та тімбілдинг',
  cabin: 'Хатинка під соснами',
  spa: 'Безбар\'єрний СПА',
  program: 'Групова програма «Шлях сили»',
  events: 'Події під ключ',
}

/**
 * Map contact preference to text
 */
const contactPreferenceText: Record<string, string> = {
  phone: 'Телефон',
  whatsapp: 'WhatsApp',
  email: 'Електронна пошта',
}

/**
 * Format contact form submission as HTML message for Telegram
 */
export function formatContactFormMessage(data: ContactFormData): string {
  const selectedInterestsText = data.selectedInterests
    .map((id) => interestLabels[id] || id)
    .join(', ') || 'Не вказано'

  const contactPreferenceDisplay = data.contactPreference
    ? contactPreferenceText[data.contactPreference]
    : 'Не вказано'

  let message = `<b>Запит на форму «Коли старт»</b>\n\n`
  message += `<b>Ім’я:</b> ${escapeHtml(data.name)}\n`
  message += `<b>Телефон:</b> <code>${escapeHtml(data.phone)}</code>\n`

  if (data.email) {
    message += `<b>Імейл:</b> ${escapeHtml(data.email)}\n`
  }

  message += `<b>Зв’язатись через:</b> ${contactPreferenceDisplay}\n`
  message += `\n<b>Цікавить:</b> ${escapeHtml(selectedInterestsText)}\n`
  message += `<b>Повідомити окремо про прайс:</b> ${data.wantsPriceList ? 'так' : 'ні'}\n`

  if (data.comment) {
    message += `\n<b>Коментар:</b>\n${escapeHtml(data.comment)}\n`
  }

  return message
}

/**
 * Escape HTML special characters for Telegram HTML parse mode
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Format a simple text message (for non-HTML messages)
 */
export function formatSimpleMessage(title: string, content: string): string {
  return `${title}\n\n${content}`
}
