import { useState } from 'react';
import ProductCarousel3D from '@/components/ProductCarousel3D';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Shop() {
  const { toast } = useToast();
  const [cartCount, setCartCount] = useState(0);

  // Demo products - in production these would come from the database
  const featuredProducts = [
    {
      id: '1',
      name: 'ברונזר פרימיום',
      price: 189,
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&q=80',
      category: 'שיזוף',
      badge: 'הכי נמכר',
    },
    {
      id: '2',
      name: 'תכשיר שיזוף ביתי',
      price: 159,
      image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&q=80',
      category: 'שיזוף',
      badge: 'חדש',
    },
    {
      id: '3',
      name: 'קרם לחות מועשר',
      price: 129,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80',
      category: 'קוסמטיקה',
    },
    {
      id: '4',
      name: 'משקפי שמש מעצבים',
      price: 299,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80',
      category: 'אביזרים',
      badge: 'מבצע',
    },
    {
      id: '5',
      name: 'ערכת טיפוח שיער',
      price: 249,
      image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&q=80',
      category: 'טיפוח שיער',
    },
    {
      id: '6',
      name: 'תכשיטי זהב עדינים',
      price: 399,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80',
      category: 'תכשיטים',
      badge: 'יוקרתי',
    },
  ];

  const handleAddToCart = (productId: string) => {
    const product = featuredProducts.find(p => p.id === productId);
    setCartCount(prev => prev + 1);
    
    toast({
      title: '✨ נוסף לעגלה!',
      description: `${product?.name} נוסף לעגלת הקניות שלך`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-pink-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Tan & Co Shop
                </h1>
                <p className="text-sm text-muted-foreground">חנות היופי שלך</p>
              </div>
            </div>

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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center py-12 mb-8">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              גלי את עולם היופי
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            מוצרי פרימיום לשיזוף, קוסמטיקה, אביזרים ועוד - הכל במקום אחד
          </p>
        </div>

        {/* 3D Carousel */}
        <ProductCarousel3D 
          products={featuredProducts} 
          onAddToCart={handleAddToCart}
        />

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
