import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

interface ZenCarouselProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
}

export default function ZenCarousel({ products, onAddToCart }: ZenCarouselProps) {
  return (
    <div className="relative w-full py-4" dir="rtl">
      <style>{`
        .zen-carousel .swiper-slide {
          width: 200px !important;
          height: 280px !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 12px;
          border-radius: 16px;
          background: rgba(30, 20, 50, 0.4);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 105, 180, 0.2);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .zen-carousel .swiper-slide-active {
          background: rgba(50, 30, 70, 0.6);
          border-color: rgba(255, 105, 180, 0.5);
          box-shadow: 0 15px 40px rgba(255, 105, 180, 0.3);
        }

        .zen-carousel .swiper-slide img {
          width: 120px;
          height: 150px;
          object-fit: contain;
          margin-bottom: 8px;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4));
          transition: transform 0.3s ease;
        }

        .zen-carousel .swiper-slide-active img {
          transform: scale(1.05);
        }

        .zen-carousel .swiper-button-next,
        .zen-carousel .swiper-button-prev {
          color: #ff69b4;
          background: rgba(20, 10, 40, 0.6);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid rgba(255, 105, 180, 0.3);
          backdrop-filter: blur(8px);
        }

        .zen-carousel .swiper-button-next:hover,
        .zen-carousel .swiper-button-prev:hover {
          background: rgba(255, 105, 180, 0.2);
          border-color: rgba(255, 105, 180, 0.6);
        }

        .zen-carousel .swiper-button-next::after,
        .zen-carousel .swiper-button-prev::after {
          font-size: 20px;
        }

        .zen-carousel .swiper-pagination-bullet {
          background: rgba(255, 105, 180, 0.4);
          width: 10px;
          height: 10px;
        }

        .zen-carousel .swiper-pagination-bullet-active {
          background: #ff69b4;
          width: 24px;
          border-radius: 5px;
        }
      `}</style>

      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        initialSlide={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        coverflowEffect={{
          rotate: 35,
          stretch: 0,
          depth: 150,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        className="zen-carousel"
        dir="rtl"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} data-testid={`zen-slide-${product.id}`}>
            <img 
              src={product.image} 
              alt={product.name}
              data-testid={`zen-image-${product.id}`}
            />
            <h3 
              className="text-sm font-bold text-center mb-1 text-pink-200 line-clamp-2"
              data-testid={`zen-title-${product.id}`}
            >
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground text-center mb-2 line-clamp-1">
              {product.category}
            </p>
            <p 
              className="text-xl font-bold text-center mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
              data-testid={`zen-price-${product.id}`}
            >
              ₪{product.price}
            </p>
            <Button
              size="sm"
              className="relative bg-gradient-to-br from-pink-500 via-pink-600 to-purple-600 text-white border-0 text-xs h-8 px-4
                shadow-[0_6px_0_0_rgba(147,51,234,0.8),0_8px_20px_rgba(236,72,153,0.6)]
                hover:shadow-[0_4px_0_0_rgba(147,51,234,0.8),0_6px_15px_rgba(236,72,153,0.8)]
                active:shadow-[0_2px_0_0_rgba(147,51,234,0.8),0_3px_10px_rgba(236,72,153,0.8)]
                hover:translate-y-[2px] active:translate-y-[4px]
                transition-all duration-150 ease-in-out
                before:absolute before:inset-0 before:bg-gradient-to-t before:from-transparent before:to-white/20 before:rounded-md"
              onClick={() => onAddToCart?.(product.id)}
              data-testid={`zen-cart-btn-${product.id}`}
            >
              <ShoppingCart className="w-3 h-3 ml-1" />
              הוסף
            </Button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
