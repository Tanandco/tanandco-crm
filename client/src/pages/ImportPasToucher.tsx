import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Glasses, CheckCircle2, Loader2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";

interface ImportResult {
  imported: number;
  skipped: number;
  total: number;
  products: { name: string; color: string; price: number }[];
}

export default function ImportPasToucher() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [url, setUrl] = useState("https://www.pas-toucher.com/he/shop/");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const importMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await fetch('/api/import/pas-toucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
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
        description: `${data.imported} מוצרים יובאו בהצלחה`,
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

  const handleImport = () => {
    importMutation.mutate(url);
  };

  return (
    <PageLayout>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 neon-text">
              ייבוא PAS TOUCHER
            </h1>
            <p className="text-xl text-gray-300">
              ייבוא אוטומטי של משקפי שמש מאתר פא-טושה
            </p>
          </div>

          {/* Import Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Glasses className="w-6 h-6" />
                קישורים לייבוא
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="shop-url">קישור לחנות</Label>
                  <Input
                    id="shop-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.pas-toucher.com/he/shop/"
                    className="text-left"
                    dir="ltr"
                    data-testid="input-shop-url"
                  />
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="font-bold mb-2 text-blue-400">ℹ️ מידע על הייבוא:</h3>
                <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                  <li>המערכת תגרוף את כל המוצרים מהקישורים</li>
                  <li>תייבא שמות, מחירים, צבעים ותמונות</li>
                  <li>תדלג על מוצרים שכבר קיימים (לפי שם וצבע)</li>
                  <li>כל המוצרים יסווגו כ"משקפי שמש" מבית PAS TOUCHER</li>
                </ul>
              </div>

              <Button
                onClick={handleImport}
                disabled={importMutation.isPending}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                data-testid="button-import"
              >
                {importMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    מייבא מוצרים...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    ייבא מוצרים
                  </>
                )}
              </Button>
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
                      {importResult.imported}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">יובאו</div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-500">
                      {importResult.skipped}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">דולגו</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-500">
                      {importResult.total}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">סה"כ</div>
                  </div>
                </div>

                {/* Imported Products List */}
                {importResult.products.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-green-500">מוצרים שיובאו:</h3>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {importResult.products.map((product, index) => (
                        <div
                          key={index}
                          className="bg-gray-800/50 rounded-lg p-3 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-400">{product.color}</div>
                          </div>
                          <div className="text-pink-500 font-bold">
                            ₪{product.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => navigate('/products')}
                    variant="outline"
                    className="flex-1"
                    data-testid="button-view-products"
                  >
                    <Package className="w-4 h-4 ml-2" />
                    צפה במוצרים
                  </Button>
                  <Button
                    onClick={() => {
                      setImportResult(null);
                    }}
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600"
                    data-testid="button-import-another"
                  >
                    ייבא שוב
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
