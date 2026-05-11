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

  const getStock = (product) =>
    product.sizes?.reduce((total, item) => total + Number(item.stock || 0), 0) || 0;

  const stockClass = (stock) => {
    if (stock > 10) return 'bg-green-100 text-green-700';
    if (stock > 0) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const ProductActions = ({ product }) => (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-end">
      <Link
        to={`/admin/products/${product._id}/edit`}
        className="rounded-lg bg-blue-500 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-600"
      >
        Edit
      </Link>

      <button
        onClick={() => deleteHandler(product._id)}
        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-10">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Products
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Manage, edit, and organize all Lite Bouys Zone products.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-800"
        >
          Add Product
        </Link>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-gray-500 sm:p-8">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-6 text-gray-500 sm:p-8">
            No products found.
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredProducts.map((product) => {
                const stock = getStock(product);

                return (
                  <div key={product._id} className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={
                          product.images?.[0]?.url
                            ? getMediaUrl(product.images[0].url)
                            : '/placeholder.jpg'
                        }
                        alt={product.name}
                        className="h-24 w-20 shrink-0 rounded-xl border border-gray-100 object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h2 className="break-words font-semibold text-gray-900">
                          {product.name}
                        </h2>

                        <p className="mt-1 break-words text-xs text-gray-500">
                          {product.slug}
                        </p>

                        <p className="mt-2 font-semibold text-gray-900">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Category</p>
                        <p className="font-medium text-gray-900">
                          {product.category?.name || 'No category'}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Status</p>
                        <span
                          className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            product.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </div>

                      <div className="col-span-2">
                        <p className="text-gray-500">Stock</p>
                        <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${stockClass(stock)}`}>
                          {stock} in stock
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <ProductActions product={product} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden md:block">
              <table className="w-full border-collapse">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Product</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Price</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Category</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Stock</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => {
                    const stock = getStock(product);

                    return (
                      <tr key={product._id} className="border-b border-gray-100 transition hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={
                                product.images?.[0]?.url
                                  ? getMediaUrl(product.images[0].url)
                                  : '/placeholder.jpg'
                              }
                              alt={product.name}
                              className="h-20 w-20 rounded-xl border border-gray-100 object-cover"
                            />

                            <div className="min-w-0">
                              <h2 className="line-clamp-1 font-semibold text-gray-900">
                                {product.name}
                              </h2>

                              <p className="line-clamp-1 text-sm text-gray-500">
                                {product.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-medium text-gray-900">{formatPrice(product.price)}</td>
                        <td className="p-4 text-gray-600">{product.category?.name || 'No category'}</td>
                        <td className="p-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${stockClass(stock)}`}>
                            {stock} in stock
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                              product.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {product.isActive ? 'Active' : 'Hidden'}
                          </span>
                        </td>
                        <td className="p-4"><ProductActions product={product} /></td>
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

export default AdminProductsPage;
