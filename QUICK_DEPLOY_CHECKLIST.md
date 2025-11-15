# ✅ רשימת בדיקה מהירה - פריסה אונליין

## לפני הפריסה:

- [ ] קוד ב-GitHub (push את השינויים)
- [ ] Dockerfile קיים בתיקיית השורש
- [ ] כל המשתנים מוכנים (ראה `.env`)

---

## שלבי הפריסה:

### 1. Push ל-GitHub
- [ ] `git add .`
- [ ] `git commit -m "Deploy"`
- [ ] `git push origin main`

### 2. Google Cloud Console
- [ ] פתח: https://console.cloud.google.com/run/detail/me-west1/tanandco
- [ ] לחץ: "Edit & Deploy New Revision"

### 3. Container
- [ ] בחר: "Continuously deploy from source repository"
- [ ] Repository: `Tanandco/tanandco-crm`
- [ ] Branch: `main`
- [ ] Build type: `Dockerfile`

### 4. Port & Auth
- [ ] Port: `5000`
- [ ] Authentication: **"Allow public access"** ✅

### 5. Variables
- [ ] `APP_BASE_URL=https://tanandco.co.il`
- [ ] `DATABASE_URL=...`
- [ ] `WA_PHONE_NUMBER_ID=...`
- [ ] כל המשתנים האחרים

### 6. Deploy
- [ ] לחץ: "Deploy"
- [ ] המתן 2-5 דקות

### 7. בדיקה
- [ ] פתח: https://tanandco-725671338807.me-west1.run.app
- [ ] בדוק שהממשק עובד
- [ ] בדוק את ה-Logs

---

## אחרי הפריסה:

- [ ] עדכן WhatsApp Webhooks
- [ ] עדכן Cardcom Webhooks
- [ ] בדוק שהכל עובד

---

**מוכן! 🚀**

