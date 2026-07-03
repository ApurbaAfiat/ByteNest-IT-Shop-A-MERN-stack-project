import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-900 dark:bg-surface-950 text-surface-300">
      {/* Main footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                Byte<span className="text-primary-400">Nest</span>
              </span>
            </Link>
            <p className="text-sm text-surface-400 mb-4 leading-relaxed">
              Your one-stop destination for premium IT products. Laptops, earbuds, smartwatches, and accessories at the best prices.
            </p>
            <div className="flex gap-3">
              {[FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-surface-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/products', label: 'All Products' },
                { to: '/category/laptops', label: 'Laptops' },
                { to: '/category/earbuds', label: 'Earbuds' },
                { to: '/category/smartwatches', label: 'Smartwatches' },
                { to: '/category/accessories', label: 'Accessories' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-surface-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/faq', label: 'FAQ' },
                { to: '/profile', label: 'My Account' },
                { to: '/my-orders', label: 'Order Tracking' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-surface-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <HiOutlineLocationMarker className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-surface-400">123 Tech Street, Gulshan, Dhaka 1212, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <HiOutlinePhone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-sm text-surface-400">+880 1700-000001</span>
              </li>
              <li className="flex items-center gap-3">
                <HiOutlineMail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-sm text-surface-400">support@bytenest.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-surface-800">
        <div className="container-custom py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-surface-500">
            © {currentYear} ByteNest. All rights reserved. Built with MERN Stack.
          </p>
          <p className="text-xs text-surface-600">
            Portfolio project — Not a commercial website
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
