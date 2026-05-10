import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiEye, FiHeart, FiShoppingBag, FiZap } from 'react-icons/fi';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { formatPrice } from '../../utils/formatters';
import { getMediaUrl } from '../../utils/media';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isInWishlist = wishlistItems.some((item) => item._id === product._id);

  const imageUrl = getMediaUrl(product.images?.[0]?.url);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const totalStock = product.sizes?.reduce(
    (total, item) => total + Number(item.stock || 0),
    0
  );

  const firstAvailableSize =
    product.sizes?.find((item) => Number(item.stock) > 0)?.size || 'M';

  const cartItem = {
    product: product._id,
    name: product.name,
    slug: product.slug,
    image: product.images?.[0]?.url || '',
    price: product.price,
    size: firstAvailableSize,
    quantity: 1,
    stock: totalStock
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

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

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!totalStock || totalStock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    dispatch(addToCart(cartItem));
    toast.success('Added to cart');
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!totalStock || totalStock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    dispatch(addToCart(cartItem));

    if (!userInfo) {
      toast.info('Please login to continue checkout');
      navigate('/login?redirect=/checkout');
      return;
    }

    navigate('/checkout');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-2xl border border-white/70 bg-white/90 shadow-[0_12px_28px_rgba(148,163,184,0.14)] transition-all duration-300 hover:shadow-[0_26px_65px_rgba(148,163,184,0.28)] sm:rounded-[1.75rem] sm:shadow-[0_18px_40px_rgba(148,163,184,0.16)]"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f2eadf]">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-white/10 group-hover:from-black/5 group-hover:to-transparent transition-colors duration-300" />

          <div className="absolute left-2 top-2 flex flex-col gap-1.5 sm:left-3 sm:top-3 sm:gap-2">
            {product.isNewArrival && (
              <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-gray-900 shadow-sm sm:px-3 sm:text-[11px]">
                NEW
              </span>
            )}

            {discount > 0 && (
              <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white shadow-sm sm:px-3 sm:text-[11px]">
                -{discount}%
              </span>
            )}

            {(!totalStock || totalStock <= 0) && (
              <span className="rounded-full bg-gray-900 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white shadow-sm sm:px-3 sm:text-[11px]">
                SOLD OUT
              </span>
            )}
          </div>

          <div className="absolute right-2 top-2 flex flex-col gap-1.5 opacity-100 transition-all duration-300 sm:right-3 sm:top-3 sm:gap-2 md:translate-x-2 md:opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
            <button
              onClick={handleWishlist}
              className={`grid h-9 w-9 place-items-center rounded-full shadow-md transition sm:h-10 sm:w-10 ${
                isInWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
              aria-label="Toggle wishlist"
            >
              <FiHeart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>

            <Link
              to={`/product/${product.slug}`}
              className="grid h-9 w-9 place-items-center rounded-full bg-white text-gray-800 shadow-md transition hover:bg-gray-100 sm:h-10 sm:w-10"
              aria-label="View product"
            >
              <FiEye size={18} />
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 translate-y-0 p-2 transition-transform duration-300 sm:p-3 md:translate-y-full group-hover:translate-y-0">
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <button
                onClick={handleQuickAdd}
                disabled={!totalStock || totalStock <= 0}
                className="flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-white px-2 py-2 text-[11px] font-semibold text-gray-900 shadow-lg transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-11 sm:gap-2 sm:rounded-xl sm:px-3 sm:py-3 sm:text-sm"
              >
                <FiShoppingBag size={15} />
                Add
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!totalStock || totalStock <= 0}
                className="flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-gray-950 px-2 py-2 text-[11px] font-semibold text-white shadow-lg transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-11 sm:gap-2 sm:rounded-xl sm:px-3 sm:py-3 sm:text-sm"
              >
                <FiZap size={15} />
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="mb-2 flex items-start justify-between gap-2 sm:gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 sm:line-clamp-1 sm:text-base">
                {product.name}
              </h3>

              <p className="mt-1 line-clamp-1 text-xs text-gray-500 sm:text-sm">
                {product.category?.name || 'Lite Bouys Zone'}
              </p>
            </div>

            {totalStock > 0 && totalStock <= 5 && (
              <span className="hidden shrink-0 rounded-full bg-yellow-100 px-2.5 py-1 text-[11px] font-semibold text-yellow-700 sm:inline-flex">
                Low Stock
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-sm font-bold text-gray-950 sm:text-base">
              {formatPrice(product.price)}
            </span>

            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through sm:text-sm">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
