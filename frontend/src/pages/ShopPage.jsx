import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/products/ProductCard';
import { FiSearch, FiSliders, FiX } from 'react-icons/fi';
import { formatPrice } from '../utils/formatters';

const ShopPage = () => {
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    setSelectedCategory(category || '');
  }, [category]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data.categories || data);
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search) params.append('keyword', search);
      if (sort) params.append('sort', sort);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      if (selectedCategory) {
        const matchedCategory = categories.find(
          (item) => item.slug === selectedCategory || item._id === selectedCategory
        );

        if (matchedCategory?._id) {
          params.append('category', matchedCategory._id);
        }
      }

      const { data } = await axios.get(`/api/products?${params.toString()}`);
      setProducts(data.products || data);
      setLoading(false);
    } catch (error) {
      console.log(error.response?.data || error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, sort, selectedCategory, minPrice, maxPrice, categories]);

  const clearFilters = () => {
    setSearch('');
    setSort('-createdAt');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
  };

  const activeCategoryName =
    categories.find(
      (item) => item.slug === selectedCategory || item._id === selectedCategory
    )?.name || 'All Products';

  return (
    <div className="min-h-screen bg-transparent">
      <section className="border-b border-gray-100 bg-[#f3eadf]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-600 sm:text-sm sm:tracking-[0.2em]">
              Lite Bouys Zone
            </p>

            <h1 className="mb-4 text-3xl font-bold text-gray-950 sm:text-4xl md:text-6xl">
              Shop Collection
            </h1>

            <p className="text-base leading-relaxed text-gray-700 sm:text-lg">
              Browse the latest street-inspired pieces, streetwear essentials, and everyday outfits.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8">
        <div className="glass-panel mb-6 p-3 sm:mb-8 sm:p-4">
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row">
            <div className="relative flex-1">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-xl border border-white/70 bg-[#fbf7f1] py-3 pl-12 pr-4 text-base focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
              />
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-white/70 bg-[#fbf7f1] px-4 py-3 text-base focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
            >
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              <FiSliders />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:mt-5 sm:gap-4 sm:pt-5 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-xl border border-white/70 bg-[#fbf7f1] px-4 py-3 text-base focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Min Price
                </label>

                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder={formatPrice(0)}
                  className="w-full rounded-xl border border-white/70 bg-[#fbf7f1] px-4 py-3 text-base focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Max Price
                </label>

                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder={formatPrice(5000)}
                  className="w-full rounded-xl border border-white/70 bg-[#fbf7f1] px-4 py-3 text-base focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:border-gray-950 hover:text-gray-950"
                >
                  <FiX />
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-sm sm:tracking-[0.2em]">
              {activeCategoryName}
            </p>

            <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl md:text-4xl">
              {products.length} Product{products.length === 1 ? '' : 's'}
            </h2>
          </div>

          <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            <Link
              to="/shop"
              onClick={() => setSelectedCategory('')}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                !selectedCategory
                  ? 'bg-gray-950 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </Link>

            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat._id}
                to={`/shop/${cat.slug}`}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === cat.slug
                    ? 'bg-gray-950 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="glass-panel p-6 text-gray-500 sm:p-10">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="glass-panel p-6 text-center sm:p-10">
            <h3 className="mb-3 text-xl font-bold text-gray-950 sm:text-2xl">No products found</h3>
            <p className="mb-6 text-gray-600">
              Try clearing filters or searching for something else.
            </p>
            <button
              onClick={clearFilters}
              className="rounded-full bg-gray-950 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
