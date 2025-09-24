import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import SpotlightCard from '../components/SpotlightCard';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!keyword) {
        setProducts([]);
        setLoading(false);
        return;
      };
      setLoading(true);
      try {
        const response = await api.get(`/products?keyword=${encodeURIComponent(keyword)}`);
        if (response.data.success) {
          setProducts(response.data.data.products);
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword]);

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4 md:px-8">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-primary tracking-widest uppercase">Search Results</h1>
          {keyword && (
            <p className="text-gray-400 mt-2">
              Showing results for: <span className="text-white font-bold">"{keyword}"</span>
            </p>
          )}
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <SpotlightCard key={product._id}>
                <ProductCard product={product} />
              </SpotlightCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl text-gray-500">No products found for "{keyword}".</h2>
            <p className="text-gray-600">Try a different search term or <Link to="/" className="text-brand-accent hover:underline">browse all products</Link>.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;