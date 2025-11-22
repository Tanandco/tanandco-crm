import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

export default function WhatsAppTest() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('היי! זה הודעת טסט מ-Tan & Co CRM 🎉');

  const sendTestMutation = useMutation({
    mutationFn: async ({ to, message }: { to: string; message: string }) => {
      return await apiRequest('POST', '/api/whatsapp/send-text', { to, message });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: '✅ הודעה נשלחה!',
          description: 'ההודעה נשלחה בהצלחה לוואטסאפ',
          variant: 'default',
        });
      } else {
        toast({
          title: '❌ שגיאה',
          description: data.error || 'ההודעה לא נשלחה',
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: '❌ שגיאה',
        description: error.message || 'אירעה שגיאה בשליחת ההודעה',
        variant: 'destructive',
      });
    },
  });

  const handleSendTest = () => {
    if (!phoneNumber.trim()) {
      toast({
        title: 'חסר מספר טלפון',
        description: 'אנא הזן מספר טלפון',
        variant: 'destructive',
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: 'חסרה הודעה',
        description: 'אנא הזן הודעה',
        variant: 'destructive',
      });
      return;
    }

    sendTestMutation.mutate({ to: phoneNumber, message });
  };

  const sendQuickTest = (testType: 'greeting' | 'balance' | 'receipt') => {
    const testMessages = {
      greeting: 'היי! 👋\n\nזה הודעת טסט מ-Tan & Co CRM.\n\nאיך אוכל לעזור לך היום?',
      balance: 'היי! 👋\n\nיתרת הכניסות שלך:\n*שיזוף*: 5 כניסות נותרו (מתוך 10)\n\nמחכים לך! 💖',
      receipt: '🧾 *חשבונית - Tan & Co*\n\n📋 *מספר עסקה:* TEST-123456\n📅 *תאריך:* ' + new Date().toLocaleString('he-IL') + '\n👤 *לקוח:* לקוח טסט\n\n' + '='.repeat(30) + '\n*פרטי רכישה:*\n\n• מוצר טסט\n  1x ₪100.00 = ₪100.00\n\n' + '='.repeat(30) + '\n💰 *סה"כ:* ₪100.00\n💳 *אמצעי תשלום:* מזומן\n\n✨ תודה על רכישתך! שיזוף נעים! 🌞',
    };

    setMessage(testMessages[testType]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6" dir="rtl">
      <style>{`
        .neon-text {
          color: #ec4899;
          text-shadow: 
            0 0 10px rgba(236, 72, 153, 0.8),
            0 0 20px rgba(236, 72, 153, 0.6),
            0 0 30px rgba(236, 72, 153, 0.4);
        }
        .glass-effect {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(236, 72, 153, 0.2);
        }
      `}</style>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
              size="icon"
              className="border-pink-500/30 hover:border-pink-500/50 hover:bg-pink-500/10"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold neon-text flex items-center gap-3">
                <MessageCircle className="w-10 h-10" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' }} />
                טסט וואטסאפ
              </h1>
              <p className="text-slate-400 mt-2">
                בדיקת שליחת הודעות וואטסאפ
              </p>
            </div>
          </div>
        </div>

        {/* Test Card */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Send className="w-6 h-6 text-pink-400" />
              שליחת הודעת טסט
            </CardTitle>
            <CardDescription className="text-slate-400">
              הזן מספר טלפון והודעה לשליחה לוואטסאפ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Phone Number Input */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-300">
                מספר טלפון
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0501234567 או 972501234567"
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-pink-500"
              />
              <p className="text-xs text-slate-500">
                ניתן להזין עם או בלי קידומת (0 או 972)
              </p>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-slate-300">
                הודעה
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="הזן הודעה לשליחה..."
                rows={6}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-pink-500 resize-none"
              />
            </div>

            {/* Quick Test Buttons */}
            <div className="space-y-2">
              <Label className="text-slate-300">הודעות טסט מהירות:</Label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendQuickTest('greeting')}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  הודעת ברכה
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendQuickTest('balance')}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  הודעת יתרה
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendQuickTest('receipt')}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  חשבונית
                </Button>
              </div>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendTest}
              disabled={sendTestMutation.isPending || !phoneNumber.trim() || !message.trim()}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg h-12"
              style={{
                boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)',
              }}
            >
              {sendTestMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  שולח...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 ml-2" />
                  שלח הודעת טסט
                </>
              )}
            </Button>

            {/* Status Display */}
            {sendTestMutation.isSuccess && (
              <div className="flex items-center gap-2 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400">ההודעה נשלחה בהצלחה!</span>
              </div>
            )}

            {sendTestMutation.isError && (
              <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">
                  שגיאה בשליחת ההודעה: {sendTestMutation.error?.message || 'שגיאה לא ידועה'}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="glass-effect mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-white">ℹ️ מידע</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-400 text-sm space-y-2">
            <p>• מספר הטלפון יתנרמל אוטומטית לפורמט בינלאומי (972...)</p>
            <p>• ודא שהמספר רשום ב-Meta Business Console</p>
            <p>• ההודעה תישלח דרך WhatsApp Cloud API</p>
            <p>• בדוק את הלוגים בקונסול לפרטים נוספים</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

