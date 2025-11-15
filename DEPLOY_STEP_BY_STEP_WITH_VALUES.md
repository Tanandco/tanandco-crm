# 🚀 פריסה - שלב אחר שלב עם כל הערכים

## ✅ הכל מוכן! עכשיו פשוט עקוב אחרי ההוראות:

---

## שלב 1: פתח Google Cloud Console

**קישור ישיר:**
https://console.cloud.google.com/run/detail/me-west1/tanandco?project=tan-and-co-crm

**או:**
1. פתח: https://console.cloud.google.com
2. בחר פרויקט: `tan-and-co-crm`
3. עבור ל: Cloud Run
4. בחר service: `tanandco`

---

## שלב 2: לחץ "Edit & Deploy New Revision"

לחץ על הכפתור הכחול **"Edit & Deploy New Revision"** בחלק העליון של הדף.

---

## שלב 3: הגדר Container

1. **גלול למטה** עד שתגיע ל-"Container"
2. **לחץ על "Select"** ליד "Container image"
3. **בחר:** "Continuously deploy new revisions from a source repository"
4. **Repository:** `Tanandco/tanandco-crm`
5. **Branch:** `main`
6. **Build type:** `Dockerfile`
7. **Dockerfile location:** `/` (ברירת מחדל)
8. **Docker context:** `/` (ברירת מחדל)

---

## שלב 4: הגדר Port

1. **גלול למטה** ל-"Container, Networking, Security"
2. **לחץ על זה** כדי לפתוח
3. **Port:** `5000`

---

## שלב 5: הגדר Authentication

**חשוב מאוד!**

1. **Authentication:**
   - ✅ **בחר: "Allow public access"**
   - ❌ **לא** "Require authentication"

---

## שלב 6: הוסף משתני סביבה

1. **גלול למטה** ל-"Variables & Secrets"
2. **לחץ על "Add Variable"**
3. **הוסף כל משתנה בנפרד** (לחץ "Add Variable" אחרי כל אחד):

### משתנה 1:
**Name:** `NODE_ENV`  
**Value:** `production`

### משתנה 2:
**Name:** `PORT`  
**Value:** `5000`

### משתנה 3:
**Name:** `APP_BASE_URL`  
**Value:** `https://tanandco.co.il`

### משתנה 4:
**Name:** `DATABASE_URL`  
**Value:** `postgresql://neondb_owner:npg_K9ZMtcmzx8Bo@ep-super-pond-afcnloji.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require`

### משתנה 5:
**Name:** `PGDATABASE`  
**Value:** `neondb`

### משתנה 6:
**Name:** `PGHOST`  
**Value:** `ep-super-pond-afcnloji.c-2.us-west-2.aws.neon.tech`

### משתנה 7:
**Name:** `PGPORT`  
**Value:** `5432`

### משתנה 8:
**Name:** `PGUSER`  
**Value:** `neondb_owner`

### משתנה 9:
**Name:** `PGPASSWORD`  
**Value:** `npg_K9ZMtcmzx8Bo`

### משתנה 10:
**Name:** `SESSION_SECRET`  
**Value:** `uPnQEsvyy3t+6f+rIAeJz9+1MYKW3/ElBzi5KYE4kNq6uRuhr9nw896zlkExdWuXbdVFcanb3ObEQIQjUtWY2A==`

### משתנה 11:
**Name:** `WA_PHONE_NUMBER_ID`  
**Value:** `699582612923896`

### משתנה 12:
**Name:** `WA_BUSINESS_ACCOUNT_ID`  
**Value:** `699582612923896`

### משתנה 13:
**Name:** `CLOUD_API_ACCESS_TOKEN`  
**Value:** `EAAJFC8nImm8BPxZAWrOxihw3uQ45qq30rqAaE0kvp3hg4IizwmAx4AQOWkGgypsCXNSzBJKts3mo8R5ZAh4GC5G0MpBajZB8cxCMEx5qaFaEQpWCFwh03f1yZAXABYZAJOlw2bJxlqeZAQg02YXsGwnJ7ZCHsX4MTP5TiKdWsZBnm8CrUhbdvbc0ZCYM8YkbGboZC6pAZDZD`

### משתנה 14:
**Name:** `CLOUD_API_VERSION`  
**Value:** `v18.0`

### משתנה 15:
**Name:** `WA_APP_SECRET`  
**Value:** `00de9b50551ca788d687dd0b839b143b`

### משתנה 16:
**Name:** `WEBHOOK_VERIFICATION_TOKEN`  
**Value:** `tanandco_2025_webhook`

### משתנה 17:
**Name:** `FACEBOOK_APP_ID`  
**Value:** `823361520180641`

### משתנה 18:
**Name:** `FACEBOOK_APP_SECRET`  
**Value:** `4c33674c9130dc39a7c654453eef2c30`

### משתנה 19:
**Name:** `CARDCOM_USERNAME`  
**Value:** `vQsrkpKRbplPFEAwkSyS`

### משתנה 20:
**Name:** `CARDCOM_API_KEY`  
**Value:** `gJRxuVM94czowcTVzLX`

### משתנה 21:
**Name:** `CARDCOM_TERMINAL`  
**Value:** `1578525`

### משתנה 22:
**Name:** `BIOSTAR_SERVER_URL`  
**Value:** `https://biostar.tanandco.co.il`

### משתנה 23:
**Name:** `BIOSTAR_USERNAME`  
**Value:** `admin`

### משתנה 24:
**Name:** `BIOSTAR_PASSWORD`  
**Value:** `Makor2024`

### משתנה 25:
**Name:** `BIOSTAR_DOOR_ID`  
**Value:** `2`

### משתנה 26:
**Name:** `BIOSTAR_ALLOW_SELF_SIGNED`  
**Value:** `false`

### משתנה 27:
**Name:** `OPENAI_API_KEY`  
**Value:** (ראה `CLOUD_RUN_ENV_VARIABLES_REAL.txt` - שורה 73)

### משתנה 28:
**Name:** `TIKTOK_CLIENT_KEY`  
**Value:** `aw0e18xw6bwegz66`

### משתנה 29:
**Name:** `TIKTOK_CLIENT_SECRET`  
**Value:** `TnPGJfg0TQAhDW5f2MFusGHDkU7tJTYI`

### משתנה 30:
**Name:** `FREEPIK_API_KEY`  
**Value:** `FPSX133bc1feeb7b6b1e8b40f7e2bba84e49`

### משתנה 31:
**Name:** `PRINTER_INTERFACE`  
**Value:** `POS-80`

---

## שלב 7: Deploy!

1. **גלול למטה** עד הסוף
2. **לחץ על הכפתור הכחול:** **"Deploy"**
3. **המתן 2-5 דקות** לבנייה ופריסה

---

## שלב 8: בדיקה

### 1. בדוק את ה-URL:
```
https://tanandco-725671338807.me-west1.run.app
```

### 2. בדוק את ה-Logs:
- לחץ על **"Logs"** בחלק העליון
- חפש שגיאות

### 3. בדוק את הממשק:
- פתח: https://tanandco-725671338807.me-west1.run.app
- בדוק שהכל עובד

---

## ✅ הכל מוכן!

**אחרי הפריסה, הפרויקט יהיה זמין אונליין! 🚀**

---

## 📞 אם יש בעיות:

### Build נכשל:
1. **פתח:** https://console.cloud.google.com/cloud-build/builds?project=tan-and-co-crm
2. **ראה את ה-Logs** - חפש שגיאות
3. **תקן** את השגיאות
4. **Push שוב** ל-GitHub
5. **Deploy מחדש**

### Port error:
- ודא ש-`PORT=5000` מוגדר ב-Variables

### Authentication error:
- ודא שבחרת **"Allow public access"**

---

**מוכן לפריסה! 🎉**

