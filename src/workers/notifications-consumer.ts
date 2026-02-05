/**
 * Queue Consumer for Notifications
 * 
 * This worker processes messages from the notifications-queue
 * and handles email sending and Telegram notifications asynchronously.
 */

import { Resend } from 'resend'
import type { Env, NotificationMessage, MessageBatch } from '@/types/cloudflare'
import { notifyGroup, formatContactFormMessage } from '@/src/lib/telegram'

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
 * Format email HTML content for contact form
 */
function formatEmailHtml(data: import('@/types/cloudflare').ContactFormData): string {
  const selectedInterestsText = data.selectedInterests
    .map((id: string) => interestLabels[id] || id)
    .join(', ') || 'Не вказано'

  return `
    <!DOCTYPE html>
    <html lang="uk">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #111111;
            background-color: #f5f5f5;
            padding: 20px;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .content {
            padding: 28px 24px;
          }
          .text-block {
            font-size: 16px;
            color: #111111;
            line-height: 1.6;
            white-space: pre-wrap;
          }
          @media only screen and (max-width: 600px) {
            body {
              padding: 10px;
            }
            .content {
              padding: 24px 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="content">
            <div class="text-block">
              ${[
                'Запит на форму «Коли старт»',
                '',
                `Ім’я: ${escapeHtml(data.name)}`,
                `Телефон: ${escapeHtml(data.phone)}`,
                data.email ? `Імейл: ${escapeHtml(data.email)}` : 'Імейл: Не вказано',
                `Зв’язатись через: ${data.contactPreference ? contactPreferenceText[data.contactPreference] : 'Не вказано'}`,
                '',
                '',
                `Цікавить: ${escapeHtml(selectedInterestsText)}`,
                `Повідомити окремо про прайс: ${data.wantsPriceList ? 'так' : 'ні'}`,
                '',
                '',
                ...(data.comment ? ['Коментар:', escapeHtml(data.comment)] : []),
              ].join('<br>')}
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Format email text content for contact form
 */
function formatEmailText(data: import('@/types/cloudflare').ContactFormData): string {
  const selectedInterestsText = data.selectedInterests
    .map((id: string) => interestLabels[id] || id)
    .join(', ') || 'Не вказано'

  return `
${[
  'Запит на форму «Коли старт»',
  '',
  `Ім’я: ${data.name}`,
  `Телефон: ${data.phone}`,
  data.email ? `Імейл: ${data.email}` : 'Імейл: Не вказано',
  `Зв’язатись через: ${data.contactPreference ? contactPreferenceText[data.contactPreference] : 'Не вказано'}`,
  '',
  '',
  `Цікавить: ${selectedInterestsText}`,
  `Повідомити окремо про прайс: ${data.wantsPriceList ? 'так' : 'ні'}`,
  '',
  '',
  ...(data.comment ? ['Коментар:', data.comment] : []),
].join('\n')}
  `.trim()
}

/**
 * Escape HTML special characters
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
 * Send email notification
 */
async function sendEmailNotification(
  data: import('@/types/cloudflare').ContactFormData,
  resendApiKey: string,
  fromAddress: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!resendApiKey) {
      return { success: false, error: 'Resend API key not configured' }
    }

    const resend = new Resend(resendApiKey)

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: ['yaroslav.kozak.dev@gmail.com', 'spravzhni.lviv@gmail.com'],
      subject: 'Запит на форму «Коли старт» - Spravzni',
      html: formatEmailHtml(data),
      text: formatEmailText(data),
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message || 'Failed to send email' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send email notification for chat messages
 */
async function sendChatEmailNotification(
  chatData: import('@/types/cloudflare').ChatMessageNotificationData,
  html: string,
  resendApiKey: string,
  fromAddress: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!resendApiKey) {
      return { success: false, error: 'Resend API key not configured' }
    }

    const resend = new Resend(resendApiKey)

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: ['yaroslav.kozak.dev@gmail.com', 'spravzhni.lviv@gmail.com'],
      subject: '💬 Нове повідомлення в чаті - Spravzni',
      html: html,
      text: `Нове повідомлення в чаті\n\nСесія: ${chatData.sessionId}\nПовідомлення: ${chatData.messageText}\nВід: ${chatData.senderType === 'user' ? 'Користувач' : 'Менеджер'}`,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message || 'Failed to send email' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending chat email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Queue consumer handler
 * Processes messages from the notifications-queue
 */
export default {
  async queue(
    batch: MessageBatch<NotificationMessage>,
    env: Env
  ): Promise<void> {
    for (const message of batch.messages) {
      try {
        const { type, data } = message.body

        if (type === 'contact-form') {
          // Type guard - data must be ContactFormData for contact-form type
          const contactData = data as import('@/types/cloudflare').ContactFormData;
          
          // Format Telegram message with error handling
          let telegramMessage: string
          try {
            telegramMessage = formatContactFormMessage(contactData)
          } catch (formatError) {
            console.error('Error formatting Telegram message:', formatError)
            // Fallback message if formatting fails
            telegramMessage = `Запит на форму «Коли старт»\n\nІм'я: ${contactData.name}\nТелефон: ${contactData.phone}${contactData.email ? `\nEmail: ${contactData.email}` : ''}`
          }
          
          // Process email and Telegram notifications in parallel
          const fromAddress = env.RESEND_FROM || 'onboarding@resend.dev'
          const [emailResult, telegramResult] = await Promise.allSettled([
            sendEmailNotification(contactData, env.RESEND_API_KEY || '', fromAddress),
            env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_GROUP_CHAT_ID
              ? notifyGroup(
                  env.TELEGRAM_GROUP_CHAT_ID,
                  env.TELEGRAM_BOT_TOKEN,
                  telegramMessage
                )
              : Promise.resolve({ success: false, error: 'Telegram not configured' }),
          ])

          // Log results
          if (emailResult.status === 'fulfilled' && emailResult.value.success) {
            console.log('Email notification sent successfully')
          } else {
            const error =
              emailResult.status === 'rejected'
                ? emailResult.reason
                : emailResult.value.error
            console.error('Failed to send email notification:', error)
          }

          if (telegramResult.status === 'fulfilled' && telegramResult.value.success) {
            console.log('Telegram notification sent successfully')
          } else {
            const error =
              telegramResult.status === 'rejected'
                ? telegramResult.reason
                : telegramResult.value.error
            console.error('Failed to send Telegram notification:', error)
          }

          // Only ack if at least one notification succeeded
          // This allows retry if both fail
          if (
            (emailResult.status === 'fulfilled' && emailResult.value.success) ||
            (telegramResult.status === 'fulfilled' && telegramResult.value.success)
          ) {
            message.ack()
          } else {
            // Both failed, retry the message
            message.retry()
          }
        } else if (type === 'chat-message') {
          // Handle chat message notifications
          const chatData = data as import('@/types/cloudflare').ChatMessageNotificationData
          
          // Format chat message for notifications with user info
          let chatMessageText = `💬 ${chatData.queuePosition !== null ? 'Новий користувач в черзі' : 'Нове повідомлення в чаті'}\n\n`
          
          if (chatData.userName || chatData.userEmail || chatData.userPhone) {
            chatMessageText += `👤 Користувач:\n`
            if (chatData.userName) chatMessageText += `Ім'я: ${chatData.userName}\n`
            if (chatData.userEmail) chatMessageText += `Email: ${chatData.userEmail}\n`
            if (chatData.userPhone) chatMessageText += `Телефон: ${chatData.userPhone}\n`
            chatMessageText += `\n`
          }
          
          if (chatData.queuePosition !== null && chatData.queuePosition !== undefined) {
            chatMessageText += `⏳ Позиція в черзі: ${chatData.queuePosition + 1}\n\n`
          }
          
          chatMessageText += `🔑 Сесія: <code>${chatData.sessionId}</code>\n`
          if (chatData.messageText) {
            chatMessageText += `💭 Повідомлення: ${chatData.messageText}\n`
          }
          chatMessageText += `Від: ${chatData.senderType === 'user' ? 'Користувач' : 'Менеджер'}\n\n`
          chatMessageText += `💬 <b>Щоб відповісти:</b>\n` +
            `1️⃣ Відповідайте на це повідомлення\n` +
            `2️⃣ Або: <code>/reply ${chatData.sessionId} ваша відповідь</code>`

          // Send email notification for chat message
          const emailHtml = `
            <!DOCTYPE html>
            <html lang="uk">
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: #111111;
                    background-color: #f5f5f5;
                    padding: 20px;
                  }
                  .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    padding: 32px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                    background: linear-gradient(135deg, #28694D 0%, #1e5638 100%);
                    color: #ffffff;
                    padding: 24px;
                    border-radius: 8px;
                    margin-bottom: 24px;
                  }
                  .message-box {
                    background-color: #fafafa;
                    border-left: 4px solid #28694D;
                    border-radius: 8px;
                    padding: 16px;
                    margin: 16px 0;
                  }
                  .footer {
                    margin-top: 24px;
                    padding-top: 24px;
                    border-top: 1px solid #e0e0e0;
                    font-size: 12px;
                    color: #666;
                  }
                </style>
              </head>
              <body>
                <div class="email-container">
                  <div class="header">
                    <h1>💬 Нове повідомлення в чаті</h1>
                  </div>
                  <div class="message-box">
                    <p><strong>Сесія:</strong> ${chatData.sessionId}</p>
                    <p><strong>Від:</strong> ${chatData.senderType === 'user' ? 'Користувач' : 'Менеджер'}</p>
                    <p><strong>Повідомлення:</strong></p>
                    <p style="margin-top: 8px; white-space: pre-wrap;">${chatData.messageText}</p>
                  </div>
                  <div class="footer">
                    <p>Це автоматичне повідомлення з системи чату.</p>
                  </div>
                </div>
              </body>
            </html>
          `

          // Use separate Telegram group for chat requests if configured, otherwise fall back to general group
          const telegramChatId = env.TELEGRAM_CHAT_GROUP_ID || env.TELEGRAM_GROUP_CHAT_ID

          // Process email and Telegram notifications in parallel
          const fromAddress = env.RESEND_FROM || 'onboarding@resend.dev'
          const [emailResult, telegramResult] = await Promise.allSettled([
            sendChatEmailNotification(chatData, emailHtml, env.RESEND_API_KEY || '', fromAddress),
            env.TELEGRAM_BOT_TOKEN && telegramChatId
              ? notifyGroup(
                  telegramChatId,
                  env.TELEGRAM_BOT_TOKEN,
                  chatMessageText
                )
              : Promise.resolve({ success: false, error: 'Telegram not configured' }),
          ])

          // Log results
          if (emailResult.status === 'fulfilled' && emailResult.value.success) {
            console.log('Chat email notification sent successfully')
          } else {
            const error =
              emailResult.status === 'rejected'
                ? emailResult.reason
                : emailResult.value.error
            console.error('Failed to send chat email notification:', error)
          }

          if (telegramResult.status === 'fulfilled' && telegramResult.value.success) {
            console.log('Chat Telegram notification sent successfully')
          } else {
            const error =
              telegramResult.status === 'rejected'
                ? telegramResult.reason
                : telegramResult.value.error
            console.error('Failed to send chat Telegram notification:', error)
          }

          // Only ack if at least one notification succeeded
          if (
            (emailResult.status === 'fulfilled' && emailResult.value.success) ||
            (telegramResult.status === 'fulfilled' && telegramResult.value.success)
          ) {
            message.ack()
          } else {
            message.retry()
          }
        } else {
          console.warn('Unknown notification type:', type)
          message.ack() // Ack unknown types to prevent infinite retries
        }
      } catch (error) {
        console.error('Error processing notification message:', error)
        // Retry on unexpected errors
        message.retry()
      }
    }
  },
}
