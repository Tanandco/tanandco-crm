# 🚀 פריסה דרך Google Cloud Console - מדריך שלב אחר שלב

## 📊 לפני שמתחילים:

### ✅ מה צריך להיות מוכן:
- ✅ GitHub repository: `Tanandco/tanandco-crm`
- ✅ קוד ב-GitHub (push את השינויים)
- ✅ Cloud Run service קיים: `tanandco` ב-`me-west1`
- ✅ גישה ל-Google Cloud Console

---

## 🎯 שלב 1: Push קוד ל-GitHub

### אם עדיין לא push-ת:

```powershell
cd "C:\Users\tanan\OneDrive\שולחן העבודה\tanandco-crm"

# בדוק סטטוס
git status

# הוסף הכל
git add .

# Commit
git commit -m "Update: International phone support, AI chatbot, improved UI, port 3000"

# Push
git push origin main
```

**אם יש שגיאה:**
```powershell
# אם זה branch ראשון
git push -u origin main
```

---

## 🎯 שלב 2: פתיחת Cloud Run Console

1. **פתח דפדפן** (Chrome מומלץ)
2. **עבור ל:** https://console.cloud.google.com/run/detail/me-west1/tanandco?project=tan-and-co-crm
3. **התחבר** עם החשבון Google שלך (אם צריך)

---

## 🎯 שלב 3: Edit & Deploy New Revision

1. **לחץ על הכפתור הכחול:** "Edit & Deploy New Revision" (בחלק העליון)
2. **תגיע למסך עריכה**

---

## 🎯 שלב 4: הגדרת Container

### 4.1 Container Image:

**בחר:**
- ✅ **"Continuously deploy new revisions from a source repository"**

**אם לא רואה את האופציה הזו:**
- לחץ על **"Select"** ליד "Container image"
- בחר **"Continuously deploy new revisions from a source repository"**

### 4.2 Source Repository:

1. **Repository:**
   - לחץ על **"Select a repository"**
   - בחר: `Tanandco/tanandco-crm`
   - אם לא רואה - לחץ **"Connect repository"** וחבר את GitHub

2. **Branch:**
   - `main` (או `master` אם זה ה-branch שלך)

3. **Build type:**
   - ✅ **"Dockerfile"**

4. **Dockerfile location:**
   - `/` (root - ברירת מחדל)

5. **Docker context:**
   - `/` (root - ברירת מחדל)

---

## 🎯 שלב 5: הגדרת Port

1. **גלול למטה** ל-"Container, Networking, Security"
2. **לחץ על זה** כדי לפתוח
3. **Port:**
   - `5000` ✅
   - (או `3000` אם שינית - אבל Dockerfile משתמש ב-5000)

---

## 🎯 שלב 6: הגדרת Authentication

**חשוב מאוד!**

1. **Authentication:**
   - ✅ **"Allow public access"** (בחר את זה!)
   - ❌ לא "Require authentication"

**למה?** כי Cloudflare Tunnel צריך גישה ציבורית.

---

## 🎯 שלב 7: הגדרת משתני סביבה

1. **גלול למטה** ל-"Variables & Secrets"
2. **לחץ על "Add Variable"**
3. **הוסף את כל המשתנים הבאים:**

### משתנים בסיסיים:
```
NODE_ENV=production
PORT=5000
APP_BASE_URL=https://tanandco.co.il
```

### Database:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
PGDATABASE=your_database_name
PGHOST=your_database_host
PGPORT=5432
PGUSER=your_database_user
PGPASSWORD=your_database_password
```

### Session:
```
SESSION_SECRET=your_random_session_secret_key_here
```

### WhatsApp:
```
WA_PHONE_NUMBER_ID=your_phone_number_id
WA_BUSINESS_ACCOUNT_ID=your_business_account_id
CLOUD_API_ACCESS_TOKEN=your_whatsapp_access_token
CLOUD_API_VERSION=v18.0
WA_APP_SECRET=your_whatsapp_app_secret
WEBHOOK_VERIFICATION_TOKEN=your_webhook_verification_token
```

### Facebook/Meta:
```
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

### Cardcom:
```
CARDCOM_USERNAME=your_cardcom_username
CARDCOM_API_KEY=your_cardcom_api_key
CARDCOM_TERMINAL=your_cardcom_terminal_number
```

### BioStar:
```
BIOSTAR_SERVER_URL=http://127.0.0.1:5000
BIOSTAR_USERNAME=admin
BIOSTAR_PASSWORD=your_biostar_password
BIOSTAR_DOOR_ID=2
BIOSTAR_ALLOW_SELF_SIGNED=true
```

### OpenAI (AI Chatbot):
```
OPENAI_API_KEY=your_openai_api_key_here
```

### אחר:
```
PRINTER_INTERFACE=POS-80
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
FREEPIK_API_KEY=your_freepik_api_key
```

**💡 טיפ:** העתק את כל המשתנים מ-`.env` שלך והדבק כאן.

---

## 🎯 שלב 8: הגדרת Scaling (אופציונלי)

1. **Service scaling:**
   - ✅ **"Auto scaling"**
   - **Minimum instances:** `0` (חוסך כסף)
   - **Maximum instances:** `10` (או יותר אם צריך)

---

## 🎯 שלב 9: Deploy!

1. **גלול למטה** עד הסוף
2. **לחץ על הכפתור הכחול:** **"Deploy"**
3. **המתן 2-5 דקות** לבנייה ופריסה

---

## ✅ שלב 10: בדיקה

### 1. בדוק את ה-Logs:
- לחץ על **"Logs"** בחלק העליון
- חפש שגיאות

### 2. בדוק את ה-URL:
```
https://tanandco-725671338807.me-west1.run.app
```

### 3. בדוק את ה-API:
```powershell
curl https://tanandco-725671338807.me-west1.run.app/api/health
```

### 4. פתח בדפדפן:
```
https://tanandco-725671338807.me-west1.run.app
```

---

## 🐛 פתרון בעיות:

### Build נכשל:
1. **פתח:** https://console.cloud.google.com/cloud-build/builds?project=tan-and-co-crm
2. **ראה את ה-Logs** - חפש שגיאות
3. **תקן** את השגיאות
4. **Push שוב** ל-GitHub
5. **Deploy מחדש**

### "Repository not found":
- ודא שה-GitHub repository public או שיש לך access
- ודא שחיברת את ה-repository ב-Cloud Console

### "Port error":
- ודא ש-`PORT=5000` מוגדר ב-Variables
- ודא שה-Dockerfile משתמש ב-PORT 5000

### "Authentication error":
- ודא שבחרת **"Allow public access"**

---

## 🎉 אחרי הפריסה:

הפרויקט יהיה זמין ב:
- **Cloud Run URL:** https://tanandco-725671338807.me-west1.run.app
- **דומיין (אם מוגדר):** https://crm.tanandco.co.il

**הכל מוכן! 🚀**

---

## 📝 הערות חשובות:

1. **APP_BASE_URL** - עדכן ל-`https://tanandco.co.il` ב-Variables
2. **WhatsApp Webhooks** - עדכן את ה-URLs אחרי הפריסה:
   - https://developers.facebook.com/apps/823361520180641/whatsapp-business/wa-dev-console
   - Webhook URL: `https://tanandco-725671338807.me-west1.run.app/api/webhooks/whatsapp`
3. **Cardcom Webhooks** - עדכן ב-Cardcom dashboard
4. **Database** - ודא שה-DATABASE_URL נכון accessible מ-Cloud Run

---

## 🔄 Continuous Deployment:

לאחר ההגדרה, כל push ל-GitHub יפרס אוטומטית!

פשוט:
```powershell
git push origin main
```

ו-Cloud Run יפרס את השינויים אוטומטית תוך 2-5 דקות! 🎉

