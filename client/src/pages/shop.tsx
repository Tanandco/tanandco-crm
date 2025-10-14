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
      {/* Floating Action Buttons - Overlay */}
      <div className="fixed top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 z-50 flex justify-between items-center pointer-events-none">
        <Button
          onClick={() => setLocation('/')}
          variant="outline"
          size="icon"
          className="border-pink-500/30 hover:border-pink-500/50 hover:bg-pink-500/10 h-9 w-9 md:h-10 md:w-10 bg-transparent md:backdrop-blur-lg md:bg-slate-950/80 pointer-events-auto"
          data-testid="button-back"
        >
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
        </Button>
        <div className="flex gap-1.5 md:gap-2 pointer-events-auto">
          <Button 
            variant="outline" 
            size="icon"
            className="border-pink-500/50 hover:border-pink-500 h-9 w-9 md:h-10 md:w-10 bg-transparent md:backdrop-blur-lg md:bg-slate-950/80"
            data-testid="button-search"
          >
            <Search className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          
          <Link href="/face-registration">
            <Button 
              variant="outline" 
              className="border-pink-500/50 hover:border-pink-500 h-9 md:h-10 bg-transparent md:backdrop-blur-lg md:bg-slate-950/80 px-2 md:px-4"
              data-testid="button-register"
            >
              <UserPlus className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2" />
              <span className="hidden sm:inline">הרשמה</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Logo Section */}
      <div className="relative pt-0 md:pt-8 pb-0 md:pb-3">
        <div className="container mx-auto px-2 md:px-4">
          {/* Centered Logo with Neon Glow - Responsive size */}
          <div className="flex justify-center mb-0 md:mb-3">
            <div className="relative p-0 md:p-2">
              {/* Outer Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-pink-600 to-pink-500 blur-[100px] opacity-40 animate-pulse"></div>
              
              {/* Inner Glow */}
              <div className="absolute inset-2 bg-gradient-to-br from-pink-400/20 via-pink-600/20 to-pink-400/20 blur-2xl"></div>
              
              {/* Logo Container - Smaller on both mobile and desktop */}
              <div className="relative scale-[0.9] md:scale-[1.3] transform-gpu">
                <Logo size="header" showGlow={true} showUnderline={true} />
              </div>
            </div>
          </div>

          {/* Categories Section - Below Logo */}
          <div className="mt-0 md:mt-4">
            <style>{`
              @keyframes flow-gradient-cat {
                0% {
                  background-position: 0% 0%;
                }
                100% {
                  background-position: 200% 200%;
                }
              }
              
              .flowing-border-cat {
                position: relative;
              }
              
              .flowing-border-cat::before {
                content: '';
                position: absolute;
                inset: -2px;
                border-radius: 0.5rem;
                padding: 2px;
                background: linear-gradient(
                  135deg,
                  rgba(236, 72, 153, 0.8),
                  rgba(168, 85, 247, 0.6),
                  rgba(139, 92, 246, 0.8),
                  rgba(236, 72, 153, 0.6),
                  rgba(168, 85, 247, 0.8)
                );
                background-size: 200% 200%;
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                z-index: -1;
                animation: flow-gradient-cat 4s linear infinite;
                opacity: 0.7;
              }
              
              .flowing-text-cat {
                background: linear-gradient(
                  135deg,
                  rgba(236, 72, 153, 1),
                  rgba(168, 85, 247, 0.8),
                  rgba(139, 92, 246, 1),
                  rgba(236, 72, 153, 0.8),
                  rgba(168, 85, 247, 1)
                );
                background-size: 200% 200%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: flow-gradient-cat 3s linear infinite;
              }
            `}</style>
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-1 md:gap-3">
              {['שיזוף', 'קוסמטיקה', 'אביזרים', 'טיפוח שיער', 'תכשיטים', 'מוצרים ירוקים'].map((category) => (
                <div
                  key={category}
                  className="flowing-border-cat rounded-lg p-2 md:p-3 flex items-center justify-center h-12 md:h-20 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ 
                    backgroundColor: 'rgba(44, 44, 44, 0.15)', 
                    boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.8)' 
                  }}
                  data-testid={`category-${category}`}
                >
                  <span 
                    className="text-[10px] md:text-base font-semibold text-center flowing-text-cat"
                  >
                    {category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Title */}
          <h2 className="text-base md:text-2xl font-semibold text-center mt-3 md:mt-6 mb-1.5 md:mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            ברונזרים למיטות שיזוף
          </h2>
        </div>
      </div>

      {/* Bed Bronzers Carousel */}
      <section className="relative pb-4">
        <div className="container mx-auto px-3 md:px-4">
          {bedBronzerProducts.length > 0 ? (
            <ZenCarousel 
              products={bedBronzerProducts} 
              onAddToCart={handleAddToCart}
            />
          ) : (
            <div className="text-center py-8">
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


      {/* Main Content */}
      <main className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        <style>{`
          @keyframes flow-gradient-features {
            0% {
              background-position: 0% 0%;
            }
            100% {
              background-position: 200% 200%;
            }
          }
          
          .flowing-border-features {
            position: relative;
          }
          
          .flowing-border-features::before {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: 0.5rem;
            padding: 2px;
            background: linear-gradient(
              135deg,
              rgba(236, 72, 153, 0.8),
              rgba(168, 85, 247, 0.6),
              rgba(139, 92, 246, 0.8),
              rgba(236, 72, 153, 0.6),
              rgba(168, 85, 247, 0.8)
            );
            background-size: 200% 200%;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            z-index: -1;
            animation: flow-gradient-features 4s linear infinite;
            opacity: 0.7;
          }
          
          .flowing-text-features {
            background: linear-gradient(
              135deg,
              rgba(236, 72, 153, 1),
              rgba(168, 85, 247, 0.8),
              rgba(139, 92, 246, 1),
              rgba(236, 72, 153, 0.8),
              rgba(168, 85, 247, 1)
            );
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: flow-gradient-features 3s linear infinite;
          }
        `}</style>
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mt-4 md:mt-8 mb-4 md:mb-8">
          <div className="text-center p-3 md:p-4 rounded-lg flowing-border-features" style={{ backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.8)' }}>
            <h4 className="text-base md:text-lg font-bold mb-1 flowing-text-features">משלוח מהיר</h4>
            <p className="text-pink-400/80 text-xs md:text-sm">משלוח עד הבית תוך 2-3 ימי עסקים</p>
          </div>

          <div className="text-center p-3 md:p-4 rounded-lg flowing-border-features" style={{ backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.8)' }}>
            <h4 className="text-base md:text-lg font-bold mb-1 flowing-text-features">החזרות בחינם</h4>
            <p className="text-pink-400/80 text-xs md:text-sm">החזרה ללא עלות תוך 30 יום</p>
          </div>

          <div className="text-center p-3 md:p-4 rounded-lg flowing-border-features" style={{ backgroundColor: 'rgba(44, 44, 44, 0.15)', boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.8)' }}>
            <h4 className="text-base md:text-lg font-bold mb-1 flowing-text-features">איכות מעולה</h4>
            <p className="text-pink-400/80 text-xs md:text-sm">מוצרים מקוריים בלבד</p>
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
