# 🔧 תיקון הדומיין tanandco.co.il

## 📊 מצב נוכחי:

- ❌ `tanandco.co.il` - מחזיר 404
- ❌ `crm.tanandco.co.il` - לא נגיש (DNS לא מפנה)

---

## 🎯 מה צריך לעשות:

### שלב 1: בדוק את Cloud Run Service

1. **פתח:**
   https://console.cloud.google.com/run/detail/europe-west1/tanandco-crm?project=tanandco-crm

2. **בדוק:**
   - ✅ האם ה-service רץ?
   - ✅ מה ה-URL של ה-service? (דומה ל: `https://tanandco-crm-xxxxx-xx.a.run.app`)
   - ✅ האם יש שגיאות ב-Logs?

3. **העתק את ה-URL** של ה-service (נצטרך אותו לשלב הבא)

---

### שלב 2: הגדר Cloudflare Tunnel

#### אופציה A: Cloudflare Tunnel (מומלץ)

1. **פתח Cloudflare Dashboard:**
   https://one.dash.cloudflare.com

2. **נווט ל:**
   - Zero Trust → Networks → Tunnels

3. **צור Tunnel חדש או ערוך קיים:**
   - לחץ "Create a tunnel" או בחר tunnel קיים
   - בחר "Cloudflare Tunnel"

4. **הגדר Public Hostname:**
   - **Subdomain:** `crm` (או השאר ריק לדומיין הראשי)
   - **Domain:** `tanandco.co.il`
   - **Service Type:** `HTTP`
   - **URL:** `https://YOUR-CLOUD-RUN-URL` (מה-URL שהעתקת בשלב 1)
     - לדוגמה: `https://tanandco-crm-xxxxx-xx.a.run.app`

5. **שמור**

---

#### אופציה B: DNS Records (אם לא משתמשים ב-Tunnel)

1. **פתח Cloudflare Dashboard:**
   https://dash.cloudflare.com

2. **בחר את הדומיין:** `tanandco.co.il`

3. **נווט ל:** DNS → Records

4. **הוסף/ערוך Record:**
   - **Type:** `CNAME`
   - **Name:** `crm` (או `@` לדומיין הראשי)
   - **Target:** `YOUR-CLOUD-RUN-URL` (מה-URL שהעתקת בשלב 1)
     - לדוגמה: `tanandco-crm-xxxxx-xx.a.run.app`
   - **Proxy status:** 🟠 Proxied (מומלץ)

5. **שמור**

---

### שלב 3: עדכן את APP_BASE_URL ב-Cloud Run

1. **פתח Cloud Run Console:**
   https://console.cloud.google.com/run/detail/europe-west1/tanandco-crm?project=tanandco-crm

2. **לחץ:** "Edit & Deploy New Revision"

3. **גלול ל:** Variables & Secrets

4. **עדכן או הוסף:**
   - **Name:** `APP_BASE_URL`
   - **Value:** `https://crm.tanandco.co.il` (או `https://tanandco.co.il` אם זה הדומיין הראשי)

5. **לחץ:** "Deploy"

---

### שלב 4: המתן והבדוק

1. **המתן 2-5 דקות** (להפצת DNS)

2. **בדוק:**
   ```powershell
   # בדיקת DNS
   Resolve-DnsName -Name "crm.tanandco.co.il" -Type CNAME
   
   # בדיקת האתר
   curl https://crm.tanandco.co.il/api/health
   ```

3. **אם הכל עובד:**
   - ✅ תראה תשובה מה-API
   - ✅ האתר יעבוד ב-`https://crm.tanandco.co.il`

---

## 🐛 פתרון בעיות:

### בעיה: DNS לא מפנה

**פתרון:**
1. ודא שה-Record ב-Cloudflare נכון
2. ודא שה-Proxy status הוא 🟠 Proxied
3. המתן 5-10 דקות להפצת DNS

### בעיה: 404 Not Found

**פתרון:**
1. בדוק שה-Cloud Run service רץ
2. בדוק שה-URL ב-Tunnel נכון
3. בדוק את ה-Logs ב-Cloud Run

### בעיה: 530 Error

**פתרון:**
1. בדוק שה-Tunnel מחובר
2. בדוק שה-URL ב-Tunnel תואם ל-Cloud Run URL
3. ודא שה-Cloud Run service מאפשר גישה ציבורית

---

## 📝 סיכום:

1. ✅ בדוק Cloud Run service URL
2. ✅ הגדר Cloudflare Tunnel או DNS Record
3. ✅ עדכן `APP_BASE_URL` ב-Cloud Run
4. ✅ המתן והבדוק

---

**עודכן:** ינואר 2025

