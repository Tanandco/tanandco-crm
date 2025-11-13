# 🔗 הגדרת Cloudflare Tunnel עם Domain משלך

מדריך מפורט לחיבור ה-domain וה-Tunnel שלך לשירות ענן.

---

## ✅ מה יש לך כבר:
- ✅ Cloudflare Tunnel מותקן ופועל
- ✅ Domain משלך ב-Cloudflare
- ✅ DNS מנוהל ב-Cloudflare

---

## 🎯 מה צריך לעשות:

### שלב 1: פרוס את האפליקציה על שירות ענן

**אפשרויות:**
- Google Cloud Run (מומלץ)
- Railway
- Render
- Fly.io

**תקבל URL כמו:**
```
https://tanandco-crm-XXXXX-uc.a.run.app
```

---

## 🔧 שלב 2: הגדרת Cloudflare Tunnel

### דרך א: דרך Cloudflare Dashboard (הכי קל)

1. **היכנס ל-Cloudflare Dashboard:**
   - https://dash.cloudflare.com
   - בחר את ה-domain שלך

2. **נווט ל-Zero Trust:**
   - Zero Trust → Networks → Tunnels
   - או: https://one.dash.cloudflare.com

3. **בחר את ה-Tunnel הקיים שלך** (או צור חדש)

4. **הוסף Public Hostname:**
   - לחץ "Configure" על ה-Tunnel
   - Public Hostname → Add a public hostname
   - הגדר:
     - **Subdomain:** `tanandco-crm` (או מה שתרצה)
     - **Domain:** ה-domain שלך (לדוגמה: `yourdomain.com`)
     - **Service:** `https://tanandco-crm-XXXXX-uc.a.run.app:443`
     - **Path:** (השאר ריק)
   - לחץ "Save hostname"

5. **הגדר DNS (אוטומטי):**
   - Cloudflare יוסיף אוטומטית CNAME record
   - או הוסף ידנית:
     - Type: `CNAME`
     - Name: `tanandco-crm` (או מה שבחרת)
     - Target: `<tunnel-id>.cfargotunnel.com`
     - Proxy: ✅ (מופעל)

### דרך ב: דרך קובץ Config (אם אתה משתמש ב-cloudflared מקומי)

ערוך את קובץ ה-config של ה-Tunnel (בדרך כלל ב-`~/.cloudflared/config.yml`):

```yaml
tunnel: <YOUR_TUNNEL_ID>
credentials-file: /path/to/credentials.json

ingress:
  # האפליקציה שלך
  - hostname: tanandco-crm.yourdomain.com
    service: https://tanandco-crm-XXXXX-uc.a.run.app:443
  
  # Fallback
  - service: http_status:404
```

**הפעל מחדש את ה-Tunnel:**
```bash
cloudflared tunnel run <TUNNEL_NAME>
```

---

## 🌐 שלב 3: הגדרת DNS (אם לא אוטומטי)

אם Cloudflare לא הוסיף אוטומטית:

1. **Cloudflare Dashboard → DNS → Records**
2. **הוסף Record:**
   - Type: `CNAME`
   - Name: `tanandco-crm` (או subdomain אחר)
   - Target: `<TUNNEL_ID>.cfargotunnel.com`
   - Proxy status: ✅ Proxied (חשוב!)
   - TTL: Auto
3. **Save**

---

## 🔐 שלב 4: הגדרת SSL

Cloudflare יגדיר SSL אוטומטית! רק ודא ש:
- ✅ Proxy מופעל (הענן כתום)
- ✅ SSL/TLS → Overview → Full (strict) או Full

---

## ⚙️ שלב 5: עדכון APP_BASE_URL

לאחר שהכל עובד, עדכן את `APP_BASE_URL`:

1. **בשירות הענן** (Google Cloud Run / Railway / וכו'):
   - הוסף משתנה סביבה:
     ```
     APP_BASE_URL=https://tanandco-crm.yourdomain.com
     ```

2. **או דרך CLI:**
   ```bash
   # Google Cloud Run
   gcloud run services update tanandco-crm \
     --update-env-vars APP_BASE_URL=https://tanandco-crm.yourdomain.com
   ```

---

## 🔗 שלב 6: עדכון Webhooks

עדכן את ה-webhooks עם ה-URL החדש:

### WhatsApp:
```
https://tanandco-crm.yourdomain.com/api/webhooks/whatsapp
```

### Cardcom:
```
https://tanandco-crm.yourdomain.com/api/webhooks/cardcom/payment
```

---

## ✅ בדיקות

### 1. בדיקת DNS:
```bash
nslookup tanandco-crm.yourdomain.com
```
צריך להחזיר IP של Cloudflare.

### 2. בדיקת Health:
```bash
curl https://tanandco-crm.yourdomain.com/api/health
```
צריך לקבל: `{"status":"ok"}`

### 3. בדיקת עמוד ראשי:
פתח בדפדפן:
```
https://tanandco-crm.yourdomain.com
```

---

## 🐛 פתרון בעיות

### ה-Tunnel לא מתחבר:
```bash
# בדוק שה-Tunnel רץ
cloudflared tunnel list

# בדוק logs
cloudflared tunnel info <TUNNEL_NAME>
```

### DNS לא עובד:
- ודא שה-Proxy מופעל (ענן כתום)
- בדוק שה-CNAME נכון
- המתן כמה דקות ל-propagation

### SSL לא עובד:
- ודא ש-SSL/TLS מוגדר ל-Full או Full (strict)
- בדוק שה-service בשירות הענן תומך ב-HTTPS

### 502 Bad Gateway:
- בדוק שה-URL של השירות הענן נכון
- ודא שהשירות רץ וזמין
- בדוק שה-Port נכון (443 ל-HTTPS)

---

## 💡 טיפים

1. **Cloudflare Zero Trust (Tunnel מנוהל):**
   - אם אתה משתמש ב-Zero Trust, ה-Tunnel רץ בענן
   - לא צריך להריץ מקומית
   - מומלץ!

2. **Cache Rules:**
   - Cloudflare → Rules → Cache Rules
   - הוסף rules לקבצים סטטיים (CSS, JS, images)

3. **Page Rules:**
   - Cloudflare → Rules → Page Rules
   - הוסף rules לניהול cache

4. **Analytics:**
   - Cloudflare → Analytics → Web Analytics
   - ראה סטטיסטיקות על התנועה

---

## 📝 רשימת בדיקה

- [ ] שירות ענן פרוס ופועל
- [ ] קיבלת URL מהשירות (לדוגמה: `*.run.app`)
- [ ] Tunnel מוגדר ב-Cloudflare
- [ ] Public Hostname נוסף ב-Tunnel
- [ ] DNS record נוסף (או אוטומטי)
- [ ] SSL פעיל
- [ ] האפליקציה נגישה דרך ה-domain
- [ ] `APP_BASE_URL` מעודכן
- [ ] Webhooks מעודכנים

---

## 🎉 סיום

לאחר שכל הבדיקות עברו:
- ✅ האפליקציה נגישה דרך ה-domain שלך
- ✅ SSL פעיל אוטומטית
- ✅ CDN ו-DDoS protection פעילים
- ✅ הכל עובד!

---

**עודכן:** דצמבר 2025

**עזרה נוספת:**
- [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Cloudflare Zero Trust](https://one.dash.cloudflare.com)

