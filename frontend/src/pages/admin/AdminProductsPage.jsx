import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatPrice } from '../../utils/formatters';
import { getMediaUrl } from '../../utils/media';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get('/api/products');

      setProducts(data.products || data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert('Error fetching products');
    }
  };

  const deleteHandler = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product?'
    );

    if (!confirmDelete) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      await axios.delete(`/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      });

      alert('Product deleted');
      fetchProducts();
    } catch (error) {
      console.log(error);
      alert('Error deleting product');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Products
          </h1>

          <p className="text-gray-500 mt-2">
            Manage, edit, and organize all Lite Bouys Zone products.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center justify-center bg-gray-900 text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition font-medium"
        >
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-gray-500">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-gray-500">
            No products found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Product
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Price
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Stock
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const stock = product.sizes?.reduce(
                    (total, item) => total + Number(item.stock || 0),
                    0
                  );

                  return (
                    <tr
                      key={product._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              product.images?.[0]?.url
                                ? getMediaUrl(product.images[0].url)
                                : '/placeholder.jpg'
                            }
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-xl border border-gray-100"
                          />

                          <div>
                            <h2 className="font-semibold text-gray-900 line-clamp-1">
                              {product.name}
                            </h2>

                            <p className="text-sm text-gray-500 line-clamp-1">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </td>

                      <td className="p-4 text-gray-600">
                        {product.category?.name || 'No category'}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            stock > 10
                              ? 'bg-green-100 text-green-700'
                              : stock > 0
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {stock || 0} in stock
                        </span>
                      </td>

                      <td className="p-4">
                        {product.isActive ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                            Hidden
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex justify-end gap-3">
                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => deleteHandler(product._id)}
                            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
