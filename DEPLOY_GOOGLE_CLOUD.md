# 🚀 פריסה על Google Cloud Run

מדריך מפורט לפריסת Tan & Co CRM על Google Cloud Run.

---

## 📋 דרישות מוקדמות

1. **חשבון Google Cloud** - [הירשם כאן](https://cloud.google.com)
2. **Google Cloud CLI** - התקן את ה-CLI
3. **Docker** (אופציונלי - Cloud Build יכול לבנות בשבילך)

---

## 🔧 שלב 1: התקנת Google Cloud CLI

### Windows (PowerShell)
```powershell
# הורד והתקן מ-https://cloud.google.com/sdk/docs/install
# או דרך Chocolatey:
choco install gcloudsdk
```

### Mac
```bash
brew install google-cloud-sdk
```

### Linux
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

---

## 🔐 שלב 2: התחברות והגדרת פרויקט

### 1. התחברות
```bash
gcloud auth login
```

### 2. יצירת פרויקט חדש (או שימוש בקיים)
```bash
# רשימת פרויקטים קיימים
gcloud projects list

# יצירת פרויקט חדש
gcloud projects create tanandco-crm --name="Tan & Co CRM"

# בחירת הפרויקט
gcloud config set project tanandco-crm
```

### 3. הפעלת APIs נדרשות
```bash
# הפעלת Cloud Run API
gcloud services enable run.googleapis.com

# הפעלת Cloud Build API (לבניית Docker)
gcloud services enable cloudbuild.googleapis.com

# הפעלת Container Registry API
gcloud services enable containerregistry.googleapis.com

# הפעלת Artifact Registry API (מומלץ)
gcloud services enable artifactregistry.googleapis.com
```

---

## 📦 שלב 3: העלאת הקוד ל-Cloud Source Repositories (אופציונלי)

### אפשרות א: מ-GitHub (מומלץ)
1. ודא שהקוד ב-GitHub
2. Cloud Run יכול להתחבר ישירות ל-GitHub

### אפשרות ב: Cloud Source Repositories
```bash
# יצירת repository
gcloud source repos create tanandco-crm

# הוספת remote
git remote add google https://source.developers.google.com/p/tanandco-crm/r/tanandco-crm

# העלאת קוד
git push google main
```

---

## 🐳 שלב 4: בניית Docker Image

### אפשרות א: Cloud Build (מומלץ - אוטומטי)
Cloud Run יבנה את ה-image אוטומטית מ-Dockerfile.

### אפשרות ב: בנייה מקומית
```bash
# בניית ה-image
docker build -t gcr.io/tanandco-crm/tanandco-crm:latest .

# העלאת ה-image ל-Container Registry
docker push gcr.io/tanandco-crm/tanandco-crm:latest
```

---

## 🚀 שלב 5: פריסה על Cloud Run

### דרך א: דרך Console (הכי קל)

1. היכנס ל-[Google Cloud Console](https://console.cloud.google.com)
2. נווט ל-**Cloud Run** → **Create Service**
3. בחר:
   - **Deploy one revision from an existing container image** (אם בנית מקומית)
   - או **Continuously deploy new revisions from a source repository** (אם יש לך GitHub)
4. אם בחרת source repository:
   - בחר את ה-repository
   - בחר את ה-branch (main)
   - Cloud Build יבנה אוטומטית
5. הגדרות:
   - **Service name:** `tanandco-crm`
   - **Region:** `us-central1` (או קרוב לישראל)
   - **CPU:** 1 vCPU
   - **Memory:** 512 MiB (או יותר אם צריך)
   - **Minimum instances:** 0 (לשלם רק לפי שימוש)
   - **Maximum instances:** 10
   - **Request timeout:** 300s
   - **Concurrency:** 80
6. **Container port:** `5000`
7. **Environment variables:** הוסף את כל המשתנים מ-Replit:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=...
   WA_PHONE_NUMBER_ID=...
   CLOUD_API_ACCESS_TOKEN=...
   ... (כל המשתנים מ-env.example.txt)
   ```
8. לחץ **Create**

### דרך ב: דרך CLI

```bash
# פריסה עם Dockerfile
gcloud run deploy tanandco-crm \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 5000 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --set-env-vars "NODE_ENV=production,PORT=5000" \
  --set-secrets "DATABASE_URL=database-url:latest,WA_PHONE_NUMBER_ID=wa-phone:latest"
```

**הערה:** עדיף להגדיר משתנים דרך Console או Secrets Manager.

---

## 🔐 שלב 6: הגדרת משתני סביבה

### דרך Console:
1. Cloud Run → tanandco-crm → **Edit & Deploy New Revision**
2. **Variables & Secrets** → **Add Variable**
3. הוסף כל משתנה מ-Replit

### דרך Secrets Manager (מומלץ לנתונים רגישים):

```bash
# יצירת secret
echo -n "your-secret-value" | gcloud secrets create DATABASE_URL --data-file=-

# הרשאה ל-Cloud Run לגשת ל-secret
gcloud secrets add-iam-policy-binding DATABASE_URL \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# שימוש ב-secret ב-Cloud Run
gcloud run services update tanandco-crm \
  --update-secrets DATABASE_URL=DATABASE_URL:latest
```

---

## 🗄️ שלב 7: הגדרת מסד נתונים

### אפשרות א: Cloud SQL (PostgreSQL) - מומלץ

```bash
# יצירת Cloud SQL instance
gcloud sql instances create tanandco-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# יצירת database
gcloud sql databases create tanandco_crm --instance=tanandco-db

# יצירת משתמש
gcloud sql users create tanandco_user \
  --instance=tanandco-db \
  --password=YOUR_PASSWORD

# קבלת connection string
gcloud sql instances describe tanandco-db --format="value(connectionName)"
```

### אפשרות ב: Neon (חיצוני)
- פשוט השתמש ב-`DATABASE_URL` מ-Neon

### חיבור Cloud Run ל-Cloud SQL:
```bash
gcloud run services update tanandco-crm \
  --add-cloudsql-instances=PROJECT_ID:REGION:tanandco-db \
  --set-env-vars "DATABASE_URL=postgresql://user:pass@/dbname?host=/cloudsql/PROJECT_ID:REGION:tanandco-db"
```

---

## 🌐 שלב 8: קבלת URL ובדיקה

לאחר הפריסה, תקבל URL כמו:
```
https://tanandco-crm-XXXXX-uc.a.run.app
```

### בדיקות:
```bash
# בדיקת health
curl https://tanandco-crm-XXXXX-uc.a.run.app/api/health

# בדיקת עמוד ראשי
curl https://tanandco-crm-XXXXX-uc.a.run.app/
```

---

## ⚙️ שלב 9: עדכון APP_BASE_URL

1. העתק את ה-URL שקיבלת
2. Cloud Run → tanandco-crm → Edit → Variables
3. הוסף/עדכן:
   ```
   APP_BASE_URL=https://tanandco-crm-XXXXX-uc.a.run.app
   ```
4. Deploy revision חדש

---

## 🔗 שלב 10: עדכון Webhooks

עדכן את ה-webhooks עם ה-URL החדש:

### WhatsApp:
```
https://tanandco-crm-XXXXX-uc.a.run.app/api/webhooks/whatsapp
```

### Cardcom:
```
https://tanandco-crm-XXXXX-uc.a.run.app/api/webhooks/cardcom/payment
```

---

## 💰 עלויות

Cloud Run משלם רק לפי שימוש:
- **CPU:** $0.00002400 per vCPU-second
- **Memory:** $0.00000250 per GiB-second
- **Requests:** $0.40 per million requests
- **Free tier:** 2 מיליון requests/חודש, 360,000 GiB-seconds/חודש

**הערכה:** ~$5-10/חודש לשימוש בינוני

---

## 🔄 עדכונים עתידיים

לעדכן את האפליקציה:
```bash
# דרך Console: Cloud Run → Deploy New Revision
# או דרך CLI:
gcloud run deploy tanandco-crm --source .
```

---

## 🐛 פתרון בעיות

### השרת לא מתחיל
```bash
# בדוק logs
gcloud run services logs read tanandco-crm --limit=50
```

### שגיאת מסד נתונים
- ודא שה-`DATABASE_URL` נכון
- אם Cloud SQL, ודא שה-Cloud SQL connection מוגדר

### שגיאת build
```bash
# בדוק build logs
gcloud builds list --limit=5
gcloud builds log BUILD_ID
```

---

## 📝 רשימת בדיקה

- [ ] Google Cloud CLI מותקן
- [ ] פרויקט נוצר
- [ ] APIs מופעלות
- [ ] קוד ב-GitHub או Cloud Source Repositories
- [ ] משתני סביבה מוגדרים
- [ ] מסד נתונים מוגדר
- [ ] Cloud Run service נוצר
- [ ] URL עובד
- [ ] Webhooks מעודכנים

---

**עודכן:** דצמבר 2025

**תמיכה:** [Google Cloud Documentation](https://cloud.google.com/run/docs)

