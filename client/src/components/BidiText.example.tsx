/**
 * BidiText Component Examples
 * 
 * This file demonstrates how to use the BidiText component
 * for proper bidirectional text rendering.
 */

import BidiText from './BidiText';

export function BidiTextExamples() {
  return (
    <div dir="rtl" className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">דוגמאות לשימוש ב-BidiText</h1>
      
      {/* Example 1: Simple mixed text */}
      <div className="p-4 bg-gray-800 rounded">
        <h2 className="text-lg mb-2">דוגמה 1: טקסט מעורב פשוט</h2>
        <p>
          <BidiText>המחיר הוא $50</BidiText>
        </p>
        <p className="text-sm text-gray-400 mt-2">
          ללא BidiText: המחיר הוא $50 (לא נכון)
        </p>
      </div>
      
      {/* Example 2: Hebrew + English + Numbers */}
      <div className="p-4 bg-gray-800 rounded">
        <h2 className="text-lg mb-2">דוגמה 2: עברית + אנגלית + מספרים</h2>
        <p>
          <BidiText>הזמנתי 3 כרטיסים ב-Tan & Co</BidiText>
        </p>
        <p className="text-sm text-gray-400 mt-2">
          ללא BidiText: הזמנתי 3 כרטיסים ב-Tan & Co (לא נכון)
        </p>
      </div>
      
      {/* Example 3: Phone numbers */}
      <div className="p-4 bg-gray-800 rounded">
        <h2 className="text-lg mb-2">דוגמה 3: מספרי טלפון</h2>
        <p>
          <BidiText>התקשר ל-050-1234567</BidiText>
        </p>
        <p>
          <BidiText>או ל-+972-50-123-4567</BidiText>
        </p>
      </div>
      
      {/* Example 4: Email addresses */}
      <div className="p-4 bg-gray-800 rounded">
        <h2 className="text-lg mb-2">דוגמה 4: כתובות אימייל</h2>
        <p>
          <BidiText>שלח ל-info@tanandco.co.il</BidiText>
        </p>
      </div>
      
      {/* Example 5: URLs */}
      <div className="p-4 bg-gray-800 rounded">
        <h2 className="text-lg mb-2">דוגמה 5: כתובות אתר</h2>
        <p>
          <BidiText>בקר ב-https://tanandco.co.il</BidiText>
        </p>
      </div>
      
      {/* Example 6: Complex mixed content */}
      <div className="p-4 bg-gray-800 rounded">
        <h2 className="text-lg mb-2">דוגמה 6: תוכן מעורב מורכב</h2>
        <p>
          <BidiText>
            הלקוח דוד הזמין 5 שירותים ב-AI TAN בעלות של ₪250
          </BidiText>
        </p>
      </div>
      
      {/* Example 7: Using as different element */}
      <div className="p-4 bg-gray-800 rounded">
        <h2 className="text-lg mb-2">דוגמה 7: שימוש כ-element אחר</h2>
        <BidiText as="div" className="text-xl font-bold">
          כותרת עם טקסט מעורב: Price $100
        </BidiText>
      </div>
      
      {/* Example 8: Without auto-detection */}
      <div className="p-4 bg-gray-800 rounded">
        <h2 className="text-lg mb-2">דוגמה 8: ללא זיהוי אוטומטי</h2>
        <BidiText autoDetect={false}>
          טקסט זה לא יעבור עיבוד אוטומטי
        </BidiText>
      </div>
      
      {/* Example 9: CSS classes usage */}
      <div className="p-4 bg-gray-800 rounded">
        <h2 className="text-lg mb-2">דוגמה 9: שימוש ב-CSS classes ישירות</h2>
        <p>
          <span className="bidi-container">
            <span className="bidi-english">English</span>
            {' '}
            <span className="bidi-number">123</span>
            {' '}
            <span>עברית</span>
          </span>
        </p>
      </div>
    </div>
  );
}

export default BidiTextExamples;

