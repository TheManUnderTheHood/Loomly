import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { ChevronRight, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Skeleton from '../components/Skeleton';

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const { addToCart } = useCart();
  const { toggleWishlist, isItemInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/products/id/${productId}`);
        if (response.data.success) {
          setProduct(response.data.data);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
    const toastId = toast.loading("Adding to cart...");
    const result = await addToCart(product._id, 1);
    if (result.success) {
      toast.success(result.message, { id: toastId });
      setIsAdding(true);
      setTimeout(() => setIsAdding(false), 1000);
    } else {
      toast.error(result.message, { id: toastId });
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to manage your wishlist.");
      navigate("/login");
      return;
    }
    const result = await toggleWishlist(product._id);
    if (result.success) {
        toast.success(result.added ? "Added to wishlist!" : "Removed from wishlist!");
    } else {
        toast.error(result.message);
    }
  };

  if (loading) {
    // Skeleton for the product page itself
    return (
      <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <Skeleton className="h-6 w-1/3 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <Skeleton className="h-[600px] w-full" />
            <div className="flex flex-col">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-10 w-1/4 my-4" />
              <Skeleton className="h-24 w-full mb-8" />
              <Skeleton className="h-6 w-1/5 mb-2" />
              <div className="flex space-x-2">
                <Skeleton className="h-12 w-12" />
                <Skeleton className="h-12 w-12" />
                <Skeleton className="h-12 w-12" />
              </div>
              <div className="flex items-center space-x-4 mt-auto pt-8">
                 <Skeleton className="h-14 w-full" />
                 <Skeleton className="h-14 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white pt-40 pb-20 px-4">
        <h1 className="text-5xl font-primary">PRODUCT NOT FOUND</h1>
        <p className="text-gray-400 mt-4">{error}</p>
        <Link to="/" className="mt-8 text-brand-accent hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <div className="text-sm text-gray-400 mb-8 flex items-center">
          <Link to="/" className="hover:text-white">Home</Link>
          <ChevronRight size={16} className="mx-1" />
          <Link to={`/style/${product.category?.slug}`} className="hover:text-white capitalize">{product.category?.name || 'Category'}</Link>
          <ChevronRight size={16} className="mx-1" />
          <span className="text-white">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="overflow-hidden rounded-lg border border-gray-800">
            <img 
              src={product.productImage?.url} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-4xl lg:text-5xl font-bold text-white">{product.name}</h1>
            <p className="text-3xl text-brand-accent font-semibold my-4">${product.price}</p>
            <p className="text-gray-300 leading-relaxed mb-8">{product.description}</p>

            <div className="mb-6">
              <label htmlFor="size" className="block text-sm font-medium text-gray-400 mb-2">SIZE</label>
              <div className="flex space-x-2">
                {['S', 'M', 'L', 'XL'].map(size => (
                  <button key={size} className="w-12 h-12 border border-gray-700 rounded-md text-white hover:border-brand-accent focus:border-brand-accent focus:text-brand-accent transition-colors">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-auto pt-8">
              <button 
                onClick={handleAddToCart}
                className={`w-full bg-brand-accent text-white font-bold py-4 rounded-md hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105 ${isAdding ? 'animate-pulse' : ''}`}
              >
                {isAdding ? 'ADDED!' : 'ADD TO CART'}
              </button>
              <button 
                onClick={handleToggleWishlist}
                className={`p-4 border rounded-md transition-colors ${isItemInWishlist(product._id) ? 'border-brand-accent bg-brand-accent/20 text-brand-accent' : 'border-gray-700 text-white hover:border-brand-accent'}`}
                aria-label="Add to wishlist"
              >
                <Heart fill={isItemInWishlist(product._id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;