# ⚡ התחלה מהירה - Google Cloud Run

## שלב 1: התקנת Google Cloud CLI

### Windows (PowerShell):

**דרך א: הורדה ישירה (מומלץ)**
1. פתח: https://cloud.google.com/sdk/docs/install
2. הורד את ה-installer ל-Windows
3. הרץ את ה-installer והתקן
4. פתח PowerShell חדש

**דרך ב: דרך Chocolatey (אם יש לך)**
```powershell
choco install gcloudsdk
```

### אחרי ההתקנה:
```powershell
# בדוק שההתקנה הצליחה
gcloud --version

# התחברות
gcloud auth login

# יצירת פרויקט
gcloud projects create tanandco-crm --name="Tan & Co CRM"
gcloud config set project tanandco-crm

# הפעלת APIs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com
```

---

## שלב 2: פריסה מהירה דרך Console

### דרך הכי קלה (ללא CLI):

1. **היכנס ל-Google Cloud Console:**
   - https://console.cloud.google.com
   - היכנס עם חשבון Google

2. **צור פרויקט חדש:**
   - לחץ על "Select a project" → "New Project"
   - שם: `tanandco-crm`
   - לחץ "Create"

3. **הפעל APIs:**
   - נווט ל: APIs & Services → Library
   - חפש והפעל:
     - Cloud Run API
     - Cloud Build API
     - Artifact Registry API

4. **פרוס את האפליקציה:**
   - נווט ל: Cloud Run → Create Service
   - בחר: **Continuously deploy new revisions from a source repository**
   - חבר את ה-GitHub repository שלך
   - בחר branch: `main`
   - Build type: **Dockerfile**
   - Service name: `tanandco-crm`
   - Region: `us-central1`
   - CPU: 1
   - Memory: 512 MiB
   - Port: `5000`
   - לחץ "Next"

5. **הוסף משתני סביבה:**
   - לחץ "Add Variable"
   - הוסף כל משתנה מ-Replit (ראה `env.example.txt`)
   - **חשוב:** הוסף `PORT=5000` ו-`NODE_ENV=production`

6. **Deploy:**
   - לחץ "Create"
   - המתן ~5-10 דקות לבנייה ופריסה
   - תקבל URL: `https://tanandco-crm-XXXXX-uc.a.run.app`

---

## שלב 3: עדכון APP_BASE_URL

1. העתק את ה-URL שקיבלת
2. Cloud Run → tanandco-crm → Edit & Deploy New Revision
3. Variables → הוסף:
   ```
   APP_BASE_URL=https://tanandco-crm-XXXXX-uc.a.run.app
   ```
4. Deploy

---

## שלב 4: עדכון Webhooks

עדכן את ה-webhooks ב-WhatsApp ו-Cardcom עם ה-URL החדש.

---

## ✅ בדיקה

פתח בדפדפן:
```
https://your-url.run.app/api/health
```

צריך לקבל: `{"status":"ok"}`

---

## 💡 טיפים

- **עלויות:** Cloud Run משלם רק לפי שימוש (~$5-10/חודש)
- **Logs:** Cloud Run → tanandco-crm → Logs
- **עדכונים:** כל push ל-main יפרס אוטומטית (אם הגדרת כך)

---

**עזרה נוספת:** ראה `DEPLOY_GOOGLE_CLOUD.md` למדריך מפורט

