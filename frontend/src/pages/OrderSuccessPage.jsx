import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { formatPrice } from '../utils/formatters';
import { getMediaUrl } from '../utils/media';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const getConfig = () =>
    userInfo?.token
      ? { headers: { Authorization: `Bearer ${userInfo.token}` } }
      : {};

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${id}`, getConfig());
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
      <div className="flex justify-center py-16">
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

  const awb = order.delhivery?.awb || order.trackingNumber;
  const trackingUrl =
    order.delhivery?.trackingUrl ||
    (awb ? `https://www.delhivery.com/track/package/${awb}` : '');

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="bg-gray-950 px-6 py-8 text-center text-white sm:px-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl font-bold text-gray-950">
            ✓
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Thanks for placing the order</h1>
          <p className="mt-3 text-sm text-gray-200 sm:text-base">
            Your payment was successful and your order has been placed.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:p-8 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 p-5">
              <h2 className="mb-4 text-lg font-semibold text-gray-950">Order details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="break-all font-semibold text-gray-950">{order._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment</p>
                  <p className="font-semibold text-gray-950">{order.isPaid ? 'Paid' : 'Pending'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order status</p>
                  <p className="font-semibold capitalize text-gray-950">{order.orderStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tracking ID / AWB</p>
                  <p className="font-semibold text-gray-950">{awb || 'Will be updated soon'}</p>
                </div>
              </div>

              {trackingUrl && (
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-full justify-center rounded-2xl bg-gray-950 px-5 py-3 font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
                >
                  Track order
                </a>
              )}

              {!awb && (
                <div className="mt-5 rounded-2xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-800">
                  The order is placed, but the Delhivery tracking ID was not generated yet. You can still view this order later from the order details page.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-gray-100 p-5">
              <h2 className="mb-4 text-lg font-semibold text-gray-950">Items ordered</h2>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={`${item.product}-${item.size}`} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <img
                      src={getMediaUrl(item.image)}
                      alt={item.name}
                      className="h-20 w-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-950">{item.name}</p>
                      <p className="text-sm text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                      <p className="mt-1 font-semibold">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <h2 className="mb-4 text-lg font-semibold text-gray-950">Delivery address</h2>
              <p className="leading-relaxed text-gray-700">
                <span className="font-semibold text-gray-950">{order.shippingAddress.fullName}</span>
                <br />
                {order.shippingAddress.phone}
                <br />
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? <><br />{order.shippingAddress.addressLine2}</> : null}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <h2 className="mb-4 text-lg font-semibold text-gray-950">Payment summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{formatPrice(order.itemsPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shippingPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform fee</span>
                  <span>{formatPrice(order.platformFee || 0)}</span>
                </div>
                <div className="flex justify-between border-t pt-3 text-base font-bold">
                  <span>Total</span>
                  <span>{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <Link to={`/order/${order._id}`} className="rounded-2xl border px-5 py-3 text-center font-semibold">
                View full order
              </Link>
              <Link to="/shop" className="rounded-2xl bg-gray-950 px-5 py-3 text-center font-semibold text-white">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
