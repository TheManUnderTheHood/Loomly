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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-40 pb-20 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="container mx-auto relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-primary tracking-widest uppercase bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">Search Results</h1>
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
          <div className="text-center py-20 animate-fade-in-up">
            <h2 className="text-3xl text-gray-400 font-primary">No products found for "{keyword}".</h2>
            <p className="text-gray-500 mt-4">Try a different search term or <Link to="/" className="text-brand-accent hover:underline font-semibold">browse all products</Link>.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;