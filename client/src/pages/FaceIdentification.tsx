import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, User, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FaceRecognition } from '@/components/FaceRecognition';
import { cn } from '@/lib/utils';

interface IdentifiedUser {
  userId: string;
  userName: string;
  confidence: number;
  accessLevel?: number;
  department?: string;
}

export default function FaceIdentification() {
  const [, navigate] = useLocation();
  const [identifiedUser, setIdentifiedUser] = useState<IdentifiedUser | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUserIdentified = async (userId: string, userName: string, confidence: number) => {
    setIdentifiedUser({
      userId,
      userName,
      confidence,
      accessLevel: 1,
      department: 'כללי'
    });
    
    // Open door automatically if confidence is high enough
    if (confidence >= 0.85) {
      try {
        await fetch('/api/biostar/open-door', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            doorId: '1',
            doorName: 'Main Entrance',
            userId,
            customerId: userId
          })
        });
      } catch (error) {
        console.error('Failed to open door:', error);
      }
    }
    
    // Auto-proceed to services after successful identification
    setTimeout(() => {
      navigate('/services');
    }, 2000);
  };

  const handleManualEntry = () => {
    navigate('/manual-entry');
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.8) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-900/50 text-green-400 border-green-500';
    if (confidence >= 0.8) return 'bg-yellow-900/50 text-yellow-400 border-yellow-500';
    return 'bg-orange-900/50 text-orange-400 border-orange-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            זיהוי לקוח אוטומטי
          </h1>
          <p className="text-xl text-gray-300">
            הבט למצלמה לזיהוי מהיר ובטוח
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Face Recognition Panel */}
          <div className="space-y-6">
            <FaceRecognition
              onUserIdentified={handleUserIdentified}
              className="h-full"
              debug={import.meta.env.DEV}
            />
            
            {/* Alternative Options */}
            <Card className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-2"
                  style={{
                    borderColor: 'rgba(236, 72, 153, 0.6)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
                  }}>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white text-center">
                  אפשרויות נוספות
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleManualEntry}
                  variant="outline"
                  className="w-full border-pink-500/50 text-pink-400 hover:bg-pink-500/20"
                  data-testid="button-manual-entry"
                >
                  <User className="h-4 w-4 mr-2" />
                  הזנה ידנית של פרטים
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                
                <Button
                  onClick={handleBackToMain}
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
                  data-testid="button-back-main"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  חזרה לעמוד הראשי
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Status Panel */}
          <div className="space-y-6">
            {!identifiedUser ? (
              <Card className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-2"
                    style={{
                      borderColor: 'rgba(236, 72, 153, 0.6)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
                    }}>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white text-center flex items-center justify-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-yellow-400" />
                    ממתין לזיהוי
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-300">
                    אנא הסתכל ישירות למצלמה לזיהוי
                  </p>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>• וודא תאורה טובה</p>
                    <p>• הסר משקפיים אם יש</p>
                    <p>• הבט ישירות למצלמה</p>
                    <p>• שמור על פנים רגועות</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-br from-green-900/50 via-emerald-900/40 to-green-800/50 border-2 border-green-500/60">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white text-center flex items-center justify-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                    זיהוי הושלם בהצלחה!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-green-400 mb-2">
                      {identifiedUser.userName}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      ID: {identifiedUser.userId}
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      <Badge 
                        variant="outline" 
                        className={cn("font-medium", getConfidenceBadge(identifiedUser.confidence))}
                      >
                        דיוק: {Math.round(identifiedUser.confidence * 100)}%
                      </Badge>
                      {identifiedUser.department && (
                        <Badge variant="outline" className="bg-blue-900/50 text-blue-400 border-blue-500">
                          {identifiedUser.department}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="bg-black/30 rounded-lg p-4 text-sm">
                      <p className="text-gray-300 mb-2">
                        מעביר אותך לבחירת שירותים...
                      </p>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-2000 ease-in-out"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* System Status */}
            <Card className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-400 text-center">
                  מצב המערכת
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">BioStar 2</span>
                  <Badge variant="outline" className="bg-green-900/50 text-green-400 border-green-500">
                    מחובר
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">מצלמה</span>
                  <Badge variant="outline" className="bg-green-900/50 text-green-400 border-green-500">
                    פעיל
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">זיהוי פנים</span>
                  <Badge variant="outline" className="bg-green-900/50 text-green-400 border-green-500">
                    מוכן
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
