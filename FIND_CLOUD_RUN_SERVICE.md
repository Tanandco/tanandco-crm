# 🔍 איך למצוא את ה-Cloud Run Service הנכון

## ⚠️ בעיה: Permission Denied

אם אתה מקבל שגיאת "permission denied", זה אומר שהקישור לא נכון או שאין לך גישה.

---

## 🔍 שלב 1: מצא את הפרויקט הנכון

### פתח את רשימת כל הפרויקטים:
https://console.cloud.google.com/home

### חפש פרויקט בשם:
- `tan-and-co-crm` (עם מקפים)
- `tanandco-crm` (בלי מקפים)
- או כל שם אחר שקשור לפרויקט

---

## 🔍 שלב 2: מצא את ה-Cloud Run Service

### אחרי שבחרת פרויקט:

1. **עבור ל-Cloud Run:**
   - בתפריט השמאלי, חפש "Cloud Run"
   - או: https://console.cloud.google.com/run

2. **בחר את ה-Service:**
   - חפש service בשם: `tanandco` או `tanandco-crm`
   - לחץ עליו

---

## 🔍 שלב 3: בדוק את הפרטים

### בדוק:
- **Project ID:** מה שם הפרויקט?
- **Service Name:** מה שם ה-service?
- **Region:** מה ה-region? (`me-west1`, `europe-west1`, וכו')

---

## 🚀 שלב 4: פרוס

### אחרי שמצאת את ה-service:

1. **לחץ:** "Edit & Deploy New Revision"
2. **ודא שהכל מוגדר:**
   - Repository: `Tanandco/tanandco-crm`
   - Branch: `main`
   - Port: `5000`
   - Authentication: Allow public access
3. **לחץ:** "Deploy"

---

## 💡 טיפים:

- אם אתה לא רואה את הפרויקט, ודא שאתה מחובר לחשבון הנכון
- אם אתה לא רואה את ה-service, ייתכן שהוא לא קיים עדיין - צריך ליצור אותו
- אם אתה לא רואה את הכפתור "Edit & Deploy", ייתכן שאין לך הרשאות - בקש מהמנהל

---

**עודכן:** ינואר 2025

