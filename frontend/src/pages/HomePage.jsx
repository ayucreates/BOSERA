import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductCard from '../components/products/ProductCard';
import {
  FiArrowRight,
  FiCompass,
  FiRefreshCw,
  FiShield,
  FiStar,
  FiTruck
} from 'react-icons/fi';
import { formatCompactNumber, formatPrice } from '../utils/formatters';
import { getMediaUrl } from '../utils/media';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      const [featuredResponse, newArrivalsResponse, categoriesResponse] =
        await Promise.all([
          axios.get('/api/products/featured'),
          axios.get('/api/products/new-arrivals'),
          axios.get('/api/categories')
        ]);

      setFeaturedProducts(featuredResponse.data.products || featuredResponse.data);
      setNewArrivals(newArrivalsResponse.data.products || newArrivalsResponse.data);
      setCategories(categoriesResponse.data.categories || categoriesResponse.data);
      setLoading(false);
    } catch (error) {
      console.log(error.response?.data || error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const visibleFeatured = featuredProducts.slice(0, 4);
  const visibleNewArrivals = newArrivals.slice(0, 8);
  const visibleCategories = categories.slice(0, 6);

  return (
    <div className="bg-transparent">
      <section className="relative overflow-hidden bg-[#f3eadf]">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#d7c0a5] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-16 md:py-28">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-medium text-gray-700 shadow-sm sm:mb-6 sm:px-4 sm:text-sm">
                <FiStar />
                Vintage inspired clothing store
              </p>

              <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-950 sm:text-5xl md:text-7xl">
                Lite Bouys Zone
              </h1>

              <p className="mb-6 max-w-xl text-base leading-relaxed text-gray-700 sm:mb-8 md:text-xl">
                Discover thrift-inspired outfits, relaxed streetwear, and everyday pieces made for clean fits and effortless style.
              </p>

              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:flex sm:flex-row sm:gap-4">
                <Link
                  to="/shop"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-3 font-semibold text-white transition hover:bg-gray-800 sm:px-7 sm:py-4"
                >
                  Shop Now
                  <FiArrowRight />
                </Link>

                <Link
                  to="/about"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-gray-950 shadow-sm transition hover:bg-gray-100 sm:px-7 sm:py-4"
                >
                  About Us
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="relative"
            >
              <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-white shadow-2xl sm:aspect-[4/5] sm:rounded-[2rem]">
                <img
                  src={
                    visibleNewArrivals[0]?.images?.[0]?.url
                      ? getMediaUrl(visibleNewArrivals[0].images[0].url)
                      : '/placeholder.jpg'
                  }
                  alt="Lite Bouys Zone hero"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white/90 p-3 shadow-lg backdrop-blur sm:bottom-6 sm:left-6 sm:right-6 sm:rounded-2xl sm:p-5">
                  <p className="mb-1 text-sm text-gray-500">New drop</p>

                  <h2 className="line-clamp-1 text-base font-bold text-gray-950 sm:text-xl">
                    {visibleNewArrivals[0]?.name || 'Fresh vintage collection'}
                  </h2>

                  <p className="mt-1 text-sm text-gray-700 sm:text-base">
                    Starting from {formatPrice(visibleNewArrivals[0]?.price || 799)}
                  </p>
                </div>
              </div>

              <div className="absolute -left-8 top-10 hidden rounded-2xl bg-white p-4 shadow-xl md:block">
                <p className="text-sm text-gray-500">Products</p>
                <p className="text-2xl font-bold text-gray-950">
                  {formatCompactNumber(visibleNewArrivals.length + visibleFeatured.length || 12)}+
                </p>
              </div>

              <div className="absolute -right-8 bottom-14 hidden rounded-2xl bg-gray-950 p-4 text-white shadow-xl md:block">
                <p className="text-sm text-gray-300">Style</p>
                <p className="text-2xl font-bold">Vintage</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-white/85 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-5 sm:gap-6 sm:py-6 md:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gray-100 sm:h-12 sm:w-12">
              <FiTruck size={22} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-950">Fast Local Delivery</h3>
              <p className="text-sm text-gray-500">
                Quick order processing and smooth delivery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gray-100 sm:h-12 sm:w-12">
              <FiShield size={22} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-950">Secure Checkout</h3>
              <p className="text-sm text-gray-500">
                Cash on delivery and online payment support.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gray-100 sm:h-12 sm:w-12">
              <FiRefreshCw size={22} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-950">Easy Updates</h3>
              <p className="text-sm text-gray-500">
                Hand picked products.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Browse
            </p>
            <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl md:text-4xl">
              Shop by Category
            </h2>
          </div>

          <Link
            to="/shop"
            className="hidden items-center gap-2 font-semibold text-gray-950 transition-all hover:gap-3 sm:inline-flex"
          >
            View all
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {visibleCategories.map((category) => (
            <Link
              key={category._id}
              to={`/shop/${category.slug}`}
              className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:p-5"
            >
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#f3eadf] text-gray-950 transition group-hover:bg-gray-950 group-hover:text-white sm:mb-5 sm:h-14 sm:w-14">
                <FiCompass size={18} />
              </div>

              <h3 className="font-bold text-gray-950 group-hover:text-gray-900">
                {category.name}
              </h3>

              <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                {category.description || 'Explore collection'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:pb-16">
        <div className="overflow-hidden rounded-2xl bg-gray-950 text-white sm:rounded-[2rem]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col justify-center p-5 sm:p-8 md:p-12">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                Selected pieces
              </p>

              <h2 className="mb-4 text-3xl font-bold md:text-5xl">Featured Fits</h2>

              <p className="mb-6 text-base leading-relaxed text-gray-300 sm:mb-8 sm:text-lg">
                Handpicked items from Lite Bouys Zone. Clean, wearable, and ready to style.
              </p>

              <Link
                to="/shop"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-gray-950 transition hover:bg-gray-100"
              >
                Explore Collection
                <FiArrowRight />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2">
              {(visibleFeatured.length ? visibleFeatured : visibleNewArrivals)
                .slice(0, 4)
                .map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product.slug}`}
                    className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-800 sm:rounded-3xl"
                  >
                    <img
                      src={
                        product.images?.[0]?.url
                          ? getMediaUrl(product.images[0].url)
                          : '/placeholder.jpg'
                      }
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                      <h3 className="line-clamp-1 text-sm font-semibold text-white sm:text-base">
                        {product.name}
                      </h3>

                      <p className="text-xs text-gray-200 sm:text-sm">{formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:pb-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Latest
            </p>
            <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl md:text-4xl">New Arrivals</h2>
          </div>

          <Link
            to="/shop"
            className="hidden items-center gap-2 font-semibold text-gray-950 transition-all hover:gap-3 sm:inline-flex"
          >
            Shop all
            <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-gray-500">Loading products...</div>
        ) : visibleNewArrivals.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-gray-500">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {visibleNewArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-6 py-3 font-semibold text-white"
          >
            Shop all
            <FiArrowRight />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:pb-20">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm sm:rounded-[2rem] sm:p-8 md:p-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Lite Bouys Zone
          </p>

          <h2 className="mb-4 text-2xl font-bold text-gray-950 sm:text-3xl md:text-5xl">
            Build your next fit today
          </h2>

          <p className="mx-auto mb-6 max-w-2xl text-base text-gray-600 sm:mb-8 sm:text-lg">
            Browse the latest drops, add your favourites to cart, and complete your order with a simple checkout.
          </p>

          <Link
            to="/shop"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-3 font-semibold text-white transition hover:bg-gray-800 sm:px-8 sm:py-4"
          >
            Start Shopping
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
