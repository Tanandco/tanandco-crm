import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, User, CheckCircle, XCircle, Loader2, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FaceRecognitionProps {
  onUserIdentified?: (userId: string, userName: string, confidence: number) => void;
  onRegistrationMode?: (enabled: boolean) => void;
  className?: string;
  isRegistrationMode?: boolean;
  debug?: boolean;
}

interface IdentificationResult {
  userId?: string;
  userName?: string;
  confidence: number;
  isLive: boolean;
  qualityScore: number;
}

interface ScanState {
  status: 'idle' | 'scanning' | 'processing' | 'success' | 'error';
  message: string;
  result?: IdentificationResult;
}

export function FaceRecognition({
  onUserIdentified,
  onRegistrationMode,
  className,
  isRegistrationMode = false,
  debug = false
}: FaceRecognitionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [scanState, setScanState] = useState<ScanState>({
    status: 'idle',
    message: 'לחץ על כפתור הסריקה לזיהוי פנים'
  });
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  // Check browser support
  useEffect(() => {
    const checkSupport = async () => {
      try {
        const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        setIsSupported(hasGetUserMedia);
        
        if (!hasGetUserMedia) {
          setScanState({
            status: 'error',
            message: 'המצלמה לא נתמכת בדפדפן זה'
          });
        }
      } catch (error) {
        setIsSupported(false);
        setScanState({
          status: 'error',
          message: 'שגיאה בבדיקת תמיכה במצלמה'
        });
      }
    };
    
    checkSupport();
  }, []);

  // Start camera stream
  const startCamera = useCallback(async () => {
    if (!isSupported) return false;
    
    try {
      setScanState({ status: 'processing', message: 'מפעיל מצלמה...' });
      
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
      setScanState({ 
        status: 'idle', 
        message: 'מצלמה פעילה - מוכן לזיהוי פנים' 
      });
      
      return true;
    } catch (error) {
      console.error('Error starting camera:', error);
      setScanState({
        status: 'error',
        message: 'שגיאה בהפעלת המצלמה'
      });
      return false;
    }
  }, [isSupported]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
    setScanState({ 
      status: 'idle', 
      message: 'לחץ על כפתור הסריקה לזיהוי פנים' 
    });
  }, []);

  // Capture image from video
  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return null;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to base64
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  // Send image for face identification
  const identifyFace = useCallback(async (imageData: string): Promise<IdentificationResult | null> => {
    try {
      const response = await fetch('/api/biostar/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData.split(',')[1], // Remove data:image/jpeg;base64, prefix
          antiSpoofing: true,
          liveDetection: true
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data as IdentificationResult;
      }
      
      return null;
    } catch (error) {
      console.error('Face identification error:', error);
      throw error;
    }
  }, []);

  // Main scan function
  const handleScan = useCallback(async () => {
    if (!isCameraActive) {
      const started = await startCamera();
      if (!started) return;
      
      // Wait a bit for camera to stabilize
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    try {
      setScanState({ status: 'scanning', message: 'מזהה פנים...' });
      
      // Capture image
      const imageData = captureImage();
      if (!imageData) {
        throw new Error('Failed to capture image');
      }
      
      setScanState({ status: 'processing', message: 'מעבד תמונה...' });
      
      // Send for identification
      const result = await identifyFace(imageData);
      
      if (result && result.userId && result.confidence > 0.7) {
        setScanState({
          status: 'success',
          message: `זוהה: ${result.userName || result.userId}`,
          result
        });
        
        // Notify parent component
        if (onUserIdentified) {
          onUserIdentified(result.userId, result.userName || '', result.confidence);
        }
        
        // Auto reset after success
        setTimeout(() => {
          setScanState({ 
            status: 'idle', 
            message: 'זיהוי הושלם בהצלחה' 
          });
        }, 3000);
      } else {
        setScanState({
          status: 'error',
          message: 'לא זוהו פנים או רמת ביטחון נמוכה'
        });
        
        // Auto reset after error
        setTimeout(() => {
          setScanState({ 
            status: 'idle', 
            message: 'מוכן לזיהוי פנים נוסף' 
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Scan error:', error);
      setScanState({
        status: 'error',
        message: 'שגיאה בתהליך הזיהוי'
      });
      
      setTimeout(() => {
        setScanState({ 
          status: 'idle', 
          message: 'מוכן לניסיון נוסף' 
        });
      }, 2000);
    }
  }, [isCameraActive, startCamera, captureImage, identifyFace, onUserIdentified]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Get status icon
  const getStatusIcon = () => {
    switch (scanState.status) {
      case 'scanning':
      case 'processing':
        return <Loader2 className="h-6 w-6 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-400" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-400" />;
      default:
        return <Scan className="h-6 w-6" />;
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch (scanState.status) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'scanning':
      case 'processing':
        return 'text-yellow-400';
      default:
        return 'text-gray-300';
    }
  };

  if (!isSupported) {
    return (
      <Card className={cn("bg-red-900/20 border-red-500/50", className)}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400">המצלמה לא נתמכת בדפדפן זה</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-2", className)}
          style={{
            borderColor: 'rgba(236, 72, 153, 0.6)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
          }}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-white text-center flex items-center justify-center gap-3">
          <Camera className="h-6 w-6 text-pink-400" />
          זיהוי פנים אוטומטי
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Video Preview */}
        <div className="relative">
          <video
            ref={videoRef}
            className={cn(
              "w-full h-64 bg-black rounded-lg object-cover",
              !isCameraActive && "hidden"
            )}
            playsInline
            muted
            data-testid="video-preview"
          />
          
          {!isCameraActive && (
            <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">מצלמה לא פעילה</p>
              </div>
            </div>
          )}
          
          {/* Scan overlay */}
          {scanState.status === 'scanning' && (
            <div className="absolute inset-0 rounded-lg border-4 border-yellow-400 animate-pulse">
              <div className="absolute inset-4 border-2 border-dashed border-yellow-400 rounded-lg" />
            </div>
          )}
          
          {/* Success overlay */}
          {scanState.status === 'success' && (
            <div className="absolute inset-0 rounded-lg border-4 border-green-400">
              <div className="absolute inset-4 border-2 border-dashed border-green-400 rounded-lg" />
            </div>
          )}
        </div>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Status Display */}
        <div className="bg-black/50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            {getStatusIcon()}
            <span className={cn("font-medium", getStatusColor())}>
              {scanState.message}
            </span>
          </div>
          
          {/* Result Details */}
          {scanState.result && scanState.status === 'success' && (
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <Badge variant="outline" className="bg-green-900/50 text-green-400 border-green-500">
                ביטחון: {Math.round(scanState.result.confidence * 100)}%
              </Badge>
              <Badge variant="outline" className="bg-blue-900/50 text-blue-400 border-blue-500">
                איכות: {Math.round(scanState.result.qualityScore * 100)}%
              </Badge>
              {scanState.result.isLive && (
                <Badge variant="outline" className="bg-purple-900/50 text-purple-400 border-purple-500">
                  זיהוי חי
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleScan}
            disabled={scanState.status === 'scanning' || scanState.status === 'processing'}
            className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            data-testid="button-scan-face"
          >
            {scanState.status === 'scanning' || scanState.status === 'processing' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                מעבד...
              </>
            ) : (
              <>
                <Scan className="h-4 w-4 mr-2" />
                בצע זיהוי פנים
              </>
            )}
          </Button>
          
          {isCameraActive && (
            <Button
              onClick={stopCamera}
              variant="outline"
              className="border-pink-500/50 text-pink-400 hover:bg-pink-500/20"
              data-testid="button-stop-camera"
            >
              <Camera className="h-4 w-4 mr-2" />
              עצור מצלמה
            </Button>
          )}
        </div>

        {/* Debug Info */}
        {debug && (
          <div className="bg-gray-900/50 rounded-lg p-3 text-xs">
            <div className="text-gray-400">
              <div>מצב: {scanState.status}</div>
              <div>מצלמה פעילה: {isCameraActive ? 'כן' : 'לא'}</div>
              <div>נתמך: {isSupported ? 'כן' : 'לא'}</div>
              {scanState.result && (
                <div className="mt-2 p-2 bg-black/30 rounded">
                  <pre>{JSON.stringify(scanState.result, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
