import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { CheckCircle, FileText, AlertCircle, Loader2, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/PageLayout';

export default function HealthForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  
  // Get customer ID from URL params
  const params = new URLSearchParams(window.location.search);
  const customerId = params.get('customerId');

  // Fetch customer data
  const { data: customer, isLoading: isLoadingCustomer } = useQuery<any>({
    queryKey: [`/api/customers/${customerId}`],
    enabled: !!customerId,
  });

  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [skinType, setSkinType] = useState<string>('3-medium');
  const [healthDeclarations, setHealthDeclarations] = useState({
    noAllergies: false,
    noSkinConditions: false,
    noMedications: false,
    noPregnancy: false,
    understandsRisks: false,
  });

  const allChecked = agreedToTerms && 
    healthDeclarations.noAllergies &&
    healthDeclarations.noSkinConditions &&
    healthDeclarations.noMedications &&
    healthDeclarations.noPregnancy &&
    healthDeclarations.understandsRisks &&
    hasSignature;

  // Signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#ec4899'; // pink-500
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const paintBackground = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paintBackground(); // Repaint background
    setHasSignature(false);
  };

  useEffect(() => {
    paintBackground();
  }, []);

  const handleSubmit = async () => {
    if (!allChecked || !customerId || !customer) return;
    
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const signatureData = canvas.toDataURL('image/png');
    
    setFormState('submitting');
    
    try {
      // Save health form with signature
      await apiRequest('POST', '/api/health-forms', {
        customerId,
        hasAllergies: !healthDeclarations.noAllergies,
        hasSkinConditions: !healthDeclarations.noSkinConditions,
        takesMedications: !healthDeclarations.noMedications,
        hasPregnancy: !healthDeclarations.noPregnancy,
        skinType,
        previousTanningExperience: healthDeclarations.understandsRisks,
        hasConsent: agreedToTerms,
        signatureData,
      });

      // Update customer health form status
      await apiRequest('PATCH', `/api/customers/${customerId}`, {
        healthFormSigned: true,
      });

      setFormState('success');
      toast({
        title: "✅ טופס נשמר בהצלחה!",
        description: "עכשיו נעבור לרישום הפנים שלך",
      });
      
      // Navigate to face registration
      setTimeout(() => {
        navigate(`/face-registration?customerId=${customerId}`);
      }, 2000);
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
      <PageLayout showBackButton={false} showHomeButton={true} showSettingsButton={true}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="max-w-md border-pink-500/20">
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
      </PageLayout>
    );
  }

  if (isLoadingCustomer) {
    return (
      <PageLayout showBackButton={false} showHomeButton={true} showSettingsButton={true}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="max-w-md border-pink-500/20 bg-slate-900/80 backdrop-blur-md">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-12 h-12 text-pink-500 mx-auto mb-4 animate-spin" />
              <p className="text-white">טוען פרטים...</p>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (!customer) {
    return (
      <PageLayout showBackButton={false} showHomeButton={true} showSettingsButton={true}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="max-w-md border-pink-500/20">
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                שגיאה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>לקוח לא נמצא במערכת</p>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBackButton={false} showHomeButton={true} showSettingsButton={true} maxWidth="max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <FileText className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold bg-gradient-to-l from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            הצהרת בריאות
          </h1>
          <p className="text-lg text-slate-300">
            אנא קרא/י בעיון וסמן/י את כל ההצהרות
          </p>
        </div>

        {/* Customer Info Card */}
        <Card className="mb-6 border-pink-500/20 bg-slate-900/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-white">פרטי הלקוח</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-slate-300">
              <User className="w-5 h-5 text-pink-500" />
              <span className="font-medium">{customer.fullName}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Phone className="w-5 h-5 text-pink-500" />
              <span className="font-medium">{customer.phone}</span>
            </div>
            {customer.email && (
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-5 h-5 text-pink-500" />
                <span className="font-medium">{customer.email}</span>
              </div>
            )}
          </CardContent>
        </Card>

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
                {/* Skin Type Selection */}
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <h3 className="text-lg font-semibold text-white mb-3">🌞 סוג העור שלך</h3>
                  <select
                    value={skinType}
                    onChange={(e) => setSkinType(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-800 border border-pink-500/30 text-white focus:ring-2 focus:ring-pink-500"
                    data-testid="select-skin-type"
                  >
                    <option value="1-very-fair">1 - עור בהיר מאוד (נוטה לכוויות)</option>
                    <option value="2-fair">2 - עור בהיר (נוטה לכוויות)</option>
                    <option value="3-medium">3 - עור בינוני (משתזף בקלות)</option>
                    <option value="4-olive">4 - עור זית (משתזף בקלות)</option>
                    <option value="5-dark">5 - עור כהה</option>
                    <option value="6-very-dark">6 - עור כהה מאוד</option>
                  </select>
                </div>

                {/* Health Declarations */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">✅ הצהרות רפואיות</h3>
                  
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <Checkbox
                      id="no-allergies"
                      checked={healthDeclarations.noAllergies}
                      onCheckedChange={(checked) => 
                        setHealthDeclarations(prev => ({ ...prev, noAllergies: checked as boolean }))
                      }
                      data-testid="checkbox-allergies"
                    />
                    <label
                      htmlFor="no-allergies"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      אני מצהיר/ה כי אין לי אלרגיות לחומרי שיזוף או מוצרי קוסמטיקה
                    </label>
                  </div>

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

                {/* Digital Signature */}
                <div className="border-t border-pink-500/20 pt-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    ✍️ חתימה דיגיטלית
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">
                    אנא חתום/חתמי במסגרת למטה באמצעות העכבר או המגע
                  </p>
                  <div className="relative">
                    <canvas
                      ref={signatureCanvasRef}
                      width={600}
                      height={200}
                      className="w-full border-2 border-pink-500/30 rounded-lg cursor-crosshair touch-none"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      data-testid="canvas-signature"
                    />
                    {!hasSignature && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-slate-500 text-lg">חתום/חתמי כאן</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearSignature}
                      disabled={!hasSignature}
                      className="border-pink-500/30"
                      data-testid="button-clear-signature"
                    >
                      נקה חתימה
                    </Button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!allChecked || formState === 'submitting'}
                    className="bg-gradient-to-l from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-lg px-12"
                    data-testid="button-submit"
                  >
                    {formState === 'submitting' ? (
                      <>
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                        שומר...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 ml-2" />
                        אשר והמשך
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
    </PageLayout>
  );
}
