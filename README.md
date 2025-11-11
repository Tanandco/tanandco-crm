# Tan & Co CRM System - מערכת ניהול לקוחות

מערכת CRM מתקדמת לניהול עסקי יופי ובריאות עם זיהוי פנים, תשלומים אוטומטיים, ואינטגרציית WhatsApp.

## 📋 תוכן עניינים

- [התקנה והפעלה מקומית](#התקנה-והפעלה-מקומית)
- [פריסה לשרת קבוע (24/7)](#פריסה-לשרת-קבוע-247)
- [משתני סביבה נדרשים](#משתני-סביבה-נדרשים)
- [המבנה הטכני](#המבנה-הטכני)
- [פתרון בעיות](#פתרון-בעיות)

---

## 🚀 התקנה והפעלה מקומית

### דרישות מוקדמות

- **Node.js** 18+ (מומלץ 20+)
- **npm** או **yarn**
- **PostgreSQL** (מומלץ: [Neon](https://neon.tech) - חינמי)
- **Git**

### שלבי התקנה

1. **שכפול הפרויקט:**
```bash
git clone <repository-url>
cd tanandco-crm
```

2. **התקנת תלויות:**
```bash
npm install
```

3. **הגדרת משתני סביבה:**
```bash
# העתק את הקובץ לדוגמה
cp .env.example .env

# ערוך את .env והזן את הערכים שלך
# ראה פרק "משתני סביבה נדרשים" למטה
```

4. **הגדרת מסד הנתונים:**
```bash
# דחיפת הסכמה למסד הנתונים
npm run db:push
```

5. **הפעלת השרת (פיתוח):**
```bash
npm run dev
```

האפליקציה תרוץ על `http://localhost:5000`

6. **בנייה לפרודקשן:**
```bash
npm run build
npm start
```

---

## 🌐 פריסה לשרת קבוע (24/7)

האפליקציה צריכה לרוץ על שרת ענן כדי להיות זמינה תמיד. הנה 3 אפשרויות מומלצות:

### אפשרות 1: Railway (מומלץ - הכי קל) 🚂

**יתרונות:**
- פריסה אוטומטית מ-GitHub
- SSL אוטומטי
- $5/חודש (500 שעות חינם)
- תמיכה ב-PostgreSQL מובנית

**הוראות:**

1. הירשם ל-[Railway](https://railway.app)
2. לחץ "New Project" → "Deploy from GitHub repo"
3. בחר את הפרויקט שלך
4. הוסף משתני סביבה (ראה `.env.example`)
5. הוסף PostgreSQL Addon (או השתמש ב-Neon)
6. Railway יזהה את `package.json` ויריץ אוטומטית

**הגדרות ב-Railway:**
- Build Command: `npm run build`
- Start Command: `npm start`
- Port: `5000` (אוטומטי)

### אפשרות 2: Render 🎨

**יתרונות:**
- חינמי (עם הגבלות)
- SSL אוטומטי
- פריסה מ-GitHub

**הוראות:**

1. הירשם ל-[Render](https://render.com)
2. "New" → "Web Service"
3. חבר את ה-GitHub repository
4. הגדר:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Environment:** `Node`
5. הוסף משתני סביבה
6. לחץ "Create Web Service"

**הערה:** Render יכול להירדם אחרי 15 דקות ללא פעילות (בתוכנית החינמית). שדרג ל-$7/חודש לשרת תמיד פעיל.

### אפשרות 3: Fly.io ✈️

**יתרונות:**
- חינמי (3 VMs קטנים)
- מהיר מאוד
- פריסה עם Docker

**הוראות:**

1. התקן את [Fly CLI](https://fly.io/docs/getting-started/installing-flyctl/)
2. היכנס: `fly auth login`
3. צור אפליקציה: `fly launch`
4. הוסף משתני סביבה: `fly secrets set KEY=value`
5. פרוס: `fly deploy`

---

## 🔐 משתני סביבה נדרשים

צור קובץ `.env` בתיקיית השורש עם המשתנים הבאים:

### מסד נתונים (חובה)
```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

### WhatsApp Business API (חובה)
```env
WA_PHONE_NUMBER_ID=699582612923896
CLOUD_API_ACCESS_TOKEN=your_long_lived_access_token
CLOUD_API_VERSION=v21.0
```

### Cardcom Payment Gateway (חובה)
```env
CARDCOM_TERMINAL_NUMBER=157825
CARDCOM_API_USERNAME=your_username
CARDCOM_API_PASSWORD=your_password
```

### BioStar 2 (אופציונלי - אם יש לך זיהוי פנים)
```env
BIOSTAR_SERVER_URL=https://your-biostar-server.com
BIOSTAR_USERNAME=admin
BIOSTAR_PASSWORD=your_password
BIOSTAR_DOOR_ID=2
# או השבת את BioStar:
BIOSTAR_DISABLED=true
```

### Meta Marketing API (אופציונלי)
```env
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
```

### TikTok Ads API (אופציונלי)
```env
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
```

### Freepik API (אופציונלי)
```env
FREEPIK_API_KEY=your_api_key
```

### הגדרות כלליות
```env
NODE_ENV=production
PORT=5000
APP_BASE_URL=https://your-app-url.com
```

**⚠️ חשוב:** לעולם אל תעלה את קובץ `.env` ל-Git! הוא כבר ב-`.gitignore`.

---

## 🏗️ המבנה הטכני

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Wouter** (routing)
- **TanStack Query** (data fetching)
- **Shadcn/ui** (UI components)
- **Tailwind CSS** (styling)

### Backend
- **Express.js** (REST API)
- **Drizzle ORM** (database)
- **PostgreSQL** (database)

### אינטגרציות
- **WhatsApp Business API** - הודעות אוטומטיות
- **Cardcom** - תשלומים
- **BioStar 2** - זיהוי פנים
- **Meta/Google/TikTok Ads** - שיווק

---

## 🔧 פתרון בעיות

### השרת לא מתחיל
```bash
# בדוק שהפורט לא תפוס
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# בדוק משתני סביבה
node -e "console.log(process.env.DATABASE_URL)"
```

### שגיאת מסד נתונים
```bash
# ודא שה-DATABASE_URL נכון
# נסה להתחבר ידנית:
psql $DATABASE_URL

# דחוף סכמה מחדש:
npm run db:push
```

### WhatsApp לא שולח הודעות
- ודא ש-`CLOUD_API_ACCESS_TOKEN` תקף
- בדוק ש-`WA_PHONE_NUMBER_ID` נכון
- ודא שהתבניות מאושרות ב-Meta

### BioStar לא מתחבר
- ודא שה-`BIOSTAR_SERVER_URL` נגיש מהשרת
- אם BioStar מקומי, השתמש ב-[Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- או השבת עם `BIOSTAR_DISABLED=true`

### שגיאת build
```bash
# נקה cache והתקן מחדש
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📞 תמיכה

לשאלות או בעיות:
1. בדוק את ה-logs בשרת
2. בדוק את ה-console בדפדפן (F12)
3. פתח issue ב-GitHub

---

## 📝 רישיון

פרויקט זה הוא קנייני של Tan & Co. כל הזכויות שמורות.

---

**עודכן לאחרונה:** נובמבר 2025

