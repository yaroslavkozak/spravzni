import { createFileRoute } from '@tanstack/react-router'
import { Resend } from 'resend'
import type { Env } from '@/types/cloudflare'
import { notifyGroup } from '@/src/lib/telegram/notify-admins'
import { createFormSubmission } from '@/src/lib/database/form-submissions'

interface ChatFormData {
  message: string
  responseMethod: 'whatsapp' | 'phone' | 'email' | null
  phone?: string
  email?: string
}

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatResponseMethod(method: string | null): string {
  const methodMap: Record<string, string> = {
    whatsapp: 'WhatsApp',
    phone: 'Телефон',
    email: 'Електронна пошта',
  }
  return method ? methodMap[method] || method : 'Не вказано'
}

function formatTelegramMessage(data: ChatFormData): string {
  let message = `<b>Нове повідомлення з чату</b>\n\n`
  message += `<b>Повідомлення:</b>\n${escapeHtml(data.message)}\n\n`
  message += `<b>Бажаний спосіб відповіді:</b> ${formatResponseMethod(data.responseMethod)}\n`

  if (data.phone) {
    message += `📱 <b>Телефон:</b> <code>${escapeHtml(data.phone)}</code>\n`
  }

  if (data.email) {
    message += `✉️ <b>Електронна пошта:</b> ${escapeHtml(data.email)}\n`
  }

  return message
}

function formatEmailHtml(data: ChatFormData): string {
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
          .header {
            background: linear-gradient(135deg, #28694D 0%, #1e5638 100%);
            color: #ffffff;
            padding: 32px 24px;
            text-align: center;
          }
          .header h1 {
            font-size: 24px;
            font-weight: 600;
            margin: 0;
            letter-spacing: -0.5px;
          }
          .content {
            padding: 32px 24px;
          }
          .field-card {
            background-color: #fafafa;
            border-left: 4px solid #28694D;
            border-radius: 8px;
            padding: 16px 20px;
            margin-bottom: 16px;
          }
          .field-label {
            font-size: 12px;
            font-weight: 600;
            color: #28694D;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
          }
          .field-value {
            font-size: 16px;
            color: #111111;
            font-weight: 400;
            line-height: 1.5;
            word-wrap: break-word;
            white-space: pre-wrap;
          }
          .field-value.phone {
            font-size: 18px;
            font-weight: 500;
            color: #28694D;
          }
          .field-value.email {
            color: #28694D;
          }
          .footer {
            background-color: #f9f9f9;
            padding: 24px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
          }
          .footer p {
            font-size: 12px;
            color: #888;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Нове повідомлення з чату</h1>
          </div>
          <div class="content">
            <div class="field-card">
              <div class="field-label">Повідомлення</div>
              <div class="field-value">${escapeHtml(data.message)}</div>
            </div>
            
            <div class="field-card">
              <div class="field-label">Бажаний спосіб відповіді</div>
              <div class="field-value">${formatResponseMethod(data.responseMethod)}</div>
            </div>
            
            ${data.phone ? `
            <div class="field-card">
              <div class="field-label">Телефон</div>
              <div class="field-value phone">${escapeHtml(data.phone)}</div>
            </div>
            ` : ''}
            
            ${data.email ? `
            <div class="field-card">
              <div class="field-label">Електронна пошта</div>
              <div class="field-value email">${escapeHtml(data.email)}</div>
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>Це автоматичне повідомлення з чату підтримки Spravzni</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export const Route = createFileRoute('/api/chat/submit')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        try {
          const body = await request.json() as ChatFormData

          // Validate required fields
          if (!body.message || !body.message.trim()) {
            return new Response(
              JSON.stringify({ error: 'Message is required' }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Validate response method and contact info
          if (!body.responseMethod) {
            return new Response(
              JSON.stringify({ error: 'Response method is required' }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          if ((body.responseMethod === 'phone' || body.responseMethod === 'whatsapp') && !body.phone) {
            return new Response(
              JSON.stringify({ error: 'Phone is required for selected response method' }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          if (body.responseMethod === 'email' && !body.email) {
            return new Response(
              JSON.stringify({ error: 'Email is required for selected response method' }),
              {
                status: 400,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Get environment variables
          let env: Env | null = null
          try {
            env = context.env as Env
          } catch (error) {
            console.warn('Cloudflare context not available:', error)
            // In development, return success but don't send notifications
            return new Response(
              JSON.stringify({ 
                success: true, 
                message: 'Form submitted successfully. We will contact you soon!',
                warning: 'Notification service unavailable in development mode'
              }),
              {
                status: 200,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // Save form submission to database
          if (env?.DB) {
            try {
              // Extract request metadata
              const ipAddress = request.headers.get('cf-connecting-ip') || 
                               request.headers.get('x-forwarded-for') || 
                               request.headers.get('x-real-ip') || 
                               null
              const userAgent = request.headers.get('user-agent') || null
              const referrer = request.headers.get('referer') || null

              await createFormSubmission(env.DB, {
                form_type: 'chat',
                name: null, // Chat form doesn't collect name
                phone: body.phone || null,
                email: body.email || null,
                form_data: body,
                ip_address: ipAddress,
                user_agent: userAgent,
                referrer: referrer,
              })
            } catch (dbError) {
              console.error('Error saving form submission to database:', dbError)
              // Don't fail the request if database save fails
            }
          }

          // Send email via Resend
          if (env.RESEND_API_KEY) {
            try {
              const resend = new Resend(env.RESEND_API_KEY)
              const emailHtml = formatEmailHtml(body)
              const fromAddress = env.RESEND_FROM || 'onboarding@resend.dev'

              await resend.emails.send({
                from: fromAddress,
                to: ['yaroslav.kozak.dev@gmail.com', 'spravzhni.lviv@gmail.com'],
                subject: 'Нове повідомлення з чату - Spravzni',
                html: emailHtml,
                text: `Нове повідомлення з чату\n\nПовідомлення: ${body.message}\nБажаний спосіб відповіді: ${formatResponseMethod(body.responseMethod)}${body.phone ? `\nТелефон: ${body.phone}` : ''}${body.email ? `\nЕлектронна пошта: ${body.email}` : ''}`,
              })
            } catch (emailError) {
              console.error('Error sending email:', emailError)
              // Don't fail the request if email fails
            }
          }

          // Send Telegram notification
          if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_GROUP_CHAT_ID) {
            try {
              const telegramMessage = formatTelegramMessage(body)
              await notifyGroup(
                env.TELEGRAM_GROUP_CHAT_ID,
                env.TELEGRAM_BOT_TOKEN,
                telegramMessage
              )
            } catch (telegramError) {
              console.error('Error sending Telegram notification:', telegramError)
              // Don't fail the request if Telegram fails
            }
          }

          // Return success response
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'Form submitted successfully. We will contact you soon!'
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        } catch (error) {
          console.error('Error processing chat form:', error)
          return new Response(
            JSON.stringify({ 
              error: 'Failed to process request',
              details: error instanceof Error ? error.message : 'Unknown error'
            }),
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        }
      },
    },
  },
})
