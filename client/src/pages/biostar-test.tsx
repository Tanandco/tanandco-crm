import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, RefreshCw, Loader2 } from 'lucide-react';

export default function BioStarTest() {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ['/api/biostar/status'],
    retry: false,
  });

  const status = data?.data || {};
  const isConnected = data?.success && status.isReady;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-8" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isConnected ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              בדיקת חיבור BioStar
            </CardTitle>
            <CardDescription>
              סטטוס מערכת זיהוי הפנים
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
              </div>
            ) : error ? (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-500 font-bold mb-2">שגיאה בחיבור</p>
                <p className="text-sm text-muted-foreground">{(error as any).message}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Connection Status */}
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <span className="font-semibold">סטטוס חיבור:</span>
                  <Badge variant={isConnected ? "default" : "destructive"}>
                    {isConnected ? 'מחובר' : 'לא מחובר'}
                  </Badge>
                </div>

                {/* Initialized */}
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <span className="font-semibold">אתחול:</span>
                  <Badge variant={status.isInitialized ? "default" : "secondary"}>
                    {status.isInitialized ? 'אותחל' : 'לא אותחל'}
                  </Badge>
                </div>

                {/* Authenticated */}
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <span className="font-semibold">אימות:</span>
                  <Badge variant={status.isAuthenticated ? "default" : "secondary"}>
                    {status.isAuthenticated ? 'מאומת' : 'לא מאומת'}
                  </Badge>
                </div>

                {/* Server URL */}
                {status.serverUrl && (
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                    <span className="font-semibold">כתובת שרת:</span>
                    <code className="text-sm text-pink-400">{status.serverUrl}</code>
                  </div>
                )}

                {/* Last Check */}
                {status.lastCheck && (
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                    <span className="font-semibold">בדיקה אחרונה:</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(status.lastCheck).toLocaleString('he-IL')}
                    </span>
                  </div>
                )}

                {/* Error Message */}
                {status.errorMessage && (
                  <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                    <p className="text-red-500 font-bold mb-2">הודעת שגיאה:</p>
                    <p className="text-sm text-muted-foreground">{status.errorMessage}</p>
                  </div>
                )}
              </div>
            )}

            {/* Refresh Button */}
            <Button
              onClick={() => refetch()}
              disabled={isLoading}
              className="w-full"
              data-testid="button-refresh-biostar"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 ml-2" />
              )}
              רענן סטטוס
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
