import { useState } from 'react';
import { ArrowLeft, Droplets, Sparkles, Share2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import sprayTanBg from '@assets/thatso spray_1759968021995.webp';

interface SprayTanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SprayTanDialog({ open, onOpenChange }: SprayTanDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (!open) return null;

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startDayOfWeek };
  };

  const getMonthName = (date: Date) => {
    const hebrewMonths = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    return hebrewMonths[date.getMonth()];
  };

  const getDayName = (dayIndex: number) => {
    const hebrewDays = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
    return hebrewDays[dayIndex];
  };

  const { daysInMonth, startDayOfWeek } = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Pink/Purple Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-pink-600/20 to-black opacity-90 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-purple-500/10" />
      </div>

      <div className="min-h-screen flex flex-col items-center justify-start p-4 pb-20">
        {/* Back Button */}
      <div className="absolute top-6 right-6 z-30">
        <Button
          onClick={() => onOpenChange(false)}
          variant="outline"
          size="lg"
          className="bg-white/10 border-white/20 text-white backdrop-blur-sm"
          data-testid="button-back-spray-tan"
        >
          <ArrowLeft className="w-5 h-5 ml-2" />
          חזרה לשירות עצמי
        </Button>
      </div>

      {/* Background Image Header - Full Width */}
      <div className="absolute top-0 left-0 right-0 h-64 z-10 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${sprayTanBg})`,
            opacity: 0.15
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
      </div>

      {/* Welcome Header */}
      <div className="absolute top-16 left-0 right-0 z-20">
        <div className="text-center space-y-4 px-4">
          <div className="flex items-center justify-center gap-3">
            <Droplets className="w-12 h-12 text-pink-500" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 1))' }} />
            <h1 
              className="text-xl font-bold text-white font-varela tracking-wide" 
              style={{ fontFamily: "'Varela Round', sans-serif !important" }}
            >
              שיזוף בהתזה - טכנולוגיה מתקדמת לשיזוף מושלם
            </h1>
            <Sparkles className="w-10 h-10 text-purple-500 animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 1))' }} />
          </div>
          
          {/* Pink Neon Separator */}
          <div className="relative py-1 flex justify-center">
            <div 
              className="w-1/2 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-pulse" 
              style={{
                filter: 'drop-shadow(0 0 16px rgba(236, 72, 153, 1)) drop-shadow(0 0 32px rgba(236, 72, 153, 1)) drop-shadow(0 0 48px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 64px rgba(236, 72, 153, 0.6))',
                boxShadow: '0 0 35px rgba(236, 72, 153, 1), 0 0 60px rgba(236, 72, 153, 0.8), 0 0 80px rgba(236, 72, 153, 0.6), inset 0 0 20px rgba(236, 72, 153, 0.5)'
              }}
            />
            <div className="absolute inset-0 flex justify-center">
              <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent opacity-80 blur-sm animate-pulse" />
            </div>
          </div>
          
        </div>
      </div>

      {/* Content Section */}
      <div className="relative w-full max-w-4xl mt-32 px-4">
        {/* Info Text */}
        <div className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border rounded-md p-6 mb-8" style={{ borderColor: 'rgba(236, 72, 153, 0.6)' }}>
          <p className="text-white text-center font-hebrew leading-relaxed mb-4">
            שיזוף בהתזה הוא שיטה מתקדמת ובטוחה המתבצעת באמצעות קומפרסור אויר המחובר לאקדח המפזר תמיסת שיזוף בחלקיקים דקיקים, מה שמקנה שיזוף אחיד ומושלם תוך 15 דקות בלבד.
          </p>
          <p className="text-white text-center font-hebrew leading-relaxed">
            תמיסת השיזוף מכילה DHA - חומר טבעי המופק מקנה סוכר. במגע עם העור הוא יוצר גוון שזוף על ידי צביעת שכבת העור העליונה בלבד.
          </p>
        </div>

        {/* Suitable For & Benefits - Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Suitable For */}
          <div className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border rounded-md p-6" style={{ borderColor: 'rgba(236, 72, 153, 0.6)' }}>
            <h3 className="text-xl font-bold text-pink-400 mb-4 font-hebrew text-center" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.6))' }}>מתאים במיוחד עבור:</h3>
            <ul className="text-white font-hebrew space-y-2 text-right list-disc list-inside">
              <li>אנשים עם עור רגיש שלא יכולים להשתזף בשמש</li>
              <li>מי שרוצה תוצאות מיידיות ללא זמן המתנה</li>
              <li>אנשים המודעים לסכנות קרינת UV</li>
              <li>מי שרוצה גוון אחיד ללא פסים או כתמים</li>
              <li>לקראת אירועים מיוחדים (חתונות, צילומים)</li>
              <li>מי שמחפש חלופה בטוחה לסולריום</li>
            </ul>
          </div>

          {/* Process & Benefits - Formatted Paragraph */}
          <div className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border rounded-md p-6" style={{ borderColor: 'rgba(236, 72, 153, 0.6)' }}>
            <h3 className="text-xl font-bold text-pink-400 mb-4 font-hebrew text-center" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.6))' }}>יתרונות ותהליך הטיפול</h3>
            <p className="text-white font-hebrew leading-relaxed text-right">
              שיזוף בהתזה מציע יתרונות ייחודיים: הוא <span className="text-pink-400 font-bold">בטוח לחלוטין</span> ללא חשיפה לקרינת UV מזיקה, <span className="text-pink-400 font-bold">מהיר</span> ונמשך רק 15 דקות, ומעניק <span className="text-pink-400 font-bold">גוון אחיד ושווה</span> ללא פסים או כתמים. התהליך פשוט ויעיל: תמיסת DHA מותזת על העור, מגיבה עם חלבוני העור, ויוצרת גוון ברונזה טבעי תוך 2-4 שעות בלבד.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { title: 'התזה בודדת', price: '₪170', sessions: '1 טיפול', badge: null, special: false },
            { title: 'חבילת 3 התזות', price: '₪450', sessions: '3 טיפולים', badge: 'חיסכון ₪60', special: false },
            { title: 'חבילת 6 התזות', price: '₪800', sessions: '6 טיפולים', badge: 'חיסכון ₪220', special: false },
            { title: 'שירות עד הבית', price: '₪350', sessions: 'טיפול מקצועי בנוחות הבית', badge: null, special: false },
            { title: 'חבילת כלה', price: '₪320', sessions: '2 טיפולים + שירות', badge: 'מיוחד', special: true },
          ].map((item, index) => (
            <div
              key={index}
              className={`group relative ${item.special ? 'bg-gradient-to-br from-pink-900/30 via-purple-900/30 to-black' : 'bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90'} border rounded-md p-4 hover-elevate active-elevate-2 transition-all`}
              style={{
                borderColor: item.special ? 'rgba(236, 72, 153, 1)' : 'rgba(236, 72, 153, 0.6)',
                boxShadow: item.special ? '0 0 25px rgba(236, 72, 153, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 1)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = item.special ? 'rgba(236, 72, 153, 1)' : 'rgba(236, 72, 153, 0.6)'}
              data-testid={`pricing-card-${index}`}
            >
              {item.badge && (
                <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold" style={{ boxShadow: '0 0 15px rgba(236, 72, 153, 0.6)' }}>
                  {item.badge}
                </div>
              )}
              <h3 className="text-white font-bold text-lg mb-2 font-hebrew text-center">{item.title}</h3>
              <p className="text-pink-400 font-bold text-2xl mb-1 text-center" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.6))' }}>{item.price}</p>
              <p className="text-gray-300 text-sm font-hebrew text-center">{item.sessions}</p>
            </div>
          ))}
        </div>

        {/* Appointment Calendar */}
        <div className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border rounded-md p-6 mb-8" style={{ borderColor: 'rgba(236, 72, 153, 0.6)' }}>
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const newMonth = new Date(currentMonth);
                newMonth.setMonth(newMonth.getMonth() + 1);
                setCurrentMonth(newMonth);
              }}
              className="text-white hover:text-pink-400"
              data-testid="button-next-month"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-pink-400" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.6))' }} />
              <h3 className="text-2xl font-bold text-white font-hebrew">
                קביעת תור - {getMonthName(currentMonth)} {currentMonth.getFullYear()}
              </h3>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const newMonth = new Date(currentMonth);
                newMonth.setMonth(newMonth.getMonth() - 1);
                setCurrentMonth(newMonth);
              }}
              className="text-white hover:text-pink-400"
              data-testid="button-prev-month"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['ש', 'ו', 'ה', 'ד', 'ג', 'ב', 'א'].map((day, index) => (
              <div key={index} className="text-center text-pink-400 font-bold text-sm font-hebrew">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid - Reduced height by 1/3 */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: (7 - startDayOfWeek) % 7 }).map((_, index) => (
              <div key={`empty-${index}`} className="h-10" />
            ))}
            
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              date.setHours(0, 0, 0, 0);
              const isPast = date < today;
              const isSelected = selectedDate?.getTime() === date.getTime();
              const isToday = date.getTime() === today.getTime();

              return (
                <button
                  key={day}
                  onClick={() => !isPast && setSelectedDate(date)}
                  disabled={isPast}
                  className={`
                    h-10 rounded-md flex items-center justify-center font-hebrew text-sm transition-all
                    ${isPast ? 'text-gray-600 cursor-not-allowed' : 'text-white hover-elevate active-elevate-2 cursor-pointer'}
                    ${isSelected ? 'bg-pink-500 border-2 border-pink-400' : 'bg-gray-800/50 border border-gray-700'}
                    ${isToday && !isSelected ? 'border-pink-400/50' : ''}
                  `}
                  style={isSelected ? { 
                    boxShadow: '0 0 20px rgba(236, 72, 153, 0.6)',
                    filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.4))'
                  } : {}}
                  data-testid={`calendar-day-${day}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {selectedDate && (
            <div className="mt-6 p-4 bg-pink-500/20 border border-pink-500/50 rounded-md">
              <p className="text-white font-hebrew text-center">
                תאריך נבחר: {selectedDate.getDate()} {getMonthName(selectedDate)} {selectedDate.getFullYear()}
              </p>
              <Button
                className="w-full mt-4 bg-pink-500 hover:bg-pink-600 text-white font-hebrew"
                data-testid="button-confirm-appointment"
              >
                אישור תור
              </Button>
            </div>
          )}
        </div>

        {/* Solution Types */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white font-hebrew mb-6 text-center">
            סוגי תמיסות השיזוף
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { 
                title: 'טבעית בהירה', 
                subtitle: 'לגוון טבעי ועדין',
                dha: '8%', 
                duration: '5-7 ימים', 
                skin: 'עור בהיר מאוד',
                popular: false
              },
              { 
                title: 'בינונית', 
                subtitle: 'האופציה הפופולרית ביותר',
                dha: '12%', 
                duration: '7-10 ימים', 
                skin: 'עור בהיר עד בינוני',
                popular: true
              },
              { 
                title: 'כהה', 
                subtitle: 'לגוון דרמטי ועמוק',
                dha: '16%', 
                duration: '8-12 ימים', 
                skin: 'עור כהה או מנוסה',
                popular: false
              },
            ].map((solution, index) => (
              <div
                key={index}
                className="relative bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border rounded-md p-5 hover-elevate active-elevate-2 transition-all"
                style={{
                  borderColor: solution.popular ? 'rgba(236, 72, 153, 1)' : 'rgba(236, 72, 153, 0.6)',
                  boxShadow: solution.popular ? '0 0 20px rgba(236, 72, 153, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 1)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = solution.popular ? 'rgba(236, 72, 153, 1)' : 'rgba(236, 72, 153, 0.6)'}
              >
                {solution.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold" style={{ boxShadow: '0 0 15px rgba(236, 72, 153, 0.6)' }}>
                    פופולרי ביותר
                  </div>
                )}
                <h3 className="text-white font-bold text-xl mb-1 font-hebrew text-center">{solution.title}</h3>
                <p className="text-gray-400 text-sm font-hebrew text-center mb-4">{solution.subtitle}</p>
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-pink-400 font-bold text-3xl" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.6))' }}>{solution.dha}</p>
                    <p className="text-gray-300 text-sm font-hebrew">ריכוז DHA</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">{solution.duration}</p>
                    <p className="text-gray-300 text-sm font-hebrew">משך החזקה</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold font-hebrew">{solution.skin}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preparation & Aftercare */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Preparation */}
          <div className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border rounded-md p-6" style={{ borderColor: 'rgba(236, 72, 153, 0.6)' }}>
            <h3 className="text-xl font-bold text-pink-400 mb-4 font-hebrew text-center" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.6))' }}>הכנה מוקדמת לטיפול</h3>
            <div className="space-y-4 text-right">
              <div>
                <h4 className="text-white font-bold font-hebrew mb-1">תיאום מועד הטיפול</h4>
                <p className="text-pink-400 text-sm mb-1">1-2 ימים לפני</p>
                <p className="text-gray-300 text-sm font-hebrew">יש לתאם את הטיפול יום או יומיים לפני המועד הרצוי להיות שזופים</p>
              </div>
              <div>
                <h4 className="text-white font-bold font-hebrew mb-1">מקלחת וגילוח</h4>
                <p className="text-pink-400 text-sm mb-1">לפני הטיפול</p>
                <p className="text-gray-300 text-sm font-hebrew">יש להתקלח ולגלח שיערות במידת הצורך לפני הגעה לטיפול</p>
              </div>
              <div>
                <h4 className="text-white font-bold font-hebrew mb-1">עור נקי ויבש</h4>
                <p className="text-pink-400 text-sm mb-1">ביום הטיפול</p>
                <p className="text-gray-300 text-sm font-hebrew">אין למרוח שמן/קרם גוף/דאודורנט/בושם - על העור להיות נקי לחלוטין</p>
              </div>
              <div>
                <h4 className="text-white font-bold font-hebrew mb-1">לבוש מתאים</h4>
                <p className="text-pink-400 text-sm mb-1">ביום הטיפול</p>
                <p className="text-gray-300 text-sm font-hebrew">יש להגיע בבגדים קלילים, רחבים, רצוי כהים ולא חשופים, וכפכפים</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-pink-500/10 border border-pink-500/30 rounded-md">
              <p className="text-gray-300 text-sm font-hebrew text-right">
                הימנעו משתיית אלכוהול 24 שעות לפני הטיפול, אל תשתמשו בבושם או דאודורנט ביום הטיפול, לבשו בגדים רחבים ונוחים, אל תתכננו פעילות גופנית לאחר הטיפול
              </p>
            </div>
            <button
              onClick={() => {
                const text = encodeURIComponent('*הכנה מוקדמת לשיזוף בהתזה* 🌟\n\n• תיאום מועד: 1-2 ימים לפני\n• מקלחת וגילוח לפני הטיפול\n• עור נקי ללא קרמים/שמנים/בושם\n• בגדים קלילים וכהים\n• ללא אלכוהול 24 שעות לפני');
                window.open(`https://wa.me/?text=${text}`, '_blank');
              }}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all hover-elevate active-elevate-2"
              data-testid="button-share-preparation"
            >
              <Share2 className="w-5 h-5" />
              <span className="font-hebrew">שתף בוואטסאפ</span>
            </button>
          </div>

          {/* Aftercare */}
          <div className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border rounded-md p-6" style={{ borderColor: 'rgba(236, 72, 153, 0.6)' }}>
            <h3 className="text-xl font-bold text-pink-400 mb-4 font-hebrew text-center" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.6))' }}>תחזוקה לאחר הטיפול</h3>
            <div className="space-y-4 text-right">
              <div>
                <h4 className="text-white font-bold font-hebrew mb-1">המתנה לאחר הטיפול</h4>
                <p className="text-pink-400 text-sm mb-1">1-4 שעות</p>
                <p className="text-gray-300 text-sm font-hebrew">יש להימנע מהזעה ומגע מים בעור 4 שעות עד למקלחת הראשונה</p>
              </div>
              <div>
                <h4 className="text-white font-bold font-hebrew mb-1">המקלחת הראשונה</h4>
                <p className="text-pink-400 text-sm mb-1">אחרי 4 שעות</p>
                <p className="text-gray-300 text-sm font-hebrew">במקלחת הראשונה יש להסתבן פעמיים להסרת הברונזר הראשוני</p>
              </div>
              <div>
                <h4 className="text-white font-bold font-hebrew mb-1">הגוון הסופי</h4>
                <p className="text-pink-400 text-sm mb-1">למחרת</p>
                <p className="text-gray-300 text-sm font-hebrew">הגוון הסופי יתפתח יום למחרת הטיפול - זה התוצאה הרצויה</p>
              </div>
              <div>
                <h4 className="text-white font-bold font-hebrew mb-1">שימור השיזוף</h4>
                <p className="text-pink-400 text-sm mb-1">כל השבוע</p>
                <p className="text-gray-300 text-sm font-hebrew">יש להימנע מפילינג/ליפה במהלך השבוע ולהתנגב בטפיחות עדינות</p>
              </div>
              <div>
                <h4 className="text-white font-bold font-hebrew mb-1">טיפוח לשימור</h4>
                <p className="text-pink-400 text-sm mb-1">כל השבוע</p>
                <p className="text-gray-300 text-sm font-hebrew">רצוי להשתמש בחמאת גוף איכותית לשימור ותחזוק תוצאת השיזוף</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-pink-500/10 border border-pink-500/30 rounded-md">
              <p className="text-gray-300 text-sm font-hebrew text-right">
                התקלחו במים פושרים, השתמשו בסבון עדין, הימנעו מחמאות גוף עם בושם, שתו הרבה מים, הימנעו מבריכת שחייה עם כלור בימים הראשונים
              </p>
            </div>
            <button
              onClick={() => {
                const text = encodeURIComponent('*תחזוקה לאחר שיזוף בהתזה* 🌟\n\n• המתנה: 1-4 שעות ללא מים/הזעה\n• מקלחת ראשונה: להסתבן פעמיים\n• גוון סופי: למחרת\n• שימור: ללא פילינג/ליפה\n• טיפוח: חמאת גוף איכותית\n• מים פושרים, סבון עדין\n• הימנעו מכלור בימים הראשונים');
                window.open(`https://wa.me/?text=${text}`, '_blank');
              }}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all hover-elevate active-elevate-2"
              data-testid="button-share-aftercare"
            >
              <Share2 className="w-5 h-5" />
              <span className="font-hebrew">שתף בוואטסאפ</span>
            </button>
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white font-hebrew mb-6 text-center">מה הלקוחות אומרים</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border rounded-md p-6 hover-elevate transition-all" style={{ borderColor: 'rgba(236, 72, 153, 0.6)' }}>
              <p className="text-white font-hebrew text-right text-lg leading-relaxed">"זה נראה כאילו חזרתי מחופשה באיביזה – בלי לצאת מהעיר!"</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border rounded-md p-6 hover-elevate transition-all" style={{ borderColor: 'rgba(236, 72, 153, 0.6)' }}>
              <p className="text-white font-hebrew text-right text-lg leading-relaxed">"ככלה זה היה הפתרון המושלם – לא הייתי דואגת לשיזוף ביום החתונה."</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
