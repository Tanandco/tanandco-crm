# 🔧 תיקון Cloud Build Trigger

## הבעיה:
ה-Configuration Type מוגדר ל-"Cloud Build configuration file" במקום "Dockerfile".

---

## ✅ מה צריך לעשות:

### שלב 1: שנה את ה-Configuration Type

במסך "Edit trigger" שאתה רואה:

1. **Configuration → Type:**
   - ❌ אל תבחר: "Cloud Build configuration file (yaml or json)"
   - ✅ **בחר: "Dockerfile"**
     - תיאור: "Build using a Dockerfile in the repository"

2. **Configuration → Location:**
   - ✅ **בחר: "Repository"**
   - **Dockerfile:** `/Dockerfile` (או השאר ריק - ימצא אוטומטית)
   - **Docker context:** `/` (או השאר ריק)

3. **לחץ "Save"** בתחתית

---

## 📋 סיכום ההגדרות הנכונות:

- **Branch Matching:** `^local$` ✅ (נכון)
- **Type:** `Dockerfile` ✅ (צריך לשנות)
- **Location:** `Repository` ✅ (צריך לשנות)
- **Dockerfile:** `/Dockerfile` ✅ (או ריק)

---

## 🎯 אחרי התיקון:

1. **לחץ "Save"**
2. **Cloud Build יפרס מחדש** אוטומטית
3. **המתן 2-3 דקות** לבנייה
4. **בדוק את ה-Build Status**

---

## 🔍 אם עדיין נכשל:

בדוק את ה-Build Logs:
- Cloud Build → History → לחץ על ה-build הכושל
- ראה את ה-Logs וחפש שגיאות

---

**עודכן:** דצמבר 2025

