# 📋 העתקה מהירה - משתני סביבה ל-Cloud Run

## הוראות:

1. **פתח את הקובץ:** `CLOUD_RUN_ENV_VARIABLES.txt`
2. **העתק כל שורה** (Key=Value)
3. **ב-Google Cloud Run:**
   - Cloud Run → tanandco → Edit & Deploy New Revision
   - Variables & Secrets → Add Variable
   - הדבק כל שורה בנפרד

---

## רשימה מהירה להעתקה:

### העתק את כל השורות הבאות:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://neondb_owner:npg_K9ZMtcmzx8Bo@ep-super-pond-afcnloji.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require
PGDATABASE=neondb
PGHOST=ep-super-pond-afcnloji.c-2.us-west-2.aws.neon.tech
PGPORT=5432
PGUSER=neondb_owner
PGPASSWORD=npg_K9ZMtcmzx8Bo
SESSION_SECRET=uPnQEsvyy3t+6f+rIAeJz9+1MYKW3/ElBzi5KYE4kNq6uRuhr9nw896zlkExdWuXbdVFcanb3ObEQIQjUtWY2A==
PRINTER_INTERFACE=POS-80
OPENAI_API_KEY=your_openai_api_key_here
WA_PHONE_NUMBER_ID=699582612923896
WA_BUSINESS_ACCOUNT_ID=699582612923896
CLOUD_API_ACCESS_TOKEN=EAAJFC8nImm8BP3dOdMZCbpjPOZCJlEtjeyiD7hS1d8KRs8XalyZBoV5fn5fMeZCoqBZBmBtfdXGYEkBBguc492TYnusMo4zC5FiEDdBDzP9HoWRs9FZCDgJhu2knZC6WT7Mizs36crouWrrE1TARBQhnnO37ZCKxH2T8l5FdSRHkPo5v2cfOAyV166B1S2gwLwZDZD
CLOUD_API_VERSION=v18.0
WA_APP_SECRET=00de9b50551ca788d687dd0b839b143b
WHATSAPP_APP_SECRET=00de9b50551ca788d687dd0b839b143b
WA_VERIFY_TOKEN=tan_and_co_verify_token
WEBHOOK_VERIFICATION_TOKEN=tanandco_2025_webhook
CARDCOM_TERMINAL_NUMBER=1578525
CARDCOM_TERMINAL=1578525
CARDCOM_USERNAME=vQsrkpKRbplPFEAwkSyS
CARDCOM_API_USERNAME=vQsrkpKRbplPFEAwkSyS
CARDCOM_API_KEY=gJRxuVM94czowcTVzLX
BIOSTAR_SERVER_URL=https://biostar.tanandco.co.il
BIOSTAR_USERNAME=admin
BIOSTAR_PASSWORD=Makor2024
BIOSTAR_DOOR_ID=2
BIOSTAR_ALLOW_SELF_SIGNED=false
FACEBOOK_APP_ID=823361520180641
FACEBOOK_APP_SECRET=4c33674c9130dc39a7c654453eef2c30
TIKTOK_CLIENT_KEY=aw0e18xw6bwegz66
TIKTOK_CLIENT_SECRET=TnPGJfg0TQAhDW5f2MFusGHDkU7tJTYI
FREEPIK_API_KEY=FPSX133bc1feeb7b6b1e8b40f7e2bba84e49
```

---

## ⚠️ משתנים שצריך להוסיף ידנית:

אם יש לך את הערכים הבאים, הוסף אותם:

```
CARDCOM_API_PASSWORD=הערך_שלך
DOOR_ACCESS_KEY=הערך_שלך
ADMIN_PHONE=972501234567
```

---

## 📝 הערה חשובה:

**אל תוסיף `APP_BASE_URL` עדיין!**
- תקבל אותו אחרי הפריסה
- תעדכן אותו אז

---

**קובץ מלא:** `CLOUD_RUN_ENV_VARIABLES.txt`

