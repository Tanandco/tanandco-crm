import { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import sprayMachineImage from '@assets/שירות עצמי 247_1760114693480.png';

interface SprayTanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SprayTanDialog({ open, onOpenChange }: SprayTanDialogProps) {
  if (!open) return null;

  const packages = [
    {
      title: 'התזה בודד',
      price: '170',
      sessions: 'ש״ח',
      highlight: false
    },
    {
      title: '3 התזות',
      price: '450',
      sessions: 'ש״ח',
      highlight: true,
      badge: 'פופולרי'
    },
    {
      title: '6 התזות',
      price: '800',
      sessions: 'ש״ח',
      highlight: false,
      badge: 'חיסכון'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Back Button */}
      <div className="absolute top-4 right-4 z-30">
        <Button 
          onClick={() => onOpenChange(false)} 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 border-pink-500/60 hover:border-pink-500 text-white bg-black/40 backdrop-blur-sm"
          data-testid="button-back-spray-tan"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-center">
          
          {/* Right Side - Image */}
          <div className="hidden lg:flex items-center justify-center order-2 lg:order-2">
            <div className="relative">
              <img 
                src={sprayMachineImage} 
                alt="Spray Tan Machine" 
                className="w-full max-w-md object-contain drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(236, 72, 153, 0.3))'
                }}
              />
            </div>
          </div>

          {/* Left Side - Content */}
          <div className="flex flex-col justify-center space-y-8 order-1 lg:order-1">
            
            {/* Title */}
            <div className="text-right space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white font-hebrew leading-tight">
                שירות עצמי של
                <span className="block text-pink-500 mt-1" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.6))' }}>
                  תעשיית השיזוף
                </span>
              </h1>
              <div className="w-32 h-1 bg-gradient-to-l from-pink-500 to-purple-500 mr-auto" 
                   style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' }} />
            </div>

            {/* Description */}
            <div className="text-right space-y-3">
              <p className="text-gray-300 text-base md:text-lg font-hebrew leading-relaxed">
                שיזוף בהתזה הוא שיטה מתקדמת ובטוחה המתבצעת באמצעות קומפרסור אויר המחובר לאקדח המפזר תמיסת שיזוף בחלקיקים דקיקים, מה שמקנה שיזוף אחיד ומושלם תוך 15 דקות בלבד.
              </p>
              <p className="text-gray-400 text-sm md:text-base font-hebrew leading-relaxed">
                תמיסת השיזוף מכילה <span className="text-pink-400 font-bold">DHA</span> - חומר טבעי המופק מקנה סוכר. במגע עם העור הוא יוצר גוון שזוף על ידי צביעת שכבת העור העליונה בלבד.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {packages.map((pkg, index) => (
                <button
                  key={index}
                  onClick={() => {
                    console.log('רכישה:', pkg.title, pkg.price);
                  }}
                  className={`
                    group relative
                    ${pkg.highlight 
                      ? 'bg-gradient-to-br from-pink-900/40 via-purple-900/30 to-black border-2 border-pink-500' 
                      : 'bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-pink-500/40'
                    }
                    rounded-lg p-4 md:p-6
                    hover-elevate active-elevate-2
                    transition-all duration-300
                  `}
                  style={{
                    boxShadow: pkg.highlight 
                      ? '0 0 30px rgba(236, 72, 153, 0.4)' 
                      : '0 4px 12px rgba(0, 0, 0, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 1)';
                    e.currentTarget.style.boxShadow = '0 0 35px rgba(236, 72, 153, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = pkg.highlight ? 'rgba(236, 72, 153, 1)' : 'rgba(236, 72, 153, 0.4)';
                    e.currentTarget.style.boxShadow = pkg.highlight ? '0 0 30px rgba(236, 72, 153, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.4)';
                  }}
                  data-testid={`package-${index}`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-bold z-10"
                         style={{ boxShadow: '0 0 15px rgba(236, 72, 153, 0.6)' }}>
                      {pkg.badge}
                    </div>
                  )}
                  
                  <div className="text-center space-y-1">
                    <h3 className="text-white font-bold text-sm md:text-base font-hebrew">
                      {pkg.title}
                    </h3>
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-pink-400 font-bold text-2xl md:text-3xl"
                         style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.6))' }}>
                        {pkg.price}
                      </p>
                      <p className="text-pink-400 text-xs md:text-sm font-hebrew">
                        {pkg.sessions}
                      </p>
                    </div>
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-radial from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </button>
              ))}
            </div>

            {/* Benefits List */}
            <div className="bg-gradient-to-br from-gray-900/60 via-black/50 to-gray-800/60 border border-pink-500/30 rounded-lg p-4 md:p-6">
              <ul className="text-right space-y-2 text-sm md:text-base text-gray-300 font-hebrew">
                <li className="flex items-start justify-end gap-2">
                  <span>ללא צורך בתיאום מראש או קביעת תורים</span>
                  <span className="text-pink-400 mt-0.5">•</span>
                </li>
                <li className="flex items-start justify-end gap-2">
                  <span>כניסה עצמאית בכל שעה של היום ובכל שעה של הלילה</span>
                  <span className="text-pink-400 mt-0.5">•</span>
                </li>
                <li className="flex items-start justify-end gap-2">
                  <span>מיטות השיזוף זמינות 24/7 ללקוחות הבוטיק</span>
                  <span className="text-pink-400 mt-0.5">•</span>
                </li>
                <li className="flex items-start justify-end gap-2">
                  <span>הכניסה למתחם השיזוף לאחר שעות הפעילות כרוך בהרשמה למערכת זיהוי פנים מתקדמת</span>
                  <span className="text-pink-400 mt-0.5">•</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
