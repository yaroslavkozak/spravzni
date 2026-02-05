#!/bin/bash

# Script to set Instagram secrets in Cloudflare Workers
# Usage: ./scripts/set-instagram-secrets.sh

echo "🔐 Setting Instagram secrets for Cloudflare Workers..."
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Error: wrangler CLI not found. Install it with: npm install -g wrangler"
    exit 1
fi

# Instagram credentials
INSTAGRAM_ACCESS_TOKEN="IGAAKnCuxsEmZABZAFk0NDVkQ2RlQkJEOU5ieTNETURONHdZAbC1wZAW5MQ3NXZAFVXR2IxcGJiazdyTDZApeFR5blBTMHBZAcUZAhRVNyVnhpYzJUTDZA6NmdVZAnFoZAmF6X1V5WThiQUdUSUEzQXhLdVZAGN0xmQ05IM3QxbG1qVmNCNC03RQZDZD"
INSTAGRAM_USER_ID="26040451588882979"

echo "📋 Setting the following secrets:"
echo "   - INSTAGRAM_ACCESS_TOKEN"
echo "   - INSTAGRAM_USER_ID: $INSTAGRAM_USER_ID"
echo ""

# Set Instagram Access Token
echo "Setting INSTAGRAM_ACCESS_TOKEN..."
echo "$INSTAGRAM_ACCESS_TOKEN" | wrangler secret put INSTAGRAM_ACCESS_TOKEN

if [ $? -eq 0 ]; then
    echo "✅ INSTAGRAM_ACCESS_TOKEN set successfully"
else
    echo "❌ Failed to set INSTAGRAM_ACCESS_TOKEN"
    exit 1
fi

echo ""

# Set Instagram User ID
echo "Setting INSTAGRAM_USER_ID..."
echo "$INSTAGRAM_USER_ID" | wrangler secret put INSTAGRAM_USER_ID

if [ $? -eq 0 ]; then
    echo "✅ INSTAGRAM_USER_ID set successfully"
else
    echo "❌ Failed to set INSTAGRAM_USER_ID"
    exit 1
fi

echo ""
echo "✅ All Instagram secrets have been set!"
echo ""
echo "📝 Next steps:"
echo "   1. Build the project: bun run build"
echo "   2. Deploy to Cloudflare: npx wrangler deploy"
echo "   3. Visit your homepage to see Instagram posts"
echo ""
echo "💡 To verify secrets, check Cloudflare Dashboard → Workers → spravzni → Settings → Variables and Secrets"
