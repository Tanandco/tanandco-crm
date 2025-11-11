# 🚀 מדריך פריסה מפורט - Tan & Co CRM

מדריך זה מסביר איך לפרוס את האפליקציה על שרת ענן כך שתעבוד 24/7 ללא תלות במחשב המקומי.

---

## 📋 תוכן

1. [הכנות לפני פריסה](#הכנות-לפני-פריסה)
2. [Railway - פריסה מומלצת](#railway---פריסה-מומלצת)
3. [Render - חלופה חינמית](#render---חלופה-חינמית)
4. [Fly.io - חלופה מתקדמת](#flyio---חלופה-מתקדמת)
5. [הגדרת BioStar עם Cloudflare Tunnel](#הגדרת-biostar-עם-cloudflare-tunnel)
6. [בדיקות לאחר פריסה](#בדיקות-לאחר-פריסה)

---

## 🔧 הכנות לפני פריסה

### 1. הכנת Repository

ודא שהקוד שלך ב-GitHub/GitLab:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/tanandco-crm.git
git push -u origin main
```

### 2. הכנת מסד נתונים

**אפשרות א: Neon (מומלץ - חינמי)**
1. הירשם ל-[Neon](https://neon.tech)
2. צור database חדש
3. העתק את ה-connection string
4. שמור אותו - תצטרך אותו בהגדרת משתני סביבה

**אפשרות ב: Railway PostgreSQL**
- Railway מציע PostgreSQL Addon
- אוטומטי עם הפריסה

### 3. הכנת משתני סביבה

הכן רשימה של כל המשתנים מ-`.env.example` עם הערכים האמיתיים.

---

## 🚂 Railway - פריסה מומלצת

Railway הוא הכי קל ונוח לפריסה. $5/חודש (500 שעות חינם).

### שלב 1: הרשמה והתחברות

1. היכנס ל-[railway.app](https://railway.app)
2. לחץ "Login" → "Login with GitHub"
3. אשר את ההרשאות

### שלב 2: יצירת פרויקט

1. לחץ "New Project"
2. בחר "Deploy from GitHub repo"
3. בחר את ה-repository שלך
4. Railway יזהה את `package.json` ויתחיל build אוטומטי

### שלב 3: הוספת PostgreSQL

1. בפרויקט, לחץ "New" → "Database" → "Add PostgreSQL"
2. Railway יצור database אוטומטית
3. לחץ על ה-database → "Variables" → העתק את `DATABASE_URL`
4. חזור לפרויקט → "Variables" → הוסף:
   ```
   DATABASE_URL=<העתק מה-database>
   ```

### שלב 4: הגדרת משתני סביבה

בפרויקט, לחץ "Variables" והוסף את כל המשתנים מ-`.env.example`:

```
WA_PHONE_NUMBER_ID=699582612923896
CLOUD_API_ACCESS_TOKEN=...
CARDCOM_TERMINAL_NUMBER=157825
CARDCOM_API_USERNAME=...
CARDCOM_API_PASSWORD=...
NODE_ENV=production
PORT=5000
APP_BASE_URL=https://your-app.railway.app
```

**חשוב:** הוסף את `APP_BASE_URL` אחרי שהאפליקציה תרוץ (תקבל URL אוטומטי).

### שלב 5: הגדרת Build

Railway מזהה אוטומטית, אבל אפשר לוודא:

1. "Settings" → "Build & Deploy"
2. Build Command: `npm run build`
3. Start Command: `npm start`
4. Root Directory: `/` (ברירת מחדל)

### שלב 6: פריסה

Railway יבנה ויפרס אוטומטית. תקבל URL כמו:
`https://your-app.up.railway.app`

### שלב 7: עדכון Webhooks

עדכן את ה-webhooks ב-Cardcom/WhatsApp עם ה-URL החדש:
- Cardcom: `https://your-app.up.railway.app/api/webhooks/cardcom/payment`
- WhatsApp: `https://your-app.up.railway.app/api/webhooks/whatsapp`

---

## 🎨 Render - חלופה חינמית

Render מציע תוכנית חינמית (עם הגבלות) או $7/חודש לשרת תמיד פעיל.

### שלב 1: הרשמה

1. היכנס ל-[render.com](https://render.com)
2. "Get Started for Free" → "Sign up with GitHub"

### שלב 2: יצירת Web Service

1. "New" → "Web Service"
2. חבר את ה-GitHub repository
3. הגדר:
   - **Name:** `tanandco-crm`
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free (או $7/חודש ל-Always On)

### שלב 3: הוספת PostgreSQL

1. "New" → "PostgreSQL"
2. בחר תוכנית (Free או $7/חודש)
3. העתק את `Internal Database URL`

### שלב 4: משתני סביבה

ב-Web Service → "Environment":
- הוסף את כל המשתנים מ-`.env.example`
- `DATABASE_URL` = ה-Internal Database URL מה-PostgreSQL

### שלב 5: פריסה

Render יתחיל build אוטומטי. תקבל URL:
`https://tanandco-crm.onrender.com`

**הערה:** בתוכנית החינמית, השרת יכול להירדם אחרי 15 דקות. השדרוג ל-$7/חודש שומר על השרת פעיל תמיד.

---

## ✈️ Fly.io - חלופה מתקדמת

Fly.io מציע 3 VMs חינמיים עם ביצועים מעולים.

### שלב 1: התקנת CLI

```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Mac/Linux
curl -L https://fly.io/install.sh | sh
```

### שלב 2: התחברות

```bash
fly auth login
```

### שלב 3: יצירת אפליקציה

```bash
cd tanandco-crm
fly launch
```

ענה על השאלות:
- App name: `tanandco-crm` (או שם אחר)
- Region: בחר הקרוב לישראל (אם יש)
- PostgreSQL: `yes` (Fly יצור database)
- Redis: `no`

### שלב 4: הגדרת משתני סביבה

```bash
# הוסף משתנים אחד אחד:
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set WA_PHONE_NUMBER_ID="699582612923896"
fly secrets set CLOUD_API_ACCESS_TOKEN="..."
# ... וכו'
```

או הוסף את כל המשתנים מקובץ `.env`:
```bash
fly secrets import < .env
```

### שלב 5: פריסה

```bash
fly deploy
```

Fly יבנה ויפרס. תקבל URL:
`https://tanandco-crm.fly.dev`

---

## 🔐 הגדרת BioStar עם Cloudflare Tunnel

אם BioStar רץ על מחשב מקומי, צריך לחבר אותו לענן.

### שלב 1: התקנת Cloudflare Tunnel

1. הירשם ל-[Cloudflare Zero Trust](https://one.dash.cloudflare.com) (חינמי)
2. הורד את `cloudflared`:
   - Windows: [הורדה](https://github.com/cloudflare/cloudflared/releases)
   - Mac: `brew install cloudflared`
   - Linux: `wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64`

### שלב 2: התחברות

```bash
cloudflared tunnel login
```

### שלב 3: יצירת Tunnel

```bash
cloudflared tunnel create biostar-tunnel
```

### שלב 4: הגדרת Tunnel

צור קובץ `config.yml`:

```yaml
tunnel: <tunnel-id>
credentials-file: /path/to/credentials.json

ingress:
  - hostname: biostar.yourdomain.com
    service: http://localhost:5000
  - service: http_status:404
```

### שלב 5: הרצת Tunnel

```bash
cloudflared tunnel run biostar-tunnel
```

עכשיו BioStar נגיש דרך `https://biostar.yourdomain.com`

### שלב 6: עדכון משתני סביבה

בשרת הענן, עדכן:
```
BIOSTAR_SERVER_URL=https://biostar.yourdomain.com
```

---

## ✅ בדיקות לאחר פריסה

### 1. בדיקת Health Check

פתח בדפדפן:
```
https://your-app-url.com/api/health
```

צריך לקבל: `{"status":"ok"}`

### 2. בדיקת מסד נתונים

פתח:
```
https://your-app-url.com/api/customers
```

צריך לקבל רשימה (או `[]` אם אין לקוחות).

### 3. בדיקת WhatsApp

שלח הודעה דרך הממשק ובדוק שהיא נשלחת.

### 4. בדיקת תשלום

נסה ליצור תשלום test דרך Cardcom.

### 5. בדיקת BioStar

אם יש לך BioStar:
```
https://your-app-url.com/api/biostar/status
```

---

## 🐛 פתרון בעיות נפוצות

### השרת לא מתחיל

**בדוק logs:**
- Railway: "Deployments" → לחץ על deployment → "View Logs"
- Render: "Events" → "View Logs"
- Fly.io: `fly logs`

**בעיות נפוצות:**
- `DATABASE_URL` לא נכון
- `PORT` לא מוגדר (צריך להיות `5000`)
- Build נכשל (בדוק שגיאות ב-logs)

### Webhooks לא עובדים

1. ודא שה-`APP_BASE_URL` נכון
2. בדוק שה-URLים נגישים (לא localhost)
3. ודא שה-SSL פעיל (HTTPS)

### BioStar לא מתחבר

1. ודא שה-`BIOSTAR_SERVER_URL` נגיש מהענן
2. אם BioStar מקומי, השתמש ב-Cloudflare Tunnel
3. או השב עם `BIOSTAR_DISABLED=true`

---

## 📞 תמיכה

לשאלות:
1. בדוק את ה-logs בפלטפורמה
2. פתח issue ב-GitHub
3. בדוק את ה-documentation של הפלטפורמה

---

**עודכן:** נובמבר 2025

