# 🚀 פריסה מלאה דרך Cloudflare - ללא Google Cloud

## ✅ מה זה אומר?

**פריסה דרך Cloudflare Tunnel בלבד:**
- ✅ השרת רץ מקומית (או על שרת VPS)
- ✅ Cloudflare Tunnel מחבר את השרת ל-DNS
- ✅ לא צריך Google Cloud Run
- ✅ לא צריך Docker
- ✅ פשוט ומהיר יותר

---

## 📋 שלב 1: הכן את השרת

### הרץ את השרת מקומית:

```powershell
npm run server
```

**השרת יעלה על:** `http://localhost:3001`

**⚠️ חשוב:** השאר את השרת רץ!

---

## 📋 שלב 2: התקן Cloudflare Tunnel

### Windows (PowerShell):

```powershell
# דרך winget (מומלץ)
winget install --id Cloudflare.cloudflared

# או דרך Chocolatey
choco install cloudflared

# בדוק שההתקנה הצליחה
cloudflared --version
```

---

## 📋 שלב 3: התחבר ל-Cloudflare

```powershell
# התחבר לחשבון Cloudflare שלך
cloudflared tunnel login
```

**זה יפתח דפדפן** - התחבר עם החשבון שלך.

---

## 📋 שלב 4: צור Tunnel

```powershell
# צור tunnel חדש
cloudflared tunnel create tanandco-crm
```

**זה ייצור tunnel בשם:** `tanandco-crm`

---

## 📋 שלב 5: הגדר את ה-Tunnel ב-Dashboard

### דרך Cloudflare Dashboard:

1. **פתח:**
   https://one.dash.cloudflare.com

2. **נווט ל:**
   - Zero Trust → Networks → Tunnels

3. **בחר את ה-Tunnel:** `tanandco-crm`

4. **לחץ:** "Configure" או "Edit"

5. **הוסף Public Hostname:**
   - **Subdomain:** `crm`
   - **Domain:** `tanandco.co.il`
   - **Service Type:** `HTTP`
   - **URL:** `http://localhost:3001`

6. **שמור**

---

## 📋 שלב 6: הרץ את ה-Tunnel

### אופציה 1: הרצה ידנית (לפיתוח)

```powershell
# הרץ את ה-tunnel
cloudflared tunnel run tanandco-crm
```

**זה ישמור את ה-tunnel רץ** - תן לו לרוץ ברקע.

### אופציה 2: התקנה כ-Service (ל-production)

#### שלב 1: קבל את ה-Token מ-Cloudflare Dashboard

1. היכנס ל: https://one.dash.cloudflare.com
2. עבור ל: Zero Trust → Networks → Tunnels
3. בחר את ה-Tunnel: `tanandco-crm`
4. לחץ על "Configure"
5. העתק את ה-Token (נראה כמו: `eyJhIjoi...`)

#### שלב 2: התקן כ-Service (דורש Admin)

```powershell
# פתח PowerShell כ-Administrator
cloudflared.exe service install [TOKEN]
```

**החלף `[TOKEN]`** ב-token שהעתקת.

#### שלב 3: הפעל את ה-Service

```powershell
Start-Service cloudflared
```

#### שלב 4: בדוק סטטוס

```powershell
Get-Service cloudflared
```

**אמור להראות:** `Running`

---

## 📋 שלב 7: בדוק שהכל עובד

### 1. בדוק שהשרת רץ:

```powershell
Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing
```

### 2. בדוק שה-Tunnel רץ:

```powershell
Get-Service cloudflared
```

### 3. גש לאתר:

🌐 **https://crm.tanandco.co.il**

**אם הכל עובד:**
- ✅ תראה את האתר
- ✅ ה-API יעבוד
- ✅ הכל דרך HTTPS אוטומטי

---

## 🔧 הגדרת Tunnel דרך קובץ Config (אלטרנטיבה)

אם אתה מעדיף דרך קובץ config:

### 1. צור/ערוך את הקובץ:

```powershell
# נתיב הקובץ
$configPath = "$env:USERPROFILE\.cloudflared\config.yml"
```

### 2. הוסף את התוכן:

```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: C:\Users\YOUR_USERNAME\.cloudflared\YOUR_TUNNEL_ID.json

ingress:
  - hostname: crm.tanandco.co.il
    service: http://localhost:3001
  - service: http_status:404
```

**החלף:**
- `YOUR_TUNNEL_ID` - ה-ID של ה-tunnel (מתקבל אחרי `cloudflared tunnel create`)
- `YOUR_USERNAME` - שם המשתמש שלך

### 3. הרץ:

```powershell
cloudflared tunnel run tanandco-crm
```

---

## 🐛 פתרון בעיות:

### בעיה: "tunnel not found"

**פתרון:**
```powershell
# רשימת כל ה-tunnels
cloudflared tunnel list

# אם אין, צור חדש
cloudflared tunnel create tanandco-crm
```

### בעיה: השרת לא רץ

**פתרון:**
```powershell
npm run server
```

### בעיה: Tunnel לא רץ

**פתרון:**
```powershell
# בדוק את ה-config
cat C:\Users\tanan\.cloudflared\config.yml

# הרץ ידנית
cloudflared tunnel run tanandco-crm
```

### בעיה: DNS לא עובד

**פתרון:**
1. היכנס ל-Cloudflare Dashboard
2. בדוק שה-Public Hostname מוגדר נכון:
   - Subdomain: `crm`
   - Domain: `tanandco.co.il`
   - URL: `http://localhost:3001`

---

## 📝 סקריפטים מוכנים:

### להרצה מהירה:

```powershell
# הרץ את הסקריפט
.\start-cloudflare-tunnel.ps1
```

### להגדרה מלאה:

```powershell
# הרץ את הסקריפט
.\setup-cloudflare-tunnel.ps1
```

---

## ✅ סיכום:

**מה צריך:**
1. ✅ השרת רץ על `localhost:3001`
2. ✅ Cloudflare Tunnel מותקן
3. ✅ Tunnel מוגדר ב-Dashboard
4. ✅ Tunnel רץ (Service או ידנית)

**התוצאה:**
- 🌐 האתר זמין ב: `https://crm.tanandco.co.il`
- 🔒 HTTPS אוטומטי
- ⚡ מהיר ויציב
- 💰 ללא עלויות נוספות

---

**עודכן:** ינואר 2025

