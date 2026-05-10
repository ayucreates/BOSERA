import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      const { data } = await axios.get('/api/orders', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      });

      setOrders(data.orders || data);
      setLoading(false);
    } catch (error) {
      console.log(error.response?.data || error);
      setLoading(false);
      alert(error.response?.data?.message || 'Error loading orders');
    }
  };

  const markAsDeliveredHandler = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      await axios.put(
        `/api/orders/${id}/status`,
        {
          status: 'delivered'
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      alert('Order marked as delivered');
      fetchOrders();
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.message || 'Error updating order');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Manage Orders
        </h1>

        <p className="text-gray-600">
          View customer orders and update delivery status.
        </p>
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Paid</th>
                <th className="text-left p-4">Delivered</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td className="p-4" colSpan="7">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isDelivered =
                    order.isDelivered || order.orderStatus === 'delivered';

                  return (
                    <tr key={order._id} className="border-t">
                      <td className="p-4 text-sm">
                        {order._id}
                      </td>

                      <td className="p-4">
                        {order.user?.name || order.user?.email || 'Unknown user'}
                      </td>

                      <td className="p-4">
                        ₹{Number(order.totalPrice || 0).toLocaleString()}
                      </td>

                      <td className="p-4">
                        {order.isPaid ? (
                          <span className="text-green-600 font-medium">
                            Paid
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">
                            Not Paid
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {isDelivered ? (
                          <span className="text-green-600 font-medium">
                            Delivered
                          </span>
                        ) : (
                          <span className="text-yellow-600 font-medium">
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>

                      <td className="p-4">
                        {!isDelivered ? (
                          <button
                            onClick={() => markAsDeliveredHandler(order._id)}
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                          >
                            Mark Delivered
                          </button>
                        ) : (
                          <span className="text-gray-500">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;