import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { CheckCircle, XCircle, Loader2, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/PageLayout';

export default function FaceRegistration() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Get customer ID from query params
  const urlParams = new URLSearchParams(window.location.search);
  const customerId = urlParams.get('customerId');
  
  // Fetch customer data
  const { data: customer, isLoading: loadingCustomer } = useQuery<any>({
    queryKey: [`/api/customers/${customerId}`],
    enabled: !!customerId,
  });

  const [uploadToken, setUploadToken] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const [registrationState, setRegistrationState] = useState<'idle' | 'sending' | 'waiting' | 'registering' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!customerId) {
      toast({
        title: "שגיאה",
        description: "לא נמצא מזהה לקוח. אנא פנה לתמיכה.",
        variant: "destructive",
      });
    }
  }, [customerId]);

  // Send WhatsApp link to customer
  const sendWhatsAppLink = async () => {
    if (!customerId) return;
    
    setRegistrationState('sending');
    
    try {
      const response = await apiRequest('POST', '/api/face-upload/send-link', { customerId });
      const data = await response.json();
      
      if (data.success) {
        setUploadToken(data.data.token);
        setLinkSent(true);
        setRegistrationState('waiting');
        toast({
          title: "הקישור נשלח! 📱",
          description: `נשלחה הודעת WhatsApp ל-${customer?.phone}`,
        });
      } else {
        throw new Error(data.error || 'Failed to send link');
      }
    } catch (error: any) {
      console.error('Send link error:', error);
      setRegistrationState('error');
      setErrorMessage(error.message || 'אירעה שגיאה בשליחת הקישור');
      toast({
        title: "שגיאה בשליחת קישור",
        description: error.message || 'אנא נסה שוב',
        variant: "destructive",
      });
    }
  };

  // Poll for uploaded image
  useEffect(() => {
    if (!uploadToken || registrationState !== 'waiting') return;
    
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/face-upload/check/${uploadToken}`);
        const data = await response.json();
        
        if (data.success && data.data.status === 'uploaded' && data.data.imageUrl) {
          // Image received! Now register with BioStar
          clearInterval(pollInterval);
          setRegistrationState('registering');
          
          try {
            const registerResponse = await fetch('/api/biostar/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: customerId,
                image: data.data.imageUrl.split(',')[1], // Remove data:image/jpeg;base64, prefix
              }),
            });

            const registerData = await registerResponse.json();

            if (registerData.success) {
              // Mark token as used
              await apiRequest('PUT', `/api/face-upload/${uploadToken}/mark-used`, {});
              
              setRegistrationState('success');
              toast({
                title: "הרישום הושלם בהצלחה! 🎉",
                description: "עכשיו תוכל להיכנס למכון באמצעות זיהוי פנים",
              });
              
              // Redirect to POS after 2 seconds
              setTimeout(() => {
                navigate(`/pos?customer=${customerId}`);
              }, 2000);
            } else {
              throw new Error(registerData.error || 'Registration failed');
            }
          } catch (error: any) {
            console.error('Registration error:', error);
            setRegistrationState('error');
            setErrorMessage(error.message || 'אירעה שגיאה בעת הרישום');
            toast({
              title: "שגיאה ברישום",
              description: error.message || 'אנא נסה שוב',
              variant: "destructive",
            });
          }
        } else if (data.success && (data.data.status === 'expired' || data.data.status === 'error')) {
          clearInterval(pollInterval);
          setRegistrationState('error');
          const message = data.data.status === 'expired' ? 
            'הקישור פג תוקף. אנא שלח שוב.' : 
            'אירעה שגיאה בהעלאת התמונה. אנא שלח שוב.';
          setErrorMessage(message);
          toast({
            title: data.data.status === 'expired' ? "הקישור פג תוקף" : "שגיאה",
            description: "אנא שלח שוב",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Poll error:', error);
      }
    }, 3000); // Poll every 3 seconds
    
    return () => clearInterval(pollInterval);
  }, [uploadToken, registrationState, customerId, customer?.phone, navigate, toast]);

  const retry = () => {
    setUploadToken(null);
    setLinkSent(false);
    setRegistrationState('idle');
    setErrorMessage('');
  };

  if (!customerId || (!loadingCustomer && !customer)) {
    return (
      <PageLayout showBackButton={false} showHomeButton={true} showSettingsButton={true}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="max-w-md border-pink-500/20">
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center gap-2">
                <XCircle className="w-6 h-6" />
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

  if (loadingCustomer) {
    return (
      <PageLayout showBackButton={false} showHomeButton={true} showSettingsButton={true}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBackButton={false} showHomeButton={true} showSettingsButton={true} maxWidth="max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4"
              style={{ textShadow: '0 0 20px rgba(236, 72, 153, 0.6)' }}>
            רישום זיהוי פנים
          </h1>
          <p className="text-xl text-gray-300">
            שלום {customer?.fullName || 'לקוח יקר'}! 👋
          </p>
        </div>

        <Card className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-2"
              style={{
                borderColor: 'rgba(236, 72, 153, 0.6)',
                boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)'
              }}>
          <CardHeader>
            <CardTitle className="text-2xl text-center">העלאת תמונה דרך WhatsApp</CardTitle>
            <CardDescription className="text-center">
              שלח לעצמך קישור להעלאת תמונה מהטלפון
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Success State */}
            {registrationState === 'success' && (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-pulse" />
                <h3 className="text-2xl font-bold text-green-400">
                  הרישום הושלם בהצלחה!
                </h3>
                <p className="text-gray-300">
                  עכשיו תוכל להיכנס למכון באמצעות זיהוי פנים
                </p>
                <p className="text-sm text-gray-400">
                  מועבר לקופה...
                </p>
              </div>
            )}

            {/* Error State */}
            {registrationState === 'error' && (
              <div className="text-center py-8 space-y-4">
                <XCircle className="w-20 h-20 text-red-500 mx-auto" />
                <h3 className="text-2xl font-bold text-red-400">
                  שגיאה
                </h3>
                <p className="text-gray-300">{errorMessage}</p>
                <Button 
                  onClick={retry} 
                  variant="outline"
                  size="lg"
                  data-testid="button-retry"
                >
                  נסה שוב
                </Button>
              </div>
            )}

            {/* Idle State - Send Link */}
            {registrationState === 'idle' && (
              <div className="text-center py-8 space-y-6">
                <Smartphone className="w-24 h-24 text-pink-500 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">העלה תמונה מהטלפון שלך</h3>
                  <p className="text-gray-400">
                    נשלח לך קישור ב-WhatsApp להעלאת תמונה מהמכשיר שלך
                  </p>
                  <p className="text-sm text-gray-500">
                    מספר טלפון: {customer?.phone}
                  </p>
                </div>
                <Button 
                  onClick={sendWhatsAppLink}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  data-testid="button-send-link"
                >
                  <Smartphone className="w-5 h-5 ml-2" />
                  שלח קישור ל-WhatsApp
                </Button>
              </div>
            )}

            {/* Sending State */}
            {registrationState === 'sending' && (
              <div className="text-center py-8 space-y-4">
                <Loader2 className="w-16 h-16 text-pink-500 mx-auto animate-spin" />
                <h3 className="text-xl font-bold">שולח קישור...</h3>
                <p className="text-gray-400">מעביר הודעה ב-WhatsApp</p>
              </div>
            )}

            {/* Waiting State */}
            {registrationState === 'waiting' && (
              <div className="text-center py-8 space-y-4">
                <div className="relative">
                  <Smartphone className="w-24 h-24 text-pink-500 mx-auto animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">ממתין לתמונה...</h3>
                <p className="text-gray-400">
                  הקישור נשלח ל-WhatsApp
                  <br />
                  אנא פתח את ההודעה והעלה תמונה
                </p>
                <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
                  <p className="text-sm text-blue-300">
                    💡 הקישור תקף ל-30 דקות
                  </p>
                </div>
              </div>
            )}

            {/* Registering State */}
            {registrationState === 'registering' && (
              <div className="text-center py-8 space-y-4">
                <Loader2 className="w-16 h-16 text-pink-500 mx-auto animate-spin" />
                <h3 className="text-xl font-bold">מרשם פנים...</h3>
                <p className="text-gray-400">התמונה התקבלה, רושם במערכת</p>
              </div>
            )}
          </CardContent>
        </Card>
    </PageLayout>
  );
}
