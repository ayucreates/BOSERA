import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronRight,
  FiHeart,
  FiMenu,
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiX
} from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${searchQuery}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'New Arrivals', path: '/shop?filter=new' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname, location.search]);

  const isActiveLink = (path) =>
    path === '/'
      ? location.pathname === path
      : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 px-2 pt-2 sm:px-3 sm:pt-3 md:px-4">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-full bg-gray-950 px-3 py-1.5 text-center text-[11px] font-medium text-white shadow-[0_18px_40px_rgba(17,24,39,0.18)] sm:px-4 sm:py-2 sm:text-sm sm:tracking-[0.12em]">
        Free shipping over ₹999. Use LITE10.
      </div>

      <nav
        className={`mx-auto mt-2 max-w-7xl rounded-2xl border px-2.5 transition-all duration-300 sm:mt-3 sm:rounded-[2rem] sm:px-4 md:px-6 ${
          isScrolled
            ? 'border-white/80 bg-white/[0.88] shadow-[0_20px_60px_rgba(148,163,184,0.22)] backdrop-blur'
            : 'border-white/70 bg-white/[0.72] backdrop-blur'
        }`}
      >
        <div className="flex h-14 items-center justify-between gap-2 sm:h-16 md:h-20">
          <button
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition hover:bg-gray-100 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <Link to="/" className="flex min-w-0 flex-1 shrink items-center gap-2 sm:gap-3 md:flex-none">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ead5bd] text-xs font-extrabold tracking-[0.16em] text-gray-950 sm:h-11 sm:w-11 sm:text-sm sm:tracking-[0.2em]">
              LB
            </div>

            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold text-gray-950 sm:text-lg sm:tracking-[0.14em] md:text-xl md:tracking-[0.24em]">
                LITE BOUYS ZONE
              </p>

              <p className="hidden text-xs uppercase tracking-[0.28em] text-gray-500 sm:block">
                Vintage and streetwear
              </p>
            </div>
          </Link>

          <ul className="hidden items-center gap-2 rounded-full bg-[#f6efe6] px-3 py-2 md:flex">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActiveLink(link.path)
                      ? 'bg-white text-gray-950 shadow-sm'
                      : 'text-gray-600 hover:bg-white/70 hover:text-gray-950'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-2 md:gap-3">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-gray-100"
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-gray-100"
                aria-label="Account menu"
              >
                <FiUser size={20} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 z-50 mt-3 w-52 overflow-hidden rounded-2xl border border-white/80 bg-white/95 py-2 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur"
                  >
                    {userInfo ? (
                      <>
                        <Link
                          to="/profile"
                          className="block px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-100"
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-100"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-2.5 text-left font-medium text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-100"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-100"
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/wishlist"
              className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-gray-100"
              aria-label="Wishlist"
            >
              <FiHeart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-gray-100"
              aria-label="Cart"
            >
              <FiShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleSearch}
              className="border-t border-gray-100 py-3 sm:py-4"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/70 bg-[#f9f3eb] px-4 py-3 pr-12 text-base shadow-sm focus:border-gray-900 sm:rounded-2xl"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  <FiSearch size={20} />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 md:hidden"
            >
              <ul className="space-y-1 py-3 sm:space-y-2 sm:py-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="flex min-h-11 items-center justify-between rounded-xl px-3 py-2.5 font-medium text-gray-700 transition hover:bg-[#f8f1e7] hover:text-gray-950 sm:rounded-2xl"
                    >
                      {link.name}
                      <FiChevronRight size={18} className="text-gray-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
