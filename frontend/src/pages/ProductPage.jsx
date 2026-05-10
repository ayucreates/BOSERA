import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  FiHeart,
  FiMinus,
  FiPlus,
  FiShare2,
  FiShoppingBag,
  FiZap
} from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Zoom } from 'swiper/modules';
import { fetchProductBySlug, clearProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { toast } from 'react-toastify';
import { formatPrice } from '../utils/formatters';
import { getMediaUrl } from '../utils/media';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const { product, loading, error } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isInWishlist =
    product && wishlistItems.some((item) => item._id === product._id);

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
    return () => dispatch(clearProduct());
  }, [dispatch, slug]);

  useEffect(() => {
    if (product?.sizes?.length > 0) {
      const firstAvailableSize = product.sizes.find(
        (item) => Number(item.stock) > 0
      );

      if (firstAvailableSize) {
        setSelectedSize(firstAvailableSize.size);
      }
    }
  }, [product]);

  const getSelectedSizeData = () =>
    product?.sizes?.find((item) => item.size === selectedSize);

  const totalStock = product?.sizes?.reduce(
    (total, item) => total + Number(item.stock || 0),
    0
  );

  const createCartItem = () => ({
    product: product._id,
    name: product.name,
    slug: product.slug,
    image: product.images?.[0]?.url || '',
    price: product.price,
    size: selectedSize,
    quantity,
    stock: getSelectedSizeData()?.stock || totalStock || 0
  });

  const validateCartAction = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return false;
    }

    const sizeData = getSelectedSizeData();

    if (!sizeData || Number(sizeData.stock) <= 0) {
      toast.error('Selected size is out of stock');
      return false;
    }

    if (Number(sizeData.stock) < quantity) {
      toast.error('Not enough stock available');
      return false;
    }

    return true;
  };

  const handleAddToCart = () => {
    if (!validateCartAction()) return;
    dispatch(addToCart(createCartItem()));
    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    if (!validateCartAction()) return;

    dispatch(addToCart(createCartItem()));

    if (!userInfo) {
      toast.info('Please login to continue checkout');
      navigate('/login?redirect=/checkout');
      return;
    }

    navigate('/checkout');
  };

  const handleWishlist = () => {
    if (!userInfo) {
      toast.error('Please login to add to wishlist');
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product._id));
      toast.success('Added to wishlist');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        url: window.location.href
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    const sizeData = getSelectedSizeData();

    if (sizeData && quantity >= Number(sizeData.stock)) {
      toast.error('Not enough stock available');
      return;
    }

    setQuantity((current) => current + 1);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-transparent px-4">
        <h2 className="mb-4 text-2xl font-semibold">Product not found</h2>
        <button
          onClick={() => navigate('/shop')}
          className="rounded-xl bg-gray-950 px-6 py-3 text-white transition hover:bg-gray-800"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const selectedSizeData = getSelectedSizeData();

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <button
          onClick={() => navigate('/shop')}
          className="mb-6 text-sm font-medium text-gray-600 transition hover:text-gray-950"
        >
          ← Back to shop
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-4">
            <div className="glass-panel overflow-hidden">
              <Swiper
                modules={[Thumbs, Zoom]}
                thumbs={{
                  swiper:
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? thumbsSwiper
                      : null
                }}
                zoom
                className="aspect-[3/4] bg-[#f4ede3]"
              >
                {product.images?.length > 0 ? (
                  product.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="swiper-zoom-container">
                        <img
                          src={getMediaUrl(image.url)}
                          alt={image.alt || product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <img
                      src="/placeholder.jpg"
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </SwiperSlide>
                )}
              </Swiper>
            </div>

            {product.images?.length > 1 && (
              <Swiper
                onSwiper={setThumbsSwiper}
                slidesPerView={4}
                spaceBetween={12}
                className="h-24"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index} className="cursor-pointer">
                    <img
                      src={getMediaUrl(image.url)}
                      alt={image.alt || product.name}
                      className="h-full w-full rounded-xl border border-white/70 object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-panel h-fit p-6 md:p-8"
          >
            <div className="mb-6">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                {product.category?.name || 'Lite Bouys Zone'}
              </p>

              <h1 className="mb-5 text-3xl font-bold leading-tight text-gray-950 md:text-5xl">
                {product.name}
              </h1>

              <div className="mb-5 flex flex-wrap items-center gap-4">
                <span className="text-3xl font-bold text-gray-950">
                  {formatPrice(product.price)}
                </span>

                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>

                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                      {discount}% OFF
                    </span>
                  </>
                )}

                {totalStock > 0 ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    In Stock
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                    Out of Stock
                  </span>
                )}
              </div>

              <p className="leading-relaxed text-gray-600">{product.description}</p>
            </div>

            <div className="space-y-6 border-t border-gray-100 pt-6">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-950">Select Size</h3>

                  {selectedSizeData && (
                    <p className="text-sm text-gray-500">
                      {selectedSizeData.stock} available
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {product.sizes?.map((sizeOption) => (
                    <button
                      key={sizeOption.size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(sizeOption.size);
                        setQuantity(1);
                      }}
                      disabled={Number(sizeOption.stock) === 0}
                      className={`min-w-12 rounded-xl border px-4 py-3 font-semibold transition ${
                        selectedSize === sizeOption.size
                          ? 'border-gray-950 bg-gray-950 text-white'
                          : Number(sizeOption.stock) === 0
                            ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300'
                            : 'border-gray-300 bg-white hover:border-gray-950'
                      }`}
                    >
                      {sizeOption.size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-gray-950">Quantity</h3>

                <div className="flex w-fit items-center overflow-hidden rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="p-4 transition hover:bg-gray-100"
                  >
                    <FiMinus size={18} />
                  </button>

                  <span className="w-14 text-center font-semibold">{quantity}</span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="p-4 transition hover:bg-gray-100"
                  >
                    <FiPlus size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!totalStock || totalStock <= 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-950 bg-white px-6 py-4 font-semibold text-gray-950 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiShoppingBag size={18} />
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!totalStock || totalStock <= 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-6 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiZap size={18} />
                  Buy Now
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleWishlist}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-5 py-3 font-medium transition ${
                    isInWishlist
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-gray-200 text-gray-800 hover:border-gray-950'
                  }`}
                >
                  <FiHeart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
                  Wishlist
                </button>

                <button
                  onClick={handleShare}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-medium text-gray-800 transition hover:border-gray-950"
                >
                  <FiShare2 size={18} />
                  Share
                </button>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="mb-4 font-bold text-gray-950">Product Details</h3>

              <ul className="space-y-3 text-gray-600">
                {product.material && (
                  <li>
                    <span className="font-semibold text-gray-950">Material:</span>{' '}
                    {product.material}
                  </li>
                )}

                {product.color && (
                  <li>
                    <span className="font-semibold text-gray-950">Color:</span>{' '}
                    {product.color}
                  </li>
                )}

                {product.brand && (
                  <li>
                    <span className="font-semibold text-gray-950">Brand:</span>{' '}
                    {product.brand}
                  </li>
                )}

                <li>
                  <span className="font-semibold text-gray-950">Category:</span>{' '}
                  {product.category?.name || 'N/A'}
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
