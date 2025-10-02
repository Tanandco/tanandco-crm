import Logo from '@/components/Logo';
import ServiceCard from '@/components/ServiceCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sun, Droplets, Scissors, Palette, Store } from 'lucide-react';
import { useLocation } from 'wouter';
import Alin from '@/components/Alin';

export default function SelfService() {
  const [, navigate] = useLocation();

  const services = [
    { 
      title: 'מיטות שיזוף', 
      icon: <Sun size={40} className="text-pink-400 group-hover:text-pink-300 transition-colors duration-300" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'sun-beds' 
    },
    { 
      title: 'שיזוף בהתזה', 
      icon: <Droplets size={40} className="text-pink-400 group-hover:text-pink-300 transition-colors duration-300" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'spray-tan' 
    },
    { 
      title: 'מספרה', 
      icon: <Scissors size={40} className="text-pink-400 group-hover:text-pink-300 transition-colors duration-300" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'hair-salon' 
    },
    { 
      title: 'קוסמטיקה', 
      icon: <Palette size={40} className="text-pink-400 group-hover:text-pink-300 transition-colors duration-300" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'cosmetics' 
    },
    { 
      title: 'החנות שלכם', 
      icon: <Store size={40} className="text-pink-400 group-hover:text-pink-300 transition-colors duration-300" style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }} />, 
      id: 'your-store' 
    },
    { 
      title: 'AI TAN', 
      icon: <Alin size={110} />, 
      id: 'ai-tan' 
    },
  ];

  const handleServiceClick = (serviceId: string) => {
    console.log(`Service selected: ${serviceId}`);
    
    if (serviceId === 'ai-tan') {
      window.open('https://preview--radiant-booth-studio.lovable.app/', '_blank');
    } else if (serviceId === 'your-store') {
      navigate('/shop');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 overflow-auto" dir="rtl">
      {/* Header with Back Button */}
      <div className="absolute top-4 right-4 z-[100]">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="border-pink-500/50 hover:border-pink-500 gap-2"
          data-testid="button-back"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה
        </Button>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Logo */}
        <div className="mb-8">
          <Logo size="medium" showGlow={true} showUnderline={true} />
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-12 space-y-6">
          {/* Back to Self Service */}
          <p 
            className="text-lg text-pink-200/70 font-medium"
            data-testid="subtitle-back-to-service"
          >
            חזרה לשירות עצמי
          </p>

          {/* Main Title */}
          <h1 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.4))'
            }}
            data-testid="title-welcome"
          >
            ברוכים הבאים לעולם המחר של תעשיית השיזוף
          </h1>

          {/* Subtitle */}
          <p 
            className="text-xl md:text-2xl text-pink-300/90 font-semibold"
            data-testid="subtitle-hybrid-model"
          >
            גאים להוביל את המודל ההייברידי של עולם השיזוף
          </p>
        </div>

        {/* Hybrid Model Explanation */}
        <div className="mb-12 max-w-3xl mx-auto">
          <div 
            className="p-6 rounded-lg bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-500/30"
            data-testid="hybrid-model-explanation"
          >
            <p className="text-lg md:text-xl text-pink-100/90 leading-relaxed text-center mb-4">
              אנחנו מציעים לכם את החופש לבחור: תוכלו להירשם באופן עצמאי במהלך שעות הפעילות, כאשר צוות מקצועי נמצא לצידכם לסייע בכל שאלה או צורך. 
            </p>
            <p className="text-lg text-pink-200/80 leading-relaxed text-center">
              לחלופין, תוכלו לקבל שירות מלא ומקיף מאיש צוות מנוסה שילווה אתכם בכל שלב.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {/* Right Column */}
          <div className="space-y-4">
            <FeatureItem 
              text="ללא צורך בתיאום מראש או קביעת תורים"
              testId="feature-no-appointment"
            />
            <FeatureItem 
              text="כניסה עצמאית בכל שעה של היום ובכל שעה של הלילה"
              testId="feature-24-7-access"
            />
            <FeatureItem 
              text="מיטות השיזוף זמינות 24/7 ללקוחות הבוטיק"
              testId="feature-boutique-access"
            />
            <FeatureItem 
              text="הכניסה למתחם השיזוף לאחר שעות הפעילות כרוך בהרשמה למערכת זיהוי פנים מתקדמת"
              testId="feature-face-recognition"
            />
            <FeatureItem 
              text="צוות מקצועי ומנוסה שיעניק לכם שירות ברמה הגבוהה ביותר"
              testId="feature-professional-staff"
            />
          </div>

          {/* Left Column */}
          <div className="space-y-4">
            <FeatureItem 
              text="שעות פעילות: 10:00-19:00, ימי שישי 10:00-14:00, ימי שבת סגור"
              highlight={true}
              testId="feature-business-hours"
            />
            <FeatureItem 
              text="*בשירות עצמי לאחר שעות הפעילות"
              highlight={true}
              testId="feature-after-hours"
            />
            <FeatureItem 
              text="שירות לקוחות זמין 24/7"
              testId="feature-customer-service"
            />
            <FeatureItem 
              text="סביבה נקיה, בטוחה ומקצועית"
              testId="feature-safe-environment"
            />
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-8">
          <h2 
            className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(236, 72, 153, 0.3))'
            }}
            data-testid="title-choose-service"
          >
            בחרו את השירות המועדף עליכם
          </h2>

          {/* Services Grid */}
          <div 
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 justify-items-center max-w-3xl mx-auto"
            data-testid="services-grid"
          >
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                icon={service.icon}
                onClick={() => handleServiceClick(service.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature Item Component
interface FeatureItemProps {
  text: string;
  highlight?: boolean;
  testId: string;
}

function FeatureItem({ text, highlight = false, testId }: FeatureItemProps) {
  return (
    <div 
      className={`
        flex items-start gap-3 p-4 rounded-lg
        ${highlight 
          ? 'bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-500/30' 
          : 'bg-slate-900/30'
        }
      `}
      data-testid={testId}
    >
      <div className="mt-1 flex-shrink-0">
        <div 
          className="w-2 h-2 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #ec4899, #a855f7)',
            boxShadow: '0 0 10px rgba(236, 72, 153, 0.6)'
          }}
        />
      </div>
      <p 
        className={`
          text-base md:text-lg leading-relaxed
          ${highlight ? 'text-pink-300 font-semibold' : 'text-pink-100/90'}
        `}
      >
        {text}
      </p>
    </div>
  );
}
