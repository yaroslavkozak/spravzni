#!/bin/bash

# Test script for chat API endpoints
# This tests the chat functionality without opening a browser

BASE_URL="${1:-https://spravzni.yaroslavkozak.workers.dev}"

echo "🧪 Testing Chat API Endpoints"
echo "Base URL: $BASE_URL"
echo ""

# Generate test user identifier
USER_ID=$(uuidgen 2>/dev/null || echo "test-user-$(date +%s)")

echo "1️⃣ Testing questionnaire submission..."
QUESTIONNAIRE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/chat/questionnaire" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test User\",
    \"email\": \"test@example.com\",
    \"phone\": \"+380501234567\",
    \"userIdentifier\": \"$USER_ID\"
  }")

echo "Response: $QUESTIONNAIRE_RESPONSE"
echo ""

SESSION_ID=$(echo "$QUESTIONNAIRE_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$SESSION_ID" ]; then
  echo "❌ Failed to get session ID"
  exit 1
fi

echo "✅ Session created: $SESSION_ID"
echo ""

echo "2️⃣ Testing session retrieval..."
SESSION_RESPONSE=$(curl -s "$BASE_URL/api/chat/sessions?sessionId=$SESSION_ID")
echo "Response: $SESSION_RESPONSE"
echo ""

echo "3️⃣ Testing message sending..."
MESSAGE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/chat/send" \
  -H "Content-Type: application/json" \
  -d "{
    \"sessionId\": \"$SESSION_ID\",
    \"text\": \"Test message from API\"
  }")

echo "Response: $MESSAGE_RESPONSE"
echo ""

echo "4️⃣ Testing message history..."
MESSAGES_RESPONSE=$(curl -s "$BASE_URL/api/chat/messages?sessionId=$SESSION_ID&recent=true&limit=10")
echo "Response: $MESSAGES_RESPONSE"
echo ""

echo "✅ All API tests completed!"
echo ""
echo "📱 Check your Telegram group (-5008375250) for notifications:"
echo "   - User info when questionnaire is submitted"
echo "   - Message notification when message is sent"
echo ""
