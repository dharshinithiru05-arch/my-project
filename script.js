// Initialize Swiper
const swiper = new Swiper('.mySwiper', {
  direction: 'horizontal',   // or "vertical" if you want swipe up/down
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  speed: 800,
});
