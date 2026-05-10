// OrderDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await axios.get(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${userInfo.token}` } });
      setOrder(data);
      setLoading(false);
    };
    fetchOrder();
  }, [id, userInfo]);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent" /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-semibold mb-8">Order Details</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="border p-4"><h2 className="font-semibold mb-2">Shipping Address</h2><p>{order.shippingAddress.fullName}<br/>{order.shippingAddress.addressLine1}<br/>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p></div>
          <div className="border p-4"><h2 className="font-semibold mb-4">Order Items</h2>{order.orderItems.map((item) => (<div key={`${item.product}-${item.size}`} className="flex gap-4 py-2 border-b last:border-0"><img src={item.image} alt={item.name} className="w-16 h-20 object-cover" /><div><p className="font-medium">{item.name}</p><p className="text-sm text-gray-500">Size: {item.size} | Qty: {item.quantity}</p><p className="font-semibold">₹{item.price.toLocaleString()}</p></div></div>))}</div>
        </div>
        <div className="bg-gray-50 p-6 h-fit"><h2 className="font-semibold mb-4">Order Summary</h2><div className="space-y-2"><div className="flex justify-between"><span>Status</span><span className="font-medium capitalize">{order.orderStatus}</span></div><div className="flex justify-between"><span>Payment</span><span>{order.isPaid ? 'Paid' : 'Pending'}</span></div><div className="border-t pt-2 flex justify-between font-semibold"><span>Total</span><span>₹{order.totalPrice.toLocaleString()}</span></div></div></div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
