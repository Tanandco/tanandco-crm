import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronRight, ChevronLeft, ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import ReflectBackground from '@/components/ui/reflect-background';

const CAROUSEL_STYLES = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  @keyframes gradient-shift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    .carousel-card,
    .shimmer-effect,
    .gradient-animation {
      animation: none !important;
      transition: none !important;
    }
  }
`;

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
}

interface ProductCarousel3DProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
}

export default function ProductCarousel3D({ products, onAddToCart }: ProductCarousel3DProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    direction: 'rtl',
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!emblaApi) return;
      
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollNext();
      } else if (e.key === 'Home') {
        e.preventDefault();
        emblaApi.scrollTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        emblaApi.scrollTo(products.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [emblaApi, scrollPrev, scrollNext, products.length]);

  return (
    <div className="relative w-full py-12" dir="rtl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            המוצרים הכי חמים שלנו
          </h2>
          <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <p className="text-muted-foreground">גלי את המוצרים המובילים של</p>
          <Logo size="small" showGlow={false} showUnderline={false} />
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative px-4">
        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border-pink-500/50 hover:border-pink-500 hover:bg-pink-500/10"
          onClick={scrollPrev}
          data-testid="button-carousel-prev"
        >
          <ChevronLeft className="h-6 w-6 text-pink-500" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border-pink-500/50 hover:border-pink-500 hover:bg-pink-500/10"
          onClick={scrollNext}
          data-testid="button-carousel-next"
        >
          <ChevronRight className="h-6 w-6 text-pink-500" />
        </Button>

        {/* Embla Viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex" style={{ direction: 'rtl' }}>
            {products.map((product, index) => {
              const isActive = index === selectedIndex;
              const offset = index - selectedIndex;
              
              return (
                <div
                  key={product.id}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-4"
                  style={{
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  <Card
                    className={`relative overflow-hidden transition-all duration-700 hover-elevate ${
                      isActive 
                        ? 'scale-110 border-pink-500/50' 
                        : 'scale-95 opacity-60'
                    }`}
                    style={{
                      transform: `
                        scale(${isActive ? 1.1 : 0.95}) 
                        rotateY(${offset * -15}deg)
                        translateZ(${isActive ? '50px' : '0px'})
                      `,
                      transformStyle: 'preserve-3d',
                      perspective: '1000px',
                    }}
                    data-testid={`product-card-${product.id}`}
                  >
                    {/* Badge */}
                    {product.badge && (
                      <Badge 
                        className="absolute top-4 right-4 z-10 bg-pink-500 text-white border-0"
                        data-testid={`badge-${product.id}`}
                      >
                        {product.badge}
                      </Badge>
                    )}

                    {/* Product Image */}
                    <div className="relative w-full aspect-square overflow-hidden bg-background flex items-center justify-center p-8">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-contain"
                        data-testid={`image-${product.id}`}
                      />
                      
                      {/* Shimmer Effect */}
                      <div 
                        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000 pointer-events-none ${
                          isActive ? 'translate-x-full' : '-translate-x-full'
                        }`}
                        style={{
                          animation: isActive ? 'shimmer 2s infinite' : 'none',
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-6 space-y-4">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {product.category}
                        </Badge>
                        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                        <p className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                          ₪{product.price}
                        </p>
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0"
                        onClick={() => onAddToCart?.(product.id)}
                        data-testid={`button-add-cart-${product.id}`}
                      >
                        <ShoppingCart className="w-4 h-4 ml-2" />
                        הוסף לעגלה
                      </Button>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex 
                  ? 'w-8 bg-gradient-to-r from-pink-500 to-purple-500' 
                  : 'w-2 bg-muted-foreground/30'
              }`}
              data-testid={`dot-${index}`}
              aria-label={`עבור למוצר ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* CSS Animation for Shimmer */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
