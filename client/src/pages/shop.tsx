import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, ShoppingCart, Heart, Star, ArrowRight, 
  Filter, X, Plus, Minus, Sparkles, Package, 
  Sun, Scissors, Gem, Glasses, Home
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import ZenCarousel from '@/components/ZenCarousel';

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
  tanningType?: 'bed-bronzer' | 'self-tanning';
  bronzerStrength?: number;
  badge?: string;
  isFeatured?: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Shop() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const products: Product[] = Array.isArray(productsData) 
    ? productsData 
    : (productsData as any)?.data ?? [];

  // קטגוריות יוקרתיות
  const categories = [
    { id: 'all', label: 'הכל', icon: Package },
    { id: 'bed-bronzer', label: 'ברונזרים למיטות', icon: Sun },
    { id: 'self-tanning', label: 'ערכות ביתיות', icon: Home },
    { id: 'hair', label: 'מוצרי שיער', icon: Scissors },
    { id: 'accessories', label: 'אביזרים', icon: Sparkles },
    { id: 'sunglasses', label: 'משקפי שמש', icon: Glasses },
    { id: 'jewelry', label: 'תכשיטים', icon: Gem },
  ];

  // סינון מוצרים
  const filteredProducts = products.filter(p => {
    if (p.productType !== 'product') return false;

    if (selectedCategory === 'bed-bronzer') {
      if (p.tanningType !== 'bed-bronzer') return false;
    } else if (selectedCategory === 'self-tanning') {
      if (p.tanningType !== 'self-tanning') return false;
    } else if (selectedCategory !== 'all') {
      if (p.category !== selectedCategory) return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        p.nameHe.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query))
      );
    }

    return true;
  });

  // חלוקה לפי קטגוריות
  const bedBronzers = filteredProducts.filter(p => p.tanningType === 'bed-bronzer');
  const selfTanning = filteredProducts.filter(p => p.tanningType === 'self-tanning');
  const hairProducts = filteredProducts.filter(p => p.category === 'hair');
  const accessories = filteredProducts.filter(p => p.category === 'accessories');
  const sunglasses = filteredProducts.filter(p => p.category === 'sunglasses');
  const jewelry = filteredProducts.filter(p => p.category === 'jewelry');

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.stock !== undefined && product.stock <= 0) {
      toast({
        title: 'אזל מהמלאי',
        description: 'המוצר לא זמין כרגע',
        variant: 'destructive',
      });
      return;
    }

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

  const totalAmount = cart.reduce((sum, item) => 
    sum + (parseFloat(item.product.salePrice || item.product.price) * item.quantity), 0
  );

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: 'העגלה ריקה',
        description: 'הוסף מוצרים לפני ביצוע תשלום',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'מעבר לתשלום',
      description: `סה"כ: ₪${totalAmount.toFixed(2)}`,
    });
  };

  // Transform products for ZenCarousel
  const transformForCarousel = (products: Product[]) => {
    return products.map(p => ({
      id: p.id,
      name: p.nameHe,
      price: parseFloat(p.salePrice || p.price),
      image: p.images?.[0] || '/placeholder.jpg',
      images: p.images || [],
      category: p.category,
      description: p.nameHe,
      bronzerStrength: p.bronzerStrength,
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      <style>{`
        /* Neon Text Effect - צבעי הפרויקט */
        .neon-text {
          color: #ec4899;
          text-shadow: 
            0 0 10px rgba(236, 72, 153, 0.8),
            0 0 20px rgba(236, 72, 153, 0.6),
            0 0 30px rgba(236, 72, 153, 0.4),
            0 0 40px rgba(168, 85, 247, 0.3);
        }

        /* Glass Effect - רקעים שקופים */
        .glass-effect {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(236, 72, 153, 0.2);
        }

        .glass-light {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(236, 72, 153, 0.1);
        }

        /* Gradient Text */
        .gradient-text {
          background: linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #ec4899 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-flow 3s ease infinite;
        }

        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        /* Glow Effect */
        .glow-pink {
          box-shadow: 
            0 0 20px rgba(236, 72, 153, 0.4),
            0 0 40px rgba(236, 72, 153, 0.2),
            0 0 60px rgba(168, 85, 247, 0.1);
        }

        .glow-purple {
          box-shadow: 
            0 0 20px rgba(168, 85, 247, 0.4),
            0 0 40px rgba(168, 85, 247, 0.2),
            0 0 60px rgba(236, 72, 153, 0.1);
        }

        /* Hover Elevate */
        .hover-elevate {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-elevate:hover {
          transform: translateY(-5px);
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.5),
            0 0 30px rgba(236, 72, 153, 0.3);
        }

        /* Scrollbar Hide */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Header עם רקע שקוף */}
      <header className="sticky top-0 z-50 glass-effect">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setLocation('/')}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>

            <h1 className="text-2xl font-bold gradient-text">
              Tan & Co Shop
            </h1>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCart(!showCart)}
                className="text-white hover:bg-white/10 relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center glow-pink">
                    {cart.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חפש מוצר..."
              className="pr-10 glass-light text-white placeholder:text-gray-400"
            />
          </div>
        </div>
      </header>

      {/* Categories Tabs */}
      <div className="sticky top-[120px] z-40 glass-light border-b border-pink-500/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <Button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  variant="ghost"
                  className={`
                    flex items-center gap-2 whitespace-nowrap
                    ${isActive 
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg glow-pink' 
                      : 'glass-light hover:bg-white/10 text-gray-300'
                    }
                    transition-all duration-300
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 glow-pink"></div>
          </div>
        ) : (
          <>
            {/* ברונזרים למיטות - קרוסלה מתקדמת */}
            {bedBronzers.length > 0 && (selectedCategory === 'all' || selectedCategory === 'bed-bronzer') && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-pink-600/20 to-purple-600/20 glass-light">
                    <Sun className="w-6 h-6 text-pink-400" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' }} />
                  </div>
                  <h2 className="text-3xl font-bold gradient-text">
                    ברונזרים למיטות שיזוף
                  </h2>
                </div>
                <ZenCarousel 
                  products={transformForCarousel(bedBronzers)} 
                  onAddToCart={addToCart}
                />
              </section>
            )}

            {/* ערכות ביתיות */}
            {selfTanning.length > 0 && (selectedCategory === 'all' || selectedCategory === 'self-tanning') && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-pink-600/20 to-purple-600/20 glass-light">
                    <Home className="w-6 h-6 text-pink-400" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' }} />
                  </div>
                  <h2 className="text-3xl font-bold gradient-text">
                    ערכות ביתיות לשיזוף עצמי
                  </h2>
                </div>
                <ZenCarousel 
                  products={transformForCarousel(selfTanning)} 
                  onAddToCart={addToCart}
                />
              </section>
            )}

            {/* מוצרי שיער */}
            {hairProducts.length > 0 && (selectedCategory === 'all' || selectedCategory === 'hair') && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-pink-600/20 to-purple-600/20 glass-light">
                    <Scissors className="w-6 h-6 text-pink-400" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' }} />
                  </div>
                  <h2 className="text-3xl font-bold gradient-text">
                    מוצרי שיער
                  </h2>
                </div>
                <ProductGrid products={hairProducts} onAddToCart={addToCart} onToggleFavorite={toggleFavorite} favorites={favorites} />
              </section>
            )}

            {/* אביזרים */}
            {accessories.length > 0 && (selectedCategory === 'all' || selectedCategory === 'accessories') && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-pink-600/20 to-purple-600/20 glass-light">
                    <Sparkles className="w-6 h-6 text-pink-400" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' }} />
                  </div>
                  <h2 className="text-3xl font-bold gradient-text">
                    אביזרים
                  </h2>
                </div>
                <ProductGrid products={accessories} onAddToCart={addToCart} onToggleFavorite={toggleFavorite} favorites={favorites} />
              </section>
            )}

            {/* משקפי שמש */}
            {sunglasses.length > 0 && (selectedCategory === 'all' || selectedCategory === 'sunglasses') && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-pink-600/20 to-purple-600/20 glass-light">
                    <Glasses className="w-6 h-6 text-pink-400" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' }} />
                  </div>
                  <h2 className="text-3xl font-bold gradient-text">
                    משקפי שמש
                  </h2>
                </div>
                <ProductGrid products={sunglasses} onAddToCart={addToCart} onToggleFavorite={toggleFavorite} favorites={favorites} />
              </section>
            )}

            {/* תכשיטים */}
            {jewelry.length > 0 && (selectedCategory === 'all' || selectedCategory === 'jewelry') && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-pink-600/20 to-purple-600/20 glass-light">
                    <Gem className="w-6 h-6 text-pink-400" style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' }} />
                  </div>
                  <h2 className="text-3xl font-bold gradient-text">
                    תכשיטים
                  </h2>
                </div>
                <ProductGrid products={jewelry} onAddToCart={addToCart} onToggleFavorite={toggleFavorite} favorites={favorites} />
              </section>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400 text-xl">לא נמצאו מוצרים</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCart(false)}
          />
          <div className="w-full max-w-md glass-effect border-r border-pink-500/20 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold neon-text">עגלת קניות</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCart(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">העגלה ריקה</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div
                      key={item.product.id}
                      className="glass-light rounded-lg p-4 border border-pink-500/20 hover-elevate"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={item.product.images?.[0] || '/placeholder.jpg'}
                          alt={item.product.nameHe}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{item.product.nameHe}</h3>
                          <p className="text-pink-400 font-bold mb-2 neon-text">
                            ₪{parseFloat(item.product.salePrice || item.product.price).toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="h-8 w-8"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="h-8 w-8"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.product.id)}
                              className="h-8 w-8 text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-pink-500/20 pt-4 space-y-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>סה"כ:</span>
                    <span className="neon-text">₪{totalAmount.toFixed(2)}</span>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg h-12 glow-pink"
                  >
                    <ShoppingCart className="w-5 h-5 ml-2" />
                    המשך לתשלום
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
  favorites: Set<string>;
}

function ProductGrid({ products, onAddToCart, onToggleFavorite, favorites }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => onAddToCart(product.id)}
          onToggleFavorite={() => onToggleFavorite(product.id)}
          isFavorite={favorites.has(product.id)}
        />
      ))}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

function ProductCard({ product, onAddToCart, onToggleFavorite, isFavorite }: ProductCardProps) {
  const price = parseFloat(product.salePrice || product.price);
  const originalPrice = product.salePrice ? parseFloat(product.price) : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Card className="
      glass-light
      border-pink-500/20
      hover:border-pink-500/50
      transition-all duration-300
      overflow-hidden
      group
      hover-elevate
    ">
      <div className="relative">
        {/* Image */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.nameHe}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {product.badge && (
              <Badge className={`
                ${product.badge === 'new' ? 'bg-green-500' : ''}
                ${product.badge === 'bestseller' ? 'bg-orange-500' : ''}
                ${product.badge === 'sale' ? 'bg-red-500' : ''}
                ${product.badge === 'limited' ? 'bg-purple-500' : ''}
              `}>
                {product.badge === 'new' ? 'חדש' : ''}
                {product.badge === 'bestseller' ? 'הכי נמכר' : ''}
                {product.badge === 'sale' ? 'מבצע' : ''}
                {product.badge === 'limited' ? 'מוגבל' : ''}
              </Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-pink-500 glow-pink">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="absolute top-2 left-2 glass-light hover:bg-white/20"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-pink-500 text-pink-500' : 'text-white'}`} 
              style={isFavorite ? { filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.8))' } : {}}
            />
          </Button>

          {/* Quick Add Button */}
          <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 glow-pink"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-4 h-4 ml-2" />
              {product.stock === 0 ? 'אזל מהמלאי' : 'הוסף לעגלה'}
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1 line-clamp-2">{product.nameHe}</h3>
              {product.brand && (
                <p className="text-sm text-gray-400">{product.brand}</p>
              )}
            </div>
          </div>

          {/* Bronzer Strength */}
          {product.bronzerStrength && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-gray-400">חוזק: {product.bronzerStrength}/15</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold neon-text">₪{price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">₪{originalPrice.toFixed(2)}</span>
            )}
          </div>

          {/* Stock Status */}
          {product.stock !== undefined && (
            <p className={`text-xs mt-2 ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {product.stock > 0 ? `במלאי: ${product.stock}` : 'אזל מהמלאי'}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
