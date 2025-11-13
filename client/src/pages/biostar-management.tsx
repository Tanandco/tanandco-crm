import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  DoorOpen, Loader2, CheckCircle2, XCircle, History, 
  ArrowRight, Users, Activity, Settings, RefreshCw,
  UserCheck, Clock, AlertCircle, Wifi, WifiOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { DoorAccessLog } from '@shared/schema';

interface BioStarStatus {
  connected: boolean;
  initialized: boolean;
  error?: string;
  serverUrl?: string;
}

interface Door {
  id: string;
  name?: string;
  entryDeviceId?: string;
}

export default function BioStarManagement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedDoorId, setSelectedDoorId] = useState<string>('1');

  // Fetch BioStar status
  const { data: statusData, isLoading: statusLoading, refetch: refetchStatus } = useQuery<{ success: boolean; data: BioStarStatus }>({
    queryKey: ['/api/biostar/status'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch door logs
  const { data: logsData, isLoading: logsLoading } = useQuery<{ success: boolean; data: DoorAccessLog[] }>({
    queryKey: ['/api/biostar/door-logs'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch doors list (if available)
  const { data: doorsData } = useQuery<{ success: boolean; data: Door[] }>({
    queryKey: ['/api/biostar/doors'],
    enabled: statusData?.data?.connected || false,
  });

  // Open door mutation
  const openDoorMutation = useMutation({
    mutationFn: async (doorId: string) => {
      return await apiRequest('POST', '/api/biostar/open-door', { doorId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/biostar/door-logs'] });
      toast({
        title: '🚪 הדלת נפתחה!',
        description: 'הדלת נפתחה בהצלחה',
      });
    },
    onError: (error: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/biostar/door-logs'] });
      toast({
        title: '❌ שגיאה',
        description: error.message || 'לא ניתן לפתוח את הדלת',
        variant: 'destructive'
      });
    }
  });

  const status = statusData?.data;
  const logs = logsData?.data || [];
  const doors = doorsData?.data || [{ id: '1', name: 'כניסה ראשית' }];

  // Statistics
  const todayLogs = logs.filter(log => {
    const logDate = new Date(log.createdAt);
    const today = new Date();
    return logDate.toDateString() === today.toDateString();
  });

  const successCount = todayLogs.filter(log => log.success).length;
  const failedCount = todayLogs.filter(log => !log.success).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
              size="icon"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">ניהול BioStar</h1>
            <Button
              onClick={() => refetchStatus()}
              variant="outline"
              size="icon"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">סטטוס חיבור</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {statusLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : status?.connected ? (
                  <>
                    <Wifi className="w-5 h-5 text-green-500" />
                    <span className="text-green-500 font-bold">מחובר</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5 text-red-500" />
                    <span className="text-red-500 font-bold">מנותק</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">פתיחות היום</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayLogs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">הצלחות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{successCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">כשלונות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{failedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="doors" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="doors">דלתות</TabsTrigger>
            <TabsTrigger value="logs">לוגים</TabsTrigger>
            <TabsTrigger value="users">משתמשים</TabsTrigger>
            <TabsTrigger value="settings">הגדרות</TabsTrigger>
          </TabsList>

          {/* Doors Tab */}
          <TabsContent value="doors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>בקרת דלתות</CardTitle>
                <CardDescription>
                  פתיחת דלתות מרחוק וניהול גישה
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Door Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {doors.map((door) => (
                    <Card
                      key={door.id}
                      className={`cursor-pointer transition-all ${
                        selectedDoorId === door.id
                          ? 'ring-2 ring-pink-500 bg-pink-500/10'
                          : 'hover:bg-slate-800/50'
                      }`}
                      onClick={() => setSelectedDoorId(door.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold">{door.name || `דלת ${door.id}`}</h3>
                            <p className="text-sm text-muted-foreground">ID: {door.id}</p>
                          </div>
                          {selectedDoorId === door.id && (
                            <CheckCircle2 className="w-5 h-5 text-pink-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Open Door Button */}
                <Button
                  onClick={() => openDoorMutation.mutate(selectedDoorId)}
                  disabled={openDoorMutation.isPending || !status?.connected}
                  className="w-full h-20 text-xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                >
                  {openDoorMutation.isPending ? (
                    <>
                      <Loader2 className="w-6 h-6 ml-3 animate-spin" />
                      פותח...
                    </>
                  ) : (
                    <>
                      <DoorOpen className="w-6 h-6 ml-3" />
                      פתח דלת {doors.find(d => d.id === selectedDoorId)?.name || selectedDoorId}
                    </>
                  )}
                </Button>

                {!status?.connected && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      <span className="text-yellow-500">
                        BioStar לא מחובר. לא ניתן לפתוח דלתות.
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  היסטוריית כניסות
                </CardTitle>
                <CardDescription>
                  {logs.length} כניסות אחרונות
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : logs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    אין כניסות עדיין
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className={`p-4 rounded-lg border ${
                          log.success
                            ? 'bg-green-500/5 border-green-500/30'
                            : 'bg-red-500/5 border-red-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {log.success ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="font-medium">
                              {log.doorName || `דלת ${log.doorId}`}
                            </span>
                            <Badge variant={log.success ? 'default' : 'destructive'}>
                              {log.actionType === 'remote_open' ? 'פתיחה מרחוק' : 
                               log.actionType === 'face_recognition' ? 'זיהוי פנים' : 
                               log.actionType}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString('he-IL', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </span>
                        </div>
                        {!log.success && log.errorMessage && (
                          <div className="mt-2 text-sm text-red-400">
                            {log.errorMessage}
                          </div>
                        )}
                        {log.customerId && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            לקוח: {log.customerId}
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
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  ניהול משתמשים
                </CardTitle>
                <CardDescription>
                  ניהול משתמשי BioStar וזיהוי פנים
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={() => setLocation('/sync-biostar')}
                    className="w-full"
                    variant="outline"
                  >
                    <UserCheck className="w-4 h-4 ml-2" />
                    סנכרן משתמשים מ-BioStar
                  </Button>
                  <Button
                    onClick={() => setLocation('/face-registration')}
                    className="w-full"
                    variant="outline"
                  >
                    <Users className="w-4 h-4 ml-2" />
                    רישום פנים חדש
                  </Button>
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      💡 סנכרן משתמשים מ-BioStar כדי לראות את כל המשתמשים הרשומים במערכת
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  הגדרות BioStar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">כתובת שרת</label>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    {status?.serverUrl || 'לא מוגדר'}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">סטטוס</label>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {status?.connected ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span>מחובר ומאומת</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span>מנותק</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {status?.error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-red-500">{status.error}</span>
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => refetchStatus()}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 ml-2" />
                  רענן סטטוס
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

