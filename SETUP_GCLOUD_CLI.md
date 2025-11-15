# 🔧 הגדרת Google Cloud CLI

## 📋 שלב 1: התקנת gcloud CLI

### Windows:

1. **הורד את ה-Installer:**
   - https://cloud.google.com/sdk/docs/install-sdk#windows
   - או: https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe

2. **הרץ את ה-Installer:**
   - התקן את כל הרכיבים
   - ודא ש-"Add to PATH" מסומן ✅

3. **פתח PowerShell חדש** (חשוב!)

4. **בדוק שההתקנה הצליחה:**
   ```powershell
   gcloud --version
   ```

---

## 📋 שלב 2: התחברות

```powershell
# התחבר ל-Google Cloud
gcloud auth login

# בחר את החשבון שלך בדפדפן
```

---

## 📋 שלב 3: הגדרת Project

```powershell
# הגדר את ה-project
gcloud config set project tan-and-co-crm

# בדוק
gcloud config get-value project
```

---

## 📋 שלב 4: הגדרת Docker (לאחר התקנת gcloud)

```powershell
# הגדר Docker עבור Artifact Registry
gcloud auth configure-docker me-west1-docker.pkg.dev

# או עבור כל ה-regions:
gcloud auth configure-docker
```

---

## 📋 שלב 5: בדיקה

```powershell
# בדוק שהכל עובד
gcloud auth list
gcloud config list
```

---

## 🚀 אחרי ההתקנה - Deploy

לאחר ש-gcloud מותקן, תוכל לפרוס:

```powershell
# Deploy ל-Cloud Run
gcloud run deploy tanandco \
  --source . \
  --platform managed \
  --region me-west1 \
  --allow-unauthenticated \
  --port 5000
```

---

## 🐛 פתרון בעיות:

### "gcloud not found":
- ודא שהתקנת את gcloud CLI
- פתח PowerShell חדש
- בדוק ש-gcloud ב-PATH: `$env:PATH`

### "Permission denied":
- הרץ PowerShell כ-Administrator
- או: `gcloud auth login` שוב

---

## 📝 הערות:

- **gcloud CLI** נדרש רק אם תרצה לפרוס דרך שורת הפקודה
- **אלטרנטיבה:** אפשר לפרוס דרך Google Cloud Console (ללא gcloud)
- **Artifact Registry** - נדרש רק אם תרצה לבנות images מקומית

---

## ✅ אם לא רוצה להתקין gcloud:

**תוכל לפרוס דרך Google Cloud Console:**
1. https://console.cloud.google.com/run
2. "Create Service" או "Edit & Deploy New Revision"
3. בחר "Continuously deploy from source repository"
4. בחר את ה-GitHub repository שלך
5. Deploy!

**זה עובד בלי gcloud CLI! 🎉**

