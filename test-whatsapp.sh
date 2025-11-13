#!/bin/bash
# בדיקת שליחת הודעת WhatsApp
# שימוש: ./test-whatsapp.sh <מספר_טלפון>

# Token מ-Cloud Run (החלף בערך האמיתי)
# ⚠️ החלף בערך האמיתי מ-Cloud Run או מ-Replit
WHATSAPP_ACCESS_TOKEN="YOUR_WHATSAPP_ACCESS_TOKEN_HERE"

# Phone Number ID
PHONE_NUMBER_ID="699582612923896"

# API Version
API_VERSION="v18.0"

# מספר טלפון (פורמט: 972XXXXXXXXX)
TO_PHONE="${1:-972501234567}"

echo "📱 שולח הודעת בדיקה ל-WhatsApp..."
echo "📞 למספר: $TO_PHONE"
echo ""

curl -i -X POST \
  "https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages" \
  -H "Authorization: Bearer ${WHATSAPP_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"messaging_product\": \"whatsapp\",
    \"to\": \"${TO_PHONE}\",
    \"type\": \"text\",
    \"text\": { \"body\": \"בדיקה - Tan & Co מחובר בהצלחה! 🎉\" }
  }"

echo ""
echo ""
echo "✅ אם קיבלת 200 OK - הכל עובד!"

