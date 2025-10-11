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

        {/* 5 כפתורי מחירון */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8 max-w-6xl mx-auto">
          <Button
            variant="outline"
            className="border-2 hover:border-[#2c2c2c] h-auto p-3 md:p-4 flex-col"
            style={{ borderColor: '#2c2c2c', backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)' }}
            data-testid="price-body-only"
          >
            <div className="text-xs md:text-sm mb-1" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>גוף בלבד</div>
            <div className="text-lg md:text-xl font-bold" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>170 ש״ח</div>
          </Button>
          
          <Button
            variant="outline"
            className="border-2 hover:border-[#2c2c2c] h-auto p-3 md:p-4 flex-col"
            style={{ borderColor: '#2c2c2c', backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)' }}
            data-testid="price-body-face"
          >
            <div className="text-xs md:text-sm mb-1" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>גוף + פנים</div>
            <div className="text-lg md:text-xl font-bold" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>450 ש״ח</div>
          </Button>
          
          <Button
            variant="outline"
            className="border-2 hover:border-[#2c2c2c] h-auto p-3 md:p-4 flex-col"
            style={{ borderColor: '#2c2c2c', backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)' }}
            data-testid="price-body-arms"
          >
            <div className="text-xs md:text-sm mb-1" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>גוף + זרועות</div>
            <div className="text-lg md:text-xl font-bold" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>300 ש״ח</div>
          </Button>
          
          <Button
            variant="outline"
            className="border-2 hover:border-[#2c2c2c] h-auto p-3 md:p-4 flex-col"
            style={{ borderColor: '#2c2c2c', backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)' }}
            data-testid="price-body-legs"
          >
            <div className="text-xs md:text-sm mb-1" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>גוף + רגליים</div>
            <div className="text-lg md:text-xl font-bold" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>340 ש״ח</div>
          </Button>
          
          <Button
            variant="outline"
            className="border-2 hover:border-[#2c2c2c] h-auto p-3 md:p-4 flex-col col-span-2 md:col-span-1"
            style={{ borderColor: '#2c2c2c', backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)' }}
            data-testid="price-vip-full"
          >
            <div className="text-xs md:text-sm mb-1" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>VIP גוף מלא</div>
            <div className="text-lg md:text-xl font-bold" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>350 ש״ח</div>
          </Button>
        </div>

        {/* 3 בלוקים עיקריים */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          
          {/* בלוק שמאלי - אזהרות והוראות */}
          <div className="border-2 rounded-lg p-4 md:p-6" style={{ borderColor: '#2c2c2c', backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)' }} data-testid="block-warnings">
            <h3 className="text-lg md:text-xl font-bold text-center mb-4" style={{ 
              color: '#e064d5',
              fontFamily: 'Varela Round, sans-serif'
            }}>
              אזהרות והוראות חשובות
            </h3>
            <div className="text-xs md:text-sm leading-relaxed space-y-3" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>
              <p>לפני ביצוע התזה: מומלץ לעשות פילינג עדין 24 שעות לפני, להימנע מקרמים שמנוניים ביום הטיפול ולהגיע עם לבוש רפוי וכהה. בנוסף, להימנע מכל טיפול שיער ביום הטיפול.</p>
              <p>אחרי ההתזה: אסור - לקלח או לטבוע תוך 6-8 שעות לפחות, להזיע (כגון פעילות ספורטיבית), לשים בושם, קרמים וכל חומר כימי על העור ולהימנע מפעילות מאומצת.</p>
              <p>טיפול והחזקה: להימנע משמשייה ומשטף מים שופע, ולשמור על לחות העור באמצעות קרמים מיוחדים לשיזוף בהתזה כדי להאריך את תוצאת השיזוף.</p>
            </div>
          </div>

          {/* בלוק אמצעי - מתי מומלץ */}
          <div className="border-2 rounded-lg p-4 md:p-6" style={{ borderColor: '#2c2c2c', backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)' }} data-testid="block-when-recommended">
            <h3 className="text-lg md:text-xl font-bold text-center mb-4" style={{ 
              color: '#e064d5',
              fontFamily: 'Varela Round, sans-serif'
            }}>
              מתי מומלץ לעשות שיזוף בהתזה?
            </h3>
            <div className="text-xs md:text-sm leading-relaxed space-y-3" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>
              <p>לקראת אירוע מיוחד: זהו הפתרון האידיאלי למי שרוצה להופיע זוהר ואחיד במיוחד לפני חתונה, יום הולדת, חופשה או כל אירוע חשוב. ניתן להשיג גוון כל שהוא בכל עונה.</p>
              <p>חלופה לשיזוף בשמש: מומלץ לאנשים בעלי עור רגיש, לאלו שמעדיפים להימנע מחשיפה לשמש או מקרינת UV בגלל החשש לנזק לעור, או לאנשים אשר שיזוף טבעי אינו מתאים להם.</p>
              <p>תיקון אזורים לא אחידים: התזה עוזרת להעלים פסים, כתמים או אזורים לא מושלמים מהשיזוף הקיים, ומעניקה מראה חלק ואחיד בזמן קצר.</p>
            </div>
          </div>

          {/* בלוק ימני - מתי להימנע */}
          <div className="border-2 rounded-lg p-4 md:p-6" style={{ borderColor: '#2c2c2c', backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)' }} data-testid="block-when-avoid">
            <h3 className="text-lg md:text-xl font-bold text-center mb-4" style={{ 
              color: '#e064d5',
              fontFamily: 'Varela Round, sans-serif'
            }}>
              מתי להימנע משיזוף בהתזה?
            </h3>
            <div className="text-xs md:text-sm leading-relaxed space-y-3" style={{ fontFamily: 'Varela Round, sans-serif', color: '#e064d5' }}>
              <p>עור פצוע או מגורה: יש להימנע מהתזה אם יש פצעים פתוחים, כוויות שמש, פריחה, אקנה דלקתי או כל מצב בו העור אינו שלם ובריא.</p>
              <p>הריון והנקה: למרות שטופל על בסיס DHA נחשב בטוח באופן כללי, מומלץ להתייעץ עם רופא לפני ביצוע הטיפול בתקופת הריון או הנקה.</p>
              <p>רגישות או אלרגיה: אם יש היסטוריה של אלרגיה לקוסמטיקה, ריחות או לחומרים כימיים, מומלץ לבצע מבחן על שטח קטן ביממה לפני הטיפול המלא, או להימנע ממנו לחלוטין.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
