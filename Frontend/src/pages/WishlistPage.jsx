import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SpotlightCard from "../components/SpotlightCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

const WishlistPage = () => {
  const { wishlist, loading } = useWishlist();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4 md:px-8">
        <div className="container mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-primary tracking-widest uppercase">Wishlist</h1>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center pt-24 px-4">
        <h1 className="text-5xl font-primary tracking-widest">YOUR WISHLIST IS EMPTY</h1>
        <p className="text-gray-400 mt-4">Save your favorite items here to shop them later.</p>
        <Link to="/" className="mt-8 bg-brand-accent text-white font-bold py-3 px-8 rounded-md hover:bg-opacity-80 transition-all">
            DISCOVER PRODUCTS
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4 md:px-8">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-primary tracking-widest uppercase">Wishlist</h1>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlist.map(({ product }, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <SpotlightCard>
                <ProductCard product={product} />
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;