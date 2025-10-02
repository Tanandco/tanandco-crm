import { useState } from 'react';
import { useLocation } from 'wouter';
import { CheckCircle, Circle, ArrowRight, CreditCard, FileText, Camera, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function Onboarding() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Get customer ID from URL params if exists
  const urlParams = new URLSearchParams(window.location.search);
  const existingCustomerId = urlParams.get('customerId');
  
  const [currentStep, setCurrentStep] = useState<number>(existingCustomerId ? 2 : 1);
  const [customerId, setCustomerId] = useState<string>(existingCustomerId || '');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');

  // Mutation to create customer
  const createCustomerMutation = useMutation({
    mutationFn: async (customerData: { fullName: string; phone: string; dateOfBirth?: string }) => {
      const response = await apiRequest('POST', '/api/customers', customerData);
      const data = await response.json();
      if (!data.success || !data.data?.id) {
        throw new Error(data.error || 'Failed to create customer');
      }
      return data.data;
    },
    onSuccess: (data) => {
      setCustomerId(data.id);
      toast({
        title: "נרשמת בהצלחה!",
        description: "מעבר לטופס בריאות...",
      });
      setCurrentStep(2);
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה",
        description: error.response?.data?.error || "נכשל בשמירת הפרטים. נסה שוב.",
        variant: "destructive",
      });
    },
  });

  const steps = [
    {
      id: 1,
      title: 'רכישת מנוי',
      description: 'בחר את המנוי המתאים לך ושלם באמצעות Cardcom',
      icon: CreditCard,
      color: 'from-pink-500 to-purple-500',
      completed: currentStep > 1,
    },
    {
      id: 2,
      title: 'טופס בריאות',
      description: 'מלא הצהרת בריאות וחתום דיגיטלית',
      icon: FileText,
      color: 'from-purple-500 to-blue-500',
      completed: currentStep > 2,
    },
    {
      id: 3,
      title: 'רישום זיהוי פנים',
      description: 'העלה תמונה ברורה לרישום במערכת הזיהוי',
      icon: Camera,
      color: 'from-blue-500 to-cyan-500',
      completed: currentStep > 3,
    },
    {
      id: 4,
      title: 'סיום והפעלה',
      description: 'הכל מוכן! תוכל להיכנס באמצעות זיהוי פנים',
      icon: CheckCircle,
      color: 'from-cyan-500 to-green-500',
      completed: currentStep > 4,
    },
  ];

  const handleStepAction = () => {
    if (currentStep === 1) {
      // Validate all required fields
      if (!customerName || !customerPhone || !dateOfBirth) {
        toast({
          title: "שגיאה",
          description: "נא למלא את כל השדות הנדרשים",
          variant: "destructive",
        });
        return;
      }

      // Validate WhatsApp phone number format
      const phoneRegex = /^(972|05)\d{8,9}$|^\+?972\d{8,9}$|^05\d{1}-?\d{7}$/;
      if (!phoneRegex.test(customerPhone)) {
        toast({
          title: "שגיאה",
          description: "מספר הטלפון חייב להיות תקין עבור WhatsApp (פורמט: 972XXXXXXXXX או 05X-XXXXXXX)",
          variant: "destructive",
        });
        return;
      }

      // Validate age (16-120) - account for month/day
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred this year yet
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 16 || age > 120) {
        toast({
          title: "שגיאה",
          description: "גיל חייב להיות בין 16 ל-120",
          variant: "destructive",
        });
        return;
      }
      
      // Create customer in database
      createCustomerMutation.mutate({
        fullName: customerName,
        phone: customerPhone,
        dateOfBirth: dateOfBirth,
      });
    } else if (currentStep === 2) {
      // Navigate to health form
      if (!customerId) {
        toast({
          title: "שגיאה",
          description: "לא נמצא מזהה לקוח. אנא צור קשר עם התמיכה.",
          variant: "destructive",
        });
        return;
      }
      navigate(`/health-form?customerId=${customerId}`);
    } else if (currentStep === 3) {
      // Navigate to face registration
      if (!customerId) {
        toast({
          title: "שגיאה",
          description: "לא נמצא מזהה לקוח. אנא צור קשר עם התמיכה.",
          variant: "destructive",
        });
        return;
      }
      navigate(`/face-registration?customerId=${customerId}`);
    } else if (currentStep === 4) {
      // Done! Navigate home
      toast({
        title: "ההרשמה הושלמה! 🎉",
        description: "תוכל עכשיו להיכנס באמצעות זיהוי פנים",
      });
      setTimeout(() => navigate('/'), 2000);
    }
  };

  const handleWhatsAppStart = () => {
    toast({
      title: "פתיחת WhatsApp",
      description: "מועבר לשירות הלקוחות שלנו...",
    });
    // Open WhatsApp (placeholder - needs actual WhatsApp link)
    window.open('https://wa.me/972XXXXXXXXX?text=שלום, אני מעוניין/ת לרכוש מנוי', '_blank');
  };

  return (
    <PageLayout showBackButton={false} showHomeButton={true} showSettingsButton={true}>
      {/* Header */}
      <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            ברוכים הבאים ל-Tan & Co
          </h1>
          <p className="text-xl text-gray-300">
            תהליך הרשמה מהיר ופשוט בשלושה שלבים בלבד
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between gap-4 flex-wrap relative">
            {/* Progress Line */}
            <div className="absolute right-0 left-0 h-1 bg-gradient-to-l from-pink-500/20 to-purple-500/20 top-6 hidden md:block" />
            <div 
              className="absolute right-0 h-1 bg-gradient-to-l from-pink-500 to-purple-500 top-6 transition-all duration-500 hidden md:block"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = step.completed;

              return (
                <div
                  key={step.id}
                  className="relative flex flex-col items-center z-10"
                >
                  <div
                    className={`
                      w-14 h-14 rounded-full flex items-center justify-center mb-3
                      transition-all duration-300 border-2
                      ${isActive
                        ? `bg-gradient-to-br ${step.color} border-white shadow-lg shadow-pink-500/50 scale-110`
                        : isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-400'
                        : 'bg-slate-800 border-slate-600'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-7 h-7 text-white" />
                    ) : (
                      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    )}
                  </div>
                  <div className="text-center">
                    <p className={`font-bold text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Card */}
        <Card className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-2"
              style={{
                borderColor: 'rgba(236, 72, 153, 0.6)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
              }}>
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              {steps[currentStep - 1]?.title}
            </CardTitle>
            <CardDescription className="text-center text-lg">
              {steps[currentStep - 1]?.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Purchase */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="p-6 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30">
                  <h3 className="text-xl font-bold text-white mb-4">בחר אפשרות רכישה:</h3>
                  
                  {/* WhatsApp Option */}
                  <div className="mb-6">
                    <Button
                      onClick={handleWhatsAppStart}
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      data-testid="button-whatsapp-purchase"
                    >
                      <MessageCircle className="w-5 h-5 ml-2" />
                      רכישה דרך WhatsApp
                    </Button>
                    <p className="text-sm text-gray-400 mt-2 text-center">
                      שירות אישי עם מענה מהיר
                    </p>
                  </div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-slate-900 text-gray-400">או</span>
                    </div>
                  </div>

                  {/* Manual Entry */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-white font-medium block mb-2">שם מלא:</label>
                      <Input
                        type="text"
                        placeholder="שם פרטי ושם משפחה"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="text-lg bg-slate-800 border-pink-500/30"
                        data-testid="input-name"
                      />
                    </div>
                    
                    <div>
                      <label className="text-white font-medium block mb-2">מספר טלפון (WhatsApp):</label>
                      <Input
                        type="tel"
                        placeholder="972XXXXXXXXX או 05X-XXXXXXX"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="text-lg bg-slate-800 border-pink-500/30"
                        data-testid="input-phone"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        הזן מספר תקין עבור WhatsApp (פורמט: 972XXXXXXXXX)
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-white font-medium block mb-2">תאריך לידה:</label>
                      <Input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 120)).toISOString().split('T')[0]}
                        className="text-lg bg-slate-800 border-pink-500/30"
                        data-testid="input-date-of-birth"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        גיל מינימלי: 16 שנים
                      </p>
                    </div>
                    
                    <Button
                      onClick={handleStepAction}
                      size="lg"
                      className="w-full"
                      data-testid="button-continue-shop"
                      disabled={createCustomerMutation.isPending}
                    >
                      {createCustomerMutation.isPending ? 'שומר...' : 'המשך לבחירת מנוי'}
                      <ArrowRight className="w-5 h-5 mr-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Health Form */}
            {currentStep === 2 && (
              <div className="text-center space-y-6">
                <div className="p-6 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <FileText className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">
                    טופס הצהרת בריאות
                  </h3>
                  <p className="text-gray-300 mb-4">
                    נדרשת הצהרה רפואית קצרה לפני תחילת השימוש בשירותי השיזוף
                  </p>
                  <ul className="text-right text-sm text-gray-400 space-y-2 mb-6">
                    <li>✓ בחירת סוג עור</li>
                    <li>✓ הצהרות רפואיות</li>
                    <li>✓ חתימה דיגיטלית</li>
                  </ul>
                  <Button
                    onClick={handleStepAction}
                    size="lg"
                    className="w-full"
                    data-testid="button-health-form"
                  >
                    מעבר לטופס בריאות
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Face Registration */}
            {currentStep === 3 && (
              <div className="text-center space-y-6">
                <div className="p-6 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <Camera className="w-20 h-20 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">
                    רישום זיהוי פנים
                  </h3>
                  <p className="text-gray-300 mb-4">
                    העלה תמונה ברורה של הפנים שלך כדי שנוכל לזהות אותך בכניסה
                  </p>
                  <ul className="text-right text-sm text-gray-400 space-y-2 mb-6">
                    <li>✓ צלם תמונה או העלה קובץ</li>
                    <li>✓ וודא שהתמונה ברורה ומוארת</li>
                    <li>✓ הפנים פונות למצלמה</li>
                  </ul>
                  <Button
                    onClick={handleStepAction}
                    size="lg"
                    className="w-full"
                    data-testid="button-face-registration"
                  >
                    רישום זיהוי פנים
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Complete */}
            {currentStep === 4 && (
              <div className="text-center space-y-6 py-8">
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto animate-pulse" />
                <h3 className="text-3xl font-bold text-green-400">
                  ההרשמה הושלמה בהצלחה!
                </h3>
                <p className="text-xl text-gray-300">
                  כל הפרטים נקלטו במערכת 🎉
                </p>
                <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-lg text-white mb-4">
                    מה הלאה?
                  </p>
                  <ul className="text-right text-gray-300 space-y-2">
                    <li>✓ תוכל להיכנס למכון באמצעות זיהוי פנים</li>
                    <li>✓ הדלת תיפתח אוטומטית לאחר הזיהוי</li>
                    <li>✓ סשנים ינוכו מהמנוי שלך אוטומטית</li>
                  </ul>
                </div>
                <Button
                  onClick={handleStepAction}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  data-testid="button-finish"
                >
                  סיום ומעבר לדף הבית
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </div>
            )}

            {/* Step Navigation (for testing/demo) */}
            <div className="flex gap-4 mt-6 pt-6 border-t border-gray-700">
              {currentStep > 1 && (
                <Button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  variant="outline"
                  data-testid="button-prev-step"
                >
                  שלב קודם
                </Button>
              )}
              {currentStep >= 2 && currentStep < 4 && customerId && (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  variant="outline"
                  className="mr-auto"
                  data-testid="button-next-step"
                >
                  {currentStep === 3 ? 'סיום (דמו)' : 'דלג לשלב הבא (דמו)'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            צריך עזרה?{' '}
            <a
              href="/chat"
              className="text-pink-400 hover:text-pink-300 underline"
              data-testid="link-help"
            >
              צור קשר איתנו ב-WhatsApp
            </a>
          </p>
        </div>
    </PageLayout>
  );
}
