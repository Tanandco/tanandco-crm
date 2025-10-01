import { useState } from 'react';
import { useLocation } from 'wouter';
import { CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function HealthForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Get customer ID from URL path
  const pathname = window.location.pathname;
  const customerId = pathname.split('/').pop() || null;

  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [healthDeclarations, setHealthDeclarations] = useState({
    noSkinConditions: false,
    noMedications: false,
    noPregnancy: false,
    understandsRisks: false,
  });

  const allChecked = agreedToTerms && 
    healthDeclarations.noSkinConditions &&
    healthDeclarations.noMedications &&
    healthDeclarations.noPregnancy &&
    healthDeclarations.understandsRisks;

  const handleSubmit = async () => {
    if (!allChecked || !customerId) return;
    
    setFormState('submitting');
    
    try {
      await fetch('/api/webhooks/jotform/health-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          declarations: healthDeclarations,
          agreedToTerms,
          timestamp: new Date().toISOString(),
        }),
      });

      setFormState('success');
      toast({
        title: "טופס נשלח בהצלחה! ✅",
        description: "תודה על השלמת הטופס",
      });
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error: any) {
      console.error('Health form submission error:', error);
      setFormState('error');
      toast({
        title: "שגיאה בשליחת הטופס",
        description: "אנא נסה שוב",
        variant: "destructive",
      });
    }
  };

  if (!customerId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6" dir="rtl">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              שגיאה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>לא נמצא מזהה לקוח. אנא פנה לתמיכה.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6" dir="rtl">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <FileText className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            הצהרת בריאות
          </h1>
          <p className="text-lg text-gray-300">
            אנא קרא בעיון וסמן את כל ההצהרות
          </p>
        </div>

        <Card className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-2"
              style={{
                borderColor: 'rgba(236, 72, 153, 0.6)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
              }}>
          <CardHeader>
            <CardTitle className="text-2xl text-center">טופס הצהרת בריאות</CardTitle>
            <CardDescription className="text-center">
              נדרשת הצהרה רפואית לפני תחילת השימוש בשירותי השיזוף
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {formState === 'success' ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-pulse" />
                <h3 className="text-2xl font-bold text-green-400">
                  הטופס נשלח בהצלחה!
                </h3>
                <p className="text-gray-300">
                  תודה על השלמת הצהרת הבריאות
                </p>
                <p className="text-sm text-gray-400">
                  מועבר לעמוד הבית...
                </p>
              </div>
            ) : (
              <>
                {/* Health Declarations */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <Checkbox
                      id="no-skin-conditions"
                      checked={healthDeclarations.noSkinConditions}
                      onCheckedChange={(checked) => 
                        setHealthDeclarations(prev => ({ ...prev, noSkinConditions: checked as boolean }))
                      }
                      data-testid="checkbox-skin-conditions"
                    />
                    <label
                      htmlFor="no-skin-conditions"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      אני מצהיר/ה כי אין לי מחלות עור פעילות, כוויות שמש, פצעים פתוחים או רגישות יתר לאור UV
                    </label>
                  </div>

                  <div className="flex items-start space-x-3 space-x-reverse">
                    <Checkbox
                      id="no-medications"
                      checked={healthDeclarations.noMedications}
                      onCheckedChange={(checked) => 
                        setHealthDeclarations(prev => ({ ...prev, noMedications: checked as boolean }))
                      }
                      data-testid="checkbox-medications"
                    />
                    <label
                      htmlFor="no-medications"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      אני מצהיר/ה כי אינני נוטל/ת תרופות המגבירות רגישות לשמש או לקרינת UV
                    </label>
                  </div>

                  <div className="flex items-start space-x-3 space-x-reverse">
                    <Checkbox
                      id="no-pregnancy"
                      checked={healthDeclarations.noPregnancy}
                      onCheckedChange={(checked) => 
                        setHealthDeclarations(prev => ({ ...prev, noPregnancy: checked as boolean }))
                      }
                      data-testid="checkbox-pregnancy"
                    />
                    <label
                      htmlFor="no-pregnancy"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      אני מצהיר/ה כי אינני בהריון ולא מניקה
                    </label>
                  </div>

                  <div className="flex items-start space-x-3 space-x-reverse">
                    <Checkbox
                      id="understands-risks"
                      checked={healthDeclarations.understandsRisks}
                      onCheckedChange={(checked) => 
                        setHealthDeclarations(prev => ({ ...prev, understandsRisks: checked as boolean }))
                      }
                      data-testid="checkbox-risks"
                    />
                    <label
                      htmlFor="understands-risks"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      אני מבין/ה את הסיכונים הכרוכים בשיזוף מלאכותי ומתחייב/ת לפעול על פי ההוראות והמגבלות
                    </label>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="border-t border-gray-700 pt-6">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      data-testid="checkbox-terms"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer font-bold text-pink-400"
                    >
                      אני מאשר/ת כי קראתי והבנתי את כל ההצהרות לעיל וכי המידע שמסרתי נכון ומדויק
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!allChecked || formState === 'submitting'}
                    data-testid="button-submit"
                  >
                    {formState === 'submitting' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                        שולח...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 ml-2" />
                        שלח טופס
                      </>
                    )}
                  </Button>
                </div>

                {/* Important Notice */}
                <div className="mt-6 p-4 bg-orange-900/30 border border-orange-500/50 rounded-lg">
                  <h4 className="font-bold text-orange-300 mb-2">⚠️ חשוב לדעת:</h4>
                  <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                    <li>חשיפה מוגזמת לקרינת UV עלולה לגרום נזק לעור ולעיניים</li>
                    <li>יש לעטות משקפי מגן מיוחדים במהלך השיזוף</li>
                    <li>מומלץ להתחיל בזמני חשיפה קצרים ולהגדיל בהדרגה</li>
                    <li>במקרה של תופעות לוואי - הפסק מיד את השימוש ופנה לרופא</li>
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
