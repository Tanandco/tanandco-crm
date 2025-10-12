import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import sprayTanImage from '@assets/שיזוף בהתזה (1920 x 1080 פיקסל) (2)_1760223839174.png';

interface SprayTanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SprayTanDialog({ open, onOpenChange }: SprayTanDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-[95vw] bg-gradient-to-b from-gray-900 to-black border-2 rounded-lg p-4 md:p-8 max-h-[95vh] overflow-y-auto" style={{ borderColor: '#2c2c2c' }}>
        
        {/* כפתור חזרה */}
        <Button 
          onClick={() => onOpenChange(false)} 
          variant="outline" 
          size="icon" 
          className="absolute top-4 left-4 md:left-6 hover:border-[#2c2c2c] z-10 h-8 w-8"
          style={{ borderColor: '#2c2c2c' }}
          data-testid="button-back-spray-tan"
        >
          <ArrowLeft className="w-5 h-5" style={{ color: '#2c2c2c' }} />
        </Button>

        {/* כותרת עליונה */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-4" style={{ 
            color: '#e064d5',
            textShadow: '0 0 30px rgba(224, 100, 213, 0.8)',
            fontFamily: 'Varela Round, sans-serif'
          }}>
            השיזוף המושלם והבטוח במרכז התדה
          </h1>
          
          {/* טקסט הסבר */}
          <p className="text-xs md:text-sm leading-relaxed max-w-5xl mx-auto" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>
            שיזוף בהתזה הוא למעשה תהליך קוסמטי מהיר ובטוח ליצירת גוון שיזוף באופן מלאכותי, ללא צורך בחשיפה לשמש או לקרינת UV מזיקה. הוא מבוסס על תומצית סוכר טבעי (DHA) שצובע את שכבת העור העליונה, ומספק תוצאה אחידה ומזהירה.
          </p>
        </div>

        {/* 5 כפתורי מחירון עם כפתורי הזמנה */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8 max-w-6xl mx-auto">
          <div className="flex flex-col gap-2">
            <div className="border-2 rounded-lg p-3 md:p-4 flex flex-col items-center" style={{ borderColor: '#2c2c2c', backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)' }}>
              <div className="text-xs md:text-sm mb-1" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>טיפול בודד</div>
              <div className="text-lg md:text-xl font-bold" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>170 ש״ח</div>
            </div>
            <Button
              variant="outline"
              className="border-2 hover:border-[#2c2c2c] w-full"
              style={{ borderColor: '#e064d5', backgroundColor: 'rgba(224, 100, 213, 0.1)', color: '#e064d5', fontFamily: 'Varela Round, sans-serif' }}
              data-testid="book-single"
            >
              הזמן עכשיו
            </Button>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="border-2 rounded-lg p-3 md:p-4 flex flex-col items-center" style={{ borderColor: '#2c2c2c', backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)' }}>
              <div className="text-xs md:text-sm mb-1" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>חבילה 3 טיפולים</div>
              <div className="text-lg md:text-xl font-bold" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>450 ש״ח</div>
            </div>
            <Button
              variant="outline"
              className="border-2 hover:border-[#2c2c2c] w-full"
              style={{ borderColor: '#e064d5', backgroundColor: 'rgba(224, 100, 213, 0.1)', color: '#e064d5', fontFamily: 'Varela Round, sans-serif' }}
              data-testid="book-package-3"
            >
              הזמן עכשיו
            </Button>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="border-2 rounded-lg p-3 md:p-4 flex flex-col items-center" style={{ borderColor: '#2c2c2c', backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)' }}>
              <div className="text-xs md:text-sm mb-1" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>חבילה 6 טיפולים</div>
              <div className="text-lg md:text-xl font-bold" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>800 ש״ח</div>
            </div>
            <Button
              variant="outline"
              className="border-2 hover:border-[#2c2c2c] w-full"
              style={{ borderColor: '#e064d5', backgroundColor: 'rgba(224, 100, 213, 0.1)', color: '#e064d5', fontFamily: 'Varela Round, sans-serif' }}
              data-testid="book-package-6"
            >
              הזמן עכשיו
            </Button>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="border-2 rounded-lg p-3 md:p-4 flex flex-col items-center" style={{ borderColor: '#2c2c2c', backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)' }}>
              <div className="text-xs md:text-sm mb-1" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>חבילה לכלה</div>
              <div className="text-lg md:text-xl font-bold" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>340 ש״ח</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[9px] md:text-[10px]" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5', opacity: 0.8 }}>
                  טסט מלא + טיפול לפני אירוע
                </span>
                <svg className="w-3 h-3" fill="none" stroke="#e064d5" strokeWidth="2" viewBox="0 0 24 24" style={{ opacity: 0.8 }}>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <circle cx="12" cy="8" r="0.5" fill="#e064d5"/>
                </svg>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-2 hover:border-[#2c2c2c] w-full"
              style={{ borderColor: '#e064d5', backgroundColor: 'rgba(224, 100, 213, 0.1)', color: '#e064d5', fontFamily: 'Varela Round, sans-serif' }}
              data-testid="book-bride"
            >
              הזמן עכשיו
            </Button>
          </div>
          
          <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
            <div className="border-2 rounded-lg p-3 md:p-4 flex flex-col items-center" style={{ borderColor: '#2c2c2c', backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)' }}>
              <div className="text-xs md:text-sm mb-1" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>שירות עד הבית</div>
              <div className="text-lg md:text-xl font-bold" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>350 ש״ח</div>
            </div>
            <Button
              variant="outline"
              className="border-2 hover:border-[#2c2c2c] w-full"
              style={{ borderColor: '#e064d5', backgroundColor: 'rgba(224, 100, 213, 0.1)', color: '#e064d5', fontFamily: 'Varela Round, sans-serif' }}
              data-testid="book-home-service"
            >
              הזמן עכשיו
            </Button>
          </div>
        </div>

        {/* לוח שנה/יומן לבחירת תאריך */}
        <div className="mb-6 md:mb-8 max-w-6xl mx-auto">
          <h3 className="text-base md:text-lg font-bold text-center mb-2" style={{ 
            color: '#e064d5',
            fontFamily: 'Varela Round, sans-serif',
            textShadow: '0 0 10px rgba(224, 100, 213, 0.5)'
          }}>
            בחרו תאריך לטיפול
          </h3>
          <div className="border-2 rounded-lg p-2 md:p-3" style={{ borderColor: '#2c2c2c', backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.8)' }}>
            {/* כותרת חודש */}
            <div className="flex items-center justify-between mb-2">
              <Button variant="ghost" className="h-6 w-6 p-0" style={{ color: '#e064d5' }} data-testid="prev-month">
                <span className="text-lg">‹</span>
              </Button>
              <h4 className="text-sm md:text-base font-bold" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>
                אוקטובר 2025
              </h4>
              <Button variant="ghost" className="h-6 w-6 p-0" style={{ color: '#e064d5' }} data-testid="next-month">
                <span className="text-lg">›</span>
              </Button>
            </div>

            {/* ימי שבוע */}
            <div className="grid grid-cols-7 gap-0.5 mb-1 pb-1 border-b" style={{ borderColor: '#2c2c2c' }}>
              {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(day => (
                <div key={day} className="text-center text-[10px] md:text-xs font-bold p-1" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>
                  {day}
                </div>
              ))}
            </div>

            {/* תאריכים */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 2;
                const isValid = day > 0 && day <= 31;
                const isWeekend = (i % 7 === 5 || i % 7 === 6);
                
                return (
                  <Button
                    key={i}
                    variant="ghost"
                    className="h-7 md:h-8 p-0 text-[10px] md:text-xs border"
                    disabled={!isValid || isWeekend}
                    style={{ 
                      color: isValid && !isWeekend ? '#e064d5' : '#666',
                      fontFamily: 'Varela Round, sans-serif',
                      borderRadius: '4px',
                      borderColor: '#2c2c2c',
                      backgroundColor: isValid && !isWeekend ? 'rgba(224, 100, 213, 0.1)' : 'transparent'
                    }}
                    data-testid={`calendar-day-${day}`}
                  >
                    {isValid ? day : ''}
                  </Button>
                );
              })}
            </div>

            {/* הערה */}
            <p className="text-[9px] md:text-[10px] text-center mt-1" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5', opacity: 0.7 }}>
              ימי שישי ושבת - סגור
            </p>
          </div>
        </div>

        {/* 3 בלוקים עיקריים */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          
          {/* בלוק ראשון - הנחיות לפני ואחרי טיפול */}
          <div className="border-2 rounded-lg p-4 md:p-6" style={{ borderColor: '#2c2c2c', backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: '8px 0 12px rgba(0, 0, 0, 0.6)' }} data-testid="block-guidelines">
            <h3 className="text-lg md:text-xl font-bold text-center mb-4" style={{ 
              color: '#e064d5',
              fontFamily: 'Varela Round, sans-serif'
            }}>
              הנחיות לפני ואחרי טיפול
            </h3>
            <div className="text-xs md:text-sm leading-relaxed space-y-3" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>
              <p><strong>לפני הטיפול:</strong> קלחת סבון פילינג/גרגירים יום לפני. גילוח במידת הצורך 24 שעות לפני. אין למרוח שמן/קרם/דאודורנט ביום הטיפול. הגיעו בבגדים קלילים, רחבים, כהים וכפכפים.</p>
              <p><strong>אחרי הטיפול:</strong> המתנה 4 שעות. הימנעו מהזעה ומגע מים עד למקלחת הראשונה. שטפו עם מים זורמים ללא סבון/קירצוף. התנגבו בטפיחות.</p>
              <p><strong>תחזוקה:</strong> הגוון הסופי יתפתח למחרת. הימנעו מפילינג/ליפה במהלך השבוע. המרחו פעמיים ביום בחמאת גוף איכותית לשימור תוצאת השיזוף.</p>
            </div>
            
            {/* כפתור שיתוף לוואטסאפ */}
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                className="border-2 hover:border-[#25D366] gap-2"
                style={{ 
                  borderColor: '#25D366', 
                  backgroundColor: 'rgba(37, 211, 102, 0.1)', 
                  color: '#25D366',
                  fontFamily: 'Varela Round, sans-serif'
                }}
                onClick={() => {
                  const text = `🌟 הנחיות שיזוף בהתזה - Tan & Co 🌟

📋 לפני הטיפול:
• קלחת סבון פילינג/גרגירים יום לפני
• גילוח במידת הצורך 24 שעות לפני
• אין למרוח שמן/קרם/דאודורנט ביום הטיפול
• הגיעו בבגדים קלילים, רחבים, כהים וכפכפים

✨ אחרי הטיפול:
• המתנה 4 שעות
• הימנעו מהזעה ומגע מים עד למקלחת הראשונה
• שטפו עם מים זורמים ללא סבון/קירצוף
• התנגבו בטפיחות

💫 תחזוקה:
• הגוון הסופי יתפתח למחרת
• הימנעו מפילינג/ליפה במהלך השבוע
• המרחו פעמיים ביום בחמאת גוף איכותית`;
                  
                  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                data-testid="share-whatsapp"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                שתף בוואטסאפ
              </Button>
            </div>
          </div>

          {/* בלוק אמצעי - עמידות והתאמה אישית */}
          <div className="border-2 rounded-lg p-4 md:p-6" style={{ borderColor: '#2c2c2c', backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: '8px 0 12px rgba(0, 0, 0, 0.6)' }} data-testid="block-durability">
            <h3 className="text-lg md:text-xl font-bold text-center mb-4" style={{ 
              color: '#e064d5',
              fontFamily: 'Varela Round, sans-serif'
            }}>
              עמידות והתאמה אישית
            </h3>
            <div className="text-xs md:text-sm leading-relaxed space-y-3" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>
              <p><strong>עמידות:</strong> השיזוף מחזיק 5-10 ימים, תלוי בסוג העור והטיפול. דהייה הדרגתית ואחידה בדומה לשיזוף טבעי.</p>
              <p><strong>התאמה אישית:</strong> התאמה לפי גוון עור טבעי ולאירועים ספציפיים. עבודה עם המותגים המובילים בעולם - תמיסות איכותיות, טבעיות, ללא פראבנים, עם רכיבי לחות וויטמינים.</p>
              <p><strong>מיתוסים:</strong> עם תכשירים איכותיים התוצאה טבעית ואחידה, ללא כתמים או גוון כתום. תכשירים מודרניים פתרו את בעיית הריח האופייני.</p>
            </div>
          </div>

          {/* בלוק שלישי - יתרונות והסתרת פגמים */}
          <div className="border-2 rounded-lg p-4 md:p-6" style={{ borderColor: '#2c2c2c', backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: '8px 0 12px rgba(0, 0, 0, 0.6)' }} data-testid="block-benefits">
            <h3 className="text-lg md:text-xl font-bold text-center mb-4" style={{ 
              color: '#e064d5',
              fontFamily: 'Varela Round, sans-serif'
            }}>
              יתרונות והסתרת פגמים
            </h3>
            <div className="text-xs md:text-sm leading-relaxed space-y-3" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>
              <p><strong>אלטרנטיבה בריאה:</strong> אלטרנטיבה מעולה לשיזוף בשמש, ללא סיכונים בריאותיים. מתאים לכל סוגי העור, כולל בהירי עור שעלולים להיכוות בשמש.</p>
              <p><strong>הסתרת פגמים:</strong> טשטוש קל של צלקות, ורידים, סימני מתיחה או אקנה על ידי יצירת גוון אחיד. מראה בריא, זוהר וחטוב באופן מיידי.</p>
              <p><strong>תיאום:</strong> יש לתאם את הטיפול יום/יומיים לפני השיזוף הרצוי לקבלת התוצאה האופטימלית.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
