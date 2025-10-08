import { useQuery } from '@tanstack/react-query';
import ZenCarousel from '@/components/ZenCarousel';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Search, Package, UserPlus, Info, Plus, RefreshCw, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'wouter';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function Shop() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Fetch bed bronzer products
  const { data: bedBronzers, isLoading: loadingBedBronzers } = useQuery<any[]>({
    queryKey: ['/api/products', { tanningType: 'bed-bronzer' }],
    queryFn: async () => {
      const res = await fetch(`/api/products?tanningType=bed-bronzer`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch bed bronzers');
      return res.json();
    },
  });

  // Fetch self-tanning products (featured only for main display)
  const { data: selfTanningProducts, isLoading: loadingSelfTanning } = useQuery<any[]>({
    queryKey: ['/api/products', { tanningType: 'self-tanning', isFeatured: true }],
    queryFn: async () => {
      const res = await fetch(`/api/products?tanningType=self-tanning&isFeatured=true`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch self-tanning products');
      return res.json();
    },
  });

  // Fetch all non-featured products for additional section
  const { data: additionalProducts, isLoading: loadingAdditional } = useQuery<any[]>({
    queryKey: ['/api/products', { isFeatured: false }],
    queryFn: async () => {
      const res = await fetch(`/api/products?isFeatured=false`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch additional products');
      return res.json();
    },
  });

  // Transform bed bronzer products
  const bedBronzerProducts = bedBronzers?.filter(p => p.is_featured || p.isFeatured).map((p) => ({
    id: p.id,
    name: p.name_he || p.nameHe || p.name,
    price: parseFloat(p.sale_price || p.salePrice || p.price),
    image: p.images?.[0] || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80',
    images: p.images || [], // Include all images including sachets
    category: (p.brand && p.brand !== 'OTHER') ? p.brand : getCategoryLabel(p.category),
    description: p.description_he || p.descriptionHe || p.description,
    badge: p.badge,
    bronzerStrength: p.bronzer_strength || p.bronzerStrength,
  })) || [];

  // Transform self-tanning products
  const selfTanningItems = selfTanningProducts?.map((p) => ({
    id: p.id,
    name: p.name_he || p.nameHe || p.name,
    price: parseFloat(p.sale_price || p.salePrice || p.price),
    image: p.images?.[0] || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80',
    category: (p.brand && p.brand !== 'OTHER') ? p.brand : getCategoryLabel(p.category),
    description: p.description_he || p.descriptionHe || p.description,
    badge: p.badge,
  })) || [];

  // Transform additional products - exclude bed-bronzer products (they're in carousel)
  const additionalItems = additionalProducts
    ?.filter(p => p.tanning_type !== 'bed-bronzer' && p.tanningType !== 'bed-bronzer')
    .map((p) => ({
      id: p.id,
      name: p.name_he || p.nameHe || p.name,
      price: parseFloat(p.sale_price || p.salePrice || p.price),
      image: p.images?.[0] || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80',
      category: (p.brand && p.brand !== 'OTHER') ? p.brand : getCategoryLabel(p.category),
      description: p.description_he || p.descriptionHe || p.description,
      badge: p.badge,
    })) || [];

  const isLoading = loadingBedBronzers || loadingSelfTanning || loadingAdditional;

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
    
    toast({
      title: '✨ נוסף!',
      description: `${product?.name} נוסף בהצלחה`,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950" dir="rtl">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-950/95 via-purple-950/40 to-slate-950/95 backdrop-blur-lg border-b border-pink-500/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center gap-2">
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
              size="icon"
              className="border-pink-500/30 hover:border-pink-500/50 hover:bg-pink-500/10"
              data-testid="button-back"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                className="border-pink-500/50 hover:border-pink-500"
                data-testid="button-search"
              >
                <Search className="w-5 h-5" />
              </Button>
              
              <Link href="/face-registration">
                <Button 
                  variant="outline" 
                  className="border-pink-500/50 hover:border-pink-500"
                  data-testid="button-register"
                >
                  <UserPlus className="w-5 h-5 ml-2" />
                  הרשמה
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Logo Section */}
      <div className="relative py-4">
        <div className="container mx-auto px-4">
          {/* Centered Logo with Neon Glow */}
          <div className="flex justify-center mb-4">
            <div className="relative p-4">
              {/* Outer Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-pink-600 to-pink-500 blur-[100px] opacity-40 animate-pulse"></div>
              
              {/* Inner Glow */}
              <div className="absolute inset-2 bg-gradient-to-br from-pink-400/20 via-pink-600/20 to-pink-400/20 blur-2xl"></div>
              
              {/* Logo Container - 2x size */}
              <div className="relative scale-[2] transform-gpu">
                <Logo size="header" showGlow={true} showUnderline={true} />
              </div>
            </div>
          </div>

          {/* Carousel Title */}
          <h2 className="text-xl md:text-2xl font-semibold text-center mt-6 mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            ברונזרים למיטות שיזוף
          </h2>
        </div>
      </div>

      {/* Bed Bronzers Carousel */}
      <section className="relative pb-8">
        <div className="container mx-auto px-4">
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
        
        {/* Mirror Reflection Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
          <div className="h-full bg-gradient-to-b from-purple-950/40 via-purple-950/20 to-transparent"></div>
        </div>
      </section>

      {/* Additional Products - Compact Grid */}
      {additionalItems.length > 0 && (
        <section className="relative pb-12 bg-[hsl(210,3%,94%)] py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              מוצרים מובילים לשיזוף עצמי
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {additionalItems.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-lg p-3 border border-gray-200 transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                  data-testid={`product-card-${product.id}`}
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-32 object-contain mb-2"
                    data-testid={`product-image-${product.id}`}
                  />
                  <h3 className="text-xs font-bold text-gray-800 mb-1 text-center line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm font-bold text-center mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    ₪{product.price}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-xs"
                      onClick={() => handleAddToCart(product.id)}
                      data-testid={`add-to-cart-${product.id}`}
                    >
                      <Plus className="w-4 h-4 ml-1" />
                      הוסף
                    </Button>
                    {product.description && (
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-pink-500/50 hover:border-pink-500 px-2"
                            data-testid={`info-${product.id}`}
                          >
                            <Info className="w-4 h-4" />
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle className="text-center text-amber-200">{product.name}</DrawerTitle>
                            <DrawerDescription className="text-center">
                              {product.description}
                            </DrawerDescription>
                          </DrawerHeader>
                          <DrawerFooter>
                            <DrawerClose asChild>
                              <Button variant="outline">סגור</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    )}
                  </div>
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
              <RefreshCw className="w-8 h-8 text-white" />
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
