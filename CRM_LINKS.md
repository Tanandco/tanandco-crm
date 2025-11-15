# 🔗 לינקים למערכת CRM

## 🌐 בפרודקשן (Production)

### 1. Cloud Run URL (ישיר)
**צריך לבדוק ב-Cloud Run Console:**
https://console.cloud.google.com/run/detail/europe-west1/tanandco-crm?project=tanandco-crm

**פורמט צפוי:**
```
https://tanandco-crm-XXXXX-XX.a.run.app
```
(ה-XXXXX משתנה לפי ה-deployment)

---

### 2. דומיין מותאם (אם מוגדר)

#### Subdomain:
```
https://crm.tanandco.co.il
```

#### דומיין ראשי:
```
https://tanandco.co.il
```

**⚠️ הערה:** כרגע הדומיין לא עובד (404) - צריך להגדיר Cloudflare Tunnel או DNS

---

## 💻 בפיתוח מקומי (Local Development)

### Local Server:
```
http://localhost:5000
```

**להרצה:**
```powershell
npm run server
```

---

## 🔧 איך למצוא את ה-Cloud Run URL:

1. **פתח Cloud Run Console:**
   https://console.cloud.google.com/run/detail/europe-west1/tanandco-crm?project=tanandco-crm

2. **בדוק את ה-URL:**
   - בחלק העליון של הדף תראה את ה-URL
   - או ב-"Service URL" או "URL"

3. **העתק את ה-URL** והשתמש בו

---

## 📋 מה לעשות אם הדומיין לא עובד:

1. **ראה:** `FIX_DOMAIN.md` למדריך מפורט
2. **הגדר Cloudflare Tunnel** או **DNS Records**
3. **עדכן `APP_BASE_URL`** ב-Cloud Run

---

**עודכן:** ינואר 2025

