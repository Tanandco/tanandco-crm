import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Package, Image as ImageIcon, AlertCircle, TrendingDown, TrendingUp, Minus, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import Logo from '@/components/Logo';

const productFormSchema = z.object({
  productType: z.enum(['product', 'service']).default('product'),
  nameHe: z.string().min(2, 'שם המוצר/שירות חייב להכיל לפחות 2 תווים'),
  name: z.string().min(2, 'Product/Service name must be at least 2 characters'),
  descriptionHe: z.string().optional(),
  description: z.string().optional(),
  price: z.string().min(1, 'חובה להזין מחיר'),
  salePrice: z.string().optional(),
  category: z.enum([
    // Physical products
    'tanning', 'cosmetics', 'accessories', 'hair', 'jewelry', 'sunglasses',
    // Services
    'sun-beds', 'spray-tan', 'hair-salon', 'massage', 'facial'
  ]),
  brand: z.enum(['Thatso', 'BALIBODY', 'AUSTRALIAN GOLD', 'PAS TOUCHER', 'OTHER']).optional(),
  sku: z.string().optional(),
  stock: z.string().default('0'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  badge: z.string().optional(),
  images: z.string().optional(),
  features: z.string().optional(),
  weight: z.string().optional(),
  // Service-specific fields
  duration: z.string().optional(), // in minutes
  sessions: z.string().optional(), // number of sessions in package
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const CATEGORY_LABELS: Record<string, string> = {
  // Physical products
  tanning: 'מוצרי שיזוף',
  cosmetics: 'קוסמטיקה',
  accessories: 'אביזרים',
  hair: 'מוצרי שיער',
  jewelry: 'תכשיטים',
  sunglasses: 'משקפי שמש',
  // Services
  'sun-beds': 'מיטות שיזוף',
  'spray-tan': 'שיזוף בהתזה',
  'hair-salon': 'שירותי מספרה',
  'massage': 'עיסויים',
  'facial': 'טיפולי פנים',
};

const BRAND_LABELS: Record<string, string> = {
  'Thatso': 'Thatso',
  'BALIBODY': 'BALIBODY',
  'AUSTRALIAN GOLD': 'AUSTRALIAN GOLD',
  'PAS TOUCHER': 'PAS TOUCHER',
  'OTHER': 'אחר',
};

export default function ProductManagement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  const { data: products, isLoading } = useQuery<any>({
    queryKey: ['/api/products'],
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productType: 'product',
      nameHe: '',
      name: '',
      descriptionHe: '',
      description: '',
      price: '',
      salePrice: '',
      category: 'cosmetics',
      brand: undefined,
      sku: '',
      stock: '0',
      isActive: true,
      isFeatured: false,
      badge: '',
      images: '',
      features: '',
      weight: '',
      duration: '',
      sessions: '',
    },
  });

  // Watch productType to show/hide relevant fields
  const productType = form.watch('productType');

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        price: parseFloat(data.price),
        salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
        stock: parseInt(data.stock),
        weight: data.weight ? parseFloat(data.weight) : null,
        duration: data.duration ? parseInt(data.duration) : null,
        sessions: data.sessions ? parseInt(data.sessions) : null,
        images: data.images ? data.images.split('\n').filter(Boolean) : [],
        features: data.features ? data.features.split('\n').filter(Boolean) : [],
      };
      
      if (editingProduct) {
        return await apiRequest('PATCH', `/api/products/${editingProduct.id}`, payload);
      } else {
        return await apiRequest('POST', '/api/products', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: editingProduct ? '✅ המוצר עודכן' : '✅ המוצר נוסף',
        description: editingProduct ? 'המוצר עודכן בהצלחה' : 'המוצר נוסף לחנות',
      });
      setIsDialogOpen(false);
      setEditingProduct(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: '❌ שגיאה',
        description: error.message || 'אירעה שגיאה בשמירת המוצר',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: '✅ המוצר נמחק',
        description: 'המוצר הוסר מהחנות',
      });
    },
  });

  const quickStockMutation = useMutation({
    mutationFn: async ({ id, delta }: { id: string; delta: number }) => {
      return await apiRequest('POST', `/api/products/${id}/adjust-stock`, { delta });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
  });

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    form.reset({
      productType: product.productType || 'product',
      nameHe: product.nameHe || '',
      name: product.name || '',
      descriptionHe: product.descriptionHe || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      salePrice: product.salePrice?.toString() || '',
      category: product.category || 'cosmetics',
      brand: product.brand || undefined,
      sku: product.sku || '',
      stock: product.stock?.toString() || '0',
      isActive: product.isActive ?? true,
      isFeatured: product.isFeatured ?? false,
      badge: product.badge || '',
      images: product.images?.join('\n') || '',
      features: product.features?.join('\n') || '',
      weight: product.weight?.toString() || '',
      duration: product.duration?.toString() || '',
      sessions: product.sessions?.toString() || '',
    });
    setIsDialogOpen(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'אזל', color: 'bg-red-500', icon: AlertCircle };
    if (stock < 5) return { label: 'נמוך', color: 'bg-yellow-500', icon: TrendingDown };
    return { label: 'תקין', color: 'bg-green-500', icon: TrendingUp };
  };

  const filteredProducts = products?.filter((product: any) => {
    if (product.productType !== 'product') return stockFilter === 'all';
    if (stockFilter === 'out') return product.stock === 0;
    if (stockFilter === 'low') return product.stock > 0 && product.stock < 5;
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
              size="icon"
              data-testid="button-back"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Logo size="header" showGlow={false} showUnderline={false} />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                ניהול מלאים
              </h1>
              <p className="text-muted-foreground">נהל את המלאי והמוצרים בחנות</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleNewProduct}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                data-testid="button-add-product"
              >
                <Plus className="w-4 h-4 ml-2" />
                הוסף מוצר חדש
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'ערוך מוצר' : 'הוסף מוצר חדש'}
                </DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                  {/* Product Type Selection */}
                  <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>סוג *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-productType">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="product">מוצר פיזי</SelectItem>
                            <SelectItem value="service">שירות</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nameHe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>שם המוצר (עברית) *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-nameHe" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name (English) *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>קטגוריה *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-category">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>מותג</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-brand">
                                <SelectValue placeholder="בחר מותג" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(BRAND_LABELS).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>מחיר (₪) *</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} data-testid="input-price" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="salePrice"
                      render={({ field}) => (
                        <FormItem>
                          <FormLabel>מחיר מבצע (₪)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} data-testid="input-salePrice" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {productType === 'product' && (
                      <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>מלאי</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} data-testid="input-stock" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {/* Service-specific fields */}
                  {productType === 'service' && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>משך זמן (דקות)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} data-testid="input-duration" placeholder="לדוגמה: 30" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sessions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>מספר כניסות בחבילה</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} data-testid="input-sessions" placeholder="לדוגמה: 10" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {productType === 'product' && (
                      <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>קוד מוצר (SKU)</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-sku" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="badge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>תג (חדש, הכי נמכר...)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="לדוגמה: הכי נמכר" data-testid="input-badge" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="descriptionHe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>תיאור (עברית)</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} data-testid="input-descriptionHe" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>תמונות (URL אחד בכל שורה)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={3} 
                            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                            data-testid="input-images"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>תכונות (תכונה אחת בכל שורה)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            rows={3} 
                            placeholder="עמיד במים&#10;ללא פרבנים&#10;טבעוני"
                            data-testid="input-features"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-6">
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-isActive"
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">פעיל</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-isFeatured"
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">מוצר מומלץ (יוצג בקרוסלה)</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500"
                      disabled={createMutation.isPending}
                      data-testid="button-submit-product"
                    >
                      {createMutation.isPending ? 'שומר...' : (editingProduct ? 'עדכן מוצר' : 'הוסף מוצר')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      data-testid="button-cancel"
                    >
                      ביטול
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stock Filter & Stats */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            onClick={() => setStockFilter('all')}
            variant={stockFilter === 'all' ? 'default' : 'outline'}
            className={stockFilter === 'all' ? 'bg-gradient-to-r from-pink-500 to-purple-500' : ''}
            data-testid="filter-all"
          >
            <Package className="w-4 h-4 ml-2" />
            הכל ({products?.length || 0})
          </Button>
          <Button
            onClick={() => setStockFilter('low')}
            variant={stockFilter === 'low' ? 'default' : 'outline'}
            className={stockFilter === 'low' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
            data-testid="filter-low"
          >
            <TrendingDown className="w-4 h-4 ml-2" />
            מלאי נמוך ({products?.filter((p: any) => p.productType === 'product' && p.stock > 0 && p.stock < 5).length || 0})
          </Button>
          <Button
            onClick={() => setStockFilter('out')}
            variant={stockFilter === 'out' ? 'default' : 'outline'}
            className={stockFilter === 'out' ? 'bg-red-600 hover:bg-red-700' : ''}
            data-testid="filter-out"
          >
            <AlertCircle className="w-4 h-4 ml-2" />
            אזל מהמלאי ({products?.filter((p: any) => p.productType === 'product' && p.stock === 0).length || 0})
          </Button>
          <Button
            onClick={handleNewProduct}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            data-testid="button-add-product-top"
          >
            <Plus className="w-4 h-4 ml-2" />
            הוסף מוצר
          </Button>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 animate-spin mx-auto mb-4" />
            <p>טוען מוצרים...</p>
          </div>
        ) : products?.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl font-semibold mb-2">אין מוצרים עדיין</p>
              <p className="text-muted-foreground mb-4">התחל להוסיף מוצרים לחנות שלך</p>
              <Button onClick={handleNewProduct} data-testid="button-add-first-product">
                <Plus className="w-4 h-4 ml-2" />
                הוסף מוצר ראשון
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product: any) => {
              const stockStatus = product.productType === 'product' ? getStockStatus(product.stock || 0) : null;
              const StockIcon = stockStatus?.icon;
              
              return (
              <Card key={product.id} className="overflow-hidden" data-testid={`product-card-${product.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{product.nameHe}</CardTitle>
                      {product.brand && (
                        <Badge variant="outline" className="mt-1">
                          {product.brand}
                        </Badge>
                      )}
                    </div>
                    {product.badge && (
                      <Badge className="bg-pink-500">{product.badge}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {product.images?.[0] && (
                    <div 
                      className="w-full h-40 rounded-lg mb-3 bg-cover bg-center"
                      style={{ backgroundImage: `url(${product.images[0]})` }}
                    />
                  )}
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">סוג:</span>
                      <Badge variant={product.productType === 'service' ? 'default' : 'secondary'}>
                        {product.productType === 'service' ? 'שירות' : 'מוצר'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">מחיר:</span>
                      <span className="font-semibold">
                        {product.salePrice ? (
                          <>
                            <span className="line-through text-muted-foreground ml-2">₪{product.price}</span>
                            <span className="text-pink-500">₪{product.salePrice}</span>
                          </>
                        ) : (
                          `₪${product.price}`
                        )}
                      </span>
                    </div>
                    {product.productType === 'product' ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">מלאי:</span>
                          <div className="flex items-center gap-2">
                            {stockStatus && StockIcon && (
                              <StockIcon className="w-4 h-4" style={{ color: stockStatus.color.replace('bg-', '') === 'red-500' ? '#ef4444' : stockStatus.color.replace('bg-', '') === 'yellow-500' ? '#eab308' : '#22c55e' }} />
                            )}
                            <Badge className={stockStatus?.color}>
                              {product.stock} {stockStatus?.label && `(${stockStatus.label})`}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => quickStockMutation.mutate({ id: product.id, delta: -1 })}
                            disabled={quickStockMutation.isPending || product.stock === 0}
                            className="flex-1"
                            data-testid={`button-decrease-stock-${product.id}`}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => quickStockMutation.mutate({ id: product.id, delta: 1 })}
                            disabled={quickStockMutation.isPending}
                            className="flex-1"
                            data-testid={`button-increase-stock-${product.id}`}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => quickStockMutation.mutate({ id: product.id, delta: 10 })}
                            disabled={quickStockMutation.isPending}
                            className="flex-1"
                            data-testid={`button-add-10-stock-${product.id}`}
                          >
                            +10
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        {product.duration && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">משך זמן:</span>
                            <span>{product.duration} דקות</span>
                          </div>
                        )}
                        {product.sessions && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">כניסות בחבילה:</span>
                            <span>{product.sessions}</span>
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">קטגוריה:</span>
                      <span>{CATEGORY_LABELS[product.category as keyof typeof CATEGORY_LABELS]}</span>
                    </div>
                    {product.sku && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SKU:</span>
                        <span className="font-mono text-xs">{product.sku}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(product)}
                      data-testid={`button-edit-${product.id}`}
                    >
                      <Edit className="w-4 h-4 ml-1" />
                      ערוך
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(product.id)}
                      data-testid={`button-delete-${product.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
