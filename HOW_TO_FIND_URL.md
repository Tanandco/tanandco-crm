# 🔍 איך למצוא את ה-URL של האפליקציה בפרודקשן

## אם האפליקציה רץה על Replit:

### שלב 1: היכנס ל-Replit
1. פתח [replit.com](https://replit.com)
2. היכנס לחשבון שלך
3. מצא את הפרויקט: **TanCoCRM** (או השם שהגדרת)

### שלב 2: מצא את ה-URL
יש כמה דרכים:

#### דרך א: דרך ה-Deployment
1. בפרויקט, לחץ על הכפתור **"Deploy"** או **"⚡ Deploy"** (בצד ימין למעלה)
2. אם יש לך deployment פעיל, תראה את ה-URL שם
3. ה-URL יהיה משהו כמו: `https://TanCoCRM.your-username.repl.co`

#### דרך ב: דרך ה-Webview
1. לחץ על הכפתור **"Open in new tab"** או **"🔗"** (בצד ימין למעלה)
2. זה יפתח את האפליקציה בדפדפן
3. העתק את ה-URL מהשורת הכתובת

#### דרך ג: דרך ה-Settings
1. לחץ על ה-⚙️ **Settings** (בצד ימין)
2. לחץ על **"Deployments"** או **"Deploy"**
3. שם תראה את כל ה-deployments הפעילים עם ה-URLs שלהם

#### דרך ד: דרך ה-Console
1. פתח את ה-Console (Terminal) בפרויקט
2. הרץ:
```bash
echo $REPLIT_DOMAINS
```
3. זה יציג את ה-URL של הפרויקט

### שלב 3: בדוק שהאפליקציה רצה
פתח את ה-URL בדפדפן. אם אתה רואה את הממשק של האפליקציה - הכל עובד! ✅

---

## אם האפליקציה לא רץה עדיין:

### אפשרות 1: הפעל Deployment ב-Replit
1. לחץ על **"Deploy"** או **"⚡ Deploy"**
2. בחר **"Autoscale"** (אם זה לא כבר מוגדר)
3. לחץ **"Deploy"**
4. Replit יבנה ויפרס את האפליקציה
5. תקבל URL אוטומטי

### אפשרות 2: הפעל ידנית
1. לחץ על הכפתור **"Run"** (▶️)
2. זה יריץ את האפליקציה ב-development mode
3. לחץ על **"Open in new tab"** כדי לראות אותה

**הערה:** ב-development mode, האפליקציה תיסגר כשתסגור את Replit. לכן חשוב לפרוס עם **Deploy** כדי שהיא תרוץ תמיד.

---

## אם האפליקציה רץה על פלטפורמה אחרת:

### Railway
1. היכנס ל-[railway.app](https://railway.app)
2. בחר את הפרויקט
3. ה-URL מופיע בראש הדף: `https://your-app.up.railway.app`

### Render
1. היכנס ל-[render.com](https://render.com)
2. בחר את ה-Web Service
3. ה-URL מופיע בראש: `https://your-app.onrender.com`

### Fly.io
1. הרץرمינל:
```bash
fly status
```
2. או היכנס ל-[fly.io dashboard](https://fly.io/dashboard)
3. ה-URL יהיה: `https://your-app.fly.dev`

---

## בדיקה מהירה:

פתח בדפדפן:
```
https://your-url.com/api/health
```

אם אתה מקבל `{"status":"ok"}` - האפליקציה רצה! ✅

---

## אם לא מצאת את ה-URL:

1. **בדוק את ה-logs** - אולי יש שגיאה
2. **ודא שה-deployment פעיל** - אולי הוא נעצר
3. **בדוק את ה-Settings** - אולי צריך להפעיל deployment מחדש

---

**עודכן:** נובמבר 2025

