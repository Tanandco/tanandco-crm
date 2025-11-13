# 📝 מדריך מילוי טופס Google Cloud Run

מדריך שלב-אחר-שלב למלא את הטופס נכון.

---

## ⚠️ תיקון חשוב - Authentication

**בתמונה שלך יש בעיה!**

אתה בחרת **"Require authentication"** - זה לא נכון!

**צריך לבחור:**
- ✅ **"Allow public access"** 
- ❌ לא "Require authentication"

**למה?** כי Cloudflare Tunnel צריך גישה ציבורית לשירות.

---

## 📋 מילוי הטופס - שלב אחר שלב

### 1. **Container** (למעלה)

#### Container image:
- אם אתה משתמש ב-**source repository** (GitHub):
  - לחץ על **"Select"** ליד "Container image"
  - בחר **"Continuously deploy new revisions from a source repository"**
  - בחר את ה-GitHub repository שלך
  - Branch: `main`
  - Build type: **Dockerfile**

#### Container port:
- **Port:** `5000`
- זה הפורט שהאפליקציה מאזינה עליו

---

### 2. **Region** ✅

- **Region:** `europe-west1 (Belgium)` - זה בסדר!
- או `us-central1` אם תרצה

---

### 3. **Authentication** ⚠️ חשוב!

**בחר:**
- ✅ **"Allow public access"**
  - תיאור: "No authentication checks will be performed."

**אל תבחר:**
- ❌ "Require authentication"

**למה?** כי Cloudflare Tunnel צריך גישה ציבורית.

---

### 4. **Billing** ✅

- ✅ **"Request-based"** - זה נכון!
  - משלם רק לפי שימוש

---

### 5. **Service scaling** ✅

- ✅ **"Auto scaling"** - זה נכון!

#### Minimum number of instances:
- **השאר:** `0` (ברירת מחדל)
- זה אומר שהשירות יכול להירדם כשאין תנועה (חוסך כסף)

#### Maximum number of instances:
- **הגדר:** `10` (או יותר אם צריך)

---

### 6. **Container, Networking, Security** (לחץ על זה)

#### Container:
- **CPU:** `1` (או יותר אם צריך)
- **Memory:** `512 MiB` (או `1 GiB` אם צריך יותר)
- **Request timeout:** `300` שניות
- **Concurrency:** `80` (כמה requests בו-זמנית)

#### Networking:
- **Port:** `5000` (חשוב!)
- **CPU allocation:** "CPU is only allocated during request processing" (ברירת מחדל)

---

### 7. **Variables & Secrets** (חשוב מאוד!)

לחץ על **"Variables & Secrets"** והוסף את כל המשתנים:

#### משתני סביבה בסיסיים:
```
NODE_ENV=production
PORT=5000
```

#### מסד נתונים:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

#### WhatsApp:
```
WA_PHONE_NUMBER_ID=699582612923896
WA_BUSINESS_ACCOUNT_ID=699582612923896
CLOUD_API_ACCESS_TOKEN=your_token_here
CLOUD_API_VERSION=v18.0
WA_APP_SECRET=your_app_secret
WHATSAPP_APP_SECRET=your_app_secret
WA_VERIFY_TOKEN=tan_and_co_verify_token
WEBHOOK_VERIFICATION_TOKEN=tanandco_2025_webhook
```

#### Cardcom:
```
CARDCOM_TERMINAL_NUMBER=1578525
CARDCOM_TERMINAL=1578525
CARDCOM_USERNAME=your_username
CARDCOM_API_USERNAME=your_api_username
CARDCOM_API_KEY=your_api_key
CARDCOM_API_PASSWORD=your_api_password
```

#### BioStar:
```
BIOSTAR_SERVER_URL=https://biostar.tanandco.co.il
BIOSTAR_USERNAME=admin
BIOSTAR_PASSWORD=your_password
BIOSTAR_DOOR_ID=2
BIOSTAR_ALLOW_SELF_SIGNED=false
```

#### Meta/Facebook:
```
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
```

#### TikTok:
```
TIKTOK_CLIENT_KEY=your_key
TIKTOK_CLIENT_SECRET=your_secret
```

#### אחר:
```
FREEPIK_API_KEY=your_key
OPENAI_API_KEY=your_key
SESSION_SECRET=your_random_secret
PRINTER_INTERFACE=POS-80
DOOR_ACCESS_KEY=your_key
ADMIN_PHONE=972501234567
```

**⚠️ חשוב:** אל תוסיף `APP_BASE_URL` עדיין - תקבל אותו אחרי הפריסה.

---

### 8. **לחץ "Create"**

לאחר שמילאת הכל, לחץ על הכפתור הכחול **"Create"** בתחתית.

---

## ✅ מה צריך להיות בסוף:

- ✅ Region: `europe-west1` (או אחר)
- ✅ Authentication: **"Allow public access"** (חשוב!)
- ✅ Billing: "Request-based"
- ✅ Scaling: Auto scaling, Min: 0, Max: 10
- ✅ Port: `5000`
- ✅ Memory: `512 MiB` או יותר
- ✅ כל משתני הסביבה מוגדרים
- ✅ לחץ "Create"

---

## 🎯 אחרי הפריסה:

1. **תקבל URL** כמו: `https://tanandco-crm-XXXXX.europe-west1.run.app`
2. **שמור את ה-URL הזה!**
3. **עדכן את Cloudflare Tunnel** עם ה-URL הזה
4. **הוסף `APP_BASE_URL`** אחר כך

---

## 🐛 אם יש שגיאה:

### שגיאת Authentication:
- ודא שבחרת **"Allow public access"**

### שגיאת Build:
- בדוק שה-Dockerfile נכון
- בדוק שה-GitHub repository נכון

### שגיאת Port:
- ודא שה-Port הוא `5000`

---

**עודכן:** דצמבר 2025

