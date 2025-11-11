/*
 * script.js
 *
 * This script initializes two Swiper instances to showcase Tan & Co. products.
 * Products are separated into two categories: tanning bed bronzers and home
 * self‑tanning products. Each slide contains an image, a product name, a
 * short description, and a price. The sliders use Swiper's coverflow effect
 * for a modern 3D carousel appearance.
 */

// Data for tanning bed bronzers
const bedProducts = [
  {
    name: "BombShell 100XX Bronzer",
    description: "קרם ברונזר עוצמתי לשימוש במיטת שיזוף עם אפקט חום ו‑100XX",
    price: "300 ₪",
    image: "images/bombshell.jpg",
  },
  {
    name: "American Glamour",
    description: "ברונזר שחור מתקדם 300x עם שמני מונוי דה טאהיטי וארגן",
    price: "300 ₪",
    image: "images/american-glamour.png",
  },
  {
    name: "Dark Chocolate",
    description: "מגה ברונזר בטעם שוקולד כהה עם חמאת קקאו ולחות",
    price: "300 ₪",
    image: "images/dark-chocolate.png",
  },
  {
    name: "Jet Black",
    description: "ברונזר שחור 120x לגוון כהה ומשיי",
    price: "300 ₪",
    image: "images/jet-black.png",
  },
  {
    name: "Tingle Bell",
    description: "קרם שיזוף עם אפקט חימום ועקצוץ עדין",
    price: "250 ₪",
    image: "images/tingle-bell.png",
  },
  {
    name: "So Hot!",
    description: "ברונזר עם בוסטר 70x לחום ושיזוף מהיר",
    price: "250 ₪",
    image: "images/so-hot.png",
  },
  {
    name: "Command",
    description: "ברונזר שחור מרובע מאלבאר בעוצמה גבוהה",
    price: "250 ₪",
    image: "images/command.png",
  },
  {
    name: "Legs Cappuccino",
    description: "קרם מדגיש רגליים בגוון קפוצ'ינו וחמימות נעימה",
    price: "250 ₪",
    image: "images/legs-cappuccino.jpg",
  },
  {
    name: "Wild Tan Black Bronzer",
    description: "ברונזר חזק עם DHA וחמאת קקאו לתוצאה כהה ועמידה",
    price: "250 ₪",
    image: "images/wild-tan.png",
  },
];

// Data for home self‑tanning products
const homeProducts = [
  {
    name: "Norvell Self Tanning Mousse",
    description: "מוס לשיזוף עצמי בגוון טבעי וללא כתמים",
    price: "200 ₪",
    image: "images/norvell-silver.jpg",
  },
  {
    name: "Norvell Venetian Mousse",
    description: "מוס לשיזוף עצמי בגוון ים תיכוני נוצץ",
    price: "200 ₪",
    image: "images/norvell-purple.jpg",
  },
  {
    name: "Jet Set Sun Spray",
    description: "תרסיס שיזוף עצמי להישג מיידי ובקלות בבית",
    price: "200 ₪",
    image: "images/jet-set-sun.png",
  },
  {
    name: "That’s So On The Go Dark",
    description: "תרסיס שיזוף כהה עם תמצית קנה סוכר ו‑Matrixyl™",
    price: "200 ₪",
    image: "images/on-the-go-dark.png",
  },
];

/**
 * Inject product slides into the specified Swiper wrapper.
 *
 * @param {string} selector - CSS selector for the swiper-wrapper element
 * @param {Array} products - Array of product objects
 */
function populateSlides(selector, products) {
  const wrapper = document.querySelector(selector);
  if (!wrapper) return;
  products.forEach((product) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p class="price">${product.price}</p>
    `;
    wrapper.appendChild(slide);
  });
}

// Populate slides for each category
populateSlides(".bedSwiper .swiper-wrapper", bedProducts);
populateSlides(".homeSwiper .swiper-wrapper", homeProducts);

// Initialize Swiper instances with coverflow effect for a 3D carousel feel
const bedSwiper = new Swiper(".bedSwiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  initialSlide: 1,
  loop: true,
  coverflowEffect: {
    rotate: 40,
    stretch: 0,
    depth: 200,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: ".bedSwiper .swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".bedSwiper .swiper-button-next",
    prevEl: ".bedSwiper .swiper-button-prev",
  },
});

const homeSwiper = new Swiper(".homeSwiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  initialSlide: 1,
  loop: true,
  coverflowEffect: {
    rotate: 40,
    stretch: 0,
    depth: 200,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: ".homeSwiper .swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".homeSwiper .swiper-button-next",
    prevEl: ".homeSwiper .swiper-button-prev",
  },
});