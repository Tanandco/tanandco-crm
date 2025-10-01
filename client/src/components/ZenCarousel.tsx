import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import { ShoppingCart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
          padding: 12px;
          border-radius: 16px;
          background: #0a0a0a;
          border: 0;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
          transition: all 0.25s ease;
        }

        .zen-carousel .swiper-slide-active {
          background: #0a0a0a;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08), 0 10px 24px rgba(0, 0, 0, 0.35);
          transform: scale(1.02);
        }

        .zen-carousel .swiper-slide img {
          width: 220px;
          height: 280px;
          object-fit: contain;
          margin-bottom: 6px;
          transition: transform 0.3s ease;
        }

        .zen-carousel .swiper-slide img[src*="tingle-bell"] {
          width: 250px;
          height: 310px;
        }

        .zen-carousel .swiper-slide-active img {
          transform: scale(1.05);
        }

        .zen-carousel .swiper-button-next,
        .zen-carousel .swiper-button-prev {
          color: rgba(255, 255, 255, 0.7);
          background: rgba(0, 0, 0, 0.4);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .zen-carousel .swiper-button-next:hover,
        .zen-carousel .swiper-button-prev:hover {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
        }

        .zen-carousel .swiper-button-next::after,
        .zen-carousel .swiper-button-prev::after {
          font-size: 20px;
        }

        .zen-carousel .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.3);
          width: 10px;
          height: 10px;
        }

        .zen-carousel .swiper-pagination-bullet-active {
          background: rgba(255, 255, 255, 0.7);
          width: 18px;
          border-radius: 6px;
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
            <div className="flex gap-2 w-full">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={() => onAddToCart?.(product.id)}
                data-testid={`zen-cart-btn-${product.id}`}
              >
                <span 
                  className="text-sm font-bold"
                  data-testid={`zen-price-${product.id}`}
                >
                  ₪{product.price}
                </span>
                <ShoppingCart className="w-3 h-3" />
              </Button>
              {product.description && (
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button 
                      size="sm"
                      variant="outline"
                      data-testid={`zen-info-${product.id}`}
                    >
                      <Info className="w-3 h-3" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle className="text-center">{product.name}</DrawerTitle>
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
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
