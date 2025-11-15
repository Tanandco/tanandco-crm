# ⚡ פריסה מהירה - 5 דקות!

## 🎯 שלבים מהירים:

### 1. פתח:
https://console.cloud.google.com/run/detail/me-west1/tanandco?project=tan-and-co-crm

### 2. לחץ: "Edit & Deploy New Revision"

### 3. Container:
- בחר: "Continuously deploy from source repository"
- Repository: `Tanandco/tanandco-crm`
- Branch: `main`
- Build type: `Dockerfile`

### 4. Port: `5000`

### 5. Authentication: "Allow public access" ✅

### 6. Variables:
**פתח את הקובץ:** `CLOUD_RUN_ENV_VARIABLES_REAL.txt`  
**העתק כל שורה** (Name=Value) והדבק ב-Cloud Run → Variables & Secrets

**או עקוב אחרי:** `DEPLOY_STEP_BY_STEP_WITH_VALUES.md`

### 7. לחץ: "Deploy"

### 8. המתן 2-5 דקות

### 9. בדוק:
https://tanandco-725671338807.me-west1.run.app

---

## ✅ הכל מוכן!

**ראה `DEPLOY_STEP_BY_STEP_WITH_VALUES.md` להוראות מפורטות!**

