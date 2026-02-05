import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { createChatMessage } from '@/src/lib/chat-database'
import { ChatRoom } from '@/src/workers/chat-room'

/**
 * Telegram Webhook Endpoint
 * 
 * Receives messages from Telegram and forwards them to chat sessions.
 * 
 * Message format expected:
 * - Reply to a notification message that contains "Сесія: [session-id]"
 * - Or message starting with "/reply [session-id] [message]"
 * - Or message starting with "Сесія: [session-id]" followed by the reply
 */

interface TelegramUpdate {
  update_id: number
  message?: {
    message_id: number
    from?: {
      id: number
      is_bot: boolean
      first_name: string
      username?: string
    }
    chat: {
      id: number
      type: string
    }
    date: number
    text?: string
    reply_to_message?: {
      message_id: number
      text?: string
    }
  }
}

export const Route = createFileRoute('/api/telegram/webhook')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        try {
          const env = context.env as Env

          // Verify this is from Telegram (optional but recommended)
          const url = new URL(request.url)
          const secret = url.searchParams.get('secret')
          // You can add secret verification here if needed

          const update: TelegramUpdate = await request.json()

          // Only process messages (not other update types)
          if (!update.message || !update.message.text) {
            return new Response(JSON.stringify({ ok: true }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          let messageText = update.message.text.trim()
          const chatId = update.message.chat.id.toString()

          // Verify this is from the chat group
          const expectedChatId = env.TELEGRAM_CHAT_GROUP_ID || env.TELEGRAM_GROUP_CHAT_ID
          if (chatId !== expectedChatId?.replace('-', '')) {
            console.log(`Ignoring message from chat ${chatId}, expected ${expectedChatId}`)
            return new Response(JSON.stringify({ ok: true }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          // Extract session ID from message
          let sessionId: string | null = null

          // Method 1: Check if replying to a message with session ID
          if (update.message.reply_to_message?.text) {
            const replyText = update.message.reply_to_message.text
            const sessionMatch = replyText.match(/Сесія:\s*([a-f0-9-]+)/i) || replyText.match(/🔑 Сесія:\s*<code>([a-f0-9-]+)<\/code>/i)
            if (sessionMatch) {
              sessionId = sessionMatch[1]
            }
          }

          // Method 2: Check if message starts with "/reply [session-id]"
          if (!sessionId && messageText.startsWith('/reply ')) {
            const parts = messageText.split(' ')
            if (parts.length >= 3) {
              sessionId = parts[1]
              // Remove the command and session ID, keep the rest as the message
              messageText = parts.slice(2).join(' ')
            }
          }

          // Method 3: Check if message contains "Сесія: [session-id]" at the start
          if (!sessionId) {
            const sessionMatch = messageText.match(/^Сесія:\s*([a-f0-9-]+)\s+(.+)/i)
            if (sessionMatch) {
              sessionId = sessionMatch[1]
              messageText = sessionMatch[2].trim()
            }
          }

          // Method 4: Try to find session ID anywhere in the message
          if (!sessionId) {
            const sessionMatch = messageText.match(/Сесія:\s*([a-f0-9-]+)/i)
            if (sessionMatch) {
              sessionId = sessionMatch[1]
              // Remove session ID part from message
              messageText = messageText.replace(/Сесія:\s*[a-f0-9-]+\s*/i, '').trim()
            }
          }

          if (!sessionId) {
            // No session ID found - send help message
            if (env.TELEGRAM_BOT_TOKEN) {
              await sendTelegramMessage(
                chatId,
                `❌ Не вдалося знайти ID сесії в повідомленні.\n\n` +
                `Щоб відповісти:\n` +
                `1. Відповісти на повідомлення з сесією\n` +
                `2. Або написати: /reply [session-id] [ваша відповідь]\n` +
                `3. Або: Сесія: [session-id] [ваша відповідь]`,
                env.TELEGRAM_BOT_TOKEN
              )
            }
            return new Response(JSON.stringify({ ok: true }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          if (!messageText || messageText.length === 0) {
            return new Response(JSON.stringify({ ok: true }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          // Save manager message to database
          const messageId = crypto.randomUUID()
          await createChatMessage(env.DB, {
            id: messageId,
            session_id: sessionId,
            sender_type: 'manager',
            message_text: messageText,
          })

          // Broadcast to WebSocket clients via Durable Object
          if (env.CHAT_ROOM) {
            try {
              const id = env.CHAT_ROOM.idFromName(sessionId)
              const chatRoom = env.CHAT_ROOM.get(id)

              // Get base URL from env or use default
              const baseUrl = env.BASE_URL || 'https://spravzni.yaroslavkozak.workers.dev'

              // Send message via Durable Object
              await chatRoom.fetch(
                new Request(`${baseUrl}/api/chat/send`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    sessionId,
                    text: messageText,
                    senderType: 'manager',
                  }),
                })
              )
            } catch (error) {
              console.error('Error broadcasting manager message:', error)
              // Message is already saved to database, so it's okay if broadcast fails
            }
          } else {
            // Fallback: Message is already saved, just need to notify clients
            // Clients will pick it up on next poll or reconnect
          }

          // Send confirmation to Telegram
          if (env.TELEGRAM_BOT_TOKEN) {
            await sendTelegramMessage(
              chatId,
              `✅ Відповідь відправлена до сесії ${sessionId.substring(0, 8)}...`,
              env.TELEGRAM_BOT_TOKEN
            )
          }

          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          console.error('Error processing Telegram webhook:', error)
          return new Response(
            JSON.stringify({
              ok: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }
      },
      GET: async ({ request, context }) => {
        // Health check endpoint
        return new Response(JSON.stringify({ status: 'ok', service: 'telegram-webhook' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})

/**
 * Helper function to send Telegram message
 */
async function sendTelegramMessage(
  chatId: string,
  text: string,
  botToken: string
): Promise<void> {
  const chatIdValue = parseInt(chatId.replace('-', ''), 10)
  
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatIdValue,
      text: text,
      parse_mode: 'HTML',
    }),
  })
}
