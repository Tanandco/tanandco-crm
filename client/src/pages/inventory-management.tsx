import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Package, Search, Plus, Minus, Edit, AlertTriangle, 
  TrendingDown, TrendingUp, ArrowRight, RefreshCw,
  Filter, Download, Upload, History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  nameHe: string;
  price: string;
  stock: number;
  category: string;
  productType: 'product' | 'service';
  brand?: string;
  sku?: string;
}

interface StockMovement {
  id: string;
  productId: string;
  movementType: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceType?: string;
  notes?: string;
  createdAt: string;
}

export default function InventoryManagement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('');
  const [adjustmentNotes, setAdjustmentNotes] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'adjustment' | 'purchase' | 'return' | 'damage'>('adjustment');

  // Fetch products
  const { data: productsData, isLoading: productsLoading, refetch: refetchProducts } = useQuery({
    queryKey: ['/api/products'],
  });

  // Fetch stock movements
  const { data: movementsData } = useQuery<{ success: boolean; data: StockMovement[] }>({
    queryKey: ['/api/pos/stock-movements'],
  });

  const products: Product[] = Array.isArray(productsData) 
    ? productsData 
    : (productsData as any)?.data ?? [];

  const movements = movementsData?.data || [];

  // Filter products
  const filteredProducts = products.filter(p => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.nameHe.toLowerCase().includes(query) ||
      p.name.toLowerCase().includes(query) ||
      (p.brand || '').toLowerCase().includes(query) ||
      (p.sku || '').toLowerCase().includes(query)
    );
  });

  // Low stock products (stock < 5)
  const lowStockProducts = filteredProducts.filter(p => 
    p.productType === 'product' && (p.stock || 0) < 5
  );

  // Out of stock products
  const outOfStockProducts = filteredProducts.filter(p => 
    p.productType === 'product' && (p.stock || 0) === 0
  );

  // Adjust stock mutation
  const adjustStockMutation = useMutation({
    mutationFn: async ({ productId, quantity, type, notes }: {
      productId: string;
      quantity: number;
      type: string;
      notes: string;
    }) => {
      // Get current product
      const productResponse = await apiRequest('GET', `/api/products/${productId}`);
      const product = await productResponse.json();
      
      const previousStock = product.stock || 0;
      const newStock = Math.max(0, previousStock + quantity);

      // Update product stock
      await apiRequest('POST', `/api/products/${productId}/adjust-stock`, {
        delta: quantity
      });

      // Create stock movement record
      await apiRequest('POST', '/api/pos/stock-movements', {
        productId,
        movementType: type,
        quantity,
        previousStock,
        newStock,
        referenceType: 'manual',
        notes,
      });

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pos/stock-movements'] });
      setAdjustmentDialogOpen(false);
      setAdjustmentQuantity('');
      setAdjustmentNotes('');
      setSelectedProduct(null);
      toast({
        title: '✅ מלאי עודכן',
        description: 'המלאי עודכן בהצלחה',
      });
    },
    onError: (error: any) => {
      toast({
        title: '❌ שגיאה',
        description: error.message || 'שגיאה בעדכון המלאי',
        variant: 'destructive',
      });
    },
  });

  const handleAdjustStock = () => {
    if (!selectedProduct || !adjustmentQuantity) return;
    
    const quantity = parseInt(adjustmentQuantity);
    if (isNaN(quantity) || quantity === 0) {
      toast({
        title: 'שגיאה',
        description: 'נא להזין כמות תקינה',
        variant: 'destructive',
      });
      return;
    }

    // For adjustments, allow negative values
    // For purchase, only positive
    // For return/damage, handle accordingly
    let finalQuantity = quantity;
    if (adjustmentType === 'purchase') {
      finalQuantity = Math.abs(quantity);
    } else if (adjustmentType === 'damage' || adjustmentType === 'return') {
      finalQuantity = -Math.abs(quantity);
    }

    adjustStockMutation.mutate({
      productId: selectedProduct.id,
      quantity: finalQuantity,
      type: adjustmentType,
      notes: adjustmentNotes || `${adjustmentType} - manual adjustment`,
    });
  };

  const getMovementTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'sale': 'מכירה',
      'purchase': 'רכישה',
      'adjustment': 'תיקון',
      'return': 'החזרה',
      'damage': 'נזק',
      'transfer': 'העברה',
    };
    return labels[type] || type;
  };

  const getMovementTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'sale': 'bg-red-500/10 text-red-500 border-red-500/30',
      'purchase': 'bg-green-500/10 text-green-500 border-green-500/30',
      'adjustment': 'bg-blue-500/10 text-blue-500 border-blue-500/30',
      'return': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
      'damage': 'bg-orange-500/10 text-orange-500 border-orange-500/30',
      'transfer': 'bg-purple-500/10 text-purple-500 border-purple-500/30',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-500 border-gray-500/30';
  };

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
            <h1 className="text-3xl font-bold">ניהול מלאי</h1>
            <Button
              onClick={() => refetchProducts()}
              variant="outline"
              size="icon"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">סה"כ מוצרים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredProducts.filter(p => p.productType === 'product').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">ערך מלאי כולל</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₪{filteredProducts
                  .filter(p => p.productType === 'product')
                  .reduce((sum, p) => sum + (parseFloat(p.price) * (p.stock || 0)), 0)
                  .toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                מלאי נמוך
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{lowStockProducts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                אזל מהמלאי
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{outOfStockProducts.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">מוצרים</TabsTrigger>
            <TabsTrigger value="movements">תנועות מלאי</TabsTrigger>
            <TabsTrigger value="alerts">התראות</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>רשימת מוצרים</CardTitle>
                    <CardDescription>ניהול מלאי מוצרים</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="חפש מוצר..."
                      className="pr-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="text-center py-8 text-gray-400">טוען...</div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredProducts
                      .filter(p => p.productType === 'product')
                      .map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-pink-500/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold">{product.nameHe}</h3>
                              {product.brand && (
                                <Badge variant="outline">{product.brand}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">
                              {product.category} | SKU: {product.sku || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-400">
                              מחיר: ₪{product.price}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${
                                (product.stock || 0) === 0 ? 'text-red-500' :
                                (product.stock || 0) < 5 ? 'text-yellow-500' :
                                'text-green-500'
                              }`}>
                                {product.stock || 0}
                              </div>
                              <div className="text-xs text-gray-400">במלאי</div>
                            </div>
                            <Button
                              onClick={() => {
                                setSelectedProduct(product);
                                setAdjustmentDialogOpen(true);
                              }}
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="w-4 h-4 ml-2" />
                              עדכן
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Movements Tab */}
          <TabsContent value="movements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>היסטוריית תנועות מלאי</CardTitle>
                <CardDescription>כל השינויים במלאי</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {movements.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">אין תנועות מלאי</div>
                  ) : (
                    movements.map((movement) => {
                      const product = products.find(p => p.id === movement.productId);
                      return (
                        <div
                          key={movement.id}
                          className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={getMovementTypeColor(movement.movementType)}>
                                {getMovementTypeLabel(movement.movementType)}
                              </Badge>
                              <span className="font-medium">
                                {product?.nameHe || 'מוצר לא נמצא'}
                              </span>
                            </div>
                            <span className="text-sm text-gray-400">
                              {new Date(movement.createdAt).toLocaleString('he-IL')}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">מלאי קודם:</span>
                              <span className="font-medium">{movement.previousStock}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {movement.quantity > 0 ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              )}
                              <span className={movement.quantity > 0 ? 'text-green-500' : 'text-red-500'}>
                                {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">מלאי חדש:</span>
                              <span className="font-bold">{movement.newStock}</span>
                            </div>
                          </div>
                          {movement.notes && (
                            <p className="text-xs text-gray-500 mt-2">{movement.notes}</p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  התראות מלאי
                </CardTitle>
                <CardDescription>מוצרים שצריך להזמין</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {outOfStockProducts.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-red-500 mb-2">אזל מהמלאי ({outOfStockProducts.length})</h3>
                      <div className="space-y-2">
                        {outOfStockProducts.map((product) => (
                          <div
                            key={product.id}
                            className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{product.nameHe}</span>
                              <Button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setAdjustmentType('purchase');
                                  setAdjustmentDialogOpen(true);
                                }}
                                variant="outline"
                                size="sm"
                              >
                                הוסף מלאי
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {lowStockProducts.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-yellow-500 mb-2">מלאי נמוך ({lowStockProducts.length})</h3>
                      <div className="space-y-2">
                        {lowStockProducts.map((product) => (
                          <div
                            key={product.id}
                            className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium">{product.nameHe}</span>
                                <span className="text-sm text-gray-400 mr-2">
                                  - נשאר {product.stock} יחידות
                                </span>
                              </div>
                              <Button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setAdjustmentType('purchase');
                                  setAdjustmentDialogOpen(true);
                                }}
                                variant="outline"
                                size="sm"
                              >
                                הוסף מלאי
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      אין התראות מלאי
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Adjustment Dialog */}
        <Dialog open={adjustmentDialogOpen} onOpenChange={setAdjustmentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>עדכון מלאי</DialogTitle>
              <DialogDescription>
                {selectedProduct?.nameHe}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>סוג עדכון</Label>
                <select
                  value={adjustmentType}
                  onChange={(e) => setAdjustmentType(e.target.value as any)}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md"
                >
                  <option value="purchase">רכישה</option>
                  <option value="adjustment">תיקון ידני</option>
                  <option value="return">החזרה</option>
                  <option value="damage">נזק/פגם</option>
                </select>
              </div>
              <div>
                <Label>כמות {adjustmentType === 'purchase' ? '(חיובית)' : adjustmentType === 'damage' || adjustmentType === 'return' ? '(שלילית)' : '(חיובית/שלילית)'}</Label>
                <Input
                  type="number"
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(e.target.value)}
                  placeholder="הזן כמות"
                />
              </div>
              <div>
                <Label>הערות</Label>
                <Input
                  value={adjustmentNotes}
                  onChange={(e) => setAdjustmentNotes(e.target.value)}
                  placeholder="הערות (אופציונלי)"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAdjustStock}
                  disabled={adjustStockMutation.isPending}
                  className="flex-1"
                >
                  {adjustStockMutation.isPending ? 'מעדכן...' : 'עדכן מלאי'}
                </Button>
                <Button
                  onClick={() => {
                    setAdjustmentDialogOpen(false);
                    setSelectedProduct(null);
                    setAdjustmentQuantity('');
                    setAdjustmentNotes('');
                  }}
                  variant="outline"
                >
                  ביטול
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

