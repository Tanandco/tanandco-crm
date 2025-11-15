import { useState } from 'react';
import BidiText from '@/components/BidiText';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BidiTest() {
  const [testText, setTestText] = useState('המחיר הוא $50');
  const [customText, setCustomText] = useState('');

  const examples = [
    'המחיר הוא $50',
    'הזמנתי 3 כרטיסים ב-Tan & Co',
    'התקשר ל-050-1234567',
    'שלח ל-info@tanandco.co.il',
    'בקר ב-https://tanandco.co.il',
    'הלקוח דוד הזמין 5 שירותים ב-AI TAN בעלות של ₪250',
    'Price $100 בעברית',
    'מספר הטלפון הוא +972-50-123-4567',
    'הזמנה #12345 ב-15/01/2025',
    'עברית English 123 Mixed',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white text-2xl">בדיקת טקסט דו-כיווני</CardTitle>
            <CardDescription className="text-gray-300">
              בדוק את עיבוד הטקסט המעורב (עברית + אנגלית + מספרים)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* דוגמאות מוכנות */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">דוגמאות מוכנות:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {examples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-right h-auto py-3 px-4 border-purple-500/30 hover:border-purple-500/60"
                    onClick={() => setTestText(example)}
                  >
                    <span className="text-sm">{example}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* בדיקה עם טקסט מותאם אישית */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">נסה טקסט משלך:</h3>
              <div className="flex gap-3">
                <Input
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="הכנס טקסט מעורב כאן..."
                  className="flex-1 bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400"
                  dir="rtl"
                />
                <Button
                  onClick={() => {
                    if (customText) {
                      setTestText(customText);
                      setCustomText('');
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!customText}
                >
                  בדוק
                </Button>
              </div>
            </div>

            {/* תוצאות */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">תוצאות:</h3>
              
              {/* ללא BidiText */}
              <Card className="bg-red-900/20 border-red-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-300 text-sm">ללא BidiText (לא נכון):</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white text-lg p-4 bg-slate-900/50 rounded border border-red-500/30">
                    {testText}
                  </p>
                </CardContent>
              </Card>

              {/* עם BidiText */}
              <Card className="bg-green-900/20 border-green-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-300 text-sm">עם BidiText (נכון):</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-white text-lg p-4 bg-slate-900/50 rounded border border-green-500/30">
                    <BidiText>{testText}</BidiText>
                  </div>
                </CardContent>
              </Card>

              {/* עם BidiText + autoDetect=false */}
              <Card className="bg-blue-900/20 border-blue-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-300 text-sm">עם BidiText (ללא זיהוי אוטומטי):</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-white text-lg p-4 bg-slate-900/50 rounded border border-blue-500/30">
                    <BidiText autoDetect={false}>{testText}</BidiText>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* הסבר */}
            <Card className="bg-purple-900/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-300 text-sm">איך זה עובד?</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 text-sm space-y-2">
                <p>
                  הקומפוננטה <code className="bg-slate-700/50 px-1 rounded">BidiText</code> מזהה אוטומטית את סוג הטקסט:
                </p>
                <ul className="list-disc list-inside space-y-1 mr-4">
                  <li>עברית - מוצגת מימין לשמאל (RTL)</li>
                  <li>אנגלית - מוצגת משמאל לימין (LTR)</li>
                  <li>מספרים - מוצגים משמאל לימין (LTR)</li>
                  <li>סימני פיסוק - נצמדים לקטע הקודם</li>
                </ul>
                <p className="mt-3">
                  התוצאה: טקסט קריא ומובן גם כשיש עירבוב של שפות!
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

