# ✅ Checklist מהיר - Tan & Co CRM

## לפני פריסה

### 1. מסד נתונים
- [ ] הרצת `.\fix-database-connection.ps1` ועדכון הסיסמה
- [ ] בדיקת `npm run db:push` - מצליח ללא שגיאות

### 2. בנייה
- [ ] `npm install` - כל התלויות מותקנות
- [ ] `npm run build` - הבנייה מצליחה
- [ ] תיקייה `dist/` קיימת עם קבצים

### 3. Git
- [ ] `git status` - כל השינויים committed
- [ ] `git remote -v` - מצביע ל-GitHub הנכון
- [ ] `git push origin main` - הקוד נדחף

### 4. Cloud Run
- [ ] Environment Variables מעודכנים לפי `CLOUD_RUN_ENV_VARIABLES_REAL.txt`
- [ ] `DATABASE_URL` מכיל סיסמה נכונה
- [ ] `APP_BASE_URL` מוגדר ל-URL הציבורי
- [ ] `WEBHOOK_VERIFICATION_TOKEN` מוגדר

### 5. WhatsApp
- [ ] Meta Console → Callback URL מעודכן
- [ ] Verify Token תואם ל-`WEBHOOK_VERIFICATION_TOKEN`
- [ ] בדיקת GET request ל-webhook מצליחה

### 6. דומיין (אם רלוונטי)
- [ ] Cloudflare → DNS → CNAME מוגדר
- [ ] SSL/TLS מוגדר ל-Full (strict)

---

## לאחר פריסה

- [ ] בדיקת Health: `GET https://crm.tanandco.co.il/api/biostar/health`
- [ ] בדיקת WhatsApp Webhook: `GET https://crm.tanandco.co.il/api/webhooks/whatsapp?...`
- [ ] בדיקת לוגים ב-Cloud Run - אין שגיאות authentication
- [ ] בדיקת חיבור למסד נתונים - אין שגיאות

---

## ⚠️ זכור

- **BioStar רץ על פורט 5000** - אל תגע!
- **CRM רץ על פורט 5080** בפיתוח
- **אל תדחוף .env ל-GitHub**

