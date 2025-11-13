# 🎯 פריסה שלב-אחר-שלב - Tan & Co CRM

**מדריך מדויק עם כל השלבים - פשוט עקוב אחרי ההוראות!**

---

## ✅ מה כבר מוכן:

- ✅ כל הקבצים תוקנו
- ✅ Build עובד מקומית
- ✅ Dockerfile מוכן
- ✅ הקוד ב-GitHub (branch: `local`)
- ✅ כל השינויים נדחפו

---

## 📋 שלב 1: העתקת משתני סביבה מ-Replit

### מה לעשות:

1. **פתח Replit** → היכנס לפרויקט שלך
2. **לחץ על "Secrets"** (בסרגל העליון)
3. **העתק את כל הערכים** של המשתנים הבאים:

**רשימה מלאה:**
- DATABASE_URL
- PGDATABASE, PGHOST, PGPORT, PGUSER, PGPASSWORD
- SESSION_SECRET
- PRINTER_INTERFACE
- OPENAI_API_KEY
- WA_PHONE_NUMBER_ID
- WA_BUSINESS_ACCOUNT_ID
- CLOUD_API_ACCESS_TOKEN
- CLOUD_API_VERSION
- WA_APP_SECRET
- WHATSAPP_APP_SECRET
- WA_VERIFY_TOKEN
- WEBHOOK_VERIFICATION_TOKEN
- CARDCOM_TERMINAL_NUMBER
- CARDCOM_TERMINAL
- CARDCOM_USERNAME
- CARDCOM_API_USERNAME
- CARDCOM_API_KEY
- CARDCOM_API_PASSWORD
- BIOSTAR_SERVER_URL
- BIOSTAR_USERNAME
- BIOSTAR_PASSWORD
- BIOSTAR_DOOR_ID
- BIOSTAR_ALLOW_SELF_SIGNED
- FACEBOOK_APP_ID
- FACEBOOK_APP_SECRET
- TIKTOK_CLIENT_KEY
- TIKTOK_CLIENT_SECRET
- FREEPIK_API_KEY
- DOOR_ACCESS_KEY
- ADMIN_PHONE

4. **שמור את כל הערכים** במסמך Word/Notepad זמני

**⚠️ חשוב:** שמור את זה - תצטרך את זה בהמשך!

---

## 🔧 שלב 2: תיקון Cloud Build Trigger

### מה לעשות:

1. **פתח:** https://console.cloud.google.com/cloud-build/triggers
2. **בחר את הפרויקט:** "Tan and co CRM"
3. **לחץ על ה-Trigger** (או צור חדש)

### אם יש Trigger קיים - Edit:

1. **לחץ "Edit"** על ה-Trigger
2. **גלול למטה ל-"Configuration"**

#### Type:
- ❌ **אל תבחר:** "Cloud Build configuration file (yaml or json)"
- ✅ **בחר:** **"Dockerfile"**
  - תיאור: "Build using a Dockerfile in the repository"

#### Location:
- ❌ **אל תבחר:** "Inline"
- ✅ **בחר:** **"Repository"**
  - Repository: Tanandco/tanandco-crm (GitHub App)
  - Dockerfile: `/Dockerfile` (או השאר ריק)
  - Docker context: `/` (או השאר ריק)

3. **לחץ "Save"** בתחתית

---

## 🌐 שלב 3: הגדרת Cloud Run Service

### אם השירות כבר קיים (`tanandco`):

1. **Cloud Run → לחץ על "tanandco"**
2. **לחץ "Edit & Deploy New Revision"**

### אם צריך ליצור חדש:

1. **Cloud Run → "Create Service"**

### מילוי הטופס - שלב אחר שלב:

#### 1. Container (למעלה):
- **Container image:** (אוטומטי אם יש Trigger)
- **Container port:** `5000` ✅

#### 2. Service name:
- **Service name:** `tanandco` (או `tanandco-crm`)

#### 3. Region:
- **Region:** `me-west1 (Tel Aviv)` ✅ (כבר נכון)

#### 4. Authentication ⚠️ חשוב מאוד:
- ✅ **בחר: "Allow public access"**
  - תיאור: "No authentication checks will be performed."
- ❌ **אל תבחר:** "Require authentication"

#### 5. Billing:
- ✅ **"Request-based"** ✅ (כבר נכון)

#### 6. Service scaling:
- ✅ **"Auto scaling"** ✅ (כבר נכון)
- **Minimum number of instances:** `0` ✅
- **Maximum number of instances:** `10` (או יותר)

#### 7. Ingress:
- ✅ **"All"** ✅ (כבר נכון)

#### 8. Containers, Volumes, Networking, Security:
לחץ על זה ובדוק:
- **CPU:** `1`
- **Memory:** `512 MiB` (או `1 GiB`)
- **Request timeout:** `300` שניות
- **Concurrency:** `80`

---

## 🔐 שלב 4: הוספת משתני סביבה

### ב-Cloud Run:

1. **גלול למטה ל-"Variables & Secrets"**
2. **לחץ "Add Variable"**
3. **הוסף כל משתנה אחד אחד:**

**התחל עם הבסיסיים:**
```
NODE_ENV=production
PORT=5000
```

**ואז הוסף את כל השאר** (העתק מ-Replit):

```
DATABASE_URL=העתק_מ_Replit
WA_PHONE_NUMBER_ID=699582612923896
WA_BUSINESS_ACCOUNT_ID=העתק_מ_Replit
CLOUD_API_ACCESS_TOKEN=העתק_מ_Replit
CLOUD_API_VERSION=v18.0
WA_APP_SECRET=העתק_מ_Replit
WHATSAPP_APP_SECRET=העתק_מ_Replit
WA_VERIFY_TOKEN=העתק_מ_Replit
WEBHOOK_VERIFICATION_TOKEN=העתק_מ_Replit
CARDCOM_TERMINAL_NUMBER=1578525
CARDCOM_TERMINAL=1578525
CARDCOM_USERNAME=העתק_מ_Replit
CARDCOM_API_USERNAME=העתק_מ_Replit
CARDCOM_API_KEY=העתק_מ_Replit
CARDCOM_API_PASSWORD=העתק_מ_Replit
BIOSTAR_SERVER_URL=https://biostar.tanandco.co.il
BIOSTAR_USERNAME=admin
BIOSTAR_PASSWORD=העתק_מ_Replit
BIOSTAR_DOOR_ID=2
BIOSTAR_ALLOW_SELF_SIGNED=false
FACEBOOK_APP_ID=העתק_מ_Replit
FACEBOOK_APP_SECRET=העתק_מ_Replit
TIKTOK_CLIENT_KEY=העתק_מ_Replit
TIKTOK_CLIENT_SECRET=העתק_מ_Replit
FREEPIK_API_KEY=העתק_מ_Replit
OPENAI_API_KEY=העתק_מ_Replit
SESSION_SECRET=העתק_מ_Replit
PRINTER_INTERFACE=POS-80
DOOR_ACCESS_KEY=העתק_מ_Replit
ADMIN_PHONE=העתק_מ_Replit
```

**⚠️ חשוב:** 
- החלף `העתק_מ_Replit` בערכים האמיתיים מ-Replit
- אל תוסיף `APP_BASE_URL` עדיין!

4. **לחץ "Deploy"** (או "Create" אם זה חדש)

---

## ⏳ שלב 5: המתן לפריסה

1. **המתן 5-10 דקות** לבנייה ופריסה
2. **תראה הודעות:**
   - "Creating service" ✅
   - "Creating Cloud Build trigger" ✅
   - "Building and deploying from repository" ⏳
   - "Creating revision" ✅
   - "Routing traffic" ✅

3. **אם יש שגיאה:**
   - לחץ על "see logs"
   - ראה מה השגיאה
   - שלח לי ואעזור לפתור

---

## 🔗 שלב 6: קבלת URL

לאחר הפריסה המוצלחת:

1. **Cloud Run → tanandco**
2. **תראה URL כמו:**
   ```
   https://tanandco-725671338807.me-west1.run.app
   ```
3. **העתק את ה-URL הזה!**
4. **שמור אותו** - תצטרך אותו לשלבים הבאים

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
2. **היכנס** עם החשבון שלך
3. **Networks → Tunnels**
4. **בחר את ה-Tunnel שלך** (או צור חדש אם צריך)

### הוספת Public Hostname:

1. **לחץ "Configure"** על ה-Tunnel
2. **Public Hostname → Add a public hostname**
3. **מלא:**
   - **Subdomain:** `crm` (או `app` - מה שתרצה)
   - **Domain:** `tanandco.co.il`
   - **Service:** `https://tanandco-725671338807.me-west1.run.app:443`
     - ⚠️ **החלף ב-URL האמיתי** מ-Cloud Run
   - **Path:** (השאר ריק - אל תמלא כלום)

4. **לחץ "Save hostname"**

**תוצאה:** `https://crm.tanandco.co.il` → `https://tanandco-XXXXX.me-west1.run.app`

---

## 🔐 שלב 9: הגדרת SSL ב-Cloudflare

1. **פתח:** https://dash.cloudflare.com
2. **בחר את ה-domain:** `tanandco.co.il`
3. **SSL/TLS → Overview**
4. **בחר:** **"Full (strict)"**
   - זה מבטיח שהחיבור בין Cloudflare ל-Cloud Run מוצפן

---

## 🔄 שלב 10: עדכון APP_BASE_URL ל-Domain החדש

1. **Cloud Run → tanandco → Edit & Deploy New Revision**
2. **Variables & Secrets → עדכן את APP_BASE_URL:**
   ```
   APP_BASE_URL=https://crm.tanandco.co.il
   ```
   (או `https://app.tanandco.co.il` אם בחרת subdomain אחר)
3. **לחץ "Deploy"**

---

## 🔗 שלב 11: עדכון Webhooks

### WhatsApp Business API:

1. **פתח:** https://developers.facebook.com
2. **היכנס** עם החשבון שלך
3. **בחר את ה-App שלך**
4. **WhatsApp → Configuration → Webhook**
5. **עדכן:**
   - **Callback URL:** `https://crm.tanandco.co.il/api/webhooks/whatsapp`
   - **Verify Token:** (השתמש בערך של `WEBHOOK_VERIFICATION_TOKEN` מ-Replit)
6. **לחץ "Verify and Save"**

### Cardcom:

1. **פתח:** https://secure.cardcom.solutions
2. **היכנס** עם החשבון שלך
3. **הגדרות → Webhooks**
4. **עדכן:**
   - **URL:** `https://crm.tanandco.co.il/api/webhooks/cardcom/payment`
5. **שמור**

---

## ✅ שלב 12: בדיקות סופיות

### 1. בדיקת Health:
פתח בדפדפן:
```
https://crm.tanandco.co.il/api/health
```
**צריך לקבל:** `{"status":"ok"}`

### 2. בדיקת עמוד ראשי:
פתח בדפדפן:
```
https://crm.tanandco.co.il
```
**צריך לראות:** את הממשק של האפליקציה

### 3. בדיקת מסד נתונים:
פתח בדפדפן:
```
https://crm.tanandco.co.il/api/customers
```
**צריך לקבל:** רשימה (או `[]` אם אין לקוחות)

---

## 🎉 סיום

לאחר שכל הבדיקות עברו:
- ✅ האפליקציה נגישה דרך `https://crm.tanandco.co.il`
- ✅ SSL פעיל אוטומטית
- ✅ CDN ו-DDoS protection פעילים
- ✅ הכל עובד!

---

## 🆘 אם יש בעיות

### Build נכשל:
1. Cloud Build → History → לחץ על ה-build הכושל
2. ראה את ה-Logs
3. שלח לי את השגיאה ואעזור לפתור

### השירות לא מתחיל:
1. Cloud Run → tanandco → Logs
2. חפש שגיאות
3. שלח לי ואעזור לפתור

### Tunnel לא עובד:
1. Zero Trust → Networks → Tunnels
2. בדוק status
3. שלח לי ואעזור לפתור

---

**עודכן:** דצמבר 2025  
**Domain:** tanandco.co.il  
**URL סופי:** `https://crm.tanandco.co.il`

