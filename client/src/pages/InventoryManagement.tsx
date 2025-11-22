import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, PackageSearch, TrendingDown, TrendingUp, AlertCircle, 
  Plus, Edit, Trash2, ArrowRight, Download, Filter, Search,
  BarChart3, ShoppingCart, Users, Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

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
  isActive: boolean;
}

export default function InventoryManagement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const products: Product[] = Array.isArray(productsData) 
    ? productsData 
    : (productsData as any)?.data ?? [];

  const adjustStockMutation = useMutation({
    mutationFn: async ({ id, delta, reason }: { id: string; delta: number; reason: string }) => {
      await apiRequest('POST', `/api/products/${id}/adjust-stock`, { delta });
      // Log adjustment (you can add an audit log endpoint)
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: '✅ המלאי עודכן',
        description: 'המלאי עודכן בהצלחה',
      });
      setIsAdjustDialogOpen(false);
      setSelectedProduct(null);
      setAdjustAmount('');
      setAdjustReason('');
    },
    onError: (error: any) => {
      toast({
        title: '❌ שגיאה',
        description: error.message || 'שגיאה בעדכון המלאי',
        variant: 'destructive',
      });
    },
  });

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'אזל', color: 'bg-red-500', icon: AlertCircle };
    if (stock < 5) return { label: 'נמוך', color: 'bg-yellow-500', icon: TrendingDown };
    return { label: 'תקין', color: 'bg-green-500', icon: TrendingUp };
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery || 
      p.nameHe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    
    const matchesStock = stockFilter === 'all' || 
      (stockFilter === 'out' && p.stock === 0) ||
      (stockFilter === 'low' && p.stock > 0 && p.stock < 5);
    
    return matchesSearch && matchesCategory && matchesStock && p.productType === 'product';
  });

  const lowStockProducts = products.filter(p => p.productType === 'product' && p.stock < 5 && p.stock > 0);
  const outOfStockProducts = products.filter(p => p.productType === 'product' && p.stock === 0);
  const totalValue = filteredProducts.reduce((sum, p) => sum + (parseFloat(p.price) * p.stock), 0);

  const handleAdjustStock = (product: Product) => {
    setSelectedProduct(product);
    setIsAdjustDialogOpen(true);
  };

  const handleSubmitAdjustment = () => {
    if (!selectedProduct || !adjustAmount) {
      toast({
        title: 'שגיאה',
        description: 'אנא הכנס כמות',
        variant: 'destructive',
      });
      return;
    }

    const delta = parseFloat(adjustAmount);
    if (isNaN(delta)) {
      toast({
        title: 'שגיאה',
        description: 'כמות לא תקינה',
        variant: 'destructive',
      });
      return;
    }

    adjustStockMutation.mutate({
      id: selectedProduct.id,
      delta,
      reason: adjustReason,
    });
  };

  const categories = [
    { id: 'all', label: 'הכל' },
    { id: 'tanning', label: 'שיזוף' },
    { id: 'cosmetics', label: 'קוסמטיקה' },
    { id: 'hair', label: 'מוצרי שיער' },
    { id: 'accessories', label: 'אביזרים' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
              size="icon"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                ניהול מלאי
              </h1>
              <p className="text-slate-400 mt-2">
                ניהול מלאי מתקדם עם מעקב בזמן אמת
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">סה"כ מוצרים</p>
                <p className="text-2xl font-bold text-white">{filteredProducts.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">מלאי נמוך</p>
                <p className="text-2xl font-bold text-yellow-400">{lowStockProducts.length}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">אזל מהמלאי</p>
                <p className="text-2xl font-bold text-red-400">{outOfStockProducts.length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">ערך מלאי</p>
                <p className="text-2xl font-bold text-green-400">₪{totalValue.toFixed(0)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="חפש מוצר..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[150px] bg-slate-700/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={(v: any) => setStockFilter(v)}>
              <SelectTrigger className="w-[150px] bg-slate-700/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל המלאי</SelectItem>
                <SelectItem value="low">מלאי נמוך</SelectItem>
                <SelectItem value="out">אזל מהמלאי</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-white">רשימת מוצרים</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
              <p className="text-slate-400 mt-2">טוען מוצרים...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <PackageSearch className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">לא נמצאו מוצרים</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-right p-3 text-slate-400">מוצר</th>
                    <th className="text-right p-3 text-slate-400">SKU</th>
                    <th className="text-right p-3 text-slate-400">קטגוריה</th>
                    <th className="text-right p-3 text-slate-400">מחיר</th>
                    <th className="text-right p-3 text-slate-400">מלאי</th>
                    <th className="text-right p-3 text-slate-400">סטטוס</th>
                    <th className="text-right p-3 text-slate-400">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const status = getStockStatus(product.stock);
                    return (
                      <tr key={product.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="p-3">
                          <div>
                            <p className="text-white font-medium">{product.nameHe}</p>
                            {product.brand && (
                              <p className="text-slate-400 text-sm">{product.brand}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-slate-400 text-sm">{product.sku || '-'}</td>
                        <td className="p-3 text-slate-400 text-sm">{product.category}</td>
                        <td className="p-3 text-white font-medium">₪{product.price}</td>
                        <td className="p-3">
                          <span className="text-white font-bold">{product.stock}</span>
                        </td>
                        <td className="p-3">
                          <Badge className={status.color}>
                            {status.label}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAdjustStock(product)}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Edit className="w-4 h-4 ml-1" />
                            עדכן מלאי
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Adjust Stock Dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>עדכון מלאי - {selectedProduct?.nameHe}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>כמות נוכחית: {selectedProduct?.stock}</Label>
            </div>
            <div>
              <Label>כמות לשינוי (חיובי להוספה, שלילי להפחתה)</Label>
              <Input
                type="number"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                placeholder="לדוגמה: +10 או -5"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label>סיבת השינוי (אופציונלי)</Label>
              <Input
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="לדוגמה: רכישה, החזרה, נזק"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsAdjustDialogOpen(false)}
                className="border-slate-600"
              >
                ביטול
              </Button>
              <Button
                onClick={handleSubmitAdjustment}
                disabled={adjustStockMutation.isPending}
                className="bg-gradient-to-r from-pink-500 to-purple-600"
              >
                {adjustStockMutation.isPending ? 'מעדכן...' : 'עדכן'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

