import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SocialIcons from './components/SocialIcons';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalLoader from './components/GlobalLoader';
import { Link } from 'react-router-dom';

// Page Imports
const Home = lazy(() => import('./pages/Home'));
const Style = lazy(() => import('./pages/Style'));
const Product = lazy(() => import('./pages/Product'));
const GenericPage = lazy(() => import('./pages/GenericPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));


// We define the animation logic directly in the main App component
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};
const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };

const AppContent = () => {
  const location = useLocation();

    return (
    <div className="relative bg-black">
      <GlobalLoader />
      <Header />
      <SocialIcons />
      <main>
        <AnimatePresence mode="wait">
          {/* +++ NEW: Added Suspense wrapper for lazy loading +++ */}
          <Suspense fallback={<GlobalLoader />}>
            <motion.div
              key={location.pathname + location.search}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
            <Routes location={location}>
                {/* --- Core Public Routes --- */}
                <Route path="/" element={<Home />} />
                <Route path="/style/:styleName" element={<Style />} />
                <Route path="/product/:productId" element={<Product />} />
                <Route path="/search" element={<SearchPage />} /> {/* +++ NEW ROUTE */}

                {/* --- Auth Routes --- */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* --- Protected Routes --- */}
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} /> {/* +++ NEW ROUTE */}

                {/* --- Generic & Policy Routes (no changes) --- */}
                <Route path="/about" element={ <GenericPage title="About Us"> <p>Loomly was born from a rebellion against the mundane...</p> </GenericPage> }/>
                <Route path="/terms" element={ <GenericPage title="Terms & Conditions"> <h2>1. Ownership</h2> <p>This is a fictional website...</p> </GenericPage> }/>
                <Route path="/privacy" element={ <GenericPage title="Privacy Policy"> <p>We respect your privacy...</p> </GenericPage> }/>
                <Route path="/blog" element={ <GenericPage title="The Loomly Manifesto"> <p>Our blog, "The Manifesto," is coming soon...</p> </GenericPage> }/>
                <Route path="/returns" element={ <GenericPage title="Return & Exchange Policy"> <h2>Our Policy</h2> <p>We stand behind the statement each piece makes...</p> </GenericPage> }/>
                <Route path="/shipping" element={ <GenericPage title="Shipping & Delivery"> <h2>Domestic & International</h2> <p>We ship globally...</p> </GenericPage> }/>
                <Route path="/disclaimer" element={ <GenericPage title="Disclaimer"> <p>Loomly is a conceptual brand...</p> </GenericPage> }/>
                <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
                
                {/* Fallback for any undefined route */}
                <Route path="*" element={ <GenericPage title="404: Lost in the Void"> <p>The page you're looking for doesn't exist...</p> <Link to="/" className="text-brand-accent hover:underline">Return to the known universe.</Link> </GenericPage> }/>
            </Routes>
          </motion.div>
          </Suspense>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;