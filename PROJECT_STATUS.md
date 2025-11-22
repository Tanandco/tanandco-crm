# מצב פרויקט Tan & Co CRM

## 📍 מיקום הפרויקט
```
C:\Users\tanan\OneDrive\שולחן העבודה\tanandco-crm
```

## ✅ הישגים אחרונים (22/11/2025)

### 1. אינטגרציית BioStar
- ✅ **חיבור:** אותר שרת BioStar מקומי בפורט 80.
- ✅ **אימות:** אומתו פרטי התחברות (`admin` / `Makor2024`).
- ✅ **קוד:** עודכן `biostar-startup.ts` לטיפול נכון בחיבור.
- ✅ **סביבה:** עודכן `.env` עם הכתובת והפרטים הנכונים.

### 2. אינטגרציית WhatsApp
- ✅ **תיקון Token:** הושלם `CLOUD_API_ACCESS_TOKEN` בקובץ `.env`.
- ✅ **בדיקה:** השירות עולה בהצלחה (`[WhatsApp] Service initialized successfully`).

### 3. שרת וסביבת עבודה
- ✅ **פורטים:** תוקנה התנגשות בפורט 5080.
- ✅ **הרצה:** השרת רץ תקין (`npm run dev`).
- ✅ **ניקוי:** הוסרו קבצי בדיקה זמניים.

## 🔧 מה צריך לעשות עכשיו

### 1. בדיקות פונקציונליות
- לבצע תהליך מלא במערכת:
    - רישום לקוח חדש
    - זיהוי פנים (BioStar)
    - חיוב (Cardcom)
    - שליחת הודעה (WhatsApp)

### 2. פריסה (Deployment)
- לוודא שכל משתני הסביבה החדשים (במיוחד `CLOUD_API_ACCESS_TOKEN` ופרטי BioStar) מעודכנים ב-Cloud Run.
- לבצע Deploy לגרסה החדשה.

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
