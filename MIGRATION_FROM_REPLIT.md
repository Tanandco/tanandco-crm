# 🚀 מדריך העברה מ-Replit לענן

מדריך מפורט להעברת האפליקציה Tan & Co CRM מ-Replit לשרת ענן (Railway, Render, Fly.io).

---

## 📋 תוכן עניינים

1. [הכנות לפני העברה](#הכנות-לפני-העברה)
2. [העברת קוד ל-GitHub](#העברת-קוד-ל-github)
3. [העברת משתני סביבה](#העברת-משתני-סביבה)
4. [פריסה על Railway (מומלץ)](#פריסה-על-railway-מומלץ)
5. [פריסה על Render](#פריסה-על-render)
6. [פריסה על Fly.io](#פריסה-על-flyio)
7. [עדכון Webhooks](#עדכון-webhooks)
8. [בדיקות לאחר פריסה](#בדיקות-לאחר-פריסה)
9. [פתרון בעיות](#פתרון-בעיות)

---

## 🔧 הכנות לפני העברה

### 1. בדיקת שינויים שנעשו

הפרויקט כבר מוכן לפריסה! השינויים הבאים כבר בוצעו:
- ✅ הסרת תלויות Replit מ-`package.json`
- ✅ יצירת `.dockerignore`
- ✅ עדכון `Dockerfile`
- ✅ תיקון נתיבי קבצים סטטיים

### 2. בדיקת מסד נתונים

ודא שיש לך גישה ל-`DATABASE_URL` מ-Replit:
1. היכנס ל-Replit → Secrets
2. העתק את כל הערכים של משתני הסביבה
3. שמור אותם במסמך זמני (לא ב-Git!)

---

## 📦 העברת קוד ל-GitHub

### שלב 1: יצירת Repository חדש

1. היכנס ל-[GitHub](https://github.com)
2. לחץ "New repository"
3. שם: `tanandco-crm`
4. בחר "Private" (מומלץ)
5. אל תוסיף README/License (יש כבר)
6. לחץ "Create repository"

### שלב 2: העלאת הקוד

```bash
# בתיקיית הפרויקט המקומית
git init
git add .
git commit -m "Initial commit - ready for cloud deployment"

# הוסף את ה-remote
git remote add origin https://github.com/YOUR_USERNAME/tanandco-crm.git

# העלה את הקוד
git branch -M main
git push -u origin main
```

**⚠️ חשוב:** ודא ש-`.env` ב-`.gitignore` (כבר שם)!

---

## 🔐 העברת משתני סביבה

### שלב 1: העתקת משתנים מ-Replit

מ-Replit → Secrets, העתק את כל המשתנים הבאים:

```
DATABASE_URL
PGDATABASE
PGHOST
PGPORT
PGUSER
PGPASSWORD
SESSION_SECRET
PRINTER_INTERFACE
OPENAI_API_KEY
WA_PHONE_NUMBER_ID
WA_BUSINESS_ACCOUNT_ID
CLOUD_API_ACCESS_TOKEN
CLOUD_API_VERSION
WA_APP_SECRET
WHATSAPP_APP_SECRET
WA_VERIFY_TOKEN
WEBHOOK_VERIFICATION_TOKEN
CARDCOM_TERMINAL_NUMBER
CARDCOM_TERMINAL
CARDCOM_USERNAME
CARDCOM_API_USERNAME
CARDCOM_API_KEY
CARDCOM_API_PASSWORD
BIOSTAR_SERVER_URL
BIOSTAR_USERNAME
BIOSTAR_PASSWORD
BIOSTAR_DOOR_ID
BIOSTAR_ALLOW_SELF_SIGNED
FACEBOOK_APP_ID
FACEBOOK_APP_SECRET
TIKTOK_CLIENT_KEY
TIKTOK_CLIENT_SECRET
FREEPIK_API_KEY
DOOR_ACCESS_KEY
ADMIN_PHONE
NODE_ENV=production
PORT=5000
```

### שלב 2: שמירה זמנית

שמור את כל הערכים בקובץ זמני (לא ב-Git!) - תצטרך אותם בהמשך.

---

## 🚂 פריסה על Railway (מומלץ)

Railway הוא הכי קל ונוח. $5/חודש (500 שעות חינם).

### שלב 1: הרשמה

1. היכנס ל-[railway.app](https://railway.app)
2. לחץ "Login" → "Login with GitHub"
3. אשר את ההרשאות

### שלב 2: יצירת פרויקט

1. לחץ "New Project"
2. בחר "Deploy from GitHub repo"
3. בחר את ה-repository `tanandco-crm`
4. Railway יזהה את `package.json` ויתחיל build אוטומטי

### שלב 3: הוספת PostgreSQL

**אפשרות א: Railway PostgreSQL (מומלץ)**
1. בפרויקט, לחץ "New" → "Database" → "Add PostgreSQL"
2. Railway יצור database אוטומטית
3. לחץ על ה-database → "Variables" → העתק את `DATABASE_URL`
4. חזור לפרויקט → "Variables" → הוסף:
   ```
   DATABASE_URL=<העתק מה-database>
   ```

**אפשרות ב: Neon (חיצוני)**
- אם יש לך כבר Neon, פשוט הוסף את ה-`DATABASE_URL` מ-Replit

### שלב 4: הגדרת משתני סביבה

בפרויקט, לחץ "Variables" והוסף את כל המשתנים שהעתקת מ-Replit:

```
WA_PHONE_NUMBER_ID=699582612923896
CLOUD_API_ACCESS_TOKEN=...
CARDCOM_TERMINAL_NUMBER=1578525
...
NODE_ENV=production
PORT=5000
```

**חשוב:** אל תוסיף `APP_BASE_URL` עדיין - תקבל אותו אחרי הפריסה.

### שלב 5: הגדרת Build

Railway מזהה אוטומטית, אבל אפשר לוודא:

1. "Settings" → "Build & Deploy"
2. Build Command: `npm run build`
3. Start Command: `npm start`
4. Root Directory: `/` (ברירת מחדל)

### שלב 6: פריסה

Railway יבנה ויפרס אוטומטית. תקבל URL כמו:
`https://tanandco-crm-production.up.railway.app`

### שלב 7: עדכון APP_BASE_URL

1. העתק את ה-URL שקיבלת
2. חזור ל-"Variables"
3. הוסף/עדכן:
   ```
   APP_BASE_URL=https://tanandco-crm-production.up.railway.app
   ```
4. Railway יפרס מחדש אוטומטית

---

## 🎨 פריסה על Render

Render מציע תוכנית חינמית (עם הגבלות) או $7/חודש לשרת תמיד פעיל.

### שלב 1: הרשמה

1. היכנס ל-[render.com](https://render.com)
2. "Get Started for Free" → "Sign up with GitHub"

### שלב 2: יצירת Web Service

1. "New" → "Web Service"
2. חבר את ה-GitHub repository `tanandco-crm`
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
- הוסף את כל המשתנים מ-Replit
- `DATABASE_URL` = ה-Internal Database URL מה-PostgreSQL
- `APP_BASE_URL` = תקבל אחרי הפריסה (עדכן אחר כך)

### שלב 5: פריסה

Render יתחיל build אוטומטי. תקבל URL:
`https://tanandco-crm.onrender.com`

**הערה:** בתוכנית החינמית, השרת יכול להירדם אחרי 15 דקות. השדרוג ל-$7/חודש שומר על השרת פעיל תמיד.

---

## ✈️ פריסה על Fly.io

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

# או הוסף את כל המשתנים מקובץ .env (אם יש לך):
fly secrets import < .env
```

### שלב 5: פריסה

```bash
fly deploy
```

Fly יבנה ויפרס. תקבל URL:
`https://tanandco-crm.fly.dev`

### שלב 6: עדכון APP_BASE_URL

```bash
fly secrets set APP_BASE_URL="https://tanandco-crm.fly.dev"
fly deploy
```

---

## 🔗 עדכון Webhooks

לאחר הפריסה, עדכן את ה-webhooks עם ה-URL החדש:

### WhatsApp Business API

1. היכנס ל-[Meta for Developers](https://developers.facebook.com)
2. בחר את ה-App שלך
3. WhatsApp → Configuration → Webhook
4. עדכן את ה-URL ל:
   ```
   https://your-new-url.com/api/webhooks/whatsapp
   ```
5. עדכן את `WEBHOOK_VERIFICATION_TOKEN` (אם שונה)

### Cardcom

1. היכנס ל-[Cardcom Dashboard](https://secure.cardcom.solutions)
2. הגדרות → Webhooks
3. עדכן את ה-URL ל:
   ```
   https://your-new-url.com/api/webhooks/cardcom/payment
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

### 3. בדיקת עמוד ראשי

פתח:
```
https://your-app-url.com/
```

צריך לראות את הממשק של האפליקציה.

### 4. בדיקת WhatsApp

שלח הודעה דרך הממשק ובדוק שהיא נשלחת.

### 5. בדיקת תשלום

נסה ליצור תשלום test דרך Cardcom.

### 6. בדיקת BioStar

אם יש לך BioStar:
```
https://your-app-url.com/api/biostar/health
```

---

## 🐛 פתרון בעיות

### השרת לא מתחיל

**בדוק logs:**
- Railway: "Deployments" → לחץ על deployment → "View Logs"
- Render: "Events" → "View Logs"
- Fly.io: `fly logs`

**בעיות נפוצות:**
- `DATABASE_URL` לא נכון
- `PORT` לא מוגדר (צריך להיות `5000`)
- Build נכשל (בדוק שגיאות ב-logs)
- חסרים משתני סביבה

### Webhooks לא עובדים

1. ודא שה-`APP_BASE_URL` נכון
2. בדוק שה-URLים נגישים (לא localhost)
3. ודא שה-SSL פעיל (HTTPS)
4. בדוק שה-`WEBHOOK_VERIFICATION_TOKEN` תואם

### BioStar לא מתחבר

1. ודא שה-`BIOSTAR_SERVER_URL` נגיש מהענן
2. אם BioStar מקומי, השתמש ב-Cloudflare Tunnel (ראה `DEPLOYMENT.md`)
3. או השב עם `BIOSTAR_DISABLED=true`

### שגיאת Build

**Railway/Render:**
- בדוק את ה-logs של ה-build
- ודא ש-`npm run build` עובד מקומית
- בדוק שאין שגיאות TypeScript: `npm run check`

**Fly.io:**
```bash
fly logs
# או
fly deploy --verbose
```

---

## 📝 רשימת בדיקה סופית

לפני שסוגרים את Replit, ודא:

- [ ] האפליקציה רצה על הענן החדש
- [ ] כל ה-webhooks מעודכנים
- [ ] מסד הנתונים מחובר ועובד
- [ ] כל המשתנים מוגדרים נכון
- [ ] בדיקות עברו בהצלחה
- [ ] גיבוי של כל המשתנים מ-Replit

---

## 🎉 סיום

לאחר שכל הבדיקות עברו בהצלחה:

1. **שמור גיבוי** של כל המשתנים מ-Replit
2. **עדכן את ה-URL** בכל המקומות הרלוונטיים
3. **בדוק שהכל עובד** במשך כמה ימים
4. **רק אז** תוכל לסגור את Replit (אם תרצה)

---

**עודכן:** דצמבר 2025

**תמיכה:** לשאלות, פתח issue ב-GitHub או בדוק את ה-logs בפלטפורמה.

