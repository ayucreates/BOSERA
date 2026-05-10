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
    <footer className="px-4 pb-4 pt-12">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/70 bg-gray-950 text-white shadow-[0_30px_80px_rgba(17,24,39,0.28)]">
        <div className="border-b border-white/10 px-6 py-10 md:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.8fr] lg:items-center">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-gray-400">
                Lite Bouys Zone
              </p>
              <h2 className="max-w-2xl font-display text-3xl font-bold leading-tight text-white md:text-5xl">
                Everyday vintage energy, styled for clean modern fits.
              </h2>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.28em] text-gray-400">
                Visit the store
              </p>
              <p className="mt-3 text-lg text-gray-200">
                Browse fresh drops, save your favourites, and check out with a smoother flow across every device.
              </p>
              <Link
                to="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-gray-950 transition hover:bg-[#f0e6d7]"
              >
                Explore Collection
                <FiArrowUpRight />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-10 px-6 py-10 md:grid-cols-2 md:px-10 lg:grid-cols-4">
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
                <span>hello@litebouyszone.com</span>
              </li>
              <li className="flex gap-3">
                <FiPhone size={18} className="mt-0.5 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex gap-3">
                <FiMapPin size={18} className="mt-0.5 shrink-0" />
                <span>123 Fashion Street, Mumbai, Maharashtra 400001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-5 text-sm text-gray-500 md:px-10">
          © {new Date().getFullYear()} Lite Bouys Zone. Designed for sharper browsing and smoother checkout.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
