# סיכום פריסה - Tan & Co CRM

## ✅ מה הושלם

### 1. סקריפט לתיקון חיבור מסד הנתונים
**קובץ:** `fix-database-connection.ps1`

הסקריפט עוזר לעדכן את `DATABASE_URL` בקובץ `.env` עם הסיסמה הנכונה מ-Neon Console.

**שימוש:**
```powershell
cd "C:\Users\tanan\OneDrive\שולחן העבודה\tanandco-crm"
.\fix-database-connection.ps1
```

### 2. מדריך פריסה מלא
**קובץ:** `DEPLOYMENT_GUIDE.md`

מדריך מפורט המכסה:
- תיקון חיבור מסד הנתונים
- בניית הפרויקט
- פריסה ל-Google Cloud Run
- הגדרת WhatsApp Webhook
- הגדרת דומיין ב-Cloudflare

### 3. Checklist מהיר
**קובץ:** `QUICK_CHECKLIST.md`

רשימת בדיקות מהירה לפני ואחרי פריסה.

---

## 📋 משימות שנותרו לביצוע

### 1. תיקון חיבור מסד הנתונים (דחוף)
**פעולה נדרשת:**
1. הרץ את `fix-database-connection.ps1`
2. התחבר ל-Neon Console: https://console.neon.tech
3. העתק את הסיסמה של המשתמש `neondb_owner`
4. עדכן את `DATABASE_URL` ב-`.env`
5. בדוק עם `npm run db:push`

### 2. סינכרון עם GitHub
**פעולה נדרשת:**
```powershell
cd "C:\Users\tanan\OneDrive\שולחן העבודה\tanandco-crm"
git status
git add .
git commit -m "Add: Database fix script and deployment guides"
git push origin main
```

### 3. עדכון Environment Variables ב-Cloud Run
**פעולה נדרשת:**
1. התחבר ל-Google Cloud Console
2. Cloud Run → בחר את השירות
3. Edit & Deploy New Revision → Variables & Secrets
4. עדכן לפי `CLOUD_RUN_ENV_VARIABLES_REAL.txt`
5. **חשוב:** ודא ש-`DATABASE_URL` מכיל את הסיסמה הנכונה

### 4. עדכון WhatsApp Webhook ב-Meta Console
**פעולה נדרשת:**
1. התחבר ל-Meta for Developers
2. WhatsApp → Configuration
3. עדכן Callback URL: `https://crm.tanandco.co.il/api/webhooks/whatsapp`
4. עדכן Verify Token לפי `WEBHOOK_VERIFICATION_TOKEN` ב-Cloud Run

---

## 🔍 בדיקות מומלצות

### לפני פריסה
```powershell
# 1. בדיקת חיבור DB
npm run db:push

# 2. בדיקת בנייה
npm run build

# 3. בדיקת השרת המקומי
npm run dev
# פתח: http://localhost:5080
```

### לאחר פריסה
```powershell
# 1. בדיקת Health
Invoke-WebRequest -Uri "https://crm.tanandco.co.il/api/biostar/health"

# 2. בדיקת WhatsApp Webhook
$url = "https://crm.tanandco.co.il/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=tanandco_2025_webhook&hub.challenge=test"
Invoke-WebRequest -Uri $url
```

---

## 📁 קבצים חשובים שנוצרו/עודכנו

1. **`fix-database-connection.ps1`** - סקריפט לתיקון חיבור DB
2. **`DEPLOYMENT_GUIDE.md`** - מדריך פריסה מלא
3. **`QUICK_CHECKLIST.md`** - checklist מהיר
4. **`DEPLOYMENT_SUMMARY.md`** - מסמך זה

---

## ⚠️ נקודות חשובות

### פורטים
- **BioStar:** פורט 5000 (אל תגע!)
- **CRM בפיתוח:** פורט 5080
- **CRM ב-Cloud Run:** נקבע אוטומטית (PORT env var)

### קבצים רגישים
- **`.env`** - לא לדחוף ל-GitHub
- השתמש ב-Cloud Run Environment Variables

### מסד נתונים
- **Neon Console:** https://console.neon.tech
- **משתמש:** `neondb_owner`
- **Host:** `ep-super-pond-afcnloji.c-2.us-west-2.aws.neon.tech`

---

## 🎯 הצעדים הבאים

1. ✅ תיקון חיבור DB (הרץ `fix-database-connection.ps1`)
2. ✅ סינכרון עם GitHub
3. ✅ עדכון Cloud Run Environment Variables
4. ✅ עדכון WhatsApp Webhook ב-Meta Console
5. ✅ בדיקות לאחר פריסה

**הכל מוכן לפריסה! 🚀**

