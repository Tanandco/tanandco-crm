# 🚀 איך להעלות את הפרויקט לאוויר

## מצב נוכחי:
- ✅ השרת רץ על `localhost:3001` ומגיב
- ✅ Tunnel מוגדר ל: `crm.tanandco.co.il` → `localhost:3001`
- ⏳ צריך להפעיל את ה-Tunnel

---

## אופציה 1: הרצה ידנית (מומלץ להתחלה)

### שלב 1: הפעל את השרת
```powershell
npm run server
```

### שלב 2: הפעל את ה-Tunnel
```powershell
cloudflared tunnel run tanandco-tunnel
```

**הערה:** זה יחזיק את הטרמינל פתוח. כדי לסגור, לחץ `Ctrl+C`.

---

## אופציה 2: התקנה כ-Service (לריצה אוטומטית)

### שלב 1: קבל את ה-Token מ-Cloudflare
1. היכנס ל-[Cloudflare Dashboard](https://dash.cloudflare.com/)
2. עבור ל-Zero Trust → Access → Tunnels
3. בחר את ה-Tunnel שלך
4. העתק את ה-Token

### שלב 2: התקן כ-Service (דורש Admin)
```powershell
# פתח PowerShell כ-Administrator
cloudflared.exe service install [TOKEN]
```

### שלב 3: הפעל את ה-Service
```powershell
Start-Service cloudflared
```

### שלב 4: בדוק סטטוס
```powershell
Get-Service cloudflared
```

---

## בדיקה שהכל עובד:

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

---

## פתרון בעיות:

### השרת לא רץ:
```powershell
npm run server
```

### Tunnel לא רץ:
```powershell
# בדוק את ה-config
cat C:\Users\tanan\.cloudflared\config.yml

# הרץ ידנית
cloudflared tunnel run tanandco-tunnel
```

### DNS לא עובד:
1. היכנס ל-Cloudflare Dashboard
2. בדוק שה-DNS record מוגדר:
   - Type: `CNAME`
   - Name: `crm`
   - Target: `[TUNNEL_ID].cfargotunnel.com`

---

## סקריפטים מוכנים:

- `deploy-to-air.ps1` - מפעיל את השרת ובודק את ה-Tunnel

---

## סיכום:

✅ השרת רץ על `localhost:3001`  
✅ Tunnel מוגדר נכון  
⏳ צריך להפעיל את ה-Tunnel (אופציה 1 או 2 למעלה)

**אחרי שהכל רץ, הפרויקט יהיה זמין על: https://crm.tanandco.co.il**

