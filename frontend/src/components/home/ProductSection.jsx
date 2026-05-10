import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from '../products/ProductCard';
import { fetchFeaturedProducts, fetchNewArrivals, fetchBestSellers } from '../../store/slices/productSlice';
import 'swiper/css';
import 'swiper/css/navigation';

const ProductSection = ({ type, title }) => {
  const dispatch = useDispatch();
  const { featured, newArrivals, bestSellers } = useSelector((state) => state.products);

  useEffect(() => {
    if (type === 'featured') dispatch(fetchFeaturedProducts());
    if (type === 'new') dispatch(fetchNewArrivals());
    if (type === 'bestseller') dispatch(fetchBestSellers());
  }, [dispatch, type]);

  const products = type === 'featured' ? featured : type === 'new' ? newArrivals : bestSellers;

  if (products.length === 0) return null;

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-semibold">{title}</h2>
          <Link
            to="/shop"
            className="text-gray-600 hover:text-gray-900 font-medium underline underline-offset-4"
          >
            View All
          </Link>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4 }
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product._id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProductSection;
