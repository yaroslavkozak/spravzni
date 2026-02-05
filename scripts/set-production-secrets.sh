#!/bin/bash

# Script to set all production secrets in Cloudflare Workers
# Usage: ./scripts/set-production-secrets.sh

echo "🔐 Setting production secrets for Cloudflare Workers..."
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Error: wrangler CLI not found. Install it with: npm install -g wrangler"
    exit 1
fi

echo "📋 Secrets to set:"
echo "  1. TELEGRAM_BOT_TOKEN"
echo "  2. TELEGRAM_GROUP_CHAT_ID (general notifications)"
echo "  3. TELEGRAM_CHAT_GROUP_ID (chat requests: -5008375250)"
echo "  4. RESEND_API_KEY"
echo "  5. LIQPAY_PUBLIC_KEY"
echo "  6. LIQPAY_PRIVATE_KEY"
echo "  7. MONOBANK_API_TOKEN"
echo "  8. BASE_URL"
echo ""

# Set secrets interactively
echo "Setting TELEGRAM_BOT_TOKEN..."
wrangler secret put TELEGRAM_BOT_TOKEN

echo ""
echo "Setting TELEGRAM_GROUP_CHAT_ID (general notifications)..."
wrangler secret put TELEGRAM_GROUP_CHAT_ID

echo ""
echo "Setting TELEGRAM_CHAT_GROUP_ID (chat requests: -5008375250)..."
echo "-5008375250" | wrangler secret put TELEGRAM_CHAT_GROUP_ID

echo ""
echo "Setting RESEND_API_KEY..."
wrangler secret put RESEND_API_KEY

echo ""
echo "Setting LIQPAY_PUBLIC_KEY..."
wrangler secret put LIQPAY_PUBLIC_KEY

echo ""
echo "Setting LIQPAY_PRIVATE_KEY..."
wrangler secret put LIQPAY_PRIVATE_KEY

echo ""
echo "Setting MONOBANK_API_TOKEN..."
wrangler secret put MONOBANK_API_TOKEN

echo ""
echo "Setting BASE_URL..."
wrangler secret put BASE_URL

echo ""
echo "✅ All secrets have been set!"
echo ""
echo "📝 Note: To verify secrets, check Cloudflare Dashboard → Workers → spravzni → Settings → Variables and Secrets"
