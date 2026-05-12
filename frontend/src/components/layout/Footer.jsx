import { Link } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiFacebook,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTwitter
} from 'react-icons/fi';

const Footer = () => {
  const quickLinks = [
    { label: 'Shop All', to: '/shop' },
    { label: 'New Arrivals', to: '/shop?filter=new' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' }
  ];

  const supportLinks = [
    { label: 'Wishlist', to: '/wishlist' },
    { label: 'Your Cart', to: '/cart' },
    { label: 'My Profile', to: '/profile' },
    { label: 'Order Tracking', to: '/orders' }
  ];

  return (
    <footer className="px-3 pb-3 pt-8 sm:px-4 sm:pb-4 sm:pt-12">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/70 bg-gray-950 text-white shadow-[0_30px_80px_rgba(17,24,39,0.28)] sm:rounded-[2.5rem]">
        <div className="border-b border-white/10 px-5 py-7 sm:px-6 sm:py-10 md:px-10">
          <div className="grid gap-5 sm:gap-8 lg:grid-cols-[1.3fr_0.8fr] lg:items-center">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 sm:mb-4 sm:tracking-[0.32em]">
                Lite Bouys Zone
              </p>
              <h2 className="max-w-2xl font-display text-2xl font-bold leading-tight text-white sm:text-3xl md:text-5xl">
                Everyday vintage energy, styled for clean modern fits.
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:rounded-[2rem] sm:p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-400 sm:text-sm sm:tracking-[0.28em]">
                Visit the store
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-200 sm:text-lg">
                Browse fresh drops, save your favourites, and check out with a smoother flow across every device.
              </p>
              <Link
                to="/shop"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-[#f0e6d7] sm:mt-6 sm:px-5 sm:py-3 sm:text-base"
              >
                Explore Collection
                <FiArrowUpRight />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-8 px-5 py-8 sm:gap-10 sm:px-6 sm:py-10 md:grid-cols-2 md:px-10 lg:grid-cols-4">
          <div>
            <h3 className="font-display text-2xl font-bold">LITE BOUYS ZONE</h3>
            <p className="mt-4 max-w-sm text-gray-400">
              Curated thrift-inspired clothing, relaxed essentials, and wearable statement pieces with a clean editorial feel.
            </p>
            <div className="mt-6 flex gap-3">
              {[FiInstagram, FiFacebook, FiTwitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-gray-200 transition hover:border-white/30 hover:bg-white/10"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-gray-400 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Customer Space</h3>
            <ul className="mt-5 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-gray-400 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Contact</h3>
            <ul className="mt-5 space-y-4 text-gray-400">
              <li className="flex gap-3">
                <FiMail size={18} className="mt-0.5 shrink-0" />
                <span>Litebouys4@gmail.com</span>
              </li>
              <li className="flex gap-3">
                <FiPhone size={18} className="mt-0.5 shrink-0" />
                <span>+91 76368 11101</span>
              </li>
              <li className="flex gap-3">
                <FiMapPin size={18} className="mt-0.5 shrink-0" />
                <span>Near Bajwi Hotel, Kokrajhar, Assam 783370</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-4 text-xs leading-relaxed text-gray-500 sm:px-6 sm:py-5 sm:text-sm md:px-10">
          &copy; {new Date().getFullYear()} Lite Bouys Zone. Designed for sharper browsing and smoother checkout.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
