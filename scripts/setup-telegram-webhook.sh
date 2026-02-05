#!/bin/bash

# Script to set up Telegram webhook for manager replies
# Usage: ./scripts/setup-telegram-webhook.sh [BOT_TOKEN]

BOT_TOKEN="${1:-}"
WEBHOOK_URL="https://spravzni.yaroslavkozak.workers.dev/api/telegram/webhook"

if [ -z "$BOT_TOKEN" ]; then
  echo "❌ Error: Bot token required"
  echo ""
  echo "Usage: ./scripts/setup-telegram-webhook.sh <BOT_TOKEN>"
  echo ""
  echo "Or set it as environment variable:"
  echo "  export TELEGRAM_BOT_TOKEN=your_token"
  echo "  ./scripts/setup-telegram-webhook.sh \$TELEGRAM_BOT_TOKEN"
  exit 1
fi

echo "🔗 Setting up Telegram webhook..."
echo "Webhook URL: $WEBHOOK_URL"
echo ""

# Set webhook
echo "Setting webhook..."
RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${WEBHOOK_URL}\"}")

echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Verify webhook
echo "Verifying webhook..."
WEBHOOK_INFO=$(curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo")
echo "$WEBHOOK_INFO" | jq '.' 2>/dev/null || echo "$WEBHOOK_INFO"
echo ""

echo "✅ Webhook setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Send a test message to your Telegram group"
echo "2. Reply to a chat notification"
echo "3. Check website chat to see the reply"
