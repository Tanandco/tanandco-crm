# 🚀 פריסה דרך Cloudflare Tunnel

## 🎯 מה זה Cloudflare Tunnel?

Cloudflare Tunnel מאפשר לך לחבר את השרת שלך (מקומי או Cloud Run) ל-Cloudflare **בלי** לחשוף את ה-IP שלך!

**יתרונות:**
- ✅ לא צריך לפתוח פורטים
- ✅ אבטחה טובה יותר
- ✅ SSL אוטומטי
- ✅ CDN מובנה

---

## 📋 שלב 1: הכן את השרת

### אופציה A: השרת רץ מקומית

```powershell
# הרץ את השרת
npm run server
```

**השרת יעלה על:** `http://localhost:5000`

### אופציה B: השרת רץ ב-Cloud Run

**קבל את ה-URL:**
1. פתח: https://console.cloud.google.com/run
2. בחר את ה-service
3. העתק את ה-URL (דומה ל: `https://tanandco-crm-xxxxx-xx.a.run.app`)

---

## 📋 שלב 2: התקן Cloudflare Tunnel

### Windows (PowerShell):

```powershell
# הורד את cloudflared
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"

# או דרך Chocolatey (אם מותקן):
choco install cloudflared

# או דרך winget:
winget install --id Cloudflare.cloudflared
```

### בדוק שההתקנה הצליחה:

```powershell
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

## 📋 שלב 5: הגדר את ה-Tunnel

### דרך Cloudflare Dashboard (מומלץ):

1. **פתח:**
   https://one.dash.cloudflare.com

2. **נווט ל:**
   - Zero Trust → Networks → Tunnels

3. **בחר את ה-Tunnel:** `tanandco-crm`

4. **לחץ:** "Configure" או "Edit"

5. **הוסף Public Hostname:**
   - **Subdomain:** `crm` (או השאר ריק לדומיין הראשי)
   - **Domain:** `tanandco.co.il`
   - **Service Type:** `HTTP`
   - **URL:** 
     - אם מקומי: `http://localhost:5000`
     - אם Cloud Run: `https://YOUR-CLOUD-RUN-URL` (מה-URL שהעתקת)

6. **שמור**

---

## 📋 שלב 6: הרץ את ה-Tunnel

### אם השרת מקומי:

```powershell
# הרץ את ה-tunnel
cloudflared tunnel run tanandco-crm
```

**זה ישמור את ה-tunnel רץ** - תן לו לרוץ ברקע.

### אם השרת ב-Cloud Run:

**לא צריך להריץ tunnel מקומי!** Cloudflare Tunnel יעבוד אוטומטית דרך ה-Dashboard.

---

## 📋 שלב 7: בדוק

### בדוק את הדומיין:

```powershell
# בדוק את הדומיין
curl https://crm.tanandco.co.il/api/health
```

**אם הכל עובד:**
- ✅ תראה תשובה מה-API
- ✅ האתר יעבוד ב-`https://crm.tanandco.co.il`

---

## 🔧 הגדרת Tunnel דרך שורת פקודה (אלטרנטיבה)

אם אתה מעדיף דרך שורת פקודה:

```powershell
# צור קובץ config
New-Item -Path "$env:USERPROFILE\.cloudflared\config.yml" -ItemType File -Force

# ערוך את הקובץ והוסף:
```

```yaml
tunnel: tanandco-crm
credentials-file: C:\Users\YOUR_USERNAME\.cloudflared\YOUR_TUNNEL_ID.json

ingress:
  - hostname: crm.tanandco.co.il
    service: http://localhost:5000
  - service: http_status:404
```

**החלף:**
- `YOUR_USERNAME` - שם המשתמש שלך
- `YOUR_TUNNEL_ID` - ה-ID של ה-tunnel (מתקבל אחרי `cloudflared tunnel create`)

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

### בעיה: "permission denied"

**פתרון:**
- ודא שהתחברת: `cloudflared tunnel login`
- ודא שיש לך הרשאות ב-Cloudflare Dashboard

### בעיה: "connection refused"

**פתרון:**
- ודא שהשרת רץ (`npm run server`)
- בדוק שה-URL נכון (localhost:5000 או Cloud Run URL)

### בעיה: "DNS not resolving"

**פתרון:**
- המתן 5-10 דקות להפצת DNS
- בדוק ב-Cloudflare Dashboard שה-Public Hostname מוגדר נכון

---

## 📝 סיכום:

1. ✅ התקן `cloudflared`
2. ✅ התחבר: `cloudflared tunnel login`
3. ✅ צור tunnel: `cloudflared tunnel create tanandco-crm`
4. ✅ הגדר ב-Cloudflare Dashboard (Public Hostname)
5. ✅ הרץ: `cloudflared tunnel run tanandco-crm` (אם מקומי)
6. ✅ בדוק: `https://crm.tanandco.co.il`

---

## 🎯 אופציה מהירה: דרך Dashboard בלבד

**אם אתה רוצה דרך Dashboard בלבד (ללא CLI):**

1. **פתח:**
   https://one.dash.cloudflare.com

2. **Zero Trust → Networks → Tunnels**

3. **לחץ:** "Create a tunnel"

4. **בחר:** "Cloudflare Tunnel"

5. **הגדר:**
   - Name: `tanandco-crm`
   - Public Hostname: `crm.tanandco.co.il` → `http://localhost:5000` (או Cloud Run URL)

6. **שמור**

**זה הכל!** 🎉

---

**עודכן:** ינואר 2025

