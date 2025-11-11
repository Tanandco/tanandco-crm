import { useState, useRef } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Camera, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function UploadFace() {
  const { token } = useParams<{ token: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Check token validity
  const { data: tokenData, isLoading: checkingToken } = useQuery({
    queryKey: [`/api/face-upload/check/${token}`],
    enabled: !!token,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (image: string) => {
      const response = await apiRequest('POST', `/api/face-upload/${token}`, { image });
      return response.json();
    },
    onSuccess: () => {
      setUploadStatus('success');
      toast({
        title: "התמונה הועלתה בהצלחה! ✅",
        description: "אפשר לסגור את הדף הזה",
      });
      
      // Stop camera if active
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        setIsCameraActive(false);
      }
    },
    onError: (error: any) => {
      setUploadStatus('error');
      toast({
        title: "שגיאה בהעלאת התמונה",
        description: error.message || 'נסה שוב',
        variant: "destructive",
      });
    },
  });

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        title: "שגיאה בגישה למצלמה",
        description: "אנא בדוק הרשאות המצלמה",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        
        // Stop camera
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
          setIsCameraActive(false);
        }
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!capturedImage) return;
    
    setUploadStatus('uploading');
    uploadMutation.mutate(capturedImage);
  };

  const retake = () => {
    setCapturedImage(null);
    setUploadStatus('idle');
  };

  if (checkingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-pink-950/30 to-gray-900 flex items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (!(tokenData as any)?.success || (tokenData as any)?.data?.status === 'expired') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-pink-950/30 to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md border-pink-500/20">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2">
              <XCircle className="w-6 h-6" />
              הקישור פג תוקף
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>הקישור לא תקף יותר. אנא צור קשר עם המכון.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if ((tokenData as any)?.data?.status === 'uploaded' || (tokenData as any)?.data?.status === 'used') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-pink-950/30 to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md border-pink-500/20">
          <CardHeader>
            <CardTitle className="text-green-500 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              התמונה כבר הועלתה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>התמונה שלך כבר הועלתה בהצלחה. תוכל לסגור את הדף הזה.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-pink-950/30 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-pink-500/30"
            style={{
              boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)'
            }}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white" style={{ textShadow: '0 0 10px rgba(236, 72, 153, 0.5)' }}>
            העלאת תמונה לזיהוי פנים
          </CardTitle>
          <CardDescription className="text-gray-300">
            צלם או העלה תמונה ברורה של הפנים שלך
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {uploadStatus === 'success' && (
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-pulse" />
              <h3 className="text-2xl font-bold text-green-400">
                התמונה הועלתה בהצלחה!
              </h3>
              <p className="text-gray-300">
                תוכל לסגור את הדף הזה
              </p>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="text-center py-8 space-y-4">
              <XCircle className="w-20 h-20 text-red-500 mx-auto" />
              <h3 className="text-2xl font-bold text-red-400">
                שגיאה בהעלאת התמונה
              </h3>
              <Button onClick={retake} variant="outline" data-testid="button-retry">
                נסה שוב
              </Button>
            </div>
          )}

          {uploadStatus !== 'success' && uploadStatus !== 'error' && (
            <>
              {!capturedImage ? (
                <div className="space-y-4">
                  {/* Camera View */}
                  {isCameraActive && (
                    <div className="space-y-4">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-lg border-2 border-pink-500/30"
                        data-testid="video-camera"
                      />
                      <Button 
                        onClick={capturePhoto}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                        size="lg"
                        data-testid="button-capture"
                      >
                        <Camera className="w-5 h-5 ml-2" />
                        צלם תמונה
                      </Button>
                    </div>
                  )}

                  {/* Upload Options */}
                  {!isCameraActive && (
                    <div className="grid gap-4">
                      <Button
                        onClick={startCamera}
                        variant="outline"
                        size="lg"
                        className="w-full border-pink-500/30"
                        data-testid="button-camera"
                      >
                        <Camera className="w-5 h-5 ml-2" />
                        פתח מצלמה
                      </Button>

                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        size="lg"
                        className="w-full border-pink-500/30"
                        data-testid="button-upload"
                      >
                        <Upload className="w-5 h-5 ml-2" />
                        העלה מהגלריה
                      </Button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        data-testid="input-file"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Preview */}
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full rounded-lg border-2 border-pink-500/30"
                    data-testid="img-preview"
                  />

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={retake}
                      variant="outline"
                      disabled={uploadStatus === 'uploading'}
                      data-testid="button-retake"
                    >
                      צלם שוב
                    </Button>

                    <Button
                      onClick={handleUpload}
                      disabled={uploadStatus === 'uploading'}
                      className="bg-pink-600 hover:bg-pink-700"
                      data-testid="button-submit"
                    >
                      {uploadStatus === 'uploading' ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          מעלה...
                        </>
                      ) : (
                        'אישור והעלאה'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
