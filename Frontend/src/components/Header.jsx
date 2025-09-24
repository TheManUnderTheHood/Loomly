import { useState } from 'react';
import { Search, Heart, ShoppingCart, User } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import MegaMenu from './MegaMenu';
import { navLinks } from '../data/navigation'; 
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const { isAuthenticated } = useAuth();
  const { cartItemCount } = useCart();
  const { wishlistItemCount } = useWishlist();

  const iconClasses = "w-6 h-6 text-white hover:text-brand-accent transition-colors duration-300";

  return (
    <header 
        className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-gray-800/50"
        onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="container mx-auto flex justify-between items-center px-4 md:px-0">
        <div className="flex items-center gap-x-12">
            <Link to="/" className="text-4xl md:text-5xl font-primary font-bold tracking-widest text-white hover:text-brand-accent transition-colors duration-300">
                Loomly
            </Link>
            <nav className="hidden md:flex items-center gap-x-8 uppercase text-sm tracking-wider h-[78px]">
                {navLinks.map((navItem) => (
                  <div 
                    key={navItem.id}
                    className="py-6 h-full flex items-center"
                    onMouseEnter={() => setActiveMenu(navItem.columns ? navItem.id : null)}
                  >
                     <NavLink 
                        to={navItem.href || '#'}
                        className={({isActive}) => `font-semibold transition-colors duration-300 ${isActive && !navItem.columns ? 'text-brand-accent' : 'text-white'} hover:text-brand-accent`}
                      >
                         {navItem.title}
                      </NavLink>
                  </div>
                ))}
            </nav>
        </div>
        
        <div className="flex items-center gap-x-4 md:gap-x-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Search for products & more" 
                className="bg-gray-800/50 w-64 text-white pl-10 pr-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
              />
            </div>

            <div 
                className="relative" 
                onMouseEnter={() => setActiveMenu('profile')}
            >
                <div className="flex flex-col items-center cursor-pointer">
                    <User className={iconClasses} />
                    <span className="text-xs text-white">{isAuthenticated ? 'Profile' : 'Login'}</span>
                </div>
                {activeMenu === 'profile' && <ProfileDropdown />}
            </div>
            
            <Link to="/wishlist" className="relative flex flex-col items-center cursor-pointer">
                <Heart className={iconClasses} />
                <span className="text-xs text-white">Wishlist</span>
                 {isAuthenticated && wishlistItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-accent text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlistItemCount}
                    </span>
                 )}
            </Link>

            <Link to="/cart" className="relative flex flex-col items-center cursor-pointer">
                 <ShoppingCart className={iconClasses} />
                 <span className="text-xs text-white">Bag</span>
                 {isAuthenticated && cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-accent text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                    </span>
                 )}
            </Link>
        </div>
      </div>
      
       <MegaMenu menuData={navLinks.find(nav => nav.id === activeMenu)} />
    </header>
  );
};

export default Header;