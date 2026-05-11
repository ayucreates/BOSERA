import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const getDeliveryAddress = (shippingAddress) => {
    if (!shippingAddress) {
      return 'No delivery information available';
    }

    return [
      shippingAddress.addressLine1,
      shippingAddress.addressLine2,
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.pincode
    ]
      .filter(Boolean)
      .join(', ');
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
          View customer orders, delivery information, ordered items, and update delivery status.
        </p>
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Delivery</th>
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
                  <td className="p-4" colSpan="8">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isDelivered =
                    order.isDelivered || order.orderStatus === 'delivered';

                  return (
                    <tr key={order._id} className="border-t align-top">
                      <td className="p-4 text-sm text-gray-700 min-w-48">
                        {order._id}
                      </td>

                      <td className="p-4 min-w-44">
                        <p className="font-medium">
                          {order.user?.name || order.shippingAddress?.fullName || 'Unknown user'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.user?.email || order.shippingAddress?.phone || 'No contact'}
                        </p>
                      </td>

                      <td className="p-4 min-w-64">
                        <p className="font-medium">
                          {order.shippingAddress?.fullName || 'No name'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress?.phone || 'No phone'}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {getDeliveryAddress(order.shippingAddress)}
                        </p>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        ₹{Number(order.totalPrice || 0).toLocaleString()}
                      </td>

                      <td className="p-4 whitespace-nowrap">
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

                      <td className="p-4 whitespace-nowrap">
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

                      <td className="p-4 whitespace-nowrap">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col gap-2 min-w-36">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                          >
                            View Details
                          </button>

                          {!isDelivered ? (
                            <button
                              onClick={() => markAsDeliveredHandler(order._id)}
                              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                            >
                              Mark Delivered
                            </button>
                          ) : (
                            <span className="text-gray-500 text-center">
                              Completed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Order Details</h2>
                <p className="text-sm text-gray-500 break-all">
                  {selectedOrder._id}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-black text-2xl leading-none"
                aria-label="Close order details"
              >
                ×
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="border rounded-xl p-4">
                <h3 className="font-semibold mb-3">Delivery Info</h3>
                <p className="font-medium">
                  {selectedOrder.shippingAddress?.fullName || 'No name'}
                </p>
                <p className="text-gray-700">
                  {selectedOrder.shippingAddress?.phone || 'No phone'}
                </p>
                <p className="text-gray-700 mt-2">
                  {selectedOrder.shippingAddress?.addressLine1 || 'No address line 1'}
                </p>
                {selectedOrder.shippingAddress?.addressLine2 && (
                  <p className="text-gray-700">
                    {selectedOrder.shippingAddress.addressLine2}
                  </p>
                )}
                <p className="text-gray-700">
                  {selectedOrder.shippingAddress?.city || 'No city'}, {' '}
                  {selectedOrder.shippingAddress?.state || 'No state'} {' '}
                  {selectedOrder.shippingAddress?.pincode || 'No pincode'}
                </p>
              </div>

              <div className="border rounded-xl p-4">
                <h3 className="font-semibold mb-3">Payment and Status</h3>
                <p>
                  <span className="font-medium">Payment:</span>{' '}
                  {selectedOrder.isPaid ? 'Paid' : 'Not Paid'}
                </p>
                <p>
                  <span className="font-medium">Method:</span>{' '}
                  {selectedOrder.paymentMethod?.toUpperCase() || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{' '}
                  {selectedOrder.orderStatus || 'Pending'}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{' '}
                  {selectedOrder.createdAt
                    ? new Date(selectedOrder.createdAt).toLocaleString()
                    : 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Total:</span>{' '}
                  ₹{Number(selectedOrder.totalPrice || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="border rounded-xl overflow-hidden">
              <h3 className="font-semibold p-4 bg-gray-100">Ordered Items</h3>

              {selectedOrder.orderItems?.length > 0 ? (
                <div className="divide-y">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={`${item.product}-${item.size}`} className="flex gap-4 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 object-cover rounded-lg bg-gray-100"
                      />

                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>

                      <p className="font-medium whitespace-nowrap">
                        ₹{Number(item.price || 0).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-4 text-gray-500">No items found for this order.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
