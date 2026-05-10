import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      const [productsResponse, categoriesResponse, ordersResponse] =
        await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/categories'),
          axios.get('/api/orders', {
            headers: {
              Authorization: `Bearer ${userInfo.token}`
            }
          })
        ]);

      setProducts(productsResponse.data.products || productsResponse.data);
      setCategories(categoriesResponse.data.categories || categoriesResponse.data);
      setOrders(ordersResponse.data.orders || ordersResponse.data);

      setLoading(false);
    } catch (error) {
      console.log(error.response?.data || error);
      setLoading(false);
      alert('Error loading dashboard data');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const isOrderDelivered = (order) => {
    return order.isDelivered || order.orderStatus === 'delivered';
  };

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalOrders = orders.length;

  const totalStock = products.reduce((total, product) => {
    const productStock = product.sizes?.reduce(
      (sum, item) => sum + Number(item.stock || 0),
      0
    );

    return total + Number(productStock || 0);
  }, 0);

  const totalValue = products.reduce((total, product) => {
    const productStock = product.sizes?.reduce(
      (sum, item) => sum + Number(item.stock || 0),
      0
    );

    return total + Number(product.price || 0) * Number(productStock || 0);
  }, 0);

  const pendingOrders = orders.filter((order) => !isOrderDelivered(order)).length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">
          Admin Dashboard
        </h1>

        <p className="text-gray-600">
          Manage Lite Bouys Zone products, categories, stock, orders, and store content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500 text-sm mb-2">
            Total Products
          </h2>

          <p className="text-3xl font-bold">
            {totalProducts}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500 text-sm mb-2">
            Categories
          </h2>

          <p className="text-3xl font-bold">
            {totalCategories}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500 text-sm mb-2">
            Orders
          </h2>

          <p className="text-3xl font-bold">
            {totalOrders}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500 text-sm mb-2">
            Pending Orders
          </h2>

          <p className="text-3xl font-bold">
            {pendingOrders}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500 text-sm mb-2">
            Stock Value
          </h2>

          <p className="text-3xl font-bold">
            ₹{totalValue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
        <Link
          to="/admin/products"
          className="bg-black text-white rounded-xl p-6 hover:bg-gray-800 transition"
        >
          <h2 className="text-2xl font-semibold mb-2">
            Manage Products
          </h2>

          <p className="text-gray-300">
            View, edit, delete, and update all store products.
          </p>
        </Link>

        <Link
          to="/admin/products/add"
          className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-2">
            Add Product
          </h2>

          <p className="text-gray-600">
            Add new products with image upload and stock.
          </p>
        </Link>

        <Link
          to="/admin/categories"
          className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-2">
            Manage Categories
          </h2>

          <p className="text-gray-600">
            Add, view, edit, and delete product categories.
          </p>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-2">
            Manage Orders
          </h2>

          <p className="text-gray-600">
            View orders and update delivery status.
          </p>
        </Link>

        <Link
          to="/shop"
          className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-2">
            View Store
          </h2>

          <p className="text-gray-600">
            Check how products look on the customer side.
          </p>
        </Link>
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden mb-10">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold">
            Recent Products
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Image</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Stock</th>
              </tr>
            </thead>

            <tbody>
              {products.slice(0, 5).map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="p-4">
                    <img
                      src={
                        product.images?.[0]?.url
                          ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.images[0].url}`
                          : '/placeholder.jpg'
                      }
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>

                  <td className="p-4 font-medium">
                    {product.name}
                  </td>

                  <td className="p-4">
                    ₹{product.price}
                  </td>

                  <td className="p-4">
                    {product.category?.name || 'No category'}
                  </td>

                  <td className="p-4">
                    {product.sizes?.reduce(
                      (total, item) => total + Number(item.stock || 0),
                      0
                    )}
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td className="p-4" colSpan="5">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold">
            Recent Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Paid</th>
                <th className="text-left p-4">Delivered</th>
              </tr>
            </thead>

            <tbody>
              {orders.slice(0, 5).map((order) => {
                const delivered = isOrderDelivered(order);

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
                      {delivered ? (
                        <span className="text-green-600 font-medium">
                          Delivered
                        </span>
                      ) : (
                        <span className="text-yellow-600 font-medium">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {orders.length === 0 && (
                <tr>
                  <td className="p-4" colSpan="5">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;