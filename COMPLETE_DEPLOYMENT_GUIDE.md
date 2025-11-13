# 🚀 מדריך פריסה מלא - Tan & Co CRM

**מדריך מפורט שלב-אחר-שלב לפריסה מלאה על Google Cloud Run + Cloudflare**

---

## ✅ מה כבר מוכן:

- ✅ Dockerfile - מוכן ובדוק
- ✅ .dockerignore - מוכן
- ✅ Build עובד מקומית
- ✅ כל הקבצים תוקנו
- ✅ הקוד ב-GitHub (branch: `local`)

---

## 📋 שלב 1: הכנת משתני סביבה

### העתק את כל המשתנים מ-Replit:

1. היכנס ל-Replit → Secrets
2. העתק את כל הערכים הבאים:

```
DATABASE_URL=...
PGDATABASE=...
PGHOST=...
PGPORT=...
PGUSER=...
PGPASSWORD=...
SESSION_SECRET=...
PRINTER_INTERFACE=POS-80
OPENAI_API_KEY=...
WA_PHONE_NUMBER_ID=699582612923896
WA_BUSINESS_ACCOUNT_ID=...
CLOUD_API_ACCESS_TOKEN=...
CLOUD_API_VERSION=v18.0
WA_APP_SECRET=...
WHATSAPP_APP_SECRET=...
WA_VERIFY_TOKEN=...
WEBHOOK_VERIFICATION_TOKEN=...
CARDCOM_TERMINAL_NUMBER=1578525
CARDCOM_TERMINAL=1578525
CARDCOM_USERNAME=...
CARDCOM_API_USERNAME=...
CARDCOM_API_KEY=...
CARDCOM_API_PASSWORD=...
BIOSTAR_SERVER_URL=https://biostar.tanandco.co.il
BIOSTAR_USERNAME=admin
BIOSTAR_PASSWORD=...
BIOSTAR_DOOR_ID=2
BIOSTAR_ALLOW_SELF_SIGNED=false
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...
FREEPIK_API_KEY=...
DOOR_ACCESS_KEY=...
ADMIN_PHONE=...
NODE_ENV=production
PORT=5000
```

**⚠️ חשוב:** שמור את כל הערכים במסמך זמני (לא ב-Git!)

---

## 🚀 שלב 2: תיקון Cloud Build Trigger

### מה לעשות:

1. **Google Cloud Console → Cloud Build → Triggers**
2. **לחץ על ה-Trigger שלך** (או צור חדש)
3. **Edit trigger:**

#### Branch Matching:
- **Branch:** `^local$` ✅

#### Configuration:
- **Type:** ✅ **"Dockerfile"** (לא Cloud Build configuration file!)
- **Location:** ✅ **"Repository"** (לא Inline!)
- **Dockerfile:** `/Dockerfile` (או השאר ריק)
- **Docker context:** `/` (או השאר ריק)

4. **לחץ "Save"**

---

## 🌐 שלב 3: הגדרת Cloud Run Service

### אם השירות כבר קיים (`tanandco`):

1. **Cloud Run → tanandco → Edit & Deploy New Revision**

### אם צריך ליצור חדש:

1. **Cloud Run → Create Service**

### הגדרות:

#### Container:
- **Container image:** (אוטומטי אם יש Trigger)
- **Container port:** `5000` ✅

#### Service settings:
- **Service name:** `tanandco` (או `tanandco-crm`)
- **Region:** `me-west1 (Tel Aviv)` ✅
- **CPU:** `1`
- **Memory:** `512 MiB` (או `1 GiB`)
- **Minimum instances:** `0`
- **Maximum instances:** `10`
- **Request timeout:** `300` שניות
- **Concurrency:** `80`

#### Authentication:
- ✅ **"Allow public access"** (חשוב מאוד!)
- ❌ לא "Require authentication"

#### Billing:
- ✅ **"Request-based"**

#### Scaling:
- ✅ **"Auto scaling"**
- **Min:** `0`
- **Max:** `10`

#### Ingress:
- ✅ **"All"** (Allow direct access from the internet)

---

## 🔐 שלב 4: הוספת משתני סביבה

### ב-Cloud Run:

1. **Variables & Secrets → Add Variable**
2. **הוסף כל משתנה אחד אחד** (או העתק-הדבק):

```
NODE_ENV=production
PORT=5000
DATABASE_URL=... (העתק מ-Replit)
WA_PHONE_NUMBER_ID=699582612923896
WA_BUSINESS_ACCOUNT_ID=... (העתק מ-Replit)
CLOUD_API_ACCESS_TOKEN=... (העתק מ-Replit)
CLOUD_API_VERSION=v18.0
WA_APP_SECRET=... (העתק מ-Replit)
WHATSAPP_APP_SECRET=... (העתק מ-Replit)
WA_VERIFY_TOKEN=... (העתק מ-Replit)
WEBHOOK_VERIFICATION_TOKEN=... (העתק מ-Replit)
CARDCOM_TERMINAL_NUMBER=1578525
CARDCOM_TERMINAL=1578525
CARDCOM_USERNAME=... (העתק מ-Replit)
CARDCOM_API_USERNAME=... (העתק מ-Replit)
CARDCOM_API_KEY=... (העתק מ-Replit)
CARDCOM_API_PASSWORD=... (העתק מ-Replit)
BIOSTAR_SERVER_URL=https://biostar.tanandco.co.il
BIOSTAR_USERNAME=admin
BIOSTAR_PASSWORD=... (העתק מ-Replit)
BIOSTAR_DOOR_ID=2
BIOSTAR_ALLOW_SELF_SIGNED=false
FACEBOOK_APP_ID=... (העתק מ-Replit)
FACEBOOK_APP_SECRET=... (העתק מ-Replit)
TIKTOK_CLIENT_KEY=... (העתק מ-Replit)
TIKTOK_CLIENT_SECRET=... (העתק מ-Replit)
FREEPIK_API_KEY=... (העתק מ-Replit)
OPENAI_API_KEY=... (העתק מ-Replit)
SESSION_SECRET=... (העתק מ-Replit)
PRINTER_INTERFACE=POS-80
DOOR_ACCESS_KEY=... (העתק מ-Replit)
ADMIN_PHONE=... (העתק מ-Replit)
```

**⚠️ חשוב:** אל תוסיף `APP_BASE_URL` עדיין - תקבל אותו אחרי הפריסה.

3. **לחץ "Deploy"** (או "Create" אם זה שירות חדש)

---

## ⏳ שלב 5: המתן לפריסה

1. **המתן 5-10 דקות** לבנייה ופריסה
2. **בדוק את ה-Build Status:**
   - Cloud Build → History
   - או Cloud Run → tanandco → Revisions

---

## 🔗 שלב 6: קבלת URL

לאחר הפריסה המוצלחת:

1. **Cloud Run → tanandco**
2. **תראה URL כמו:**
   ```
   https://tanandco-725671338807.me-west1.run.app
   ```
3. **שמור את ה-URL הזה!**

---

## ⚙️ שלב 7: עדכון APP_BASE_URL

1. **Cloud Run → tanandco → Edit & Deploy New Revision**
2. **Variables & Secrets → Add Variable**
3. **הוסף:**
   ```
   APP_BASE_URL=https://tanandco-725671338807.me-west1.run.app
   ```
   (החלף ב-URL האמיתי שקיבלת)
4. **לחץ "Deploy"**

---

## 🔗 שלב 8: הגדרת Cloudflare Tunnel

### דרך Cloudflare Zero Trust Dashboard:

1. **פתח:** https://one.dash.cloudflare.com
2. **Networks → Tunnels**
3. **בחר את ה-Tunnel שלך** (או צור חדש)
4. **Configure → Public Hostname → Add a public hostname:**

   - **Subdomain:** `crm` (או `app`)
   - **Domain:** `tanandco.co.il`
   - **Service:** `https://tanandco-725671338807.me-west1.run.app:443`
     - ⚠️ החלף ב-URL האמיתי מ-Cloud Run
   - **Path:** (השאר ריק)

5. **לחץ "Save hostname"**

**תוצאה:** `https://crm.tanandco.co.il` → `https://tanandco-XXXXX.me-west1.run.app`

---

## 🔐 שלב 9: הגדרת SSL ב-Cloudflare

1. **Cloudflare Dashboard → SSL/TLS**
2. **Overview → Full (strict)**
   - זה מבטיח שהחיבור בין Cloudflare ל-Cloud Run מוצפן

---

## 🔄 שלב 10: עדכון APP_BASE_URL ל-Domain החדש

1. **Cloud Run → tanandco → Edit & Deploy New Revision**
2. **Variables & Secrets → עדכן:**
   ```
   APP_BASE_URL=https://crm.tanandco.co.il
   ```
   (או `https://app.tanandco.co.il` אם בחרת subdomain אחר)
3. **לחץ "Deploy"**

---

## 🔗 שלב 11: עדכון Webhooks

### WhatsApp Business API:

1. **Meta for Developers:** https://developers.facebook.com
2. **בחר את ה-App → WhatsApp → Configuration → Webhook**
3. **עדכן:**
   - **Callback URL:** `https://crm.tanandco.co.il/api/webhooks/whatsapp`
   - **Verify Token:** (השתמש ב-`WEBHOOK_VERIFICATION_TOKEN`)

### Cardcom:

1. **Cardcom Dashboard:** https://secure.cardcom.solutions
2. **הגדרות → Webhooks**
3. **עדכן:**
   - **URL:** `https://crm.tanandco.co.il/api/webhooks/cardcom/payment`

---

## ✅ שלב 12: בדיקות סופיות

### 1. בדיקת Health:
```bash
curl https://crm.tanandco.co.il/api/health
```
צריך לקבל: `{"status":"ok"}`

### 2. בדיקת עמוד ראשי:
פתח בדפדפן:
```
https://crm.tanandco.co.il
```

### 3. בדיקת מסד נתונים:
```bash
curl https://crm.tanandco.co.il/api/customers
```

---

## 🐛 פתרון בעיות

### Build נכשל:

1. **Cloud Build → History → לחץ על ה-build הכושל**
2. **ראה את ה-Logs** - חפש שגיאות
3. **ודא שה-Trigger מוגדר נכון:**
   - Type: `Dockerfile`
   - Location: `Repository`
   - Branch: `^local$`

### השירות לא מתחיל:

1. **Cloud Run → tanandco → Logs**
2. **חפש שגיאות**
3. **ודא שכל משתני הסביבה מוגדרים**

### Tunnel לא עובד:

1. **Zero Trust → Networks → Tunnels → בחר את ה-Tunnel**
2. **בדוק status**
3. **ודא שה-Public Hostname מוגדר נכון**

---

## 📝 רשימת בדיקה סופית

- [ ] כל משתני הסביבה הועתקו מ-Replit
- [ ] Cloud Build Trigger מוגדר נכון (Dockerfile, Repository)
- [ ] Cloud Run Service נוצר/מעודכן
- [ ] Authentication: "Allow public access"
- [ ] כל משתני הסביבה מוגדרים ב-Cloud Run
- [ ] Build הצליח
- [ ] קיבלת URL מ-Cloud Run
- [ ] APP_BASE_URL מעודכן
- [ ] Cloudflare Tunnel מוגדר
- [ ] Public Hostname נוסף: `crm.tanandco.co.il`
- [ ] SSL מוגדר ל-Full (strict)
- [ ] Webhooks מעודכנים
- [ ] האפליקציה נגישה דרך `https://crm.tanandco.co.il`
- [ ] כל הבדיקות עברו

---

## 🎉 סיום

לאחר שכל הבדיקות עברו:
- ✅ האפליקציה נגישה דרך `https://crm.tanandco.co.il`
- ✅ SSL פעיל אוטומטית
- ✅ CDN ו-DDoS protection פעילים
- ✅ הכל עובד!

---

**עודכן:** דצמבר 2025  
**Domain:** tanandco.co.il  
**URL סופי:** `https://crm.tanandco.co.il`

