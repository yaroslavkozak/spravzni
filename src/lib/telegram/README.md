# Telegram Notifications for Admins

This module provides utilities for sending Telegram notifications to admin users when new contact form submissions are received.

## 📁 Structure

```
src/lib/telegram/
├── index.ts              # Main exports
├── notify-admins.ts      # Core notification functionality
├── message-formatter.ts  # Message formatting utilities
└── README.md            # This file
```

## 🚀 Setup

### 1. Database Schema

The `users` table must have the following fields for admin notifications to work:

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT,
  name TEXT,
  email TEXT,
  user_type TEXT CHECK(user_type IN ('customer', 'trainer', 'admin')),
  telegram_chat_id INTEGER,
  telegram_username TEXT,
  telegram_linked_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster admin queries
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_telegram_chat_id ON users(telegram_chat_id);
```

If your users table doesn't have these fields, you can add them with a migration:

```sql
-- Add missing columns if they don't exist
ALTER TABLE users ADD COLUMN user_type TEXT DEFAULT 'customer';
ALTER TABLE users ADD COLUMN telegram_chat_id INTEGER;
ALTER TABLE users ADD COLUMN telegram_username TEXT;
ALTER TABLE users ADD COLUMN telegram_linked_at TEXT;
```

### 2. Environment Variables

Add the Telegram bot token to your Cloudflare Workers environment:

**In `wrangler.toml` or via Cloudflare Dashboard:**

```toml
[vars]
TELEGRAM_BOT_TOKEN = "your_bot_token_here"
```

Or set it as a secret (recommended for production):

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
```

### 3. Create a Telegram Bot

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Use `/newbot` command
3. Follow instructions to create bot
4. Save the bot token
5. Share the bot with your admin users

### 4. Link Admin Users to Telegram

Admin users need to:
1. Start a conversation with your Telegram bot
2. Share their phone number or link their account
3. The bot should store their `telegram_chat_id` in the database

The `telegram_chat_id` is automatically set when a user interacts with the bot. You may need to implement a bot webhook handler similar to the one in `/Users/yaroslavkozak/Desktop/Projects/rudholm.new/external/TELEGRAM_OTP/backend/api/telegram/webhook.ts`.

## 📖 Usage

### In API Routes

```typescript
import { notifyAdmins, formatContactFormMessage } from '@/src/lib/telegram'
import type { Env } from '@/types/cloudflare'

// In your API handler
const env = context.env as Env
const db = env.DB
const botToken = env.TELEGRAM_BOT_TOKEN

// Format the message
const message = formatContactFormMessage(formData)

// Send notifications (non-blocking)
notifyAdmins(db, botToken, message)
  .then((result) => {
    console.log(`Notified ${result.notifiedCount}/${result.totalAdmins} admins`)
  })
  .catch((err) => {
    console.error('Failed to notify admins:', err)
  })
```

### Message Formatting

The `formatContactFormMessage` function creates an HTML-formatted message for Telegram:

```typescript
const message = formatContactFormMessage({
  name: 'John Doe',
  phone: '+380501234567',
  email: 'john@example.com',
  contactPreference: 'phone',
  selectedInterests: ['active', 'spa'],
  comment: 'Interested in booking',
  wantsPriceList: true
})
```

## 🔧 API Reference

### `notifyAdmins(DB, botToken, message)`

Sends a Telegram message to all admin users with linked Telegram accounts.

**Parameters:**
- `DB: D1Database` - Cloudflare D1 database instance
- `botToken: string | undefined` - Telegram bot token
- `message: string` - HTML-formatted message to send

**Returns:**
```typescript
{
  success: boolean
  notifiedCount: number
  totalAdmins: number
  errors?: Array<{ chatId: number; error: string }>
}
```

### `formatContactFormMessage(data)`

Formats contact form data as an HTML message for Telegram.

**Parameters:**
- `data: ContactFormData` - Contact form submission data

**Returns:** `string` - HTML-formatted message

### `formatSimpleMessage(title, content)`

Formats a simple text message.

**Parameters:**
- `title: string` - Message title
- `content: string` - Message content

**Returns:** `string` - Formatted message

## 🛡️ Error Handling

The notification system is designed to be non-blocking:
- If Telegram bot token is not configured, notifications are skipped
- If no admins are found, the function returns success with `notifiedCount: 0`
- Individual notification failures are logged but don't stop the process
- The main API response is not affected by notification failures

## 📝 Notes

- Notifications are sent asynchronously and don't block the main API response
- Messages use HTML parse mode for formatting
- Only users with `user_type = 'admin'` and `telegram_chat_id IS NOT NULL` receive notifications
- The system gracefully handles missing configuration or database errors

## 🔗 Related Files

- `/src/routes/api/contact.ts` - Contact form API endpoint (uses this module)
- `/types/cloudflare.d.ts` - Environment type definitions
