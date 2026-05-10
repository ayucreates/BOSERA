import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiMinus,
  FiPlus,
  FiShield,
  FiShoppingBag,
  FiTrash2,
  FiTruck
} from 'react-icons/fi';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { formatPrice } from '../utils/formatters';
import { getMediaUrl } from '../utils/media';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;
  const freeShippingRemaining = Math.max(999 - subtotal, 0);

  const handleQuantityChange = (productId, size, newQuantity, stock) => {
    if (newQuantity < 1) return;

    if (stock && newQuantity > stock) {
      toast.error('Not enough stock available');
      return;
    }

    dispatch(updateQuantity({ productId, size, quantity: newQuantity }));
  };

  const handleRemove = (productId, size) => {
    dispatch(removeFromCart({ productId, size }));
    toast.success('Removed from cart');
  };

  const handleCheckout = () => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
      return;
    }

    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:py-20">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-white shadow-sm sm:mb-6 sm:h-20 sm:w-20">
            <FiShoppingBag size={34} />
          </div>

          <h1 className="mb-4 text-3xl font-bold text-gray-950 sm:text-4xl md:text-5xl">
            Your cart is empty
          </h1>

          <p className="mb-6 text-base text-gray-600 sm:mb-8 sm:text-lg">
            Looks like you have not added anything yet. Start browsing and build your fit.
          </p>

          <Link
            to="/shop"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-3 font-semibold text-white transition hover:bg-gray-800 sm:px-8 sm:py-4"
          >
            Continue Shopping
            <FiArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <section className="border-b border-gray-100 bg-[#f3eadf]">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:py-12 md:py-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-600 sm:text-sm sm:tracking-[0.2em]">
            Checkout
          </p>

          <h1 className="mb-3 text-3xl font-bold text-gray-950 sm:mb-4 sm:text-4xl md:text-6xl">
            Shopping Cart
          </h1>

          <p className="text-base text-gray-700 sm:text-lg">
            Review your items before placing your order.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 gap-5 sm:gap-8 lg:grid-cols-3">
          <div className="space-y-3 sm:space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <motion.div
                key={`${item.product}-${item.size}`}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-3 sm:p-4 md:p-5"
              >
                <div className="grid grid-cols-[6rem_1fr] gap-3 sm:flex sm:flex-row sm:gap-4">
                  <Link
                    to={`/product/${item.slug || item.product}`}
                    className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-40 sm:w-32"
                  >
                    <img
                      src={getMediaUrl(item.image)}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div>
                        <Link to={`/product/${item.slug || item.product}`}>
                          <h3 className="line-clamp-2 text-base font-bold leading-snug text-gray-950 hover:underline sm:line-clamp-1 sm:text-xl">
                            {item.name}
                          </h3>
                        </Link>

                        <p className="mt-1 text-sm text-gray-500 sm:text-base">Size: {item.size || 'M'}</p>
                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                          Stock: {item.stock || 'Available'}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemove(item.product, item.size)}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-100 sm:h-10 sm:w-10"
                        aria-label="Remove item"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:mt-6 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="mb-2 text-sm text-gray-500">Quantity</p>

                        <div className="flex w-fit items-center overflow-hidden rounded-xl border border-gray-200 bg-white">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product,
                                item.size,
                                item.quantity - 1,
                                item.stock
                              )
                            }
                            className="p-2.5 transition hover:bg-gray-100 sm:p-3"
                          >
                            <FiMinus size={16} />
                          </button>

                          <span className="w-10 text-center font-semibold sm:w-12">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product,
                                item.size,
                                item.quantity + 1,
                                item.stock
                              )
                            }
                            className="p-2.5 transition hover:bg-gray-100 sm:p-3"
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-sm text-gray-500">Item total</p>
                        <p className="text-xl font-bold text-gray-950 sm:text-2xl">
                          {formatPrice(Number(item.price || 0) * Number(item.quantity || 0))}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div>
            <div className="glass-panel p-4 sm:sticky sm:top-24 sm:p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-950 sm:mb-6 sm:text-2xl">Order Summary</h2>

              <div className="mb-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-950">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-950">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>

                {subtotal < 999 ? (
                  <div className="rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">
                    Add {formatPrice(freeShippingRemaining)} more for free shipping.
                  </div>
                ) : (
                  <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
                    You unlocked free shipping.
                  </div>
                )}

                <div className="flex justify-between border-t border-gray-100 pt-4 text-xl font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-6 py-3 font-semibold text-white transition hover:bg-gray-800 sm:py-4"
              >
                Proceed to Checkout
                <FiArrowRight />
              </button>

              <Link
                to="/shop"
                className="mt-3 flex min-h-12 items-center justify-center rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:border-gray-950 hover:text-gray-950 sm:mt-4 sm:py-4"
              >
                Continue Shopping
              </Link>

              <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <FiTruck size={20} />
                  <span className="text-sm">Fast order processing</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <FiShield size={20} />
                  <span className="text-sm">Secure checkout support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
