import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import SpotlightCard from '../components/SpotlightCard';

const Style = () => {
  const { styleName } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const styleTitle = category ? category.name.toUpperCase() : styleName.replace('-', ' ').toUpperCase();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/products/style/${styleName}`);
        if (response.data.success) {
          setProducts(response.data.data.products);
          setCategory(response.data.data.category);
        } else {
          setError('Category not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products for this category.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [styleName]);

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4 md:px-8">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-primary tracking-widest uppercase">{styleTitle}</h1>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            {`Browse our entire collection of ${styleTitle.toLowerCase()} pieces.`}
          </p>
        </header>
        
        {error ? (
          <div className="text-center py-20">
            <h2 className="text-2xl text-red-500">Error fetching products.</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
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
        ) : (
           <div className="text-center py-20">
             <h2 className="text-2xl text-gray-500">No products found for this category.</h2>
             <p className="text-gray-600">Check back later!</p>
           </div>
        )}

      </div>
    </div>
  );
};

export default Style;