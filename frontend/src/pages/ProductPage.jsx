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

const RatingStars = ({ rating = 0 }) => {
  const roundedRating = Math.round(Number(rating) || 0);

  return (
    <div className="flex items-center gap-0.5 text-yellow-500">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>{star <= roundedRating ? '★' : '☆'}</span>
      ))}
    </div>
  );
};

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

  const getFirstImageUrl = () => {
    const firstImage = product?.images?.[0];

    if (!firstImage) return '';

    if (typeof firstImage === 'string') {
      return firstImage;
    }

    return firstImage.url || '';
  };

  const getImageUrl = (image) => {
    if (!image) return '/placeholder.jpg';

    if (typeof image === 'string') {
      return getMediaUrl(image);
    }

    return getMediaUrl(image.url);
  };

  const createCartItem = () => ({
    product: product._id,
    name: product.name,
    slug: product.slug,
    image: getFirstImageUrl(),
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

    sessionStorage.setItem('buyNowItems', JSON.stringify([createCartItem()]));
    navigate('/checkout?buyNow=true');
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
  const reviews = product.reviews || [];

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl px-3 py-5 sm:px-4 sm:py-8 md:py-12">
        <button
          onClick={() => navigate('/shop')}
          className="mb-4 text-sm font-medium text-gray-600 transition hover:text-gray-950 sm:mb-6"
        >
          ← Back to shop
        </button>

        <div className="grid grid-cols-1 gap-5 sm:gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-3 sm:space-y-4">
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
                className="aspect-[4/5] bg-[#f4ede3] sm:aspect-[3/4]"
              >
                {product.images?.length > 0 ? (
                  product.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="swiper-zoom-container">
                        <img
                          src={getImageUrl(image)}
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
                spaceBetween={8}
                className="h-20 sm:h-24"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index} className="cursor-pointer">
                    <img
                      src={getImageUrl(image)}
                      alt={image.alt || product.name}
                      className="h-full w-full rounded-lg border border-white/70 object-cover sm:rounded-xl"
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
            className="glass-panel h-fit p-4 sm:p-6 md:p-8"
          >
            <div className="mb-5 sm:mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 sm:mb-3 sm:text-sm sm:tracking-[0.2em]">
                {product.category?.name || 'Lite Bouys Zone'}
              </p>

              <h1 className="mb-4 text-2xl font-bold leading-tight text-gray-950 sm:text-3xl md:text-5xl">
                {product.name}
              </h1>

              <div className="mb-3 flex flex-wrap items-center gap-2">
                <RatingStars rating={product.rating} />
                <span className="text-sm text-gray-500">
                  {product.numReviews || 0} review{product.numReviews === 1 ? '' : 's'}
                </span>
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-2.5 sm:mb-5 sm:gap-4">
                <span className="text-2xl font-bold text-gray-950 sm:text-3xl">
                  {formatPrice(product.price)}
                </span>

                {product.originalPrice && (
                  <>
                    <span className="text-base text-gray-400 line-through sm:text-lg">
                      {formatPrice(product.originalPrice)}
                    </span>

                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600 sm:px-3 sm:text-sm">
                      {discount}% OFF
                    </span>
                  </>
                )}

                {totalStock > 0 ? (
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 sm:px-3 sm:text-sm">
                    In Stock
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 sm:px-3 sm:text-sm">
                    Out of Stock
                  </span>
                )}
              </div>

              <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                {product.description}
              </p>
            </div>

            <div className="space-y-5 border-t border-gray-100 pt-5 sm:space-y-6 sm:pt-6">
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-950">Select Size</h3>

                  {selectedSizeData && (
                    <p className="shrink-0 text-xs text-gray-500 sm:text-sm">
                      {selectedSizeData.stock} available
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2 min-[420px]:grid-cols-5 sm:flex sm:flex-wrap sm:gap-3">
                  {product.sizes?.map((sizeOption) => (
                    <button
                      key={sizeOption.size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(sizeOption.size);
                        setQuantity(1);
                      }}
                      disabled={Number(sizeOption.stock) === 0}
                      className={`min-h-11 rounded-xl border px-3 py-2.5 font-semibold transition sm:min-w-12 sm:px-4 sm:py-3 ${
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

                <div className="flex w-fit items-center overflow-hidden rounded-xl border border-gray-200 bg-white">
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

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!totalStock || totalStock <= 0}
                  className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl border border-gray-950 bg-white px-3 py-3 text-sm font-semibold text-gray-950 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-6 sm:py-4 sm:text-base"
                >
                  <FiShoppingBag size={18} />
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!totalStock || totalStock <= 0}
                  className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-gray-950 px-3 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-6 sm:py-4 sm:text-base"
                >
                  <FiZap size={18} />
                  Buy Now
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
                <button
                  onClick={handleWishlist}
                  className={`flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-3 text-sm font-medium transition sm:gap-2 sm:px-5 sm:text-base ${
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
                  className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 py-3 text-sm font-medium text-gray-800 transition hover:border-gray-950 sm:gap-2 sm:px-5 sm:text-base"
                >
                  <FiShare2 size={18} />
                  Share
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-100 bg-white/80 p-4 sm:mt-8 sm:p-5">
              <h3 className="mb-3 font-bold text-gray-950">Return & Exchange</h3>

              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-600 sm:text-base">
                <li>Return and exchange are available within 3 days of delivery.</li>
                <li>The product tag must stay attached for return or exchange.</li>
                <li>An unboxing video is required for return or exchange claims.</li>
              </ul>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5 sm:mt-8 sm:pt-6">
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

        <section className="mt-10 rounded-2xl border border-gray-100 bg-white/90 p-4 shadow-sm sm:mt-14 sm:rounded-[2rem] sm:p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-sm">
                Reviews
              </p>
              <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl">
                Customer Reviews
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <RatingStars rating={product.rating} />
              <span className="text-sm text-gray-500">
                {product.rating ? Number(product.rating).toFixed(1) : '0.0'} out of 5
              </span>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="rounded-2xl bg-gray-50 p-5 text-gray-600">
              No reviews yet. Reviews can be added after delivery from the order details page.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews
                .slice()
                .reverse()
                .map((review) => (
                  <div key={review._id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-950">{review.name}</p>
                          {review.verifiedPurchase && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                              Verified purchase
                            </span>
                          )}
                        </div>
                        <RatingStars rating={review.rating} />
                      </div>

                      <p className="text-xs text-gray-500">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>

                    <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                      {review.comment}
                    </p>

                    {review.images?.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                        {review.images.map((image, index) => (
                          <img
                            key={`${image.url}-${index}`}
                            src={getMediaUrl(image.url)}
                            alt={image.alt || `Review image ${index + 1}`}
                            className="h-24 w-full rounded-xl object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductPage;
