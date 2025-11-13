# 🚀 מדריך פריסה - Tan & Co CRM

מדריך ספציפי לפריסת האפליקציה על Google Cloud Run עם Cloudflare Tunnel.

**Domain:** `tanandco.co.il`  
**שירות:** Google Cloud Run  
**Tunnel:** Cloudflare Zero Trust (מנוהל)

---

## 📋 שלב 1: פריסה על Google Cloud Run

### 1.1 התקנת Google Cloud CLI (אם עדיין לא)

**Windows:**
1. הורד מ: https://cloud.google.com/sdk/docs/install
2. התקן והפעל PowerShell חדש

**או דרך Chocolatey:**
```powershell
choco install gcloudsdk
```

### 1.2 התחברות והגדרת פרויקט

```powershell
# התחברות
gcloud auth login

# יצירת פרויקט (אם עדיין לא)
gcloud projects create tanandco-crm --name="Tan & Co CRM"

# בחירת הפרויקט
gcloud config set project tanandco-crm
```

### 1.3 הפעלת APIs

```powershell
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### 1.4 העלאת הקוד ל-GitHub (אם עדיין לא)

```powershell
# ודא שהקוד ב-GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## 🚀 שלב 2: פריסה דרך Console (הכי קל)

### 2.1 יצירת Service

1. **היכנס ל-Google Cloud Console:**
   - https://console.cloud.google.com
   - בחר את הפרויקט `tanandco-crm`

2. **נווט ל-Cloud Run:**
   - Cloud Run → Create Service

3. **בחר Deployment method:**
   - ✅ **Continuously deploy new revisions from a source repository**
   - לחץ "Set up with Cloud Build"
   - בחר את ה-GitHub repository שלך
   - בחר branch: `main`
   - Build type: **Dockerfile**

4. **Service settings:**
   - **Service name:** `tanandco-crm`
   - **Region:** `us-central1` (או קרוב לישראל)
   - **CPU:** 1
   - **Memory:** 512 MiB (או 1 GiB אם צריך יותר)
   - **Minimum instances:** 0 (לשלם רק לפי שימוש)
   - **Maximum instances:** 10
   - **Request timeout:** 300s
   - **Concurrency:** 80

5. **Container:**
   - **Container port:** `5000`
   - **Environment variables:** לחץ "Add Variable" והוסף:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://... (מ-Replit או Neon)
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
OPENAI_API_KEY=...
SESSION_SECRET=...
PRINTER_INTERFACE=POS-80
DOOR_ACCESS_KEY=...
ADMIN_PHONE=...
```

**⚠️ חשוב:** אל תוסיף `APP_BASE_URL` עדיין - תקבל אותו אחרי הפריסה.

6. **לחץ "Create"**
   - המתן ~5-10 דקות לבנייה ופריסה

### 2.2 קבלת URL

לאחר הפריסה, תקבל URL כמו:
```
https://tanandco-crm-XXXXX-uc.a.run.app
```

**שמור את ה-URL הזה!** תצטרך אותו לשלב הבא.

---

## 🔗 שלב 3: הגדרת Cloudflare Tunnel

### 3.1 היכנס ל-Cloudflare Zero Trust

1. **פתח:** https://one.dash.cloudflare.com
2. **בחר את ה-account שלך**

### 3.2 בחר את ה-Tunnel הקיים

1. **Networks → Tunnels**
2. **בחר את ה-Tunnel שלך** (או צור חדש אם צריך)

### 3.3 הוסף Public Hostname

1. **לחץ "Configure"** על ה-Tunnel
2. **Public Hostname → Add a public hostname**
3. **הגדר:**
   - **Subdomain:** `crm` (או `app` או `api` - מה שתרצה)
   - **Domain:** `tanandco.co.il`
   - **Service:** `https://tanandco-crm-XXXXX-uc.a.run.app:443`
     - ⚠️ החלף `XXXXX` ב-ID האמיתי שקיבלת
   - **Path:** (השאר ריק)
4. **לחץ "Save hostname"**

**דוגמה:**
- Subdomain: `crm`
- Domain: `tanandco.co.il`
- Service: `https://tanandco-crm-abc123-uc.a.run.app:443`
- **תוצאה:** `https://crm.tanandco.co.il` → `https://tanandco-crm-abc123-uc.a.run.app`

### 3.4 בדיקת DNS (אוטומטי)

Cloudflare יוסיף אוטומטית CNAME record. אם לא:
1. **Cloudflare Dashboard → DNS → Records**
2. **ודא שיש:**
   - Type: `CNAME`
   - Name: `crm` (או מה שבחרת)
   - Target: `<TUNNEL_ID>.cfargotunnel.com`
   - Proxy: ✅ **Proxied** (חשוב!)

---

## ⚙️ שלב 4: עדכון APP_BASE_URL

### 4.1 עדכן ב-Cloud Run

1. **Cloud Run → tanandco-crm → Edit & Deploy New Revision**
2. **Variables & Secrets → Add Variable**
3. **הוסף:**
   ```
   APP_BASE_URL=https://crm.tanandco.co.il
   ```
   (או `https://app.tanandco.co.il` אם בחרת subdomain אחר)
4. **לחץ "Deploy"**

---

## 🔐 שלב 5: הגדרת SSL

Cloudflare יגדיר SSL אוטומטית! רק ודא:

1. **Cloudflare Dashboard → SSL/TLS**
2. **Overview → Full (strict)**
   - זה מבטיח שהחיבור בין Cloudflare ל-Cloud Run מוצפן

---

## 🔗 שלב 6: עדכון Webhooks

עדכן את ה-webhooks עם ה-URL החדש:

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

## ✅ שלב 7: בדיקות

### 7.1 בדיקת Health

```powershell
curl https://crm.tanandco.co.il/api/health
```

צריך לקבל: `{"status":"ok"}`

### 7.2 בדיקת עמוד ראשי

פתח בדפדפן:
```
https://crm.tanandco.co.il
```

צריך לראות את הממשק של האפליקציה.

### 7.3 בדיקת מסד נתונים

```powershell
curl https://crm.tanandco.co.il/api/customers
```

צריך לקבל רשימה (או `[]` אם אין לקוחות).

---

## 🐛 פתרון בעיות

### השרת לא מתחיל

**בדוק logs:**
1. **Cloud Run → tanandco-crm → Logs**
2. חפש שגיאות

**בעיות נפוצות:**
- `DATABASE_URL` לא נכון
- חסרים משתני סביבה
- Build נכשל

### Tunnel לא עובד

1. **Zero Trust → Networks → Tunnels**
2. **בחר את ה-Tunnel → בדוק status**
3. **ודא שה-Public Hostname מוגדר נכון**

### DNS לא עובד

1. **Cloudflare → DNS → Records**
2. **ודא שה-CNAME קיים**
3. **ודא ש-Proxy מופעל** (ענן כתום)

### SSL לא עובד

1. **Cloudflare → SSL/TLS → Overview**
2. **הגדר ל-Full (strict)**

### 502 Bad Gateway

- בדוק שה-URL של Cloud Run נכון ב-Tunnel
- ודא שהשירות רץ (Cloud Run → Logs)
- בדוק שה-Port נכון (443)

---

## 📝 רשימת בדיקה סופית

- [ ] Google Cloud Run service נוצר
- [ ] קיבלת URL מ-Cloud Run (`*.run.app`)
- [ ] כל משתני הסביבה מוגדרים
- [ ] Cloudflare Tunnel מוגדר
- [ ] Public Hostname נוסף: `crm.tanandco.co.il`
- [ ] DNS record קיים (אוטומטי)
- [ ] SSL פעיל (Full strict)
- [ ] `APP_BASE_URL` מעודכן
- [ ] Webhooks מעודכנים
- [ ] האפליקציה נגישה דרך `https://crm.tanandco.co.il`
- [ ] Health check עובד
- [ ] מסד נתונים מחובר

---

## 🎉 סיום

לאחר שכל הבדיקות עברו:
- ✅ האפליקציה נגישה דרך `https://crm.tanandco.co.il`
- ✅ SSL פעיל אוטומטית
- ✅ CDN ו-DDoS protection פעילים
- ✅ הכל עובד!

---

## 🔄 עדכונים עתידיים

לעדכן את האפליקציה:
- כל push ל-`main` יפרס אוטומטית (אם הגדרת כך)
- או: Cloud Run → Deploy New Revision

---

## 💰 עלויות

- **Google Cloud Run:** ~$5-10/חודש (לשימוש בינוני)
- **Cloudflare:** חינמי (תוכנית בסיסית)
- **סה"כ:** ~$5-10/חודש

---

**עודכן:** דצמבר 2025  
**Domain:** tanandco.co.il  
**URL סופי:** `https://crm.tanandco.co.il`

