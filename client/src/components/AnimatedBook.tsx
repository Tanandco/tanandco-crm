import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface BookPage {
  title: string;
  content: string[];
}

const pages: BookPage[] = [
  {
    title: "שיזוף בטוח ומדורג",
    content: [
      "אתם רוצים לקבל צבע שלא חלמתם עליו? לא בא לכם להישרף או לשרוף סתם כניסות נכון?",
      "תקדישו 30 שניות על השעון ותקראו את מה שיש לי להגיד, אתם תודו לי בסוף הדרך, שהיא תהיה הרבה יותר קצרה אם לא תקראו.",
      "מיטות שיזוף זו החלופה האולטימטיבית לשמש, לטוב ולרע, וכל דבר שמגזימים יותר מידי לא בריא, וזה בהחלט לא פוסח על עולם השיזוף.",
      "אז כמה טיפים חשובים ואיזו תוכנית קטנה וצאו לדרך בצורה נכונה ואחראית"
    ]
  },
  {
    title: "שלב ראשון – יצירת בסיס לגוון",
    content: [
      "השיזוף הראשון הוא הבסיס לכל התהליך. גם אם התוצאה הראשונית הינה עדינה, היא יוצרת את הבסיס עליו יבנה הגוון המושלם, ולכן בשיזוף הראשון, בהתאם לסוג העור, מומלץ להתחיל במעט דקות:",
      "• עור בהיר מאוד – 7–8 דקות בלבד, מומלץ ברונזר",
      "• עור בינוני – 8–10 דקות, מומלץ ברונזר",
      "• עור כהה – 10–12 דקות, מומלץ ברונזר",
      "",
      "• השתזפו כל 48 שעות עד השגת הגוון הרצוי (5–10 פעמים)",
      "  משיזוף לשיזוף תעלו עוד דקה",
      "• בהחלט מומלץ להתמרח בברונזר איכותי לפני השיזוף",
      "",
      "שלב שני – תחזוקה",
      "לאחר השגת הגוון הרצוי:",
      "• מומלץ להגיע לשיזוף פעם ב 7-14 ימים במטרה לתחזק את הצבע הקיים",
      "• להתמרח בקרם גוף עשיר",
      "• עור יבש אינו מחזיק את הגוון הרבה זמן ולכן חשוב לשתות הרבה מים"
    ]
  },
  {
    title: "סקשיין שאלות ותשובות נפוצות",
    content: [
      "יש לכם שאלות? אנחנו כאן בשבילכם!",
      "",
      "המערכת שלנו מאפשרת לכם לקבל מענה מהיר ומקצועי לכל שאלה.",
      "",
      "בחרו את הפעולה המתאימה למטה ונתחיל את המסע שלכם לשיזוף מושלם! ☀️"
    ]
  }
];

export default function AnimatedBook() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // Auto-advance pages
  useEffect(() => {
    if (currentPage < pages.length - 1) {
      const timer = setTimeout(() => {
        nextPage();
      }, 8000); // 8 seconds per page
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < pages.length - 1 && !isFlipping) {
      setIsFlipping(true);
      setCurrentPage(currentPage + 1);
      setTimeout(() => {
        setIsFlipping(false);
      }, 600);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setCurrentPage(currentPage - 1);
      setTimeout(() => {
        setIsFlipping(false);
      }, 600);
    }
  };

  const goToPage = (pageIndex: number) => {
    if (!isFlipping && pageIndex !== currentPage && pageIndex >= 0 && pageIndex < pages.length) {
      setIsFlipping(true);
      setCurrentPage(pageIndex);
      setTimeout(() => {
        setIsFlipping(false);
      }, 600);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-8" dir="rtl">
      <style>{`
        @keyframes bookOpen {
          from {
            transform: perspective(2000px) rotateY(-25deg);
            opacity: 0;
          }
          to {
            transform: perspective(2000px) rotateY(0deg);
            opacity: 1;
          }
        }

        @keyframes pageFlipRight {
          0% {
            transform: perspective(2000px) rotateY(0deg);
          }
          100% {
            transform: perspective(2000px) rotateY(-180deg);
          }
        }

        @keyframes pageFlipLeft {
          0% {
            transform: perspective(2000px) rotateY(180deg);
          }
          100% {
            transform: perspective(2000px) rotateY(0deg);
          }
        }

        .book-container {
          perspective: 2000px;
          animation: bookOpen 1s ease-out;
        }

        .book {
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.6s ease;
        }

        .page-flip-right {
          animation: pageFlipRight 0.6s ease-in-out;
        }

        .page-flip-left {
          animation: pageFlipLeft 0.6s ease-in-out;
        }

        .book-page {
          background: linear-gradient(to bottom, #fef9f3 0%, #fef5e7 100%);
          border: 2px solid #d4a574;
          box-shadow: 
            inset 0 0 30px rgba(212, 165, 116, 0.1),
            5px 5px 20px rgba(0, 0, 0, 0.3);
        }

        .book-spine {
          background: linear-gradient(to right, #8b4513 0%, #a0522d 50%, #8b4513 100%);
          box-shadow: inset -2px 0 5px rgba(0, 0, 0, 0.5);
        }

        .page-texture {
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(212, 165, 116, 0.03) 2px,
              rgba(212, 165, 116, 0.03) 4px
            );
        }
      `}</style>

      <div className="book-container">
        <div className={`book ${isFlipping ? 'page-flip-right' : ''}`}>
          {/* Book Pages */}
          <div className="relative">
            {/* Left Page */}
            <div className="book-page page-texture rounded-l-lg p-8 min-h-[400px] relative">
              <div className="absolute top-0 left-0 w-4 h-full book-spine" />
              
              <div className="pr-6">
                <h2 
                  className="text-2xl font-bold mb-6 text-amber-900"
                  style={{
                    textShadow: '1px 1px 2px rgba(139, 69, 19, 0.3)'
                  }}
                  data-testid="book-page-title"
                >
                  {pages[currentPage].title}
                </h2>

                <div className="space-y-3 text-amber-950 leading-relaxed">
                  {pages[currentPage].content.map((paragraph, idx) => (
                    <p 
                      key={idx} 
                      className={`${paragraph.startsWith('•') ? 'pr-4' : ''} ${paragraph === '' ? 'h-2' : ''}`}
                      data-testid={`book-paragraph-${idx}`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Page Number - Left */}
              <div className="absolute bottom-4 left-8 text-sm text-pink-700">
                עמוד {currentPage + 1}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 0 || isFlipping}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            transition-all duration-300
            ${currentPage === 0 || isFlipping 
              ? 'opacity-30 cursor-not-allowed' 
              : 'hover-elevate active-elevate-2 bg-amber-800/20 border border-pink-600/50 text-amber-200'
            }
          `}
          data-testid="button-prev-page"
        >
          <ChevronRight className="w-5 h-5" />
          <span>עמוד קודם</span>
        </button>

        {/* Page Indicators */}
        <div className="flex gap-2">
          {pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx)}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${idx === currentPage 
                  ? 'bg-pink-500 w-8' 
                  : 'bg-pink-500/30 hover:bg-pink-500/50'
                }
              `}
              data-testid={`page-indicator-${idx}`}
            />
          ))}
        </div>

        <button
          onClick={nextPage}
          disabled={currentPage === pages.length - 1 || isFlipping}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            transition-all duration-300
            ${currentPage === pages.length - 1 || isFlipping 
              ? 'opacity-30 cursor-not-allowed' 
              : 'hover-elevate active-elevate-2 bg-amber-800/20 border border-pink-600/50 text-amber-200'
            }
          `}
          data-testid="button-next-page"
        >
          <span>עמוד הבא</span>
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
