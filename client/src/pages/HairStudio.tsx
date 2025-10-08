import Logo from '@/components/Logo';
import { Calendar, Scissors, Sparkles, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function HairStudio() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const services = {
    cosmetics: [
      { name: "קוסמטיקה", price: "₪100-250" },
      { name: "קוסמטיקה + פלאנבר", price: "₪250-350" },
      { name: "קוסמטיקה בד גזה", price: "₪120-180" },
      { name: "קוסמטיקה בד גזה + עיסוי כף רגל", price: "₪150-200" },
      { name: "קוסמטיקה גרירקט", price: "₪100-120" }
    ],
    coloring: [
      { name: "צביעות ועיצוב", price: "" },
      { name: "צבע ריח", price: "₪250-350" },
      { name: "צבע חצי", price: "₪400-600" },
      { name: "צבע / צביעה/ צבע עדין רק", price: "₪450-900" },
      { name: "כימי", price: "₪600-950" },
      { name: "פלסטיקה בלבד / תוספות/ מכשירה", price: "₪150-200" },
      { name: "פירטה סינציפיט ופיר קומרלבר אונל", price: "₪400-1,200" }
    ],
    manicure: [
      { name: "מניקור / פדיקור", price: "" },
      { name: "צבע שיניים", price: "₪100-150" },
      { name: "ציפורניים / בניקור", price: "₪150-200" },
      { name: "מבנה קלאסיקה + צבע ג׳ל ריף", price: "₪100-180" },
      { name: "תיקון / חיזוק / פרחים", price: "₪1,500-3,800" }
    ]
  };

  const profiles = [
    { handle: "tanandco_hair", url: "https://instagram.com/tanandco_hair", name: "Tan & Co Hair" },
    { handle: "stylist_one", url: "https://instagram.com/stylist_one", name: "Stylist One" },
    { handle: "stylist_two", url: "https://instagram.com/stylist_two", name: "Stylist Two" },
  ];

  return (
    <section dir="rtl" className="w-full min-h-screen bg-black text-white">
      {/* LOGO HEADER */}
      <div className="absolute top-4 right-6 z-10">
        <Logo size="small" showGlow={true} showUnderline={false} />
      </div>

      {/* HERO */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden style={{background: "linear-gradient(135deg, rgba(156,70,149,0.08) 0%, rgba(209,47,198,0.05) 50%, rgba(156,70,149,0.08) 100%)"}}>
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pt-6 pb-8 lg:pt-8 lg:pb-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              היופי החדש מתחיל כאן.
            </h1>
            <p className="mt-5 text-lg text-white/80 leading-8">
              טאן אנד קו מובילה בגאווה את <span className="text-[#d12fc6] font-semibold" style={{textShadow: "0 0 20px #d12fc6, 0 0 40px #d12fc6"}}>המהפכה הבאה</span> של תעשיית היופי עם <span className="text-[#d12fc6] font-semibold" style={{textShadow: "0 0 20px #d12fc6, 0 0 40px #d12fc6"}}>המודל ההיברידי־אוטונומי</span> הראשון מסוגו: שירותים בטכנולוגיה פורצת דרך, באוטומציה מלאה, 24/7 – וללא תלות בכוח אדם.
            </p>
            <p className="mt-5 text-lg text-white/80 leading-8">
              אבל בתוך כל החדשנות תמיד נשאר המקום למה שלא ניתן להחליף באף אלגוריתם: <span className="text-[#d12fc6] font-semibold" style={{textShadow: "0 0 20px #d12fc6, 0 0 40px #d12fc6"}}>הקשר האנושי. המגע. הקרבה. החיוך. השיחה הטובה.</span> ולכן, תחת קורת גג אחת, אנחנו מאחדים את מקצועני היופי והשיער המובילים – כל אחד מהם <span className="text-[#d12fc6] font-semibold" style={{textShadow: "0 0 20px #d12fc6, 0 0 40px #d12fc6"}}>עצמאי, יוצר, אמן אמיתי</span>. יחד הם יוצרים מרחב חופשי, יצירתי ומלא השראה – שבו גם אתם יכולים פשוט… לנשום.<br />אז קחו רגע לעצמכם. שבו בנחת. ותנו לנו להוציא אתכם מכאן עם תחושה אחת ברורה: <span className="text-[#d12fc6] font-semibold" style={{textShadow: "0 0 20px #d12fc6, 0 0 40px #d12fc6"}}>שהגעתם בדיוק למקום הנכון.</span>
            </p>
          </div>
        </div>
      </div>

      {/* SERVICE CATEGORIES */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="group rounded-2xl border border-[#9C4695]/40 bg-gradient-to-br from-[#9C4695]/20 to-transparent p-8 text-center hover:border-[#d12fc6] hover:shadow-[0_0_30px_rgba(209,47,198,0.3)] transition-all duration-300 cursor-pointer" data-testid="category-extensions">
            <div className="flex justify-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#d12fc6] group-hover:shadow-[0_0_10px_rgba(209,47,198,0.8)] transition-all"></div>
              <div className="w-3 h-3 rounded-full bg-[#d12fc6] group-hover:shadow-[0_0_10px_rgba(209,47,198,0.8)] transition-all"></div>
              <div className="w-3 h-3 rounded-full bg-[#d12fc6] group-hover:shadow-[0_0_10px_rgba(209,47,198,0.8)] transition-all"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-[#d12fc6] transition-colors">תוספות שיער</h3>
            <p className="text-base text-white/60">ותסרוקות</p>
          </div>
          <div className="group rounded-2xl border border-[#9C4695]/40 bg-gradient-to-br from-[#9C4695]/20 to-transparent p-8 text-center hover:border-[#d12fc6] hover:shadow-[0_0_30px_rgba(209,47,198,0.3)] transition-all duration-300 cursor-pointer" data-testid="category-bridal">
            <div className="flex justify-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#d12fc6] group-hover:shadow-[0_0_10px_rgba(209,47,198,0.8)] transition-all"></div>
              <div className="w-3 h-3 rounded-full bg-[#d12fc6] group-hover:shadow-[0_0_10px_rgba(209,47,198,0.8)] transition-all"></div>
              <div className="w-3 h-3 rounded-full bg-[#d12fc6] group-hover:shadow-[0_0_10px_rgba(209,47,198,0.8)] transition-all"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-[#d12fc6] transition-colors">תסרוקות כלה</h3>
            <p className="text-base text-white/60">וליווי</p>
          </div>
          <div className="group rounded-2xl border border-[#9C4695]/40 bg-gradient-to-br from-[#9C4695]/20 to-transparent p-8 text-center hover:border-[#d12fc6] hover:shadow-[0_0_30px_rgba(209,47,198,0.3)] transition-all duration-300 cursor-pointer" data-testid="category-color">
            <div className="flex justify-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#d12fc6] group-hover:shadow-[0_0_10px_rgba(209,47,198,0.8)] transition-all"></div>
              <div className="w-3 h-3 rounded-full bg-[#d12fc6] group-hover:shadow-[0_0_10px_rgba(209,47,198,0.8)] transition-all"></div>
              <div className="w-3 h-3 rounded-full bg-[#d12fc6] group-hover:shadow-[0_0_10px_rgba(209,47,198,0.8)] transition-all"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-[#d12fc6] transition-colors">גוונים</h3>
            <p className="text-base text-white/60">ובליאג'</p>
          </div>
          <div className="group rounded-2xl border border-[#9C4695]/40 bg-gradient-to-br from-[#9C4695]/20 to-transparent p-8 text-center hover:border-[#d12fc6] hover:shadow-[0_0_30px_rgba(209,47,198,0.3)] transition-all duration-300 cursor-pointer" data-testid="category-treatments">
            <div className="flex justify-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#d12fc6] group-hover:shadow-[0_0_10px_rgba(209,47,198,0.8)] transition-all"></div>
              <div className="w-3 h-3 rounded-full bg-[#d12fc6] group-hover:shadow-[0_0_10px_rgba(209,47,198,0.8)] transition-all"></div>
              <div className="w-3 h-3 rounded-full bg-[#d12fc6] group-hover:shadow-[0_0_10px_rgba(209,47,198,0.8)] transition-all"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-[#d12fc6] transition-colors">כל סוגי ההחלקות</h3>
            <p className="text-base text-white/60">וטיפולים משקמים</p>
          </div>
        </div>
      </div>

      {/* PRICING SECTION */}
      <div id="pricing" className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">מחירון טאן אנד קו – חדר מספרה</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Cosmetics */}
          <div className="rounded-2xl border border-[#9C4695]/40 bg-gradient-to-br from-[#9C4695]/10 to-transparent p-6" data-testid="pricing-cosmetics">
            <h3 className="text-xl font-semibold mb-6 text-center text-[#d12fc6]">קוסמטיקה</h3>
            <div className="space-y-3">
              {services.cosmetics.map((service, i) => (
                <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-white/10">
                  <span className="text-white/90">{service.name}</span>
                  <span className="text-[#d12fc6] font-semibold">{service.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coloring & Styling */}
          <div className="rounded-2xl border border-[#9C4695]/40 bg-gradient-to-br from-[#9C4695]/10 to-transparent p-6" data-testid="pricing-coloring">
            <h3 className="text-xl font-semibold mb-6 text-center text-[#d12fc6]">צביעות ועיצוב</h3>
            <div className="space-y-3">
              {services.coloring.map((service, i) => (
                <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-white/10">
                  <span className="text-white/90">{service.name}</span>
                  <span className="text-[#d12fc6] font-semibold">{service.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Manicure & Pedicure */}
          <div className="rounded-2xl border border-[#9C4695]/40 bg-gradient-to-br from-[#9C4695]/10 to-transparent p-6" data-testid="pricing-manicure">
            <h3 className="text-xl font-semibold mb-6 text-center text-[#d12fc6]">מניקור / פדיקור</h3>
            <div className="space-y-3">
              {services.manicure.map((service, i) => (
                <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-white/10">
                  <span className="text-white/90">{service.name}</span>
                  <span className="text-[#d12fc6] font-semibold">{service.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOOKING SECTION */}
      <div id="book" className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-2xl border border-[#9C4695]/40 bg-gradient-to-br from-[#9C4695]/10 to-transparent p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-[#d12fc6]" />
            <h2 className="text-2xl font-bold">קביעת תור</h2>
          </div>
          
          <p className="text-white/70 mb-8 leading-relaxed">
            מאוחר מאוד טאן אנד קו – חדר מספרה <br/>
            שני, חום, הום, לים יניה חמישי, לפיכך – מ-09:00 עד 22:00 | שבת – רצוי ליצור קשר מראש
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <button className="w-full rounded-xl bg-[#d12fc6] px-6 py-4 font-semibold hover:bg-[#d12fc6]/90 transition" data-testid="button-book-now">
                קבעו תור עכשיו
              </button>
              <button className="w-full rounded-xl border border-white/20 px-6 py-4 font-semibold hover:bg-white/5 transition" data-testid="button-contact">
                צרו קשר
              </button>
            </div>
            
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-center text-sm text-white/60 mb-3">October 2025</div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(day => (
                  <div key={day} className="text-white/40 font-semibold">{day}</div>
                ))}
                {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                  <button
                    key={day}
                    className="aspect-square rounded-lg hover:bg-[#d12fc6]/20 hover:text-[#d12fc6] transition text-white/70"
                    data-testid={`calendar-day-${day}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ARTISTS SECTION */}
      <div id="artists" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-3xl font-bold mb-4">עובדים חופשי, יוצרים יחד</h2>
        <p className="text-white/70 max-w-3xl mb-8">
          במתחם שלנו כל נותן/ת שירות הוא/היא עצמאי/ת ומשכיר/ה עמדה. אנחנו מספקים מעטפת מותגית וחוויית לקוח אחידה; הם מביאים את הכישרון והקשר האישי.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {profiles.map((p, i) => (
            <article key={i} className="group rounded-2xl border border-[#9C4695]/40 bg-gradient-to-br from-[#9C4695]/10 to-transparent p-5 hover:border-[#d12fc6] transition" data-testid={`profile-card-${i}`}>
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#e064d5]/15 to-transparent mb-4">
                <img
                  src={`https://dummyimage.com/800x600/0b0b0b/ffffff&text=@${p.handle}`}
                  alt={`${p.name}`}
                  className="h-full w-full object-cover opacity-90 group-hover:scale-105 transition"
                  loading="lazy"
                />
              </div>

              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <span className="text-xs rounded-full border border-white/15 px-2 py-1 text-white/70">עצמאי/ת</span>
              </div>
              <p className="text-sm text-white/60 mb-4">@{p.handle}</p>
              
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#d12fc6] text-white px-4 py-2 text-sm font-semibold hover:bg-[#d12fc6]/90 transition w-full justify-center"
                data-testid={`button-instagram-${i}`}
              >
                עקבו באינסטגרם
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
