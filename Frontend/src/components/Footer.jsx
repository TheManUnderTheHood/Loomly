import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinkClasses = "text-gray-400 hover:text-white transition-colors";
  return (
    <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 mt-24 py-12 px-4">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
        <div>
          <h3 className="font-bold text-white mb-4 tracking-wider">Loomly</h3>
          <p className="text-gray-400 text-sm">Clean but crazy as fuck.</p>
        </div>
        <div>
          <h3 className="font-bold text-white mb-4 tracking-wider">SHOP</h3>
          <ul className="space-y-2">
            <li><Link to="/style/old-money" className={footerLinkClasses}>Old Money</Link></li>
            <li><Link to="/style/streetwear" className={footerLinkClasses}>Streetwear</Link></li>
            <li><Link to="/style/ethnic" className={footerLinkClasses}>Ethnic</Link></li>
            <li><Link to="/style/formals" className={footerLinkClasses}>Formals</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-white mb-4 tracking-wider">ASSISTANCE</h3>
          <ul className="space-y-2">
            <li><Link to="/blog" className={footerLinkClasses}>Blog</Link></li>
            <li><Link to="/about" className={footerLinkClasses}>About Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-white mb-4 tracking-wider">POLICIES</h3>
          <ul className="space-y-2">
            <li><Link to="/terms" className={footerLinkClasses}>Terms & Conditions</Link></li>
            <li><Link to="/returns" className={footerLinkClasses}>Return & Exchange</Link></li>
            <li><Link to="/shipping" className={footerLinkClasses}>Shipping & Delivery</Link></li>
            <li><Link to="/privacy" className={footerLinkClasses}>Privacy Policy</Link></li>
            <li><Link to="/disclaimer" className={footerLinkClasses}>Disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-500 pt-8 mt-8 border-t border-gray-800 text-sm">
        © {new Date().getFullYear()} Loomly. All Rights Reserved. Not for the faint of heart.
      </div>
    </footer>
  );
};

export default Footer;