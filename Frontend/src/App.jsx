import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import SocialIcons from './components/SocialIcons';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalLoader from './components/GlobalLoader';
import { Link } from 'react-router-dom'; // Import Link for the 404 page

// Page Imports
import Home from './pages/Home';
import Style from './pages/Style';
import Product from './pages/Product';
import GenericPage from './pages/GenericPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

// We define the animation logic directly in the main App component
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};
const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };

// This is the main component that renders the page content
// We need to wrap it in a component that has access to Router context (like useLocation)
const AppContent = () => {
  const location = useLocation();

  return (
    <div className="relative bg-black">
      <GlobalLoader />
      <Header />
      <SocialIcons />
      <main>
        <AnimatePresence mode="wait">
          {/* We wrap the Routes component directly, and provide a key that changes with the URL */}
          <motion.div
            key={location.pathname}
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

                {/* --- Auth Routes --- */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* --- Protected Routes --- */}
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />

                {/* --- Generic & Policy Routes --- */}
                <Route path="/about" element={
                  <GenericPage title="About Us">
                    <p>Loomly was born from a rebellion against the mundane. We believe in clothing that screams, not whispers. Our aesthetic is a paradox: minimalist in its focus, yet "crazy as fuck" in its execution. We are the uniform for the iconoclasts, the dreamers, and the defiant.</p>
                    <p>Every piece is a statement. Every collection is a narrative. We don't just sell clothes; we craft identities.</p>
                  </GenericPage>
                }/>
                <Route path="/terms" element={
                  <GenericPage title="Terms & Conditions">
                    <h2>1. Ownership</h2>
                    <p>This is a fictional website created for demonstration purposes. All product names, descriptions, and branding are conceptual.</p>
                    <h2>2. Conduct</h2>
                    <p>Be bold. Be respectful. Don't be boring.</p>
                  </GenericPage>
                }/>
                <Route path="/privacy" element={
                  <GenericPage title="Privacy Policy">
                    <p>We respect your privacy as much as we respect a perfectly executed outfit. We collect only the data necessary to process your orders and improve your experience, such as your login details and shipping information.</p>
                    <ul>
                      <li>We do not sell your data. Ever.</li>
                      <li>We use state-of-the-art encryption to protect your information.</li>
                      <li>You have the right to be forgotten. Contact us to delete your account and all associated data.</li>
                    </ul>
                  </GenericPage>
                }/>
                <Route path="/blog" element={
                  <GenericPage title="The Loomly Manifesto">
                    <p>Our blog, "The Manifesto," is coming soon. Expect deep dives into our design philosophy, style guides for the defiant, and stories from the cultural front lines. Stay tuned.</p>
                  </GenericPage>
                }/>
                <Route path="/returns" element={
                  <GenericPage title="Return & Exchange Policy">
                    <h2>Our Policy</h2>
                    <p>We stand behind the statement each piece makes. If you're not satisfied, you have 14 days from the delivery date to request a return or exchange. Items must be in their original, unworn condition with all tags attached.</p>
                    <h2>Process</h2>
                    <p>To initiate a return, contact our support team with your order number. We don't do boring return forms.</p>
                  </GenericPage>
                }/>
                <Route path="/shipping" element={
                  <GenericPage title="Shipping & Delivery">
                    <h2>Domestic & International</h2>
                    <p>We ship globally to all iconoclasts, wherever you may be. Standard shipping is free on all orders over $150. Express options are available at checkout.</p>
                    <h2>Timeline</h2>
                    <p>Orders are processed within 1-2 business days. Delivery times vary based on your location. You will receive a tracking number as soon as your order is dispatched.</p>
                  </GenericPage>
                }/>
                <Route path="/disclaimer" element={
                  <GenericPage title="Disclaimer">
                    <p>Loomly is a conceptual brand and e-commerce website created for portfolio and demonstration purposes. All products, descriptions, and brand identity elements are fictional.</p>
                    <p>The images used are sourced from royalty-free platforms like Unsplash and are for illustrative purposes only. This is not a real store, and no actual products are for sale. Wear our ideas, not our clothes (for now).</p>
                  </GenericPage>
                }/>
                
                {/* Fallback for any undefined route */}
                <Route path="*" element={
                    <GenericPage title="404: Lost in the Void">
                        <p>The page you're looking for doesn't exist. It may have been a glitch in the matrix or a path not yet forged.</p>
                        <Link to="/" className="text-brand-accent hover:underline">Return to the known universe.</Link>
                    </GenericPage>
                }/>
            </Routes>
          </motion.div>
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