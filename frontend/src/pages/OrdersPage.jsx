// OrdersPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await axios.get('/api/orders/myorders', { headers: { Authorization: `Bearer ${userInfo.token}` } });
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, [userInfo]);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent" /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-semibold mb-8">My Orders</h1>
      {orders.length === 0 ? <p className="text-gray-500">No orders yet.</p> : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/order/${order._id}`} className="block border p-4 hover:border-gray-900 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{order.totalPrice.toLocaleString()}</p>
                  <span className={`text-sm px-2 py-1 ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-600' : order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>{order.orderStatus}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
