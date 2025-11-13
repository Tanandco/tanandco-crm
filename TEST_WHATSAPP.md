# 🧪 בדיקת WhatsApp - Tan & Co CRM

## בדיקה מקומית (לפני הפריסה)

### Windows PowerShell:

```powershell
# העתק את הקובץ test-whatsapp.ps1
# הרץ:
.\test-whatsapp.ps1 -PhoneNumber "972501234567"
```

### Linux/Mac:

```bash
# העתק את הקובץ test-whatsapp.sh
# הרץ:
chmod +x test-whatsapp.sh
./test-whatsapp.sh 972501234567
```

---

## בדיקה ידנית עם curl:

### Windows PowerShell:

```powershell
# ⚠️ החלף בערך האמיתי מ-Cloud Run או מ-Replit
$WHATSAPP_ACCESS_TOKEN = "YOUR_WHATSAPP_ACCESS_TOKEN_HERE"

curl.exe -i -X POST `
  "https://graph.facebook.com/v18.0/699582612923896/messages" `
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{
    "messaging_product": "whatsapp",
    "to": "972501234567",
    "type": "text",
    "text": { "body": "בדיקה - Tan & Co מחובר בהצלחה! 🎉" }
  }'
```

### Linux/Mac:

```bash
# ⚠️ החלף בערך האמיתי מ-Cloud Run או מ-Replit
export WHATSAPP_ACCESS_TOKEN="YOUR_WHATSAPP_ACCESS_TOKEN_HERE"

curl -i -X POST \
  "https://graph.facebook.com/v18.0/699582612923896/messages" \
  -H "Authorization: Bearer $WHATSAPP_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "972501234567",
    "type": "text",
    "text": { "body": "בדיקה - Tan & Co מחובר בהצלחה! 🎉" }
  }'
```

---

## בדיקה אחרי הפריסה (מ-Cloud Run):

### דרך API של האפליקציה:

```bash
# אחרי שהאפליקציה פרוסה
curl -X POST https://crm.tanandco.co.il/api/chat/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "972501234567",
    "message": "בדיקה - Tan & Co מחובר בהצלחה! 🎉"
  }'
```

---

## מה לבדוק:

### ✅ אם קיבלת 200 OK:
- ה-Token תקין ✅
- ה-Phone Number ID תקין ✅
- המספר נגיש ל-WhatsApp ✅

### ❌ אם קיבלת שגיאה:

#### 401 Unauthorized:
- ה-Token לא תקין או פג תוקף
- בדוק את ה-Token ב-Meta for Developers

#### 400 Bad Request:
- המספר לא בפורמט נכון (צריך: 972XXXXXXXXX)
- או שהמספר לא נגיש ל-WhatsApp

#### 403 Forbidden:
- ה-Phone Number ID לא נכון
- או שאין הרשאות לשלוח למספר הזה

---

## פורמט מספר טלפון:

- ✅ נכון: `972501234567` (ללא +, ללא מקפים)
- ❌ שגוי: `+972-50-123-4567`
- ❌ שגוי: `050-123-4567`
- ❌ שגוי: `972-50-123-4567`

---

## הערות חשובות:

1. **מספר חייב להיות רשום ב-WhatsApp Business** (או להיות מספר בדיקה)
2. **ה-Token חייב להיות Long-Lived Token** (לא Short-Lived)
3. **ה-Phone Number ID** חייב להיות נכון (699582612923896)

---

**עודכן:** דצמבר 2025

