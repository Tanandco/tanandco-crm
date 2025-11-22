# 🚀 התחלה מהירה - Cloudflare Deployment

## ⚡ שלבים מהירים:

### 1. הרץ את השרת

פתח PowerShell והרץ:
```powershell
npm run server
```

**השרת יעלה על:** `http://localhost:3001`

**⚠️ השאר את החלון הזה פתוח!**

---

### 2. הרץ את סקריפט הפריסה

פתח PowerShell **חדש** (השאר את השרת רץ בחלון הראשון) והרץ:
```powershell
.\deploy-cloudflare-only.ps1
```

---

### 3. הגדר ב-Cloudflare Dashboard

הסקריפט ינחה אותך, אבל בקיצור:

1. **פתח:** https://one.dash.cloudflare.com
2. **נווט ל:** Zero Trust → Networks → Tunnels
3. **בחר:** `tanandco-crm`
4. **הוסף Public Hostname:**
   - Subdomain: `crm`
   - Domain: `tanandco.co.il`
   - Service Type: `HTTP`
   - URL: `http://localhost:3001`
5. **שמור**

---

### 4. בדוק

🌐 **https://crm.tanandco.co.il**

---

## 🐛 פתרון בעיות:

### השרת לא עולה:
```powershell
# בדוק אם יש תהליך על פורט 3001
Get-NetTCPConnection -LocalPort 3001

# עצור תהליכים קיימים
Stop-Process -Name node -Force

# הרץ מחדש
npm run server
```

### Tunnel לא רץ:
```powershell
# בדוק tunnels קיימים
cloudflared tunnel list

# הרץ tunnel ידנית
cloudflared tunnel run tanandco-crm
```

---

**זה הכל! 🎉**

