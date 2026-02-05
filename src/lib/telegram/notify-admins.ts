/**
 * Utility function to send Telegram notifications to admin users
 * 
 * This function queries the database for all admin users with linked Telegram accounts
 * and sends them a notification message via the Telegram Bot API.
 */

import type { D1Database } from '@/types/cloudflare'

interface AdminUser {
  id: number
  telegram_chat_id: number
  telegram_username: string | null
  name: string | null
  phone: string
}

/**
 * Send a message to a Telegram chat (supports both user chat IDs and group chat IDs)
 */
async function sendTelegramMessage(
  chatId: number | string,
  text: string,
  botToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Convert string chat ID to number if needed (for negative group IDs like "-5078474468")
    const chatIdValue = typeof chatId === 'string' ? parseInt(chatId, 10) : chatId
    
    const requestBody = {
      chat_id: chatIdValue,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }
    
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    )

    const responseText = await response.text()
    
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse Telegram API response:', parseError)
      return {
        success: false,
        error: `Failed to parse response: ${responseText.substring(0, 100)}`,
      }
    }

    if (!response.ok || !data.ok) {
      console.error('Telegram API error:', {
        status: response.status,
        errorCode: data.error_code,
        description: data.description,
      })
      return {
        success: false,
        error: data.description || `HTTP ${response.status}`,
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending Telegram message:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get all admin users with linked Telegram accounts
 */
async function getAdminUsers(DB: D1Database): Promise<AdminUser[]> {
  try {
    const admins = await DB.prepare(
      `SELECT id, telegram_chat_id, telegram_username, name, phone 
       FROM users 
       WHERE user_type = 'admin' 
       AND telegram_chat_id IS NOT NULL`
    )
      .all<AdminUser>()

    return admins.results || []
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return []
  }
}

/**
 * Send notification to a Telegram group chat
 * 
 * @param groupChatId Telegram group chat ID (can be negative for groups)
 * @param botToken Telegram bot token
 * @param message HTML-formatted message to send
 * @returns Object with success status
 */
export async function notifyGroup(
  groupChatId: string | number | undefined,
  botToken: string | undefined,
  message: string
): Promise<{ success: boolean; error?: string }> {
  if (!botToken) {
    console.warn('Telegram bot token not configured, skipping group notification')
    return { success: false, error: 'Bot token not configured' }
  }

  if (!groupChatId) {
    console.warn('Telegram group chat ID not configured, skipping group notification')
    return { success: false, error: 'Group chat ID not configured' }
  }

  try {
    const result = await sendTelegramMessage(groupChatId, message, botToken)
    
    if (!result.success) {
      console.error(`Failed to send Telegram notification to group ${groupChatId}:`, result.error)
    }
    
    return result
  } catch (error) {
    console.error('Error in notifyGroup:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send notification to all admin users via Telegram
 * 
 * @param DB D1Database instance
 * @param botToken Telegram bot token
 * @param message HTML-formatted message to send
 * @returns Object with success status and details about sent notifications
 */
export async function notifyAdmins(
  DB: D1Database,
  botToken: string | undefined,
  message: string
): Promise<{
  success: boolean
  notifiedCount: number
  totalAdmins: number
  errors?: Array<{ chatId: number; error: string }>
}> {
  // Check if bot token is configured
  if (!botToken) {
    console.warn('Telegram bot token not configured, skipping admin notifications')
    return {
      success: false,
      notifiedCount: 0,
      totalAdmins: 0,
    }
  }

  try {
    // Get all admin users with Telegram linked
    const admins = await getAdminUsers(DB)

    if (admins.length === 0) {
      console.log('No admin users with linked Telegram accounts found')
      return {
        success: true,
        notifiedCount: 0,
        totalAdmins: 0,
      }
    }

    console.log(`Found ${admins.length} admin(s) with Telegram linked. Sending notifications...`)

    // Send notification to each admin
    const results = await Promise.allSettled(
      admins.map((admin) =>
        sendTelegramMessage(admin.telegram_chat_id, message, botToken)
      )
    )

    // Count successes and collect errors
    let successCount = 0
    const errors: Array<{ chatId: number; error: string }> = []

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.success) {
        successCount++
      } else {
        const admin = admins[index]
        const error =
          result.status === 'rejected'
            ? result.reason?.message || 'Unknown error'
            : result.value.error || 'Unknown error'
        errors.push({
          chatId: admin.telegram_chat_id,
          error,
        })
        console.error(
          `Failed to notify admin ${admin.id} (chat_id: ${admin.telegram_chat_id}):`,
          error
        )
      }
    })

    console.log(
      `Admin notifications sent: ${successCount}/${admins.length} successful`
    )

    return {
      success: successCount > 0,
      notifiedCount: successCount,
      totalAdmins: admins.length,
      ...(errors.length > 0 && { errors }),
    }
  } catch (error) {
    console.error('Error notifying admins:', error)
    return {
      success: false,
      notifiedCount: 0,
      totalAdmins: 0,
      errors: [
        {
          chatId: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      ],
    }
  }
}
