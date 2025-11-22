# 🔄 פלואו האוטומציה - Tan & Co CRM

## 📊 סקירה כללית

המערכת כוללת **שני מנועי אוטומציה עיקריים**:

1. **WorkflowService** - אוטומציה של לקוח (Customer Journey)
2. **AutomationEngine** - אוטומציה של קמפיינים פרסומיים (Ads Optimization)

---

## 👤 1. Customer Workflow (WorkflowService)

### שלבי הלקוח (Customer Stages)

```
lead_inbound
    ↓
whatsapp_engaged
    ↓
checkout_link_sent
    ↓
payment_pending
    ↓
payment_success
    ↓
health_form_sent
    ↓
health_form_completed
    ↓
face_link_sent
    ↓
face_enrolled
    ↓
active ✅
```

### פלואו מפורט

#### 1️⃣ **lead_inbound** - לקוח חדש
**טריגר:** הודעת WhatsApp נכנסת מלקוח חדש

**פעולות:**
- יצירת לקוח חדש במערכת
- עדכון `stage = "lead_inbound"`
- שליחת הודעת ברכה + אפשרויות רכישה (קישור checkout)

**מעבר לשלב הבא:**
- `checkout_link_sent` - לאחר שליחת קישור רכישה

---

#### 2️⃣ **checkout_link_sent** - קישור רכישה נשלח
**טריגר:** שליחת קישור checkout ללקוח

**פעולות:**
- שליחת הודעת WhatsApp עם קישור רכישה
- עדכון `stage = "checkout_link_sent"`

**מעבר לשלב הבא:**
- `payment_pending` - כאשר הלקוח לוחץ על הקישור
- `payment_success` - כאשר התשלום הושלם

---

#### 3️⃣ **payment_pending** - ממתין לתשלום
**טריגר:** לקוח לוחץ על קישור checkout

**פעולות:**
- יצירת סשן תשלום ב-Cardcom
- מעבר לדף תשלום

**מעבר לשלב הבא:**
- `payment_success` - כאשר התשלום הושלם (webhook מ-Cardcom)

---

#### 4️⃣ **payment_success** - תשלום הושלם ✅
**טריגר:** Webhook מ-Cardcom (`/api/webhooks/cardcom/payment`)

**פעולות:**
1. יצירת רשומת תשלום במערכת
2. יצירת/עדכון membership:
   - אם יש membership קיים → הוספת שיעורים
   - אם אין → יצירת membership חדש (90 יום תוקף)
3. שליחת הודעת אישור תשלום ב-WhatsApp
4. עדכון `stage = "payment_success"`
5. **אוטומטית:** שליחת קישורי onboarding (health form + face registration)

**מעבר לשלב הבא:**
- `health_form_sent` - לאחר שליחת קישורי onboarding

---

#### 5️⃣ **health_form_sent** - קישור טופס בריאות נשלח
**טריגר:** שליחת קישור health form לאחר תשלום

**פעולות:**
- שליחת קישור health form ב-WhatsApp
- עדכון `stage = "health_form_sent"`

**מעבר לשלב הבא:**
- `health_form_completed` - כאשר הלקוח ממלא את הטופס (webhook)

---

#### 6️⃣ **health_form_completed** - טופס בריאות הושלם ✅
**טריגר:** Webhook מ-JotForm (`/api/webhooks/jotform/health-form`)

**פעולות:**
- עדכון `healthFormSigned = true`
- עדכון `stage = "health_form_completed"`

**מעבר לשלב הבא:**
- `face_link_sent` - כבר נשלח, ממתין לרישום פנים

---

#### 7️⃣ **face_link_sent** - קישור רישום פנים נשלח
**טריגר:** שליחת קישור face registration לאחר תשלום

**פעולות:**
- שליחת קישור רישום פנים ב-WhatsApp
- עדכון `stage = "face_link_sent"`

**מעבר לשלב הבא:**
- `face_enrolled` - כאשר הלקוח מעלה תמונה (webhook)

---

#### 8️⃣ **face_enrolled** - פנים נרשמו ✅
**טריגר:** העלאת תמונה דרך קישור (`/api/onboarding/face-register`)

**פעולות:**
1. רישום פנים ב-BioStar
2. עדכון `faceRecognitionId` בלקוח
3. עדכון `stage = "face_enrolled"`
4. **אוטומטית:** השלמת onboarding

**מעבר לשלב הבא:**
- `active` - השלמת onboarding

---

#### 9️⃣ **active** - לקוח פעיל ✅
**טריגר:** השלמת כל שלבי ה-onboarding

**פעולות:**
- עדכון `stage = "active"`
- עדכון `isNewClient = false`
- שליחת הודעת השלמה ב-WhatsApp

**סטטוס:** הלקוח פעיל במערכת, יכול להשתמש בשירותים

---

### Webhooks ו-Triggers

| Webhook/Event | Endpoint | שלב |
|---------------|----------|-----|
| WhatsApp Message | `POST /api/webhooks/whatsapp` | `lead_inbound` → `checkout_link_sent` |
| Cardcom Payment | `POST /api/webhooks/cardcom/payment` | `payment_pending` → `payment_success` |
| Health Form | `POST /api/webhooks/jotform/health-form` | `health_form_sent` → `health_form_completed` |
| Face Upload | `POST /api/onboarding/face-register` | `face_link_sent` → `face_enrolled` |

---

## 🤖 2. Automation Engine (קמפיינים פרסומיים)

### מחזור אוטומציה

**תדירות:** כל 15 דקות (`PERFORMANCE_CHECK_INTERVAL`)

**פעולות במחזור:**
1. `monitorAndOptimizeCampaigns()` - ניטור ואופטימיזציה של קמפיינים
2. `performBudgetPacing()` - בדיקת קצב הוצאה
3. `runABTests()` - הרצת A/B tests
4. `syncAudiences()` - סנכרון audiences

---

### ניטור ואופטימיזציה של קמפיינים

#### שלבים:

1. **איסוף ביצועים:**
   - Meta (Facebook/Instagram Ads)
   - Google Ads
   - TikTok Ads

2. **חישוב מדדי ביצועים:**
   - CTR (Click-Through Rate)
   - CPC (Cost Per Click)
   - Conversion Rate
   - Cost Per Conversion
   - Performance Score (0-1)

3. **החלטות אוטומטיות:**

   **א. השעיית קמפיין:**
   - אם `spend > 100` ו-`CTR < 0.6%` (30% מה-TARGET)
   - או `costPerConversion > budget * 0.5`
   - **פעולה:** השעיית קמפיין + הודעת WhatsApp למנהל

   **ב. התאמת תקציב:**
   - **ביצועים מצוינים** (score > 0.8):
     - העלאת תקציב ב-30% (מקסימום +200₪)
   - **ביצועים טובים** (score > 0.6):
     - העלאת תקציב ב-10%
   - **ביצועים בינוניים** (score < 0.5):
     - הורדת תקציב ב-10%
   - **ביצועים חלשים** (score < 0.3):
     - הורדת תקציב ב-50% (מינימום 50₪)

4. **לוגים:**
   - כל פעולה נרשמת ב-`automation_logs`
   - הודעות WhatsApp למנהל על שינויים

---

### Budget Pacing (בקרת קצב הוצאה)

**מטרה:** למנוע בזבוז תקציב מוקדם מדי

**חישוב:**
```
spendPace = actualSpend / expectedSpend
expectedSpend = budget * (currentHour * 60 + currentMinute) / (24 * 60)
```

**אזהרה:**
- אם `spendPace > 1.5` (150% מהצפוי)
- **פעולה:** הודעת WhatsApp למנהל

---

### A/B Testing

**תנאים:**
- קמפיין עם 2+ Ad Sets

**תהליך:**
1. השוואת ביצועים של כל Ad Sets
2. חישוב Performance Score לכל אחד
3. זיהוי מנצח (אם יש הבדל של 25%+)
4. **פעולה:** הודעת WhatsApp עם תוצאות

---

### Audience Sync

**מטרה:** סנכרון לקוחות VIP ל-audiences

**תהליך:**
1. איתור לקוחות VIP (membership type='vip' או totalPurchased > 1000)
2. אם יש 50+ לקוחות VIP
3. **פעולה:** יצירת log לסנכרון (עתידי)

---

## 📱 אינטגרציות

### WhatsApp
- הודעות אוטומטיות בכל שלב
- התראות למנהל על שינויים בקמפיינים
- עדכוני יתרה ללקוחות

### Cardcom
- יצירת סשן תשלום
- עיבוד webhook תשלום
- עדכון membership אוטומטי

### BioStar
- רישום פנים אוטומטי
- זיהוי פנים בכניסה
- פתיחת דלת אוטומטית

### Meta/Google/TikTok Ads
- ניטור ביצועים
- התאמת תקציבים
- השעיית קמפיינים

---

## 🔧 הגדרות אוטומציה

### AutomationEngine Constants

```typescript
MAX_BUDGET_INCREASE = 0.30      // מקסימום 30% העלאה
MAX_BUDGET_DECREASE = 0.50      // מקסימום 50% הורדה
MIN_DAILY_BUDGET = 50           // תקציב מינימלי יומי
TARGET_CTR = 0.02               // 2% CTR יעד
TARGET_CONVERSION_RATE = 0.05   // 5% Conversion Rate יעד
PERFORMANCE_CHECK_INTERVAL = 15 * 60 * 1000  // 15 דקות
```

---

## 📊 Performance Score Formula

```typescript
score = 0

// CTR Score (30%)
ctrScore = min(ctr / TARGET_CTR, 1) * 0.3
score += ctrScore

// Conversion Score (40%)
if (conversions > 0) {
  conversionScore = min(conversionRate / TARGET_CONVERSION_RATE, 1) * 0.4
  score += conversionScore
  
  // Efficiency Score (30%)
  efficiencyScore = max(1 - (costPerConversion / 200), 0) * 0.3
  score += efficiencyScore
} else {
  // CPC Score (40%)
  cpcScore = max(1 - (cpc / 5), 0) * 0.4
  score += cpcScore
  
  // Click Score (30%)
  clickScore = min(clicks / 100, 1) * 0.3
  score += clickScore
}

return score  // 0-1
```

---

## 🚀 הפעלת האוטומציה

### WorkflowService
**פועל אוטומטית** כאשר:
- הודעת WhatsApp נכנסת
- תשלום הושלם
- טופס בריאות הושלם
- פנים נרשמו

### AutomationEngine
**נדרש הפעלה ידנית:**
```typescript
const automationEngine = new AutomationEngine(storage, whatsappService);
automationEngine.initializeMetaService(accessToken);
automationEngine.startAutomation();
```

**הערה:** כרגע לא מופעל אוטומטית בשרת - צריך להוסיף אתחול ב-`server/index.ts`

---

## 📝 לוגים

כל פעולת אוטומציה נרשמת ב-`automation_logs`:
- Platform (meta/google_ads/tiktok/automation_engine)
- Entity (campaign/adset/ad/cycle)
- Action (performance_checked/budget_adjusted/paused)
- Success/Failure
- Details (JSON)

---

## ⚠️ נקודות חשובות

1. **WorkflowService** פועל אוטומטית דרך webhooks
2. **AutomationEngine** צריך להיות מופעל ידנית (לא מופעל כרגע)
3. כל שינוי בקמפיינים נשלח למנהל ב-WhatsApp
4. Performance Score מחושב דינמית לפי ביצועים
5. תקציבים מתאימים אוטומטית לפי ביצועים

---

**עודכן:** $(Get-Date -Format "yyyy-MM-dd HH:mm")

