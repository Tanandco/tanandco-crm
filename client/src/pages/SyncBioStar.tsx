import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Users, CheckCircle2, XCircle, Loader2, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";

interface SyncResult {
  matched: number;
  unmatched: number;
  total: number;
  unmatchedNames: string[];
  syncedUsers: { name: string; phone: string; biostarId: string }[];
}

export default function SyncBioStar() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);

  const syncMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/sync/biostar', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'סנכרון נכשל');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setSyncResult(data);
      toast({
        title: "סנכרון הושלם!",
        description: `${data.matched} לקוחות סונכרנו בהצלחה`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה בסנכרון",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSyncResult(null);
    }
  };

  const handleSync = () => {
    if (file) {
      syncMutation.mutate(file);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 neon-text">
              סנכרון BioStar
            </h1>
            <p className="text-xl text-gray-300">
              חבר לקוחות קיימים לזיהוי הפנים שלהם ב-BioStar
            </p>
          </div>

          {/* Upload Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                העלאת קובץ BioStar CSV
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex-1">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    data-testid="input-biostar-csv"
                  />
                  <div className="
                    border-2 border-dashed border-pink-500/30
                    rounded-lg p-8
                    text-center cursor-pointer
                    hover:border-pink-500/60 hover:bg-pink-500/5
                    transition-all duration-300
                  ">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-pink-500" />
                    <p className="text-gray-300">
                      {file ? file.name : 'לחץ להעלאת קובץ CSV מ-BioStar'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      קבצים נתמכים: .csv
                    </p>
                  </div>
                </label>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="font-bold mb-2 text-blue-400">💡 כיצד לייצא מ-BioStar:</h3>
                <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                  <li>היכנס ל-BioStar 2 Cloud</li>
                  <li>עבור ל: User → User</li>
                  <li>לחץ על "Export" ובחר "CSV"</li>
                  <li>העלה את הקובץ כאן</li>
                </ol>
              </div>

              {file && (
                <Button
                  onClick={handleSync}
                  disabled={syncMutation.isPending}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  data-testid="button-sync"
                >
                  {syncMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      מסנכרן...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-5 h-5 mr-2" />
                      סנכרן לקוחות
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {syncResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  תוצאות סנכרון
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-500">
                      {syncResult.matched}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">סונכרנו</div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-500">
                      {syncResult.unmatched}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">לא נמצאו</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-500">
                      {syncResult.total}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">סה"כ</div>
                  </div>
                </div>

                {/* Synced List */}
                {syncResult.syncedUsers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-green-500">לקוחות שסונכרנו:</h3>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {syncResult.syncedUsers.map((user, index) => (
                        <div
                          key={index}
                          className="bg-gray-800/50 rounded-lg p-3 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-400">{user.phone}</div>
                          </div>
                          <div className="text-pink-500 font-bold text-sm">
                            ID: {user.biostarId}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unmatched */}
                {syncResult.unmatchedNames.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-yellow-500 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      לקוחות ב-BioStar שלא נמצאו ב-CRM:
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {syncResult.unmatchedNames.map((name, index) => (
                        <div key={index} className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2 text-sm">
                          {name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => navigate('/customers')}
                    variant="outline"
                    className="flex-1"
                    data-testid="button-view-customers"
                  >
                    צפה בלקוחות
                  </Button>
                  <Button
                    onClick={() => {
                      setFile(null);
                      setSyncResult(null);
                    }}
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600"
                    data-testid="button-sync-another"
                  >
                    סנכרן קובץ נוסף
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
