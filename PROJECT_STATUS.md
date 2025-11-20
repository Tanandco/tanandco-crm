# מצב פרויקט Tan & Co CRM

## 📍 מיקום הפרויקט
```
C:\Users\tanan\OneDrive\שולחן העבודה\tanandco-crm
```

## ✅ מה תוקן

### 1. package.json
- ✅ הוספתי סקריפט `db:push` (drizzle-kit push)
- ✅ הוספתי סקריפט `db:studio` (drizzle-kit studio)
- ✅ הוספתי סקריפט `db:generate` (drizzle-kit generate)
- ✅ הוספתי `drizzle-kit` ל-devDependencies
- ✅ תיקנתי את סקריפט `dev` להשתמש ב-tsx (כמו `server`)
- ✅ תיקנתי את סקריפט `start` להגדיר NODE_ENV=production

### 2. server/index.ts
- ✅ הוספתי טעינת dotenv בתחילת הקובץ (`import "dotenv/config"`)
- ✅ תיקנתי את הפורט: בפיתוח 5080, בפרודקשן 5000 (Cloud Run)
- ✅ שיפרתי את הודעת ההפעלה

### 3. קבצים שנוצרו
- ✅ `DATABASE_SETUP_GUIDE.md` - מדריך להגדרת מסד נתונים

## 🔧 מה צריך לעשות עכשיו

### 1. התקנת תלויות חדשות
```powershell
cd "C:\Users\tanan\OneDrive\שולחן העבודה\tanandco-crm"
npm install
```

זה יתקין את `drizzle-kit` שהוסף ל-devDependencies.

### 2. תיקון חיבור מסד הנתונים
עקוב אחרי `DATABASE_SETUP_GUIDE.md` כדי לתקן את ה-DATABASE_URL ב-.env.

### 3. בדיקת הבנייה
```powershell
npm run build
```

אם זה מצליח, תראה תיקייה `dist` עם הקבצים הבנויים.

### 4. בדיקת השרת המקומי
```powershell
npm run dev
```

השרת אמור לעלות על `http://localhost:5080` (או הפורט שמוגדר ב-PORT env var).

## 🚀 פריסה ל-Cloud Run

### לפני הפריסה
1. ודא שהקוד ב-GitHub מעודכן:
   ```powershell
   git status
   git add .
   git commit -m "Fix: add drizzle-kit, fix port configuration, add dotenv"
   git push origin main
   ```

2. ודא ש-Environment Variables ב-Cloud Run מעודכנים:
   - פתח `CLOUD_RUN_ENV_VARIABLES_REAL.txt` (אם קיים)
   - עדכן את כל המשתנים ב-Cloud Run Console

### פריסה
Cloud Build ירוץ אוטומטית אחרי push ל-main, או:
1. פתח [Google Cloud Console](https://console.cloud.google.com/run)
2. בחר את השירות `tanandco`
3. לחץ "Edit & Deploy New Revision"
4. ודא שהקוד מושך מ-GitHub (branch: main)
5. לחץ "Deploy"

## ⚠️ דברים חשובים

### אל תעשה:
- ❌ אל תשנה את פורט 5000 - זה BioStar!
- ❌ אל תדחוף את קובץ `.env` ל-GitHub
- ❌ אל תגע במערכת BioStar המקומית

### מה כן לעשות:
- ✅ השתמש בפורט 5080 בפיתוח
- ✅ השתמש ב-Environment Variables ב-Cloud Run
- ✅ ודא ש-DATABASE_URL נכון לפני `npm run db:push`

## 📝 סקריפטים זמינים

```powershell
# פיתוח (פורט 5080)
npm run dev

# בנייה
npm run build

# הרצה בפרודקשן
npm start

# מסד נתונים
npm run db:push      # דחיפת סכמה
npm run db:studio    # ממשק גרפי
npm run db:generate  # יצירת migrations
```

## 🔗 קישורים שימושיים

- [Neon Console](https://console.neon.tech/)
- [Google Cloud Run](https://console.cloud.google.com/run)
- [GitHub Repository](https://github.com/Tanandco/tanandco-crm)

