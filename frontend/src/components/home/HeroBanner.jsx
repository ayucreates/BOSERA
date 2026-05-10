import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    id: 1,
    image: '/banners/banner1.jpg',
    title: 'New Season Collection',
    subtitle: 'Discover the latest trends in vintage fashion',
    cta: 'Shop Now',
    link: '/shop'
  },
  {
    id: 2,
    image: '/banners/banner2.jpg',
    title: 'Summer Sale',
    subtitle: 'Up to 50% off on selected items',
    cta: 'Explore Deals',
    link: '/shop?sale=true'
  },
  {
    id: 3,
    image: '/banners/banner3.jpg',
    title: 'Curated Classics',
    subtitle: 'Timeless pieces for your wardrobe',
    cta: 'View Collection',
    link: '/shop?category=classics'
  }
];

const HeroBanner = () => {
  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="h-[60vh] md:h-[80vh]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-6xl font-display font-bold mb-4"
                  >
                    {slide.title}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-xl mb-8"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link
                      to={slide.link}
                      className="inline-block bg-white text-gray-900 px-8 py-3 font-medium hover:bg-gray-100 transition-colors"
                    >
                      {slide.cta}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroBanner;
