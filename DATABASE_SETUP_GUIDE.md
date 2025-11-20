# מדריך להגדרת מסד נתונים (Neon + Drizzle)

## בעיה ידועה

הפקודה `npm run db:push` נכשלת עם השגיאה:
```
error: password authentication failed for user 'neondb_owner'
```

## פתרון

### שלב 1: קבלת הסיסמה הנכונה מ-Neon

1. התחבר ל-[Neon Console](https://console.neon.tech/)
2. בחר את הפרויקט שלך
3. לחץ על **Settings** → **Connection Details**
4. העתק את ה-`DATABASE_URL` המלא (כולל הסיסמה)

### שלב 2: עדכון .env המקומי

**אפשרות א': שימוש בסקריפט PowerShell**

```powershell
cd "C:\Users\tanan\OneDrive\שולחן העבודה\tanandco-crm"
.\quick-fix-database.ps1
```

**אפשרות ב': עריכה ידנית**

1. פתח את קובץ `.env` בתיקיית הפרויקט
2. מצא את השורה `DATABASE_URL=...`
3. החלף את הערך ב-`DATABASE_URL` המלא מ-Neon Console
4. שמור את הקובץ

### שלב 3: בדיקת החיבור

```powershell
cd "C:\Users\tanan\OneDrive\שולחן העבודה\tanandco-crm"
.\test-database-connection.ps1
```

אם החיבור מצליח, תראה הודעה:
```
✅ Database connection successful!
```

### שלב 4: דחיפת הסכמה למסד הנתונים

```powershell
npm run db:push
```

אם הכל תקין, תראה:
```
✓ Pushed migrations to database
```

## הערות חשובות

- **אל תדחוף את קובץ `.env` ל-GitHub!** הקובץ מכיל סודות.
- השתמש ב-Environment Variables ב-Cloud Run עבור הפריסה.
- אם יש לך Pooler URL מ-Neon, השתמש בו (זה מהיר יותר).

## בדיקת הסכמה

לצפייה במסד הנתונים:

```powershell
npm run db:studio
```

זה יפתח דפדפן עם ממשק גרפי למסד הנתונים.

