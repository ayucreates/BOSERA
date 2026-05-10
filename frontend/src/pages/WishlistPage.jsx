// WishlistPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { fetchWishlist } from '../store/slices/wishlistSlice';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent" /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-semibold mb-8">My Wishlist</h1>
      {items.length === 0 ? (<div className="text-center py-12"><p className="text-gray-500 mb-4">Your wishlist is empty</p><Link to="/shop" className="btn-primary inline-block">Explore Products</Link></div>) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{items.map((product) => <ProductCard key={product._id} product={product} />)}</div>
      )}
    </div>
  );
};

export default WishlistPage;
