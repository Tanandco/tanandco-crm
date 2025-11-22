# מדריך פריסה מלא - Tan & Co CRM

## 📍 מיקום הפרויקט התקין

**זהו הנתיב היחיד שבו נמצאת הגרסה התקינה והמלאה:**
```
C:\Users\tanan\OneDrive\שולחן העבודה\tanandco-crm
```

⚠️ **חשוב:** כל התיקונים והבדיקות בוצעו מתוך תיקייה זו בלבד. כל תיקייה אחרת בשם `tanandco-crm` במחשב אינה רלוונטית.

---

## 🔧 1. תיקון חיבור מסד הנתונים

### בעיה ידועה
הפקודה `npm run db:push` נכשלת עם השגיאה:
```
error: password authentication failed for user 'neondb_owner'
```

### פתרון

#### אופציה 1: שימוש בסקריפט האוטומטי
```powershell
cd "C:\Users\tanan\OneDrive\שולחן העבודה\tanandco-crm"
.\fix-database-connection.ps1
```

הסקריפט יבקש ממך:
1. להתחבר ל-Neon Console: https://console.neon.tech
2. לבחור את הפרויקט
3. לעבור ל-Dashboard → Connection Details
4. להעתיק את הסיסמה של המשתמש `neondb_owner`
5. להדביק את הסיסמה בסקריפט

#### אופציה 2: עדכון ידני
1. פתח את קובץ `.env` בתיקיית הפרויקט
2. מצא את השורה `DATABASE_URL=...`
3. עדכן את הסיסמה בחלק הבא:
   ```
   postgresql://neondb_owner:[הסיסמה_החדשה]@ep-super-pond-afcnloji.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require
   ```
4. שמור את הקובץ

### בדיקת החיבור
לאחר העדכון, הרץ:
```powershell
npm run db:push
```

אם הפעולה הצליחה, תראה הודעת הצלחה ללא שגיאות authentication.

---

## 🏗️ 2. בניית הפרויקט

### בנייה מקומית
```powershell
cd "C:\Users\tanan\OneDrive\שולחן העבודה\tanandco-crm"
npm install
npm run build
```

הפקודה `npm run build`:
- בונה את ה-client עם Vite
- שומרת את הקבצים בתיקייה `dist/`
- השרת רץ ישירות מ-TypeScript (לא צריך build לשרת)

### בדיקת הבנייה
לאחר הבנייה, ודא שקיימת תיקייה `dist/` עם:
- `index.html`
- תיקיית `assets/` עם קבצי JS ו-CSS

---

## 🐳 3. בדיקת Dockerfile

הפרויקט כולל `Dockerfile` מוכן לפריסה ב-Cloud Run:

```dockerfile
FROM node:20-alpine AS builder
# ... בונה את ה-client

FROM node:20-alpine AS production
# ... מריץ את השרת עם tsx
CMD ["npx", "tsx", "server/index.ts"]
```

### בדיקה מקומית (אופציונלי)
```powershell
docker build -t tanandco-crm .
docker run -p 5000:5000 --env-file .env tanandco-crm
```

⚠️ **שימו לב:** בדיקה מקומית דורשת Docker Desktop מותקן.

---

## ☁️ 4. פריסה ל-Google Cloud Run

### 4.1. סינכרון עם GitHub

1. **בדיקת סטטוס Git:**
   ```powershell
   cd "C:\Users\tanan\OneDrive\שולחן העבודה\tanandco-crm"
   git status
   git diff
   ```

2. **דחיפה ל-GitHub:**
   ```powershell
   git add .
   git commit -m "Update: Database connection and deployment fixes"
   git push origin main
   ```

3. **וידוא שה-remote נכון:**
   ```powershell
   git remote -v
   ```
   צריך להציג: `origin  https://github.com/Tanandco/tanandco-crm.git`

### 4.2. עדכון Environment Variables ב-Cloud Run

1. התחבר ל-Google Cloud Console: https://console.cloud.google.com
2. עבור ל-Cloud Run → בחר את השירות `tanandco-crm`
3. לחץ על "Edit & Deploy New Revision"
4. עבור לטאב "Variables & Secrets"
5. עדכן את המשתנים לפי `CLOUD_RUN_ENV_VARIABLES_REAL.txt`

**משתנים קריטיים:**
- `DATABASE_URL` - עם הסיסמה הנכונה מ-Neon
- `WA_VERIFY_TOKEN` או `WEBHOOK_VERIFICATION_TOKEN` - לאימות WhatsApp
- `WA_APP_SECRET` - לאימות חתימת WhatsApp
- `APP_BASE_URL` - ה-URL הציבורי של ה-CRM (למשל: `https://crm.tanandco.co.il`)

### 4.3. פריסה אוטומטית

הפרויקט מוגדר עם `cloudbuild.yaml` לפריסה אוטומטית:

1. **דחיפה ל-GitHub** מפעילה את Cloud Build
2. Cloud Build בונה את ה-Docker image
3. הדימוי נדחף ל-Artifact Registry
4. Cloud Run מושך את הדימוי החדש

**בדיקת סטטוס הפריסה:**
```powershell
# דרך Google Cloud Console
# Cloud Build → History → בדוק את ה-build האחרון
```

### 4.4. פריסה ידנית (אם נדרש)

```powershell
# התקנת gcloud CLI (אם לא מותקן)
# הוראות: SETUP_GCLOUD_CLI.md

# התחברות
gcloud auth login

# הגדרת פרויקט
gcloud config set project tan-and-co-crm

# בנייה ופריסה
gcloud builds submit --config cloudbuild.yaml
gcloud run deploy tanandco-crm \
  --image me-west1-docker.pkg.dev/tan-and-co-crm/cloud-run-source-deploy/tanandco-crm \
  --region me-west1 \
  --platform managed
```

---

## 📱 5. הגדרת WhatsApp Webhook

### 5.1. URL של ה-Webhook

ב-Cloud Run, ה-URL של ה-Webhook הוא:
```
https://[SERVICE_URL]/api/webhooks/whatsapp
```

או עם דומיין מותאם אישית:
```
https://crm.tanandco.co.il/api/webhooks/whatsapp
```

### 5.2. עדכון ב-Meta Developers Console

1. התחבר ל-Meta for Developers: https://developers.facebook.com
2. בחר את האפליקציה שלך
3. עבור ל-WhatsApp → Configuration
4. עדכן את:
   - **Callback URL:** `https://crm.tanandco.co.il/api/webhooks/whatsapp`
   - **Verify Token:** הערך מ-`WEBHOOK_VERIFICATION_TOKEN` או `WA_VERIFY_TOKEN` ב-Cloud Run

### 5.3. בדיקת ה-Webhook

**GET Request (אימות):**
```powershell
$verifyToken = "tanandco_2025_webhook"  # הערך מ-Cloud Run
$url = "https://crm.tanandco.co.il/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=$verifyToken&hub.challenge=test123"
Invoke-WebRequest -Uri $url -Method GET
```

אם הכל תקין, תקבל חזרה את הערך `test123`.

---

## 🌐 6. הגדרת דומיין (Cloudflare)

### 6.1. DNS Configuration

1. התחבר ל-Cloudflare Dashboard: https://dash.cloudflare.com
2. בחר את הדומיין `tanandco.co.il`
3. עבור ל-DNS → Records
4. הוסף רשומה חדשה:
   - **Type:** CNAME
   - **Name:** `crm`
   - **Target:** `[CLOUD_RUN_SERVICE_URL]` (למשל: `tanandco-xxxxx.me-west1.run.app`)
   - **Proxy:** Enabled (מומלץ)

### 6.2. SSL/TLS

Cloudflare יגדיר אוטומטית SSL/TLS עם Full (strict) mode.

### 6.3. בדיקת הדומיין

```powershell
# בדיקת DNS
nslookup crm.tanandco.co.il

# בדיקת HTTPS
Invoke-WebRequest -Uri "https://crm.tanandco.co.il" -Method GET
```

---

## ⚠️ 7. נקודות חשובות - מה לא לעשות

### ❌ אל תגע ב-BioStar
- השרת של BioStar רץ על **פורט 5000**
- כל התערבות תגרום לנפילת מערכת הגישה הפיזית
- ה-CRM רץ על **פורט 5080** בפיתוח (לא מתנגש)

### ❌ אל תשנה פורטים ידנית
- פורט 5080 נבחר בכוונה להימנע מהתנגשות
- ב-Cloud Run, הפורט נקבע אוטומטית דרך משתנה `PORT`

### ❌ אל תדחוף .env ל-GitHub
- הקובץ `.env` מכיל סודות
- השתמש ב-GitHub Secrets וב-Cloud Run Environment Variables

---

## ✅ 8. Checklist לפני פריסה

- [ ] חיבור למסד הנתונים עובד (`npm run db:push` מצליח)
- [ ] הבנייה עובדת (`npm run build` מצליח)
- [ ] הקוד מסונכרן עם GitHub (`git status` נקי)
- [ ] Environment Variables ב-Cloud Run מעודכנים
- [ ] WhatsApp Webhook מוגדר ב-Meta Console
- [ ] דומיין מוגדר ב-Cloudflare (אם רלוונטי)
- [ ] בדיקת השרת המקומי עובדת (`npm run dev`)

---

## 🧪 9. בדיקות לאחר פריסה

### 9.1. בדיקת Health Endpoint
```powershell
Invoke-WebRequest -Uri "https://crm.tanandco.co.il/api/biostar/health" -Method GET
```

### 9.2. בדיקת WhatsApp Webhook
```powershell
$url = "https://crm.tanandco.co.il/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=tanandco_2025_webhook&hub.challenge=test"
Invoke-WebRequest -Uri $url -Method GET
```

### 9.3. בדיקת חיבור למסד הנתונים
בדוק את הלוגים ב-Cloud Run Console - לא אמורות להיות שגיאות authentication.

---

## 📞 10. תמיכה ועזרה

### קבצים חשובים בפרויקט:
- `CLOUD_RUN_ENV_VARIABLES_REAL.txt` - כל משתני הסביבה ל-Cloud Run
- `fix-database-connection.ps1` - סקריפט לתיקון חיבור DB
- `Dockerfile` - קונפיגורציית Docker
- `cloudbuild.yaml` - קונפיגורציית Cloud Build

### לוגים:
- **Cloud Run Logs:** Google Cloud Console → Cloud Run → Logs
- **Local Logs:** קונסול PowerShell בעת הרצת `npm run dev`

---

## 🎯 סיכום

1. **תיקון DB:** הרץ `fix-database-connection.ps1` ועדכן את הסיסמה
2. **בנייה:** `npm run build` - ודא שהכל עובד
3. **Git:** דחוף את הקוד ל-GitHub
4. **Cloud Run:** עדכן Environment Variables
5. **WhatsApp:** עדכן את ה-Webhook URL ב-Meta Console
6. **דומיין:** הגדר CNAME ב-Cloudflare (אם נדרש)

**הפרויקט מוכן לפריסה! 🚀**

