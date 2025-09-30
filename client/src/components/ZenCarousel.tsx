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
          width: 280px !important;
          height: 380px !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 16px;
          border-radius: 16px;
          background: rgba(30, 20, 50, 0.4);
          backdrop-filter: blur(10px);
          border: none;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 
                      0 3px 10px rgba(0, 0, 0, 0.4),
                      inset 0 1px 0 rgba(255, 255, 255, 0.15),
                      inset 0 -1px 0 rgba(0, 0, 0, 0.3);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .zen-carousel .swiper-slide-active {
          background: rgba(50, 30, 70, 0.6);
          box-shadow: 0 20px 60px rgba(255, 105, 180, 0.4),
                      0 10px 30px rgba(255, 105, 180, 0.3),
                      0 5px 15px rgba(0, 0, 0, 0.5),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2),
                      inset 0 -1px 0 rgba(0, 0, 0, 0.4);
          transform: translateY(-5px);
        }

        .zen-carousel .swiper-slide img {
          width: 180px;
          height: 220px;
          object-fit: contain;
          margin-bottom: 12px;
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
          border: none;
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
        pagination={false}
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
              className="relative bg-[rgba(40,30,60,0.6)] text-pink-200 border-0 text-xs h-8 px-4
                shadow-[-3px_-3px_6px_rgba(80,60,100,0.4),3px_3px_6px_rgba(10,5,20,0.8)]
                hover:shadow-[-2px_-2px_4px_rgba(80,60,100,0.3),2px_2px_4px_rgba(10,5,20,0.6)]
                active:shadow-[inset_2px_2px_6px_rgba(10,5,20,0.9),inset_-2px_-2px_4px_rgba(80,60,100,0.3)]
                transition-all duration-200 ease-in-out"
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
