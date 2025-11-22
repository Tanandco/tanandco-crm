# 🔄 עדכון ערכי Environment Variables

## ✅ ערכים שעודכנו מהתמונה

### WhatsApp Business API
- ✅ `WA_PHONE_NUMBER_ID`: `726314123894387` (היה: `699582612923896`)
- ✅ `CLOUD_API_VERSION`: `v23.0` (היה: `v18.0`)
- ⚠️ `CLOUD_API_ACCESS_TOKEN`: הערך בתמונה חתוך - **נדרש העתקה מלאה**

### Cardcom Payment Gateway
- ✅ `CARDCOM_TERMINAL_NUMBER`: `157825` (היה: `1578525`)
- ✅ `CARDCOM_API_USERNAME`: `vDbtKqKRbelPCEAw45yS` (היה: `vQsrkpKRbplPFEAwkSyS`)
- ✅ `CARDCOM_API_PASSWORD`: `gfRAuVf94kdewrcTVzLX` (היה: `your_cardcom_api_password`)

---

## ⚠️ פעולות נדרשות

### 1. עדכן CLOUD_API_ACCESS_TOKEN המלא
הערך בתמונה חתוך. נדרש:
1. העתק את כל ה-`CLOUD_API_ACCESS_TOKEN` מ-Account Secrets
2. עדכן ב-`CLOUD_RUN_ENV_VARIABLES_REAL.txt`
3. עדכן ב-Cloud Run Environment Variables

### 2. עדכן ב-Cloud Run
לאחר עדכון הקובץ המקומי:
1. התחבר ל-Google Cloud Console
2. Cloud Run → בחר את השירות
3. Edit & Deploy New Revision
4. Variables & Secrets → עדכן את הערכים:
   - `WA_PHONE_NUMBER_ID`
   - `CLOUD_API_VERSION`
   - `CARDCOM_TERMINAL_NUMBER`
   - `CARDCOM_API_USERNAME`
   - `CARDCOM_API_PASSWORD`
   - `CLOUD_API_ACCESS_TOKEN` (המלא)

### 3. עדכן ב-.env המקומי (אם קיים)
אם יש קובץ `.env` בתיקיית הפרויקט, עדכן גם שם:
```powershell
cd "C:\Users\tanan\OneDrive\שולחן העבודה\tanandco-crm"
# ערוך את .env עם הערכים החדשים
```

---

## 📋 Checklist

- [ ] העתק את `CLOUD_API_ACCESS_TOKEN` המלא מ-Account Secrets
- [ ] עדכן את `CLOUD_RUN_ENV_VARIABLES_REAL.txt` עם הערך המלא
- [ ] עדכן את כל הערכים ב-Cloud Run Environment Variables
- [ ] עדכן את `.env` המקומי (אם קיים)
- [ ] בדוק שהשרת עובד עם הערכים החדשים

---

## 🔍 הערות

1. **WA_PHONE_NUMBER_ID שונה** - ודא שזה לא ישפיע על הודעות קיימות
2. **CLOUD_API_VERSION עודכן ל-v23.0** - ודא שהקוד תומך בגרסה זו
3. **Cardcom credentials עודכנו** - זה אמור לפתור את בעיית התשלומים

---

**עודכן:** $(Get-Date -Format "yyyy-MM-dd HH:mm")

