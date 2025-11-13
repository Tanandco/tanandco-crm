import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Search, ShoppingCart, X, Plus, Minus, Filter, 
  Star, Package, ArrowRight, Heart, Share2, 
  TrendingUp, Sparkles, Sun, Sparkle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import Logo from '@/components/Logo';

interface Product {
  id: string;
  name: string;
  nameHe: string;
  price: string;
  salePrice?: string;
  category: string;
  productType: 'product' | 'service';
  stock?: number;
  brand?: string;
  images?: string[];
  badge?: string;
  tanningType?: string;
  bronzerStrength?: number;
  isFeatured?: boolean;
  description?: string;
  descriptionHe?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const CATEGORIES = [
  { id: 'all', label: 'הכל', icon: Package },
  { id: 'bed-bronzer', label: 'ברונזרים למיטות', icon: Sun },
  { id: 'self-tanning', label: 'שיזוף עצמי ביתי', icon: Sparkle },
  { id: 'hair', label: 'מוצרי שיער', icon: Sparkles },
  { id: 'cosmetics', label: 'קוסמטיקה', icon: Star },
  { id: 'accessories', label: 'אביזרים', icon: Package },
  { id: 'sunglasses', label: 'משקפי שמש', icon: Sun },
  { id: 'seasonal', label: 'מוצרים עונתיים', icon: TrendingUp },
];

export default function OnlineShop() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);

  // Fetch all products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const products: Product[] = Array.isArray(productsData) 
    ? productsData 
    : (productsData as any)?.data ?? [];

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Filter by category
      if (selectedCategory === 'all') {
        // Show all products
      } else if (selectedCategory === 'bed-bronzer') {
        if (p.tanningType !== 'bed-bronzer') return false;
      } else if (selectedCategory === 'self-tanning') {
        if (p.tanningType !== 'self-tanning') return false;
      } else if (selectedCategory === 'seasonal') {
        // Seasonal products - could be marked with badge 'seasonal' or specific category
        if (p.badge !== 'seasonal' && !p.category.includes('seasonal')) return false;
      } else {
        if (p.category !== selectedCategory) return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          p.nameHe.toLowerCase().includes(query) ||
          p.name.toLowerCase().includes(query) ||
          (p.brand || '').toLowerCase().includes(query) ||
          (p.descriptionHe || '').toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  // Group products by category for display
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    
    filteredProducts.forEach(product => {
      let categoryKey = product.category;
      
      if (product.tanningType === 'bed-bronzer') {
        categoryKey = 'bed-bronzer';
      } else if (product.tanningType === 'self-tanning') {
        categoryKey = 'self-tanning';
      }
      
      if (!grouped[categoryKey]) {
        grouped[categoryKey] = [];
      }
      grouped[categoryKey].push(product);
    });
    
    return grouped;
  }, [filteredProducts]);

  // Cart operations
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }

    toast({
      title: '✨ נוסף לעגלה',
      description: `${product.nameHe} נוסף בהצלחה`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: 'העגלה נוקתה',
      description: 'כל הפריטים הוסרו',
    });
  };

  const totalAmount = cart.reduce((sum, item) => 
    sum + (parseFloat(item.product.salePrice || item.product.price) * item.quantity), 0
  );

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      // Prepare items for payment
      const items = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productNameHe: item.product.nameHe,
        quantity: item.quantity,
        unitPrice: item.product.salePrice || item.product.price,
      }));

      // Create payment session for products
      const baseUrl = window.location.origin;
      const response = await apiRequest('POST', '/api/payments/cardcom/products', {
        items,
        totalAmount: totalAmount.toString(),
        customerName: 'לקוח אונליין',
        customerPhone: '0500000000', // Will be collected in checkout form
        successUrl: `${baseUrl}/payment-success?source=shop`,
        errorUrl: `${baseUrl}/payment-error?source=shop`,
      });

      return response.json();
    },
    onSuccess: (data: any) => {
      if (data.data?.url) {
        window.location.href = data.data.url;
      } else {
        toast({
          title: '❌ שגיאה',
          description: 'לא ניתן ליצור תשלום',
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: '❌ שגיאה',
        description: error.message || 'שגיאה בתהליך התשלום',
        variant: 'destructive',
      });
    },
  });

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: 'העגלה ריקה',
        description: 'הוסף מוצרים לפני ביצוע תשלום',
        variant: 'destructive',
      });
      return;
    }

    checkoutMutation.mutate();
  };

  const getCategoryLabel = (category: string) => {
    const cat = CATEGORIES.find(c => c.id === category);
    return cat?.label || category;
  };

  const getPrice = (product: Product) => {
    return product.salePrice ? parseFloat(product.salePrice) : parseFloat(product.price);
  };

  const getOriginalPrice = (product: Product) => {
    return product.salePrice ? parseFloat(product.price) : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-pink-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
              size="icon"
              className="border-pink-500/30 hover:border-pink-500/50"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="חפש מוצרים..."
                  className="pr-10 bg-slate-900/50 border-pink-500/30"
                />
              </div>
            </div>

            <Button
              onClick={() => setShowCart(true)}
              variant="outline"
              className="relative border-pink-500/30 hover:border-pink-500/50"
            >
              <ShoppingCart className="w-5 h-5 ml-2" />
              עגלה
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-pink-500 text-white">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                className={`whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600'
                    : 'border-pink-500/30 hover:border-pink-500/50'
                }`}
              >
                <Icon className="w-4 h-4 ml-2" />
                {category.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 pb-8">
        {isLoading ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto mb-4 animate-spin text-pink-500" />
            <p className="text-gray-400">טוען מוצרים...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400">
              {searchQuery ? `לא נמצאו תוצאות עבור "${searchQuery}"` : 'לא נמצאו מוצרים בקטגוריה זו'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const price = getPrice(product);
              const originalPrice = getOriginalPrice(product);
              const inStock = (product.stock || 0) > 0 || product.productType === 'service';
              
              return (
                <Card
                  key={product.id}
                  className="group cursor-pointer bg-gradient-to-br from-slate-900/90 via-black/80 to-slate-800/90 border-pink-500/30 hover:border-pink-500/50 transition-all overflow-hidden"
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowProductDialog(true);
                  }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.nameHe}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                        <Package className="w-16 h-16 text-pink-500/50" />
                      </div>
                    )}
                    
                    {product.badge && (
                      <Badge className="absolute top-2 right-2 bg-pink-500">
                        {product.badge === 'new' ? 'חדש' :
                         product.badge === 'bestseller' ? 'רב מכר' :
                         product.badge === 'sale' ? 'מבצע' :
                         product.badge === 'limited' ? 'מוגבל' :
                         product.badge === 'seasonal' ? 'עונתי' :
                         product.badge}
                      </Badge>
                    )}

                    {!inStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Badge variant="destructive">אזל מהמלאי</Badge>
                      </div>
                    )}

                    {product.salePrice && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        {Math.round((1 - parseFloat(product.salePrice) / parseFloat(product.price)) * 100)}% הנחה
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-white line-clamp-2 min-h-[3rem]">
                        {product.nameHe}
                      </h3>
                      
                      {product.brand && (
                        <p className="text-xs text-gray-400">{product.brand}</p>
                      )}

                      {product.bronzerStrength && (
                        <Badge variant="outline" className="text-xs">
                          דרגה {product.bronzerStrength}
                        </Badge>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-pink-400">
                              ₪{price.toFixed(2)}
                            </span>
                            {originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ₪{originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          {product.productType === 'product' && product.stock !== undefined && (
                            <p className="text-xs text-gray-500">
                              {product.stock > 0 ? `במלאי: ${product.stock}` : 'אזל מהמלאי'}
                            </p>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (inStock) {
                            addToCart(product);
                          }
                        }}
                        disabled={!inStock}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        size="sm"
                      >
                        <ShoppingCart className="w-4 h-4 ml-2" />
                        {inStock ? 'הוסף לעגלה' : 'אזל מהמלאי'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Shopping Cart Dialog */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              עגלת קניות ({cart.length})
            </DialogTitle>
            <DialogDescription>
              {cart.length > 0 ? 'פריטים בעגלה שלך' : 'העגלה ריקה'}
            </DialogDescription>
          </DialogHeader>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400">העגלה ריקה</p>
              <Button
                onClick={() => setShowCart(false)}
                className="mt-4"
                variant="outline"
              >
                המשך לקניות
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cart.map((item) => {
                  const price = getPrice(item.product);
                  return (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                    >
                      {item.product.images && item.product.images[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.nameHe}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      )}
                      
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{item.product.nameHe}</h4>
                        <p className="text-sm text-gray-400">
                          ₪{price.toFixed(2)} × {item.quantity}
                        </p>
                        <p className="text-lg font-bold text-pink-400">
                          ₪{(price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <Button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => removeFromCart(item.product.id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-700 pt-4 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-400">סה"כ:</span>
                  <span className="text-2xl font-bold text-white">
                    ₪{totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={clearCart}
                    variant="outline"
                    className="flex-1"
                  >
                    נקה עגלה
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    disabled={checkoutMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    {checkoutMutation.isPending ? 'מעבד...' : 'המשך לתשלום'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Product Details Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.nameHe}</DialogTitle>
                <DialogDescription>
                  {selectedProduct.brand && `${selectedProduct.brand} | `}
                  {getCategoryLabel(selectedProduct.category)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {selectedProduct.images && selectedProduct.images[0] && (
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.nameHe}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}

                {selectedProduct.descriptionHe && (
                  <p className="text-gray-300">{selectedProduct.descriptionHe}</p>
                )}

                {selectedProduct.bronzerStrength && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">דרגת ברונזר:</p>
                    <Badge>{selectedProduct.bronzerStrength}</Badge>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-pink-400">
                        ₪{getPrice(selectedProduct).toFixed(2)}
                      </span>
                      {getOriginalPrice(selectedProduct) && (
                        <span className="text-lg text-gray-500 line-through">
                          ₪{getOriginalPrice(selectedProduct)!.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {selectedProduct.productType === 'product' && selectedProduct.stock !== undefined && (
                      <p className="text-sm text-gray-400 mt-1">
                        {selectedProduct.stock > 0 ? `במלאי: ${selectedProduct.stock} יחידות` : 'אזל מהמלאי'}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      const inStock = (selectedProduct.stock || 0) > 0 || selectedProduct.productType === 'service';
                      if (inStock) {
                        addToCart(selectedProduct);
                        setShowProductDialog(false);
                      }
                    }}
                    disabled={(selectedProduct.stock || 0) === 0 && selectedProduct.productType === 'product'}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    <ShoppingCart className="w-4 h-4 ml-2" />
                    הוסף לעגלה
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

