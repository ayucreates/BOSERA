// OrderDetailPage.jsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { formatPrice } from '../utils/formatters';
import { getMediaUrl } from '../utils/media';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = userInfo?.token
          ? { headers: { Authorization: `Bearer ${userInfo.token}` } }
          : {};

        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, userInfo]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="mb-3 text-2xl font-bold text-gray-950">Order not found</h1>
        <p className="mb-6 text-gray-600">{error || 'This order could not be loaded.'}</p>
        <Link to="/shop" className="btn-primary inline-flex">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-semibold">Order Details</h1>

      {!userInfo && (
        <div className="mb-6 rounded-2xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-800">
          Save this order link if you checked out as a guest. You can use it to view this order again.
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border bg-white p-4">
            <h2 className="mb-2 font-semibold">Shipping Address</h2>
            <p className="leading-relaxed text-gray-700">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.phone}
              <br />
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 ? <><br />{order.shippingAddress.addressLine2}</> : null}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <h2 className="mb-4 font-semibold">Order Items</h2>
            {order.orderItems.map((item) => (
              <div
                key={`${item.product}-${item.size}`}
                className="flex gap-4 border-b py-3 last:border-0"
              >
                <img
                  src={getMediaUrl(item.image)}
                  alt={item.name}
                  className="h-20 w-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Size: {item.size} | Qty: {item.quantity}
                  </p>
                  <p className="font-semibold">{formatPrice(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-fit rounded-2xl bg-gray-50 p-6">
          <h2 className="mb-4 font-semibold">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Status</span>
              <span className="font-medium capitalize">{order.orderStatus}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment</span>
              <span>{order.isPaid ? 'Paid' : 'Pending'}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(order.shippingPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>{formatPrice(order.platformFee || 0)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
