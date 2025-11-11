import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  brand?: string;
}

interface TanningProductCarouselCompactProps {
  onAddToCart?: (productId: string) => void;
}

export default function TanningProductCarouselCompact({ onAddToCart }: TanningProductCarouselCompactProps) {
  // Mock products - ברונזרים
  const products: Product[] = [
    {
      id: '1',
      name: 'Australian Gold',
      brand: 'Australian Gold',
      price: 120,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&q=80'
    },
    {
      id: '2',
      name: 'Devoted Creations',
      brand: 'Devoted Creations',
      price: 150,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80'
    },
    {
      id: '3',
      name: 'Designer Skin',
      brand: 'Designer Skin',
      price: 180,
      image: 'https://images.unsplash.com/photo-1556228841-d9d2f9c3c1cc?w=300&q=80'
    },
    {
      id: '4',
      name: 'Swedish Beauty',
      brand: 'Swedish Beauty',
      price: 140,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80'
    },
    {
      id: '5',
      name: 'Supre Tan',
      brand: 'Supre Tan',
      price: 130,
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&q=80'
    },
    {
      id: '6',
      name: 'Millennium Tanning',
      brand: 'Millennium Tanning',
      price: 110,
      image: 'https://images.unsplash.com/photo-1556228852-80b4f32e4da7?w=300&q=80'
    }
  ];

  return (
    <div className="w-full h-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent">
      <div className="flex gap-2 px-2 h-full items-center">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[140px] h-[150px] bg-gradient-to-br from-background via-background/95 to-primary/5 backdrop-blur-sm border-2 border-primary/50 rounded-lg p-2 hover:border-primary transition-all duration-300 group hover:scale-[1.03] shadow-2xl hover:shadow-primary/50 relative overflow-hidden"
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(8px)',
              transform: 'translateZ(0)',
              filter: 'drop-shadow(0 0 15px hsl(var(--primary) / 0.3))'
            }}
            data-testid={`product-compact-${product.id}`}
          >
            {/* Enhanced inner glow effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/2 via-primary/2 to-white/2 opacity-0 group-hover:opacity-100 transition-all duration-300" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              {/* Product Image */}
              <div className="relative w-full h-16 mb-1 rounded-md overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&q=80';
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <h4 className="text-[9px] font-bold text-white mb-0.5 font-hebrew leading-tight line-clamp-1">
                  {product.name}
                </h4>
                
                <div className="text-primary text-base font-bold mb-1">
                  ₪{product.price}
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={() => onAddToCart?.(product.id)}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-bold px-1.5 py-1 text-[9px] transition-all duration-300 hover:scale-105 font-hebrew"
                  style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.5))' }}
                  data-testid={`button-add-product-${product.id}`}
                >
                  <ShoppingCart className="w-2.5 h-2.5 ml-0.5" />
                  הוסף
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
