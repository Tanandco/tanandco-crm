import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  nameHe?: string;
  price: number;
  image: string;
  description?: string;
  descriptionHe?: string;
  brand?: string;
  badge?: string;
}

interface TanningProductCarouselProps {
  onAddToCart?: (productId: string) => void;
}

export default function TanningProductCarousel({ onAddToCart }: TanningProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch featured tanning products from API
  const { data: productsData, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { category: 'tanning', isFeatured: true }],
    queryFn: async () => {
      const res = await fetch('/api/products?category=tanning&isFeatured=true');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return data.map((p: any) => ({
        id: p.id,
        name: p.nameHe || p.name_he || p.name,
        nameHe: p.nameHe || p.name_he,
        price: parseFloat(p.salePrice || p.sale_price || p.price),
        image: p.images?.[0] || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80',
        description: p.descriptionHe || p.description_he || p.description,
        descriptionHe: p.descriptionHe || p.description_he,
        brand: p.brand,
        badge: p.badge
      }));
    },
  });

  const products = productsData || [];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  if (isLoading) {
    return (
      <div className="relative w-full max-w-4xl mx-auto p-6" dir="rtl">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          טוען מוצרים...
        </h2>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="relative w-full max-w-4xl mx-auto p-6" dir="rtl">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          אין מוצרים זמינים כרגע
        </h2>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto p-6" dir="rtl">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        המוצרים שלנו
      </h2>

      <div className="relative">
        {/* Navigation Buttons */}
        <Button
          onClick={prevSlide}
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 border-pink-500/30"
          data-testid="button-prev-product"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        <Button
          onClick={nextSlide}
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 border-pink-500/30"
          data-testid="button-next-product"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Products Display */}
        <div className="grid md:grid-cols-3 gap-4 px-12">
          {products.map((product, idx) => {
            const offset = (idx - currentIndex + products.length) % products.length;
            const isCenter = offset === 0;
            
            return (
              <Card
                key={product.id}
                className={`
                  p-4 transition-all duration-300
                  ${isCenter 
                    ? 'bg-gradient-to-br from-amber-900/40 to-purple-900/40 border-pink-500/50 scale-105' 
                    : 'bg-slate-900/60 border-slate-700/50 opacity-60'
                  }
                `}
                data-testid={`product-card-${product.id}`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                
                <div className="mb-2">
                  {product.badge && (
                    <span className="inline-block px-2 py-1 text-xs font-bold bg-pink-500/20 text-pink-400 rounded mb-2">
                      {product.badge === 'bestseller' ? 'רב מכר' : product.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-white">{product.nameHe || product.name}</h3>
                  {product.brand && product.brand !== 'OTHER' && (
                    <p className="text-xs text-gray-500">{product.brand}</p>
                  )}
                </div>
                {product.description && (
                  <p className="text-sm text-gray-400 mb-3">{product.descriptionHe || product.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-pink-400">₪{product.price}</span>
                  <Button
                    onClick={() => onAddToCart?.(product.id)}
                    size="sm"
                    className="bg-gradient-to-r from-pink-600 to-purple-600"
                    data-testid={`button-add-to-cart-${product.id}`}
                  >
                    <ShoppingCart className="w-4 h-4 ml-1" />
                    הוסף
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-pink-500 w-6' : 'bg-gray-600'
              }`}
              data-testid={`dot-indicator-${idx}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
