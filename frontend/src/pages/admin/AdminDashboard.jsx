import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getMediaUrl } from '../../utils/media';

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

  const stats = [
    { label: 'Total Products', value: totalProducts },
    { label: 'Categories', value: totalCategories },
    { label: 'Orders', value: totalOrders },
    { label: 'Pending Orders', value: pendingOrders },
    { label: 'Stock Value', value: `₹${totalValue.toLocaleString()}` }
  ];

  const shortcuts = [
    {
      to: '/admin/products',
      title: 'Manage Products',
      description: 'View, edit, delete, and update all store products.',
      dark: true
    },
    {
      to: '/admin/products/add',
      title: 'Add Product',
      description: 'Add new products with image upload and stock.'
    },
    {
      to: '/admin/categories',
      title: 'Manage Categories',
      description: 'Add, view, edit, and delete product categories.'
    },
    {
      to: '/admin/orders',
      title: 'Manage Orders',
      description: 'View orders and update delivery status.'
    },
    {
      to: '/shop',
      title: 'View Store',
      description: 'Check how products look on the customer side.'
    }
  ];

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-10">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-10">
      <div className="mb-8 sm:mb-10">
        <h1 className="mb-2 text-3xl font-bold sm:text-4xl">
          Admin Dashboard
        </h1>

        <p className="text-sm text-gray-600 sm:text-base">
          Manage BOSERA products, categories, stock, orders, and store content.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:mb-10 sm:gap-6 md:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white p-4 shadow sm:p-6">
            <h2 className="mb-2 text-xs text-gray-500 sm:text-sm">
              {stat.label}
            </h2>

            <p className="break-words text-2xl font-bold sm:text-3xl">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-5">
        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.to}
            to={shortcut.to}
            className={`rounded-xl p-5 transition sm:p-6 ${
              shortcut.dark
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-white shadow hover:shadow-lg'
            }`}
          >
            <h2 className="mb-2 text-xl font-semibold sm:text-2xl">
              {shortcut.title}
            </h2>

            <p className={shortcut.dark ? 'text-sm text-gray-300' : 'text-sm text-gray-600'}>
              {shortcut.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mb-8 overflow-hidden rounded-xl bg-white shadow sm:mb-10">
        <div className="border-b p-4 sm:p-6">
          <h2 className="text-2xl font-semibold">
            Recent Products
          </h2>
        </div>

        {products.length === 0 ? (
          <p className="p-4 text-gray-500 sm:p-6">No products found.</p>
        ) : (
          <>
            <div className="divide-y divide-gray-100 md:hidden">
              {products.slice(0, 5).map((product) => {
                const stock = product.sizes?.reduce(
                  (total, item) => total + Number(item.stock || 0),
                  0
                );

                return (
                  <div key={product._id} className="flex gap-4 p-4">
                    <img
                      src={
                        product.images?.[0]?.url
                          ? getMediaUrl(product.images[0].url)
                          : '/placeholder.jpg'
                      }
                      alt={product.name}
                      className="h-20 w-16 shrink-0 rounded-lg object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="break-words font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">₹{product.price}</p>
                      <p className="break-words text-sm text-gray-500">
                        {product.category?.name || 'No category'}
                      </p>
                      <p className="text-sm text-gray-500">Stock: {stock}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden md:block">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-left">Image</th>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Category</th>
                    <th className="p-4 text-left">Stock</th>
                  </tr>
                </thead>

                <tbody>
                  {products.slice(0, 5).map((product) => (
                    <tr key={product._id} className="border-t">
                      <td className="p-4">
                        <img
                          src={
                            product.images?.[0]?.url
                              ? getMediaUrl(product.images[0].url)
                              : '/placeholder.jpg'
                          }
                          alt={product.name}
                          className="h-16 w-16 rounded object-cover"
                        />
                      </td>

                      <td className="p-4 font-medium">{product.name}</td>
                      <td className="p-4">₹{product.price}</td>
                      <td className="p-4">{product.category?.name || 'No category'}</td>
                      <td className="p-4">
                        {product.sizes?.reduce(
                          (total, item) => total + Number(item.stock || 0),
                          0
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="border-b p-4 sm:p-6">
          <h2 className="text-2xl font-semibold">
            Recent Orders
          </h2>
        </div>

        {orders.length === 0 ? (
          <p className="p-4 text-gray-500 sm:p-6">No orders found.</p>
        ) : (
          <>
            <div className="divide-y divide-gray-100 md:hidden">
              {orders.slice(0, 5).map((order) => {
                const delivered = isOrderDelivered(order);

                return (
                  <div key={order._id} className="p-4">
                    <p className="break-all text-xs text-gray-500">#{order._id}</p>
                    <div className="mt-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-words font-medium">
                          {order.user?.name || order.user?.email || 'Unknown user'}
                        </p>
                        <p className="font-semibold text-gray-900">
                          ₹{Number(order.totalPrice || 0).toLocaleString()}
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

                    <p className={order.isPaid ? 'mt-2 text-sm font-medium text-green-600' : 'mt-2 text-sm font-medium text-red-600'}>
                      {order.isPaid ? 'Paid' : 'Not Paid'}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="hidden md:block">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-left">Order ID</th>
                    <th className="p-4 text-left">Customer</th>
                    <th className="p-4 text-left">Total</th>
                    <th className="p-4 text-left">Paid</th>
                    <th className="p-4 text-left">Delivered</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.slice(0, 5).map((order) => {
                    const delivered = isOrderDelivered(order);

                    return (
                      <tr key={order._id} className="border-t">
                        <td className="max-w-48 break-all p-4 text-sm">{order._id}</td>
                        <td className="p-4">{order.user?.name || order.user?.email || 'Unknown user'}</td>
                        <td className="p-4">₹{Number(order.totalPrice || 0).toLocaleString()}</td>
                        <td className="p-4">
                          {order.isPaid ? (
                            <span className="font-medium text-green-600">Paid</span>
                          ) : (
                            <span className="font-medium text-red-600">Not Paid</span>
                          )}
                        </td>
                        <td className="p-4">
                          {delivered ? (
                            <span className="font-medium text-green-600">Delivered</span>
                          ) : (
                            <span className="font-medium text-yellow-600">Pending</span>
                          )}
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
    </div>
  );
};

export default AdminDashboard;
