import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SprayTanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SprayTanDialog({ open, onOpenChange }: SprayTanDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-7xl bg-gradient-to-b from-gray-900 to-black border border-pink-500/30 rounded-lg p-4 md:p-8 max-h-[95vh] overflow-y-auto">
        
        {/* כפתור חזרה */}
        <Button 
          onClick={() => onOpenChange(false)} 
          variant="outline" 
          size="icon" 
          className="absolute top-4 left-4 md:left-6 border-pink-500/60 hover:border-pink-500 z-10"
          data-testid="button-back-spray-tan"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* כותרת עליונה באנגלית */}
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-2xl md:text-4xl font-bold" style={{ 
            color: '#d12fc6',
            textShadow: '0 0 20px rgba(209, 47, 198, 0.6)'
          }}>
            SPRAY TAN
          </h1>
          <p className="text-pink-400 text-sm md:text-base mt-1">KEEP IT SAFE</p>
        </div>

        {/* כותרת עברית מרכזית */}
        <h2 className="text-xl md:text-3xl font-bold text-center text-white mb-3 md:mb-4" style={{ fontFamily: 'Varela Round, sans-serif' }}>
          השיזוף המושלם והבטוח במרכז התדה
        </h2>

        {/* טקסט הסבר */}
        <p className="text-xs md:text-sm text-gray-300 text-center mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'Varela Round, sans-serif' }}>
          שיזוף בהתזה הוא למעשה תהליך קוסמטי מהיר ובטוח ליצירת גוון שיזוף באופן מלאכותי, ללא צורך בחשיפה לשמש או לקרינת UV מזיקה. הוא מבוסס על תמצית סוכר המעלית, הפועמים הנוצא אודלה ומזהרת.
        </p>

        {/* 4 שדות מרכזיים - Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          
          {/* שדה 1 - מחירון (ימין למעלה) */}
          <div className="border-2 border-pink-500/60 rounded-lg p-4 md:p-6 bg-black/40" 
               style={{ boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)' }}>
            <h3 className="text-lg md:text-xl font-bold text-pink-400 text-center mb-4" style={{ fontFamily: 'Varela Round, sans-serif' }}>
              מחירון
            </h3>
            <ul className="space-y-2 text-sm md:text-base text-gray-200" style={{ fontFamily: 'Varela Round, sans-serif' }}>
              <li className="flex justify-between">
                <span>גופה בלבד - 170 ש״ח</span>
                <span className="text-pink-400">•</span>
              </li>
              <li className="flex justify-between">
                <span>גוף ופנים - 450 ש״ח</span>
                <span className="text-pink-400">•</span>
              </li>
              <li className="flex justify-between">
                <span>גוף + זרועות - 300 ש״ח</span>
                <span className="text-pink-400">•</span>
              </li>
              <li className="flex justify-between">
                <span>גוף + רגליים - 340 ש״ח</span>
                <span className="text-pink-400">•</span>
              </li>
              <li className="flex justify-between">
                <span>VIP גוף מלא - 350 ש״ח</span>
                <span className="text-pink-400">•</span>
              </li>
            </ul>
          </div>

          {/* שדה 2 - לוח זמני פעילות (שמאל למעלה) */}
          <div className="border-2 border-pink-500/60 rounded-lg p-4 md:p-6 bg-black/40" 
               style={{ boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)' }}>
            <h3 className="text-lg md:text-xl font-bold text-pink-400 text-center mb-4" style={{ fontFamily: 'Varela Round, sans-serif' }}>
              זמני פעילות
            </h3>
            <div className="text-sm md:text-base text-gray-200 space-y-3" style={{ fontFamily: 'Varela Round, sans-serif' }}>
              <p>ימי ראשון עד חמישי: 09:00-21:00</p>
              <p>יום שישי: 09:00-16:00</p>
              <p>שבת: סגור</p>
              <p className="text-pink-400 mt-4">מומלץ לקבוע תור מראש</p>
            </div>
          </div>

          {/* שדה 3 - מידע על התהליך (ימין למטה) */}
          <div className="border-2 border-pink-500/60 rounded-lg p-4 md:p-6 bg-black/40" 
               style={{ boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)' }}>
            <h3 className="text-lg md:text-xl font-bold text-pink-400 text-center mb-4" style={{ fontFamily: 'Varela Round, sans-serif' }}>
              מידע חשוב
            </h3>
            <ul className="space-y-2 text-xs md:text-sm text-gray-200" style={{ fontFamily: 'Varela Round, sans-serif' }}>
              <li>• התוצאה מופיעה תוך 4-6 שעות</li>
              <li>• נמשך עד 7-10 ימים</li>
              <li>• מומלץ להימנע ממקלחת 8 שעות</li>
              <li>• טבעי ובטוח לחלוטין</li>
              <li>• ללא חשיפה לקרינת UV</li>
            </ul>
          </div>

          {/* שדה 4 - לוח זמינות (שמאל למטה) */}
          <div className="border-2 border-pink-500/60 rounded-lg p-4 md:p-6 bg-black/40" 
               style={{ boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)' }}>
            <h3 className="text-lg md:text-xl font-bold text-pink-400 text-center mb-4" style={{ fontFamily: 'Varela Round, sans-serif' }}>
              הזמן תור
            </h3>
            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
              {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28].map((day) => (
                <button 
                  key={day}
                  className="aspect-square flex items-center justify-center text-xs md:text-sm border border-pink-500/40 rounded hover:bg-pink-500/20 transition-colors"
                  data-testid={`button-day-${day}`}
                >
                  {day}
                </button>
              ))}
            </div>
            <p className="text-xs text-center text-gray-400">לחץ על התאריך הרצוי</p>
          </div>

        </div>

      </div>
    </div>
  );
}
