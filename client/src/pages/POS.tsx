import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import Logo from '@/components/Logo';

interface Product {
  id: string;
  name: string;
  nameHe: string;
  price: string;
  category: string;
  productType: 'product' | 'service';
  stock?: number;
  brand?: string;
  images?: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function POS() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const products: Product[] = Array.isArray(productsData) 
    ? productsData 
    : (productsData as any)?.data ?? (productsData as any)?.products ?? [];

  const categories = [
    { id: 'all', label: 'הכל' },
    { id: 'tanning', label: 'שיזוף' },
    { id: 'cosmetics', label: 'קוסמטיקה' },
    { id: 'hair', label: 'מוצרי שיער' },
    { id: 'sun-beds', label: 'מיטות שיזוף' },
    { id: 'spray-tan', label: 'ריסוס שיזוף' },
    { id: 'hair-salon', label: 'שירותי שיער' },
  ];

  const filteredProducts = products.filter(p => {
    if (!searchQuery.trim()) {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesCategory;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const nameHe = p.nameHe.toLowerCase();
    const nameEn = p.name.toLowerCase();
    const brand = (p.brand || '').toLowerCase();
    
    const matchesSearch = 
      nameHe.includes(query) || 
      nameEn.includes(query) || 
      brand.includes(query) ||
      nameHe.split(' ').some(word => word.startsWith(query)) ||
      nameEn.split(' ').some(word => word.startsWith(query));
    
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
      title: "נוסף לעגלה",
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
      title: "העגלה נוקתה",
      description: "כל הפריטים הוסרו",
    });
  };

  const totalAmount = cart.reduce((sum, item) => 
    sum + (parseFloat(item.product.price) * item.quantity), 0
  );

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "העגלה ריקה",
        description: "הוסף מוצרים לפני ביצוע תשלום",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "מעבר לתשלום",
      description: `סה"כ לתשלום: ₪${totalAmount.toFixed(2)}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="small" />
            <h1 
              className="text-3xl font-bold text-white"
              style={{
                textShadow: '0 0 20px rgba(69, 114, 182, 0.6)',
              }}
              data-testid="text-pos-title"
            >
              קופה
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חפש מוצר או שירות... (הקלד כדי לחפש)"
                className="pr-10 bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-500"
                data-testid="input-search"
                autoFocus
              />
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery('')}
                  variant="ghost"
                  size="icon"
                  className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-white"
                  data-testid="button-clear-search"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Categories */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <Button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  className={selectedCategory === cat.id ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  data-testid={`button-category-${cat.id}`}
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto">
              {isLoading ? (
                <div className="col-span-full text-center py-12 text-gray-400">טוען מוצרים...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-400">
                  {searchQuery ? `לא נמצאו תוצאות עבור "${searchQuery}"` : 'לא נמצאו מוצרים'}
                </div>
              ) : (
                filteredProducts.map(product => (
                  <Card
                    key={product.id}
                    className="p-4 bg-slate-800/50 border-blue-500/30 hover:border-blue-500/60 transition-all cursor-pointer"
                    onClick={() => addToCart(product)}
                    data-testid={`card-product-${product.id}`}
                  >
                    {product.images && product.images[0] && (
                      <img 
                        src={product.images[0]} 
                        alt={product.nameHe}
                        className="w-full h-32 object-cover rounded-md mb-2"
                      />
                    )}
                    <h3 className="text-white font-semibold mb-1 text-sm">{product.nameHe}</h3>
                    {product.brand && (
                      <p className="text-gray-400 text-xs mb-2">{product.brand}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 font-bold">₪{product.price}</span>
                      {product.productType === 'product' && product.stock !== undefined && (
                        <span className="text-xs text-gray-500">במלאי: {product.stock}</span>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <Card 
              className="p-6 bg-slate-800/50 border-blue-500/30 sticky top-6"
              style={{
                boxShadow: '0 0 40px rgba(69, 114, 182, 0.3)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">עגלה</h2>
                </div>
                {cart.length > 0 && (
                  <Button
                    onClick={clearCart}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                    data-testid="button-clear-cart"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">העגלה ריקה</p>
                ) : (
                  cart.map(item => (
                    <div 
                      key={item.product.id}
                      className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg"
                      data-testid={`cart-item-${item.product.id}`}
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{item.product.nameHe}</p>
                        <p className="text-blue-400 text-sm">₪{item.product.price}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          data-testid={`button-decrease-${item.product.id}`}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-white w-8 text-center">{item.quantity}</span>
                        <Button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          data-testid={`button-increase-${item.product.id}`}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      <Button
                        onClick={() => removeFromCart(item.product.id)}
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-400 hover:text-red-300"
                        data-testid={`button-remove-${item.product.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-700 pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">סה"כ:</span>
                  <span 
                    className="text-2xl font-bold text-white"
                    data-testid="text-total-amount"
                  >
                    ₪{totalAmount.toFixed(2)}
                  </span>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                  data-testid="button-checkout"
                >
                  <CreditCard className="w-5 h-5 ml-2" />
                  סיום ותשלום
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
