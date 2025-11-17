# 🚀 דרכים חלופיות לפריסה

## ⚠️ בעיה: Cloud Console לא עובד

אם אתה מקבל שגיאת "permission denied" או שהקונסול לא נגיש, יש דרכים אחרות!

---

## 🎯 דרך 1: GitHub Actions (אוטומטי)

### אם יש workflow מוגדר:

1. **פתח GitHub:**
   https://github.com/Tanandco/tanandco-crm/actions

2. **אם יש workflow:**
   - כל push ל-`main` יפרס אוטומטית
   - תראה את הסטטוס ב-Actions

3. **אם אין workflow:**
   - צריך ליצור אחד (ראה למטה)

---

## 🎯 דרך 2: gcloud CLI (שורת פקודה)

### יתרונות:
- ✅ לא צריך Console
- ✅ מהיר יותר
- ✅ אוטומטי

### דרישות:
- gcloud CLI מותקן
- הרשאות לפרויקט

### איך:

```powershell
# 1. התקן gcloud (אם לא מותקן)
# https://cloud.google.com/sdk/docs/install

# 2. התחבר
gcloud auth login

# 3. הגדר פרויקט
gcloud config set project tan-and-co-crm

# 4. פרוס
gcloud run deploy tanandco-crm `
  --source . `
  --platform managed `
  --region me-west1 `
  --allow-unauthenticated `
  --port 5000
```

### או השתמש בסקריפט:
```powershell
.\deploy-via-gcloud.ps1
```

---

## 🎯 דרך 3: Cloud Build (אוטומטי מ-GitHub)

### אם יש cloudbuild.yaml:

1. **הגדר Cloud Build Trigger:**
   - פתח: https://console.cloud.google.com/cloud-build/triggers
   - צור Trigger חדש
   - חבר ל-GitHub repository
   - Branch: `main`

2. **כל push יפרס אוטומטית!**

---

## 🎯 דרך 4: יצירת Service חדש

### אם ה-service לא קיים:

1. **פתח Cloud Run:**
   https://console.cloud.google.com/run

2. **לחץ:** "Create Service"

3. **הגדר:**
   - Name: `tanandco-crm`
   - Region: בחר region
   - Authentication: Allow unauthenticated

4. **Container:**
   - בחר: "Continuously deploy from source repository"
   - Repository: `Tanandco/tanandco-crm`
   - Branch: `main`

5. **Port:** `5000`

6. **לחץ:** "Create"

---

## 🎯 דרך 5: Docker + Manual Push

### אם כל השאר לא עובד:

```powershell
# 1. Build Docker image
docker build -t gcr.io/PROJECT_ID/tanandco-crm:latest .

# 2. Push ל-Container Registry
docker push gcr.io/PROJECT_ID/tanandco-crm:latest

# 3. Deploy ל-Cloud Run
gcloud run deploy tanandco-crm `
  --image gcr.io/PROJECT_ID/tanandco-crm:latest `
  --platform managed `
  --region me-west1 `
  --allow-unauthenticated `
  --port 5000
```

---

## 💡 מה הכי קל?

### אם יש לך gcloud CLI:
→ השתמש ב-`deploy-via-gcloud.ps1`

### אם אין לך gcloud:
→ צור GitHub Actions workflow (ראה למטה)

### אם אתה רוצה אוטומטי:
→ הגדר Cloud Build Trigger

---

## 🔧 יצירת GitHub Actions Workflow

אם אין workflow, אני יכול ליצור אחד שיפרס אוטומטית!

**אמור לי ואכין לך workflow מוכן.**

---

**עודכן:** ינואר 2025

