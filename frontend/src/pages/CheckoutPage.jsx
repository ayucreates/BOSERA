import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { clearCart, saveShippingAddress } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/formatters';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, shippingAddress } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [address, setAddress] = useState(
    shippingAddress || {
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: ''
    }
  );
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleAddressChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      dispatch(saveShippingAddress(address));

      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };

      const { data: order } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress: address,
          paymentMethod,
          itemsPrice: subtotal,
          shippingPrice: shipping,
          taxPrice: tax,
          totalPrice: total
        },
        config
      );

      if (paymentMethod === 'razorpay') {
        const { data: razorpayOrder } = await axios.post(
          '/api/payment/create-order',
          { amount: total },
          config
        );

        const {
          data: { keyId }
        } = await axios.get('/api/config/razorpay');

        const options = {
          key: keyId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Lite Bouys Zone',
          description: 'Order Payment',
          order_id: razorpayOrder.id,
          handler: async (response) => {
            try {
              await axios.post('/api/payment/verify', response, config);
              await axios.put(`/api/orders/${order._id}/pay`, response, config);
              dispatch(clearCart());
              toast.success('Payment successful!');
              navigate(`/order/${order._id}`);
            } catch {
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: address.fullName,
            contact: address.phone
          },
          theme: { color: '#1a1a1a' }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        navigate(`/order/${order._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 md:py-12">
      <div className="mb-6 max-w-2xl sm:mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 sm:mb-3 sm:text-sm sm:tracking-[0.2em]">
          Checkout
        </p>
        <h1 className="text-3xl font-bold text-gray-950 sm:text-4xl md:text-5xl">Complete your order</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 sm:gap-8 lg:grid-cols-3">
          <div className="space-y-5 sm:space-y-8 lg:col-span-2">
            <div className="glass-panel p-4 sm:p-6">
              <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>
              <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                <input name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleAddressChange} className="input-field" required />
                <input name="phone" placeholder="Phone Number" value={address.phone} onChange={handleAddressChange} className="input-field" required />
                <input name="addressLine1" placeholder="Address Line 1" value={address.addressLine1} onChange={handleAddressChange} className="input-field md:col-span-2" required />
                <input name="addressLine2" placeholder="Address Line 2" value={address.addressLine2} onChange={handleAddressChange} className="input-field md:col-span-2" />
                <input name="city" placeholder="City" value={address.city} onChange={handleAddressChange} className="input-field" required />
                <input name="state" placeholder="State" value={address.state} onChange={handleAddressChange} className="input-field" required />
                <input name="pincode" placeholder="Pincode" value={address.pincode} onChange={handleAddressChange} className="input-field" required />
              </div>
            </div>

            <div className="glass-panel p-4 sm:p-6">
              <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-white/80 p-3 sm:rounded-2xl sm:p-4">
                  <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span>Pay Online (Razorpay)</span>
                </label>
                <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-white/80 p-3 sm:rounded-2xl sm:p-4">
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="glass-panel p-4 sm:sticky sm:top-24 sm:p-6">
              <h2 className="mb-4 text-xl font-semibold sm:mb-6">Order Summary</h2>
              <div className="mb-5 space-y-3 sm:mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.product}-${item.size}`} className="flex justify-between gap-3 text-sm">
                    <span className="line-clamp-2 min-w-0">{item.name} x {item.quantity}</span>
                    <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t pt-3">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between border-t pt-3 text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
