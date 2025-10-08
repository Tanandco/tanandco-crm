import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileSpreadsheet, CheckCircle2, XCircle, Loader2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PageLayout from "@/components/PageLayout";

interface ImportResult {
  success: number;
  failed: number;
  total: number;
  errors: string[];
  created: { name: string; phone: string; balance: number }[];
}

export default function ImportSubscribers() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/import/subscribers', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'ייבוא נכשל');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setImportResult(data);
      toast({
        title: "ייבוא הושלם!",
        description: `${data.success} מנויים יובאו בהצלחה`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה בייבוא",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImportResult(null);
    }
  };

  const handleImport = () => {
    if (file) {
      importMutation.mutate(file);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 neon-text">
              ייבוא מנויים
            </h1>
            <p className="text-xl text-gray-300">
              העלה קובץ Excel עם רשימת המנויים
            </p>
          </div>

          {/* Upload Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6" />
                העלאת קובץ Excel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex-1">
                  <input
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                    data-testid="input-excel-file"
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
                      {file ? file.name : 'לחץ להעלאת קובץ Excel'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      קבצים נתמכים: .xls, .xlsx
                    </p>
                  </div>
                </label>
              </div>

              {file && (
                <Button
                  onClick={handleImport}
                  disabled={importMutation.isPending}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  data-testid="button-import"
                >
                  {importMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      מייבא מנויים...
                    </>
                  ) : (
                    <>
                      <Users className="w-5 h-5 mr-2" />
                      ייבא מנויים
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {importResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  תוצאות ייבוא
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-500">
                      {importResult.success}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">הצליחו</div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-red-500">
                      {importResult.failed}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">נכשלו</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-500">
                      {importResult.total}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">סה"כ</div>
                  </div>
                </div>

                {/* Created List */}
                {importResult.created.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-green-500">מנויים שיובאו:</h3>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {importResult.created.map((item, index) => (
                        <div
                          key={index}
                          className="bg-gray-800/50 rounded-lg p-3 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-400">{item.phone}</div>
                          </div>
                          <div className="text-pink-500 font-bold">
                            {item.balance} כניסות
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Errors */}
                {importResult.errors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-red-500 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      שגיאות:
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {importResult.errors.map((error, index) => (
                        <div key={index} className="bg-red-500/10 border border-red-500/30 rounded p-2 text-sm">
                          {error}
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
                      setImportResult(null);
                    }}
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600"
                    data-testid="button-import-another"
                  >
                    ייבא קובץ נוסף
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
