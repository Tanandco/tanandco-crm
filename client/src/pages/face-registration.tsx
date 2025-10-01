import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Camera, Upload, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function FaceRegistration() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Get customer ID from URL path
  const pathname = window.location.pathname;
  const customerId = pathname.split('/').pop() || null;
  const customerName = 'לקוח יקר';

  const [registrationState, setRegistrationState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [uploadMethod, setUploadMethod] = useState<'camera' | 'file' | null>(null);
  
  // Camera states
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // File upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!customerId) {
      toast({
        title: "שגיאה",
        description: "לא נמצא מזהה לקוח. אנא פנה לתמיכה.",
        variant: "destructive",
      });
    }
    
    // Cleanup camera on unmount
    return () => {
      stopCamera();
    };
  }, [customerId]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setIsCameraActive(true);
      setUploadMethod('camera');
    } catch (error) {
      console.error('Error starting camera:', error);
      toast({
        title: "שגיאה בהפעלת המצלמה",
        description: "לא ניתן להפעיל את המצלמה. נסה להעלות תמונה במקום.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedImage(imageData);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "שגיאה",
        description: "יש לבחור קובץ תמונה בלבד",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setCapturedImage(imageData);
      setUploadMethod('file');
    };
    reader.readAsDataURL(file);
  };

  const submitRegistration = async () => {
    if (!capturedImage || !customerId) return;
    
    setRegistrationState('uploading');
    
    try {
      const response = await fetch('/api/biostar/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: customerId,
          image: capturedImage.split(',')[1], // Remove data:image/jpeg;base64, prefix
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRegistrationState('success');
        toast({
          title: "הרישום הושלם בהצלחה! 🎉",
          description: "עכשיו תוכל להיכנס למכון באמצעות זיהוי פנים",
        });
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        throw new Error(data.error || 'Registration failed');
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
  };

  const retake = () => {
    setCapturedImage(null);
    setUploadMethod(null);
    setRegistrationState('idle');
  };

  if (!customerId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6" dir="rtl">
        <Card className="max-w-md">
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            רישום זיהוי פנים
          </h1>
          <p className="text-xl text-gray-300">
            שלום {customerName}! 👋
          </p>
          <p className="text-lg text-gray-400 mt-2">
            העלה תמונה ברורה שלך לרישום במערכת
          </p>
        </div>

        <Card className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-2"
              style={{
                borderColor: 'rgba(236, 72, 153, 0.6)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
              }}>
          <CardHeader>
            <CardTitle className="text-2xl text-center">העלאת תמונה</CardTitle>
            <CardDescription className="text-center">
              בחר אפשרות להעלאת תמונה
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
                  מועבר לעמוד הבית...
                </p>
              </div>
            )}

            {/* Error State */}
            {registrationState === 'error' && (
              <div className="text-center py-8 space-y-4">
                <XCircle className="w-20 h-20 text-red-500 mx-auto" />
                <h3 className="text-2xl font-bold text-red-400">
                  שגיאה ברישום
                </h3>
                <p className="text-gray-300">{errorMessage}</p>
                <Button 
                  onClick={retake} 
                  variant="outline"
                  data-testid="button-retry"
                >
                  נסה שוב
                </Button>
              </div>
            )}

            {/* Normal Flow */}
            {registrationState !== 'success' && registrationState !== 'error' && (
              <>
                {/* No image captured yet - show options */}
                {!capturedImage && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Camera Option */}
                    <Card 
                      className="cursor-pointer hover-elevate active-elevate-2 transition-all"
                      onClick={() => !isCameraActive && startCamera()}
                      data-testid="card-camera-option"
                    >
                      <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
                        <Camera className="w-16 h-16 text-pink-500" />
                        <h3 className="text-xl font-bold">צלם עכשיו</h3>
                        <p className="text-sm text-gray-400 text-center">
                          השתמש במצלמה של המכשיר
                        </p>
                      </CardContent>
                    </Card>

                    {/* File Upload Option */}
                    <Card 
                      className="cursor-pointer hover-elevate active-elevate-2 transition-all"
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="card-upload-option"
                    >
                      <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
                        <Upload className="w-16 h-16 text-purple-500" />
                        <h3 className="text-xl font-bold">העלה תמונה</h3>
                        <p className="text-sm text-gray-400 text-center">
                          בחר תמונה מהמכשיר
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Camera View */}
                {isCameraActive && !capturedImage && (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-black">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-auto"
                        data-testid="video-camera"
                      />
                    </div>
                    <div className="flex gap-4 justify-center">
                      <Button 
                        onClick={capturePhoto} 
                        size="lg"
                        data-testid="button-capture"
                      >
                        <Camera className="w-5 h-5 ml-2" />
                        צלם תמונה
                      </Button>
                      <Button 
                        onClick={() => { stopCamera(); setUploadMethod(null); }} 
                        variant="outline"
                        size="lg"
                        data-testid="button-cancel-camera"
                      >
                        ביטול
                      </Button>
                    </div>
                  </div>
                )}

                {/* Captured/Uploaded Image Preview */}
                {capturedImage && registrationState === 'idle' && (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-black">
                      <img 
                        src={capturedImage} 
                        alt="Captured" 
                        className="w-full h-auto"
                        data-testid="img-preview"
                      />
                    </div>
                    <div className="flex gap-4 justify-center">
                      <Button 
                        onClick={submitRegistration} 
                        size="lg"
                        data-testid="button-submit"
                      >
                        <ArrowRight className="w-5 h-5 ml-2" />
                        אשר ושלח
                      </Button>
                      <Button 
                        onClick={retake} 
                        variant="outline"
                        size="lg"
                        data-testid="button-retake"
                      >
                        צלם שוב
                      </Button>
                    </div>
                  </div>
                )}

                {/* Uploading State */}
                {registrationState === 'uploading' && (
                  <div className="text-center py-8 space-y-4">
                    <Loader2 className="w-16 h-16 text-pink-500 mx-auto animate-spin" />
                    <h3 className="text-xl font-bold">שולח...</h3>
                    <p className="text-gray-400">אנא המתן בזמן שהמערכת רושמת את הפנים שלך</p>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  data-testid="input-file"
                />

                {/* Hidden canvas for camera capture */}
                <canvas ref={canvasRef} className="hidden" />
              </>
            )}

            {/* Instructions */}
            {!capturedImage && registrationState === 'idle' && (
              <div className="mt-8 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
                <h4 className="font-bold text-blue-300 mb-2">⚠️ הנחיות חשובות:</h4>
                <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                  <li>ודא שהתמונה ברורה ומוארת היטב</li>
                  <li>הפנים צריכות להיות פונות ישירות למצלמה</li>
                  <li>הסר משקפיים או כובע אם אפשר</li>
                  <li>וודא שהרקע לא עמוס מדי</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
