# 📊 סטטוס האינטגרציות - Tan & Co CRM

## ✅ אינטגרציות פעילות ומוגדרות

### 1. WhatsApp Business API ⭐
**סטטוס:** ✅ פעיל ומוגדר

**משתני סביבה:**
- ✅ `WA_PHONE_NUMBER_ID=699582612923896`
- ✅ `CLOUD_API_ACCESS_TOKEN` - מוגדר
- ✅ `CLOUD_API_VERSION=v18.0`
- ✅ `WA_APP_SECRET` - מוגדר
- ✅ `WEBHOOK_VERIFICATION_TOKEN=tanandco_2025_webhook`
- ✅ `WA_VERIFY_TOKEN=tan_and_co_verify_token`

**Endpoints:**
- ✅ `GET /api/webhooks/whatsapp` - אימות webhook
- ✅ `POST /api/webhooks/whatsapp` - קבלת הודעות
- ✅ `POST /api/whatsapp/send-text` - שליחת הודעות

**שירותים:**
- ✅ `WhatsAppService` - מוגדר ופועל
- ✅ שליחת הודעות טקסט
- ✅ שליחת תבניות (templates)
- ✅ עדכון יתרת שיעורים ללקוחות

**⚠️ פעולות נדרשות:**
1. עדכן ב-Meta Console את Callback URL ל-`https://crm.tanandco.co.il/api/webhooks/whatsapp`
2. ודא שה-Verify Token תואם ל-`WEBHOOK_VERIFICATION_TOKEN`

---

### 2. BioStar 2 (זיהוי פנים) ⭐
**סטטוס:** ✅ פעיל ומוגדר

**משתני סביבה:**
- ✅ `BIOSTAR_SERVER_URL=https://biostar.tanandco.co.il`
- ✅ `BIOSTAR_USERNAME=admin`
- ✅ `BIOSTAR_PASSWORD=Makor2024`
- ✅ `BIOSTAR_DOOR_ID=2`
- ✅ `BIOSTAR_ALLOW_SELF_SIGNED=false`

**Endpoints:**
- ✅ `GET /api/biostar/health` - בדיקת חיבור
- ✅ `GET /api/biostar/status` - סטטוס המערכת
- ✅ `POST /api/biostar/identify` - זיהוי פנים
- ✅ `POST /api/biostar/register` - רישום פנים
- ✅ `POST /api/biostar/open-door` - פתיחת דלת (מוגבל ל-localhost)
- ✅ `GET /api/biostar/door-logs` - לוגי גישה

**שירותים:**
- ✅ `BioStarClient` - מוגדר ופועל
- ✅ `BioStarStartup` - אתחול אוטומטי בשרת
- ✅ זיהוי פנים אוטומטי
- ✅ פתיחת דלת אוטומטית לאחר זיהוי
- ✅ ניכוי שיעור אוטומטי

**⚠️ הערות:**
- השרת מנסה להתחבר ל-BioStar בעת הפעלה
- אם החיבור נכשל, המערכת ממשיכה לעבוד ללא זיהוי פנים
- **חשוב:** BioStar רץ על פורט 5000 - אל תגע!

---

### 3. Cardcom (תשלומים) ⚠️
**סטטוס:** ⚠️ מוגדר חלקית

**משתני סביבה:**
- ✅ `CARDCOM_TERMINAL_NUMBER=1578525`
- ✅ `CARDCOM_USERNAME=vQsrkpKRbplPFEAwkSyS`
- ✅ `CARDCOM_API_USERNAME=vQsrkpKRbplPFEAwkSyS`
- ✅ `CARDCOM_API_KEY=gJRxuVM94czowcTVzLX`
- ❌ `CARDCOM_API_PASSWORD=your_cardcom_api_password` - **לא מוגדר!**

**Endpoints:**
- ✅ `POST /api/payments/cardcom/session` - יצירת סשן תשלום
- ✅ `POST /api/webhooks/cardcom/payment` - webhook לתשלומים

**שירותים:**
- ✅ `CardcomService` - מוגדר
- ✅ יצירת סשן תשלום
- ✅ עיבוד webhook

**⚠️ פעולות נדרשות:**
1. **דחוף:** עדכן את `CARDCOM_API_PASSWORD` ב-Cloud Run Environment Variables
2. בדוק את ה-API Password ב-Cardcom Console
3. ודא שה-Indicator URL מוגדר ב-Cardcom: `https://crm.tanandco.co.il/api/webhooks/cardcom/payment`

---

## ⚠️ אינטגרציות מוגדרות אך לא פעילות

### 4. Meta Marketing API (Facebook Ads)
**סטטוס:** ⚠️ קוד קיים, לא מוגדר

**משתני סביבה:**
- ✅ `FACEBOOK_APP_ID=823361520180641`
- ✅ `FACEBOOK_APP_SECRET=4c33674c9130dc39a7c654453eef2c30`
- ❌ `META_ACCESS_TOKEN` - **לא מוגדר**

**שירותים:**
- ✅ `MetaMarketingService` - קיים
- ✅ ניהול קמפיינים
- ✅ ניהול Ad Sets
- ✅ ניהול Ads
- ✅ קבלת ביצועים

**⚠️ פעולות נדרשות:**
1. קבל Access Token מ-Meta for Developers
2. הוסף `META_ACCESS_TOKEN` ל-Cloud Run Environment Variables
3. אתחל את השירות דרך `AutomationEngine.initializeMetaService()`

---

### 5. TikTok Ads API
**סטטוס:** ⚠️ קוד קיים, לא מוגדר

**משתני סביבה:**
- ✅ `TIKTOK_CLIENT_KEY=aw0e18xw6bwegz66`
- ✅ `TIKTOK_CLIENT_SECRET=TnPGJfg0TQAhDW5f2MFusGHDkU7tJTYI`
- ❌ `TIKTOK_ACCESS_TOKEN` - **לא מוגדר**
- ❌ `TIKTOK_ADVERTISER_ID` - **לא מוגדר**

**שירותים:**
- ✅ `TikTokAdsService` - קיים
- ✅ ניהול קמפיינים
- ✅ קבלת ביצועים

**⚠️ פעולות נדרשות:**
1. קבל Access Token מ-TikTok for Business
2. קבל Advertiser ID
3. הוסף `TIKTOK_ACCESS_TOKEN` ו-`TIKTOK_ADVERTISER_ID` ל-Cloud Run
4. אתחל את השירות דרך `AutomationEngine.initializeTikTokService()`

---

### 6. Google Ads API
**סטטוס:** ⚠️ קוד קיים, לא מוגדר

**משתני סביבה:**
- ❌ `GOOGLE_ADS_CLIENT_ID` - **לא מוגדר**
- ❌ `GOOGLE_ADS_CLIENT_SECRET` - **לא מוגדר**
- ❌ `GOOGLE_ADS_REFRESH_TOKEN` - **לא מוגדר**
- ❌ `GOOGLE_ADS_DEVELOPER_TOKEN` - **לא מוגדר**
- ❌ `GOOGLE_ADS_CUSTOMER_ID` - **לא מוגדר**

**שירותים:**
- ✅ `GoogleAdsService` - קיים
- ✅ ניהול קמפיינים
- ✅ קבלת ביצועים

**⚠️ פעולות נדרשות:**
1. הגדר OAuth 2.0 ב-Google Cloud Console
2. קבל Client ID ו-Client Secret
3. קבל Refresh Token
4. קבל Developer Token מ-Google Ads
5. הוסף את כל המשתנים ל-Cloud Run
6. אתחל את השירות דרך `AutomationEngine.initializeGoogleService()`

---

## 🔧 אינטגרציות נוספות

### 7. Neon Database (PostgreSQL)
**סטטוס:** ⚠️ מוגדר, בעיית סיסמה

**משתני סביבה:**
- ✅ `DATABASE_URL` - מוגדר (אבל סיסמה שגויה)
- ✅ `PGHOST`, `PGPORT`, `PGUSER` - מוגדרים

**⚠️ פעולות נדרשות:**
1. **דחוף:** הרץ `fix-database-connection.ps1` לעדכון הסיסמה
2. בדוק עם `npm run db:push`
3. ודא שהסיסמה ב-Cloud Run מעודכנת

---

### 8. OpenAI API
**סטטוס:** ✅ מוגדר

**משתני סביבה:**
- ✅ `OPENAI_API_KEY` - מוגדר

**הערות:**
- API Key מוגדר, אך לא נבדק שימוש בקוד

---

### 9. Freepik API
**סטטוס:** ✅ מוגדר

**משתני סביבה:**
- ✅ `FREEPIK_API_KEY` - מוגדר

**הערות:**
- API Key מוגדר, אך לא נבדק שימוש בקוד

---

## 📋 סיכום לפי עדיפות

### 🔴 דחוף (חיוני לפעילות)
1. **Cardcom API Password** - עדכן `CARDCOM_API_PASSWORD` ב-Cloud Run
2. **Database Connection** - תיקון סיסמה ב-Neon
3. **WhatsApp Webhook** - עדכן Callback URL ב-Meta Console

### 🟡 חשוב (לשיפור פונקציונליות)
4. **Meta Marketing API** - הוסף Access Token
5. **TikTok Ads API** - הוסף Access Token ו-Advertiser ID
6. **Google Ads API** - הגדר OAuth וכל ה-credentials

### 🟢 אופציונלי
7. **OpenAI** - בדוק שימוש בקוד
8. **Freepik** - בדוק שימוש בקוד

---

## 🧪 בדיקות מומלצות

### WhatsApp
```powershell
# בדיקת Webhook Verification
$url = "https://crm.tanandco.co.il/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=tanandco_2025_webhook&hub.challenge=test"
Invoke-WebRequest -Uri $url -Method GET
```

### BioStar
```powershell
# בדיקת Health
Invoke-WebRequest -Uri "https://crm.tanandco.co.il/api/biostar/health" -Method GET
```

### Database
```powershell
# בדיקת חיבור
cd "C:\Users\tanan\OneDrive\שולחן העבודה\tanandco-crm"
npm run db:push
```

---

## 📝 הערות כלליות

1. **Environment Variables:** כל המשתנים נמצאים ב-`CLOUD_RUN_ENV_VARIABLES_REAL.txt`
2. **Cloud Run:** ודא שכל המשתנים מעודכנים ב-Cloud Run Console
3. **Webhooks:** ודא שה-URLs הציבוריים מוגדרים נכון ב-Cloud Run
4. **API Keys:** בדוק תאריכי תפוגה של Tokens (במיוחד WhatsApp)

---

**עודכן:** $(Get-Date -Format "yyyy-MM-dd HH:mm")

