# 🚀 פריסה עכשיו - הוראות מהירות

## ✅ הכל מוכן!

- ✅ Dockerfile נוצר
- ✅ פורט תוקן ל-5000
- ✅ קוד ב-GitHub (branch: `main`)

---

## 🎯 שלבים מהירים:

### 1. פתח Google Cloud Console:
**קישור ישיר:**
https://console.cloud.google.com/run/detail/me-west1/tanandco?project=tan-and-co-crm

### 2. לחץ "Edit & Deploy New Revision"

### 3. הגדר:
- **Container:** "Continuously deploy from source repository"
- **Repository:** `Tanandco/tanandco-crm`
- **Branch:** `main`
- **Build type:** `Dockerfile`
- **Port:** `5000`
- **Authentication:** "Allow public access" ✅

### 4. הוסף משתני סביבה:
ראה `FINAL_DEPLOYMENT_INSTRUCTIONS.md` לרשימה מלאה.

**חובה:**
- `NODE_ENV=production`
- `PORT=5000`
- `APP_BASE_URL=https://tanandco.co.il`
- `DATABASE_URL=...`
- `WA_PHONE_NUMBER_ID=...`
- `CLOUD_API_ACCESS_TOKEN=...`

### 5. לחץ "Deploy"

### 6. המתן 2-5 דקות

### 7. בדוק:
https://tanandco-725671338807.me-west1.run.app

---

## 📝 משתני סביבה מלאים:

ראה `FINAL_DEPLOYMENT_INSTRUCTIONS.md` או `DEPLOY_VIA_CONSOLE_STEP_BY_STEP.md`

---

**מוכן לפריסה! 🚀**

