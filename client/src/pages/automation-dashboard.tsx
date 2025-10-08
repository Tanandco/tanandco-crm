import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, TrendingDown, Activity, Pause, Play, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';

export default function AutomationDashboard() {
  const [, setLocation] = useLocation();
  const { data: campaigns, isLoading: campaignsLoading } = useQuery<any>({
    queryKey: ['/api/automation/campaigns'],
  });

  const { data: logs, isLoading: logsLoading } = useQuery<any>({
    queryKey: ['/api/automation/logs'],
  });

  if (campaignsLoading || logsLoading) {
    return (
      <div className="flex items-center justify-center h-screen" dir="rtl">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p>טוען...</p>
        </div>
      </div>
    );
  }

  const activeCampaigns = campaigns?.data?.filter((c: any) => c.status === 'active') || [];
  const pausedCampaigns = campaigns?.data?.filter((c: any) => c.status === 'paused') || [];
  const recentLogs = logs?.data?.slice(0, 20) || [];

  const totalSpend = campaigns?.data?.reduce((sum: number, c: any) => {
    return sum + (c.metrics?.spend || 0);
  }, 0) || 0;

  const totalImpressions = campaigns?.data?.reduce((sum: number, c: any) => {
    return sum + (c.metrics?.impressions || 0);
  }, 0) || 0;

  const totalClicks = campaigns?.data?.reduce((sum: number, c: any) => {
    return sum + (c.metrics?.clicks || 0);
  }, 0) || 0;

  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  return (
    <div className="min-h-screen p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => setLocation('/')}
            variant="outline"
            size="icon"
            data-testid="button-back"
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent flex-1">
            לוח בקרת אוטומציה
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card data-testid="card-total-campaigns">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">קמפיינים פעילים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeCampaigns.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {pausedCampaigns.length} מושהים
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-total-spend">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">סך ההוצאה היום</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₪{totalSpend.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                ממוצע ליום
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-total-impressions">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">חשיפות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalImpressions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalClicks.toLocaleString()} קליקים
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-avg-ctr">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">CTR ממוצע</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgCTR.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                יעד: 2%
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="campaigns" data-testid="tab-campaigns">קמפיינים</TabsTrigger>
            <TabsTrigger value="logs" data-testid="tab-logs">לוג אוטומציה</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-4">
            <div className="grid gap-4">
              {campaigns?.data?.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    אין קמפיינים במערכת
                  </CardContent>
                </Card>
              ) : (
                campaigns?.data?.map((campaign: any) => (
                  <Card key={campaign.id} data-testid={`campaign-card-${campaign.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{campaign.name}</CardTitle>
                          <CardDescription className="mt-1">
                            <Badge variant="outline" className="mr-2">
                              {campaign.platform}
                            </Badge>
                            <Badge 
                              variant={campaign.status === 'active' ? 'default' : 'secondary'}
                              data-testid={`badge-status-${campaign.id}`}
                            >
                              {campaign.status === 'active' ? 'פעיל' : 'מושהה'}
                            </Badge>
                          </CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`button-toggle-${campaign.id}`}
                        >
                          {campaign.status === 'active' ? (
                            <>
                              <Pause className="w-4 h-4 ml-2" />
                              השהה
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 ml-2" />
                              הפעל
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">תקציב יומי</p>
                          <p className="font-semibold">₪{campaign.budget}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">הוצאה</p>
                          <p className="font-semibold">
                            ₪{campaign.metrics?.spend?.toFixed(0) || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">חשיפות</p>
                          <p className="font-semibold">
                            {campaign.metrics?.impressions?.toLocaleString() || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">CTR</p>
                          <p className="font-semibold flex items-center gap-1">
                            {campaign.metrics?.ctr?.toFixed(2) || 0}%
                            {campaign.metrics?.ctr > 2 ? (
                              <TrendingUp className="w-3 h-3 text-green-500" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-red-500" />
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>פעולות אחרונות</CardTitle>
                <CardDescription>20 הפעולות האחרונות של מנוע האוטומציה</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentLogs.length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">
                      אין לוגים זמינים
                    </p>
                  ) : (
                    recentLogs.map((log: any, index: number) => (
                      <div
                        key={log.id || index}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                        data-testid={`log-entry-${index}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {log.platform}
                            </Badge>
                            <span className="font-medium">{log.action}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {log.entity} - {log.entityId}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString('he-IL')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
