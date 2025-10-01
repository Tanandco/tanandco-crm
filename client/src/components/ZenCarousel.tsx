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
  images?: string[]; // All product images including sachets
  category: string;
  description?: string;
  bronzerStrength?: number;
}

interface ZenCarouselProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
}

export default function ZenCarousel({ products, onAddToCart }: ZenCarouselProps) {
  return (
    <div className="relative w-full py-4 -mt-8" dir="rtl">
      <style>{`
        @keyframes flow-gradient {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 200% 200%;
          }
        }

        .zen-carousel .swiper-slide {
          width: 280px !important;
          height: 380px !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 16px;
          border-radius: 20px;
          background: linear-gradient(135deg, 
            rgba(236, 72, 153, 0.2) 0%,
            rgba(168, 85, 247, 0.15) 50%,
            rgba(236, 72, 153, 0.1) 100%);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(236, 72, 153, 0.6);
          box-shadow: 
            0 10px 20px rgba(0, 0, 0, 0.3),
            0 20px 40px rgba(236, 72, 153, 0.3),
            0 30px 60px rgba(168, 85, 247, 0.2),
            0 0 80px rgba(236, 72, 153, 0.1);
          position: relative;
          transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
          overflow: visible;
          transform: translateY(0) rotateX(0deg);
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .zen-carousel .swiper-slide::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 20px;
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
          animation: flow-gradient 4s linear infinite;
          opacity: 0.7;
        }

        .zen-carousel .swiper-slide::after {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 24px;
          background: radial-gradient(
            circle at center,
            rgba(236, 72, 153, 0.15),
            rgba(168, 85, 247, 0.1),
            transparent 70%
          );
          z-index: -2;
          filter: blur(20px);
          opacity: 0.6;
        }

        .zen-carousel .swiper-slide-active {
          background: linear-gradient(135deg, 
            rgba(236, 72, 153, 0.3) 0%,
            rgba(168, 85, 247, 0.2) 50%,
            rgba(236, 72, 153, 0.15) 100%);
          backdrop-filter: blur(16px);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.5),
            0 30px 60px rgba(236, 72, 153, 0.5),
            0 40px 80px rgba(168, 85, 247, 0.4),
            0 0 100px rgba(236, 72, 153, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: translateY(-10px) scale(1.05) rotateX(2deg);
          border-color: rgba(236, 72, 153, 0.8);
        }

        .zen-carousel .swiper-slide-active::before {
          background: linear-gradient(
            135deg,
            rgba(236, 72, 153, 1),
            rgba(168, 85, 247, 0.8),
            rgba(139, 92, 246, 1),
            rgba(236, 72, 153, 0.8),
            rgba(168, 85, 247, 1)
          );
          background-size: 200% 200%;
          animation: flow-gradient 3s linear infinite;
          opacity: 1;
        }

        .zen-carousel .swiper-slide-active::after {
          inset: -20px;
          background: radial-gradient(
            circle at center,
            rgba(236, 72, 153, 0.3),
            rgba(168, 85, 247, 0.2),
            transparent 60%
          );
          filter: blur(30px);
          opacity: 1;
        }

        .zen-carousel .swiper-slide img {
          width: 220px;
          height: 280px;
          object-fit: contain;
          margin-bottom: 6px;
          transition: transform 0.3s ease;
        }

        .zen-carousel .swiper-slide img[src*="jet-black"] {
          transform: translateX(30px);
        }

        .zen-carousel .swiper-slide-active img[src*="jet-black"] {
          transform: translateX(30px) scale(1.05);
        }

        .zen-carousel .swiper-slide img[src*="tingle-bell"] {
          width: 336px;
          height: 432px;
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
            {product.bronzerStrength && (
              <p className="text-xs text-muted-foreground text-center mb-2">
                חוזק: {product.bronzerStrength}
              </p>
            )}
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
                    
                    {/* Show all product images including sachets */}
                    {product.images && product.images.length > 1 && (
                      <div className="px-4 pb-4">
                        <h4 className="text-sm font-semibold mb-3 text-center text-muted-foreground">
                          אפשרויות זמינות
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {product.images.map((img, idx) => (
                            <div 
                              key={idx} 
                              className="bg-gradient-to-br from-pink-500/20 to-purple-500/10 backdrop-blur-md rounded-xl p-4 border border-pink-500/60 shadow-xl shadow-pink-500/20 hover:from-pink-500/30 hover:to-purple-500/15 hover:shadow-2xl hover:shadow-pink-500/40 hover:scale-105 transition-all duration-500 cursor-pointer"
                            >
                              <img 
                                src={img} 
                                alt={`${product.name} - ${idx === 0 ? 'טיובה' : 'שקית חד פעמית'}`}
                                className="w-full h-40 object-contain mb-2 transition-transform duration-300"
                              />
                              <p className="text-xs text-center text-pink-200 font-medium hover:bg-pink-500/10 hover:px-2 border-b border-pink-500/20 transition-all duration-300 py-1">
                                {idx === 0 ? '🧴 טיובה' : '📦 שקית חד פעמית'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
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
