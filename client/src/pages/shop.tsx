import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ZenCarousel from '@/components/ZenCarousel';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

export default function Shop() {
  const { toast } = useToast();
  const [cartCount, setCartCount] = useState(0);

  // Fetch bed bronzer products
  const { data: bedBronzers, isLoading: loadingBedBronzers } = useQuery<any[]>({
    queryKey: ['/api/products', { tanningType: 'bed-bronzer' }],
    queryFn: async () => {
      const res = await fetch('/api/products?tanningType=bed-bronzer');
      if (!res.ok) throw new Error('Failed to fetch bed bronzers');
      return res.json();
    },
  });

  // Fetch self-tanning products
  const { data: selfTanningProducts, isLoading: loadingSelfTanning } = useQuery<any[]>({
    queryKey: ['/api/products', { tanningType: 'self-tanning' }],
    queryFn: async () => {
      const res = await fetch('/api/products?tanningType=self-tanning');
      if (!res.ok) throw new Error('Failed to fetch self-tanning products');
      return res.json();
    },
  });

  // Transform bed bronzer products
  const bedBronzerProducts = bedBronzers?.filter(p => p.isFeatured).map((p) => ({
    id: p.id,
    name: p.nameHe || p.name,
    price: parseFloat(p.salePrice || p.price),
    image: p.images?.[0] || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80',
    category: p.brand || getCategoryLabel(p.category),
    badge: p.badge,
  })) || [];

  // Transform self-tanning products
  const selfTanningItems = selfTanningProducts?.filter(p => p.isFeatured).map((p) => ({
    id: p.id,
    name: p.nameHe || p.name,
    price: parseFloat(p.salePrice || p.price),
    image: p.images?.[0] || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80',
    category: p.brand || getCategoryLabel(p.category),
    badge: p.badge,
  })) || [];

  const isLoading = loadingBedBronzers || loadingSelfTanning;

  function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
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
    return labels[category] || category;
  }

  const handleAddToCart = (productId: string) => {
    const allProducts = [...bedBronzerProducts, ...selfTanningItems];
    const product = allProducts.find(p => p.id === productId);
    setCartCount(prev => prev + 1);
    
    toast({
      title: '✨ נוסף לעגלה!',
      description: `${product?.name} נוסף לעגלת הקניות שלך`,
      duration: 2000,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <Package className="w-12 h-12 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-pink-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size="header" showGlow={false} showUnderline={false} />
            </div>

            <div className="flex gap-2">
              <Link href="/products">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="border-pink-500/50 hover:border-pink-500"
                  data-testid="button-manage-products"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="relative border-pink-500/50 hover:border-pink-500"
                data-testid="button-cart"
              >
                <ShoppingCart className="w-5 h-5 ml-2" />
                עגלה
                {cartCount > 0 && (
                  <span className="absolute -top-2 -left-2 w-6 h-6 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Bed Bronzers Carousel */}
      <section className="relative pt-2 pb-8">
        <div className="container mx-auto">
          {bedBronzerProducts.length > 0 ? (
            <ZenCarousel 
              products={bedBronzerProducts} 
              onAddToCart={handleAddToCart}
            />
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">אין ברונזרים זמינים</p>
            </div>
          )}
        </div>
      </section>

      {/* Self-Tanning Products - Simple Grid */}
      {selfTanningItems.length > 0 && (
        <section className="relative pb-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              תכשירים ביתיים לשיזוף עצמי
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {selfTanningItems.map((product) => (
                <div 
                  key={product.id}
                  className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 border-0 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.6),0_3px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_20px_60px_rgba(255,105,180,0.3),0_10px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1"
                  data-testid={`product-card-${product.id}`}
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-contain mb-4"
                    data-testid={`product-image-${product.id}`}
                  />
                  <h3 className="text-lg font-bold text-pink-200 mb-2 text-center line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center mb-3">
                    {product.category}
                  </p>
                  <p className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    ₪{product.price}
                  </p>
                  <Button
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    onClick={() => handleAddToCart(product.id)}
                    data-testid={`add-to-cart-${product.id}`}
                  >
                    <ShoppingCart className="w-4 h-4 ml-2" />
                    הוסף לעגלה
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">

        {/* Categories Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-8">קטגוריות פופולריות</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['שיזוף', 'קוסמטיקה', 'אביזרים', 'טיפוח שיער', 'תכשיטים', 'מוצרים ירוקים'].map((category) => (
              <Button
                key={category}
                variant="outline"
                className="h-24 text-lg border-pink-500/30 hover:border-pink-500 hover:bg-pink-500/10"
                data-testid={`category-${category}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 mb-12">
          <div className="text-center p-6 rounded-lg bg-slate-900/50 border border-pink-500/20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold mb-2">משלוח מהיר</h4>
            <p className="text-muted-foreground">משלוח עד הבית תוך 2-3 ימי עסקים</p>
          </div>

          <div className="text-center p-6 rounded-lg bg-slate-900/50 border border-pink-500/20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold mb-2">החזרות בחינם</h4>
            <p className="text-muted-foreground">החזרה ללא עלות תוך 30 יום</p>
          </div>

          <div className="text-center p-6 rounded-lg bg-slate-900/50 border border-pink-500/20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold mb-2">איכות מעולה</h4>
            <p className="text-muted-foreground">מוצרים מקוריים בלבד</p>
          </div>
        </div>
      </main>

      {/* Gradient Animation */}
      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
