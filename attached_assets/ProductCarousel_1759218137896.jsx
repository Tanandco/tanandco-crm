import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

/*
 * ProductCarousel
 *
 * This component renders two 3D coverflow carousels: one for bronzers designed
 * for tanning beds and another for at‑home self‑tanning products.  Each slide
 * presents a product image along with its name and price.  The images are
 * imported from local files (ensure these files are available in your project).
 * To add or modify products, update the `productData` array below.  The
 * `category` field controls placement in either the “bed” or “home” carousel.
 */

// Local image imports.  Place these files in an accessible `images` directory
// relative to this component.  If you rename or relocate any images, update
// the import paths accordingly.
import bombshellImg from './images/Lotion-Bombshell.jpg';
// Updated American Glamour image (250 ml variant with transparent background)
import americanGlamourImg from './images/american-glamour-250.png';
// Updated to use official product image instead of cropped one
import darkChocolateImg from './images/dark-chocolate.png';
import jetBlackImg from './images/jet-black-1-768x1004.png';
import tingleBellImg from './images/Tingle_Bell.png';
import soHotImg from './images/So_Hot.png';
// Updated to use official product image instead of cropped one
import commandImg from './images/command.png';
// New product images
import jetSetSunImg from './images/jet-set-sun.png';
import wildTanBlackStrongBronzerImg from './images/wild-tan-black-strong-bronzer.png';
import onTheGoDarkImg from './images/on-the-go-dark.png';
import legsCappuccinoImg from './images/Legs_Cappuccino_crop.jpg';
import norvellSilverImg from './images/Norvell_silver_crop.jpg';
import norvellPurpleImg from './images/Norvell_purple_crop.jpg';

// Data describing each product.  Include only essential fields to keep the
// slider responsive.  Categories: 'bed' for tanning bed bronzers, 'home' for
// at‑home tanning products.
const productData = [
  {
    sku: 'TNC-0001',
    name: 'BombShell 100XX Bronzer',
    desc: 'קרם ברונזר חזק לשיזוף מיידי עם אפקט חום',
    price: '300 ₪',
    category: 'bed',
    image: bombshellImg,
  },
  {
    sku: 'TNC-0002',
    name: 'American Glamour',
    desc: 'קרם שיזוף עם בוסטר לעור כהה וזוהר',
    price: '300 ₪',
    category: 'bed',
    image: americanGlamourImg,
  },
  {
    sku: 'TNC-0003',
    name: 'Dark Chocolate',
    desc: 'ברונזר שוקולד כהה לשיזוף עמוק',
    price: '300 ₪',
    category: 'bed',
    image: darkChocolateImg,
  },
  {
    sku: 'TNC-0004',
    name: 'Jet Black',
    desc: 'ברונזר שחור אינטנסיבי עם אפקט כהות חזקה',
    price: '300 ₪',
    category: 'bed',
    image: jetBlackImg,
  },
  {
    sku: 'TNC-0005',
    name: 'Tingle Bell',
    desc: 'קרם שיזוף עם אפקט חימום ועקצוץ',
    price: '250 ₪',
    category: 'bed',
    image: tingleBellImg,
  },
  {
    sku: 'TNC-0006',
    name: 'So Hot!',
    desc: 'ברונזר עם 70x בוסטר לחום ושיזוף מואץ',
    price: '250 ₪',
    category: 'bed',
    image: soHotImg,
  },
  {
    sku: 'TNC-0007',
    name: 'Command',
    desc: 'קרם ברונזר עוצמתי לגוון עור כהה',
    price: '250 ₪',
    category: 'bed',
    image: commandImg,
  },
  {
    sku: 'TNC-0008',
    name: 'Legs Cappuccino',
    desc: 'קרם ייחודי לשיזוף והדגשה של הרגליים',
    price: '250 ₪',
    category: 'bed',
    image: legsCappuccinoImg,
  },
  {
    sku: 'TNC-0009',
    name: 'Norvell Self Tanning Mousse (Silver)',
    desc: 'מוס לשיזוף עצמי – גוון טבעי',
    price: '200 ₪',
    category: 'home',
    image: norvellSilverImg,
  },
  {
    sku: 'TNC-0010',
    name: 'Norvell Venetian Mousse (Purple)',
    desc: 'מוס לשיזוף עצמי – גוון שזוף ים תיכוני',
    price: '200 ₪',
    category: 'home',
    image: norvellPurpleImg,
  },

  // New products added by request
  {
    sku: 'TNC-0011',
    name: 'Jet Set Sun Self Tanning Spray',
    desc: 'תרסיס שיזוף עצמי במהירות ובקלות',
    price: '200 ₪',
    category: 'home',
    image: jetSetSunImg,
  },
  {
    sku: 'TNC-0012',
    name: 'Wild Tan Black Strong Bronzer',
    desc: 'ברונזר חזק עם מאיץ וחמאת קקאו לשיזוף ארוך טווח',
    price: '250 ₪',
    category: 'bed',
    image: wildTanBlackStrongBronzerImg,
  },
  {
    sku: 'TNC-0013',
    name: "That'so On The Go Dark",
    desc: 'תרסיס שיזוף כהה עם תמצית קנה סוכר ופיגמנטים ברונזרים',
    price: '200 ₪',
    category: 'home',
    image: onTheGoDarkImg,
  },
];

// Separate products by category for their respective carousels
const bedProducts = productData.filter((p) => p.category === 'bed');
const homeProducts = productData.filter((p) => p.category === 'home');

const ProductCarousel = () => {
  return (
    <div className="p-6 space-y-12">
      {/* Carousel for tanning bed bronzers */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-center">ברונזרים למיטות שיזוף</h2>
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination]}
          className="pb-8"
        >
          {bedProducts.map((product) => (
            <SwiperSlide
              key={product.sku}
              className="flex flex-col items-center w-64"
            >
              <img
                src={product.image}
                alt={product.name}
                className="rounded-lg w-64 h-64 object-contain shadow-lg"
              />
              <div className="mt-3 text-center">
                <h3 className="font-semibold text-base">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.price}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      {/* Carousel for at‑home self‑tanning products */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-center">מוצרי שיזוף ביתיים</h2>
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination]}
        >
          {homeProducts.map((product) => (
            <SwiperSlide
              key={product.sku}
              className="flex flex-col items-center w-64"
            >
              <img
                src={product.image}
                alt={product.name}
                className="rounded-lg w-64 h-64 object-contain shadow-lg"
              />
              <div className="mt-3 text-center">
                <h3 className="font-semibold text-base">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.price}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
};

export default ProductCarousel;