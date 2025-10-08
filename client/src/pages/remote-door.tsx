import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DoorOpen, Loader2, CheckCircle2, XCircle, History, ArrowRight } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import type { DoorAccessLog } from '@shared/schema';

export default function RemoteDoor() {
  const [, setLocation] = useLocation();
  const [lastOpened, setLastOpened] = useState<Date | null>(null);
  const { toast } = useToast();

  // Fetch door logs
  const { data: logsData, isLoading: logsLoading } = useQuery<{ success: boolean; data: DoorAccessLog[] }>({
    queryKey: ['/api/biostar/door-logs'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const openDoorMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/biostar/open-door', { doorId: '1' });
    },
    onSuccess: () => {
      setLastOpened(new Date());
      // Invalidate logs to refresh
      queryClient.invalidateQueries({ queryKey: ['/api/biostar/door-logs'] });
      toast({
        title: '🚪 הדלת נפתחה!',
        description: 'הדלת נפתחה בהצלחה',
      });
    },
    onError: (error: any) => {
      // Invalidate logs even on error to show failed attempt
      queryClient.invalidateQueries({ queryKey: ['/api/biostar/door-logs'] });
      toast({
        title: '❌ שגיאה',
        description: error.message || 'לא ניתן לפתוח את הדלת',
        variant: 'destructive'
      });
    }
  });

  const logs = logsData?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Button
            onClick={() => setLocation('/')}
            variant="outline"
            size="icon"
            data-testid="button-back"
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
        {/* Door Control Card */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">🚪 פתיחה מרחוק</CardTitle>
            <CardDescription className="text-lg">
              לחץ על הכפתור לפתיחת הדלת
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Door Button */}
            <Button
              onClick={() => openDoorMutation.mutate()}
              disabled={openDoorMutation.isPending}
              className="w-full h-32 text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-lg shadow-pink-500/50"
              data-testid="button-open-door"
            >
              {openDoorMutation.isPending ? (
                <>
                  <Loader2 className="w-8 h-8 ml-3 animate-spin" />
                  פותח...
                </>
              ) : (
                <>
                  <DoorOpen className="w-8 h-8 ml-3" />
                  פתח דלת
                </>
              )}
            </Button>

            {/* Status Messages */}
            {openDoorMutation.isSuccess && (
              <div className="flex items-center justify-center gap-2 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-green-500 font-semibold">הדלת נפתחה בהצלחה!</span>
              </div>
            )}

            {openDoorMutation.isError && (
              <div className="flex items-center justify-center gap-2 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-500 font-semibold">
                  {(openDoorMutation.error as any)?.message || 'שגיאה בפתיחת הדלת'}
                </span>
              </div>
            )}

            {/* Last Opened Time */}
            {lastOpened && (
              <div className="text-center text-sm text-muted-foreground">
                נפתחה לאחרונה: {lastOpened.toLocaleTimeString('he-IL')}
              </div>
            )}

            {/* Info Box */}
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-sm text-muted-foreground text-center">
                💡 הדלת תיפתח לכמה שניות ותינעל אוטומטית
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Access Logs Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              היסטוריית פתיחות
            </CardTitle>
            <CardDescription>
              {logs.length} פתיחות אחרונות
            </CardDescription>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                אין פתיחות עדיין
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto" data-testid="logs-container">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-lg border ${
                      log.success
                        ? 'bg-green-500/5 border-green-500/30'
                        : 'bg-red-500/5 border-red-500/30'
                    }`}
                    data-testid={`log-entry-${log.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {log.success ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="font-medium" data-testid={`log-door-${log.id}`}>
                          {log.doorName || `דלת ${log.doorId}`}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground" data-testid={`log-time-${log.id}`}>
                        {new Date(log.createdAt).toLocaleString('he-IL', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {!log.success && log.errorMessage && (
                      <div className="mt-1 text-sm text-red-400" data-testid={`log-error-${log.id}`}>
                        {log.errorMessage}
                      </div>
                    )}
                    {log.ipAddress && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        IP: {log.ipAddress}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
