# 🔧 פתרון שגיאת Build ב-Google Cloud Run

## הבעיה:
Build failed - צריך לבדוק את ה-build logs.

---

## שלב 1: בדיקת Build Logs

### דרך Console:
1. **Google Cloud Console → Cloud Build → History**
2. **לחץ על ה-build הכושל** (האחרון ברשימה)
3. **ראה את ה-Logs** - חפש שגיאות

### דרך CLI:
```powershell
# רשימת builds אחרונים
gcloud builds list --limit=5

# ראה logs של build ספציפי
gcloud builds log BUILD_ID
```

---

## בעיות נפוצות ופתרונות:

### 1. שגיאת Dockerfile
**בעיה:** Dockerfile לא נמצא או לא נכון

**פתרון:**
- ודא שיש `Dockerfile` בתיקיית השורש
- ודא שה-Dockerfile נכון (ראה `Dockerfile` בפרויקט)

### 2. שגיאת Build (npm run build)
**בעיה:** ה-build נכשל בגלל שגיאות בקוד

**פתרון:**
- ודא שה-build עובד מקומית: `npm run build`
- אם יש שגיאות, תיקן אותן לפני הפריסה

### 3. שגיאת GitHub Repository
**בעיה:** Repository לא נגיש או branch לא נכון

**פתרון:**
- ודא שה-repository נגיש
- ודא שה-branch הוא `main` (או `master`)
- ודא שיש Dockerfile ב-branch הזה

### 4. שגיאת Permissions
**בעיה:** אין הרשאות ל-Cloud Build

**פתרון:**
- Cloud Build → Settings → Enable API
- ודא שיש הרשאות לפרויקט

---

## שלב 2: תיקון הבעיה

לאחר שזיהית את הבעיה מה-logs, תיקן אותה:

### אם הבעיה היא ב-Dockerfile:
- ודא שה-Dockerfile נכון
- ודא שהוא בתיקיית השורש

### אם הבעיה היא ב-Build:
- תיקן את השגיאות בקוד
- ודא ש-`npm run build` עובד מקומית
- Push את השינויים ל-GitHub

---

## שלב 3: פריסה מחדש

לאחר התיקון:

1. **Push את השינויים ל-GitHub:**
   ```powershell
   git add .
   git commit -m "Fix build errors"
   git push origin main
   ```

2. **Cloud Run יפרס אוטומטית** (אם הגדרת continuous deployment)

3. **או Deploy ידנית:**
   - Cloud Run → tanandco → Deploy New Revision
   - בחר את ה-revision החדש

---

## בדיקה מהירה:

### בדוק שה-build עובד מקומית:
```powershell
npm run build
```

אם זה נכשל מקומית, זה יכשל גם ב-Cloud Run.

---

## עזרה נוספת:

אם אתה רואה שגיאה ספציפית ב-logs, שלח אותה ואעזור לך לפתור!

