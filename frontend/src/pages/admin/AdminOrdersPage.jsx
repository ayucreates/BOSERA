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

  const isOrderDelivered = (order) =>
    order.isDelivered || order.orderStatus === 'delivered';

  const OrderActions = ({ order }) => {
    const delivered = isOrderDelivered(order);

    return (
      <div className="grid gap-2 sm:min-w-36">
        <button
          type="button"
          onClick={() => setSelectedOrder(order)}
          className="rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-100"
        >
          View Details
        </button>

        {!delivered ? (
          <button
            type="button"
            onClick={() => markAsDeliveredHandler(order._id)}
            className="rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800"
          >
            Mark Delivered
          </button>
        ) : (
          <span className="rounded-lg bg-gray-100 px-4 py-2 text-center text-gray-500">
            Completed
          </span>
        )}
      </div>
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-10">
        <p className="text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="mb-2 text-3xl font-bold sm:text-4xl">
          Manage Orders
        </h1>

        <p className="text-sm text-gray-600 sm:text-base">
          View customer orders, delivery information, ordered items, and update delivery status.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        {orders.length === 0 ? (
          <p className="p-4 text-gray-500 sm:p-6">No orders found.</p>
        ) : (
          <>
            <div className="divide-y divide-gray-100 lg:hidden">
              {orders.map((order) => {
                const delivered = isOrderDelivered(order);

                return (
                  <div key={order._id} className="p-4">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-all text-xs text-gray-500">#{order._id}</p>
                        <h2 className="mt-1 break-words font-semibold text-gray-900">
                          {order.user?.name || order.shippingAddress?.fullName || 'Unknown user'}
                        </h2>
                        <p className="break-words text-sm text-gray-500">
                          {order.user?.email || order.shippingAddress?.phone || 'No contact'}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                          delivered
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {delivered ? 'Delivered' : 'Pending'}
                      </span>
                    </div>

                    <div className="grid gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Delivery</p>
                        <p className="break-words font-medium text-gray-900">
                          {order.shippingAddress?.fullName || 'No name'}
                        </p>
                        <p className="break-words text-gray-700">
                          {order.shippingAddress?.phone || 'No phone'}
                        </p>
                        <p className="break-words text-gray-600">
                          {getDeliveryAddress(order.shippingAddress)}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-gray-500">Total</p>
                          <p className="font-semibold text-gray-900">
                            ₹{Number(order.totalPrice || 0).toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500">Payment</p>
                          <p className={order.isPaid ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}>
                            {order.isPaid ? 'Paid' : 'Not Paid'}
                          </p>
                        </div>

                        <div className="col-span-2">
                          <p className="text-gray-500">Date</p>
                          <p className="text-gray-700">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <OrderActions order={order} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden lg:block">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-left">Order ID</th>
                    <th className="p-4 text-left">Customer</th>
                    <th className="p-4 text-left">Delivery</th>
                    <th className="p-4 text-left">Total</th>
                    <th className="p-4 text-left">Paid</th>
                    <th className="p-4 text-left">Delivered</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => {
                    const delivered = isOrderDelivered(order);

                    return (
                      <tr key={order._id} className="border-t align-top">
                        <td className="max-w-48 break-all p-4 text-sm text-gray-700">
                          {order._id}
                        </td>

                        <td className="p-4">
                          <p className="font-medium">
                            {order.user?.name || order.shippingAddress?.fullName || 'Unknown user'}
                          </p>
                          <p className="break-words text-sm text-gray-500">
                            {order.user?.email || order.shippingAddress?.phone || 'No contact'}
                          </p>
                        </td>

                        <td className="max-w-72 p-4">
                          <p className="font-medium">
                            {order.shippingAddress?.fullName || 'No name'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress?.phone || 'No phone'}
                          </p>
                          <p className="line-clamp-2 break-words text-sm text-gray-500">
                            {getDeliveryAddress(order.shippingAddress)}
                          </p>
                        </td>

                        <td className="whitespace-nowrap p-4">
                          ₹{Number(order.totalPrice || 0).toLocaleString()}
                        </td>

                        <td className="whitespace-nowrap p-4">
                          {order.isPaid ? (
                            <span className="font-medium text-green-600">Paid</span>
                          ) : (
                            <span className="font-medium text-red-600">Not Paid</span>
                          )}
                        </td>

                        <td className="whitespace-nowrap p-4">
                          {delivered ? (
                            <span className="font-medium text-green-600">Delivered</span>
                          ) : (
                            <span className="font-medium text-yellow-600">Pending</span>
                          )}
                        </td>

                        <td className="whitespace-nowrap p-4">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </td>

                        <td className="p-4">
                          <OrderActions order={order} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-4 sm:px-4 sm:py-6">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <p className="break-all text-sm text-gray-500">
                  {selectedOrder._id}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-2xl leading-none text-gray-500 hover:text-black"
                aria-label="Close order details"
              >
                ×
              </button>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border p-4">
                <h3 className="mb-3 font-semibold">Delivery Info</h3>
                <p className="break-words font-medium">
                  {selectedOrder.shippingAddress?.fullName || 'No name'}
                </p>
                <p className="break-words text-gray-700">
                  {selectedOrder.shippingAddress?.phone || 'No phone'}
                </p>
                <p className="mt-2 break-words text-gray-700">
                  {selectedOrder.shippingAddress?.addressLine1 || 'No address line 1'}
                </p>
                {selectedOrder.shippingAddress?.addressLine2 && (
                  <p className="break-words text-gray-700">
                    {selectedOrder.shippingAddress.addressLine2}
                  </p>
                )}
                <p className="break-words text-gray-700">
                  {selectedOrder.shippingAddress?.city || 'No city'}, {' '}
                  {selectedOrder.shippingAddress?.state || 'No state'} {' '}
                  {selectedOrder.shippingAddress?.pincode || 'No pincode'}
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <h3 className="mb-3 font-semibold">Payment and Status</h3>
                <p><span className="font-medium">Payment:</span> {selectedOrder.isPaid ? 'Paid' : 'Not Paid'}</p>
                <p><span className="font-medium">Method:</span> {selectedOrder.paymentMethod?.toUpperCase() || 'N/A'}</p>
                <p><span className="font-medium">Status:</span> {selectedOrder.orderStatus || 'Pending'}</p>
                <p><span className="font-medium">Date:</span> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}</p>
                <p><span className="font-medium">Total:</span> ₹{Number(selectedOrder.totalPrice || 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border">
              <h3 className="bg-gray-100 p-4 font-semibold">Ordered Items</h3>

              {selectedOrder.orderItems?.length > 0 ? (
                <div className="divide-y">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={`${item.product}-${item.size}`} className="flex gap-3 p-4 sm:gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-16 shrink-0 rounded-lg bg-gray-100 object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="break-words font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>

                      <p className="whitespace-nowrap font-medium">
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
