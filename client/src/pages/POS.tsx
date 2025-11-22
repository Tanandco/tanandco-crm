import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, X, ImageOff, Image, User, UserX, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import PaymentDialog from '@/components/PaymentDialog';

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

interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function POS() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showImages, setShowImages] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { toast } = useToast();

  // Read customerId from URL query params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('customerId');
    
    if (customerId && !selectedCustomer) {
      // Fetch customer data
      apiRequest('GET', `/api/customers/${customerId}`)
        .then((response: any) => {
          if (response.data) {
            setSelectedCustomer({
              id: response.data.id,
              fullName: response.data.fullName,
              phone: response.data.phone,
              email: response.data.email,
            });
            toast({
              title: 'לקוח נטען',
              description: response.data.fullName,
            });
          }
        })
        .catch((error) => {
          console.error('Failed to load customer:', error);
        });
    }
  }, []);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const products: Product[] = Array.isArray(productsData) 
    ? productsData 
    : (productsData as any)?.data ?? (productsData as any)?.products ?? [];

  const { data: customersData } = useQuery({
    queryKey: ['/api/customers'],
    enabled: showCustomerSearch && customerSearchQuery.length > 0,
  });

  const customers: Customer[] = Array.isArray(customersData) 
    ? customersData 
    : (customersData as any)?.data ?? [];

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

  const filteredCustomers = customers.filter(c => 
    c.fullName.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    c.phone.includes(customerSearchQuery)
  );

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerSearch(false);
    setCustomerSearchQuery('');
    toast({
      title: "לקוח נבחר",
      description: customer.fullName,
    });
  };

  const selectGuest = () => {
    setSelectedCustomer(null);
    setShowCustomerSearch(false);
    toast({
      title: "מכירה כאורח",
      description: "העסקה תירשם ללא לקוח",
    });
  };

  const checkoutMutation = useMutation({
    mutationFn: async (paymentData: { transactionId: string; paymentMethod: string }) => {
      // Update stock for all products in cart
      for (const item of cart) {
        if (item.product.productType === 'product') {
          await apiRequest('POST', `/api/products/${item.product.id}/adjust-stock`, { 
            delta: -item.quantity 
          });
        }
      }

      // Create transaction record
      await apiRequest('POST', '/api/transactions', {
        customerId: selectedCustomer?.id || 'guest',
        type: 'product',
        amount: totalAmount.toFixed(2),
        currency: 'ILS',
        status: 'completed',
        paymentMethod: paymentData.paymentMethod,
        metadata: {
          transactionId: paymentData.transactionId,
          items: cart.map(item => ({
            productId: item.product.id,
            name: item.product.nameHe,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      });

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      const customerInfo = selectedCustomer ? selectedCustomer.fullName : "אורח";
      toast({
        title: "✅ עסקה הושלמה",
        description: `לקוח: ${customerInfo} | סה"כ: ₪${totalAmount.toFixed(2)}`,
      });
      setCart([]);
      // Keep customer selected if came from customer management
      const urlParams = new URLSearchParams(window.location.search);
      if (!urlParams.get('customerId')) {
        setSelectedCustomer(null);
      }
    },
    onError: (error: any) => {
      toast({
        title: "❌ שגיאה",
        description: error.message || "אירעה שגיאה בעדכון המלאי",
        variant: "destructive",
      });
    },
  });

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "העגלה ריקה",
        description: "הוסף מוצרים לפני ביצוע תשלום",
        variant: "destructive",
      });
      return;
    }

    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = (transactionId: string, paymentMethod: string) => {
    checkoutMutation.mutate({ transactionId, paymentMethod });
    setShowPaymentDialog(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <Button
            onClick={() => setLocation('/')}
            variant="outline"
            size="icon"
            className="border-pink-500/30 hover:border-pink-500/50 hover:bg-pink-500/10"
            data-testid="button-back"
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
          <h1 
            className="text-3xl font-bold text-white flex-1"
            style={{
              textShadow: '0 0 20px rgba(69, 114, 182, 0.6)',
            }}
            data-testid="text-pos-title"
          >
            קופה
          </h1>
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
                className="pr-10 bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 text-white placeholder:text-gray-500 backdrop-blur-sm"
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

            {/* Categories & Image Toggle */}
            <div className="flex gap-2 flex-wrap items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <Button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    className={selectedCategory === cat.id ? 'bg-gradient-to-br from-pink-600 via-pink-500 to-purple-600 hover:from-pink-500 hover:to-purple-500 border-pink-500/50' : 'bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 hover:border-pink-500/50 backdrop-blur-sm'}
                    data-testid={`button-category-${cat.id}`}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
              
              <Button
                onClick={() => setShowImages(!showImages)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 hover:border-pink-500/50 backdrop-blur-sm"
                data-testid="button-toggle-images"
              >
                {showImages ? (
                  <>
                    <ImageOff className="w-4 h-4" />
                    הסתר תמונות
                  </>
                ) : (
                  <>
                    <Image className="w-4 h-4" />
                    הצג תמונות
                  </>
                )}
              </Button>
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
                    className="p-4 bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 hover:border-pink-500 transition-all cursor-pointer backdrop-blur-sm hover-elevate active-elevate-2"
                    onClick={() => addToCart(product)}
                    data-testid={`card-product-${product.id}`}
                    style={{
                      boxShadow: '0 0 20px rgba(236, 72, 153, 0.1)',
                    }}
                  >
                    {showImages && product.images && product.images[0] && (
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
                      <span className="text-pink-400 font-bold" style={{ textShadow: '0 0 10px rgba(236, 72, 153, 0.5)' }}>₪{product.price}</span>
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
          <div className="lg:col-span-1 space-y-4">
            {/* Customer Selection */}
            <Card 
              className="p-4 bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 backdrop-blur-sm"
              style={{
                boxShadow: '0 0 20px rgba(236, 72, 153, 0.2)',
              }}
            >
              {selectedCustomer ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-pink-400" />
                      <span className="text-white font-semibold">{selectedCustomer.fullName}</span>
                    </div>
                    <Button
                      onClick={() => setSelectedCustomer(null)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white h-7"
                      data-testid="button-remove-customer"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400">{selectedCustomer.phone}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {!showCustomerSearch ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setShowCustomerSearch(true)}
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 hover:border-pink-500/50"
                        data-testid="button-search-customer"
                      >
                        <User className="w-4 h-4 ml-2" />
                        חפש לקוח
                      </Button>
                      <Button
                        onClick={selectGuest}
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 hover:border-pink-500/50"
                        data-testid="button-guest-sale"
                      >
                        <UserX className="w-4 h-4 ml-2" />
                        אורח
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative">
                        <Input
                          value={customerSearchQuery}
                          onChange={(e) => setCustomerSearchQuery(e.target.value)}
                          placeholder="שם או טלפון..."
                          className="pr-10 bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 text-white"
                          data-testid="input-customer-search"
                          autoFocus
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Button
                          onClick={() => {
                            setShowCustomerSearch(false);
                            setCustomerSearchQuery('');
                          }}
                          variant="ghost"
                          size="icon"
                          className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      {customerSearchQuery.length > 0 && (
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {filteredCustomers.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-2">לא נמצאו לקוחות</p>
                          ) : (
                            filteredCustomers.map(customer => (
                              <button
                                key={customer.id}
                                onClick={() => selectCustomer(customer)}
                                className="w-full text-right p-2 rounded-md bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                                data-testid={`button-select-customer-${customer.id}`}
                              >
                                <p className="text-white text-sm font-medium">{customer.fullName}</p>
                                <p className="text-gray-400 text-xs">{customer.phone}</p>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
            
            <Card 
              className="p-6 bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 sticky top-6 backdrop-blur-sm"
              style={{
                boxShadow: '0 0 40px rgba(236, 72, 153, 0.3)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-pink-400" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.6))' }} />
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
                      className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-800/50 via-black/40 to-gray-900/50 rounded-lg border border-pink-500/20"
                      data-testid={`cart-item-${item.product.id}`}
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{item.product.nameHe}</p>
                        <p className="text-pink-400 text-sm">₪{item.product.price}</p>
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
                  className="w-full bg-gradient-to-br from-pink-600 via-pink-500 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white border-pink-500/50"
                  size="lg"
                  disabled={checkoutMutation.isPending}
                  data-testid="button-checkout"
                  style={{
                    boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)',
                  }}
                >
                  <CreditCard className="w-5 h-5 ml-2" />
                  {checkoutMutation.isPending ? 'מעבד...' : 'סיום ותשלום'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <PaymentDialog
        open={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        totalAmount={totalAmount}
        customerId={selectedCustomer?.id}
        customerName={selectedCustomer?.fullName}
        items={cart.map(item => ({
          name: item.product.nameHe,
          quantity: item.quantity,
          price: parseFloat(item.product.price),
        }))}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
