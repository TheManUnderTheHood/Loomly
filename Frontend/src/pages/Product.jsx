import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { ChevronRight, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Skeleton from '../components/Skeleton';
import ProductCard from '../components/ProductCard';
import SpotlightCard from '../components/SpotlightCard';

// These sub-components are fine as they are
const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/reviews/product/${productId}`);
        if (response.data.success) {
          setReviews(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);
  
  if (loading) return <p className="text-gray-400">Loading reviews...</p>

  return <div className="mt-16">
    <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
    {reviews.length > 0 ? (
      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review._id} className="border-b border-gray-800 pb-4">
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < review.rating ? 'text-yellow-400' : 'text-gray-600'} fill="currentColor" />
                ))}
              </div>
              <p className="ml-4 font-bold">{review.user?.fullName || 'Anonymous'}</p>
            </div>
            <p className="text-gray-300">{review.comment}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No reviews yet for this product.</p>
    )}
  </div>;
}

const RelatedProducts = ({ productId }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/related/${productId}`);
        if (response.data.success) {
          setRelated(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch related products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [productId]);
  
  if (loading) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"><Skeleton className="h-96 w-full" /><Skeleton className="h-96 w-full" /></div>;
  if (related.length === 0) return null;

  return <div className="mt-20">
    <h2 className="text-4xl font-primary text-center tracking-widest uppercase mb-12">You Might Also Like</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {related.map(product => (
            <SpotlightCard key={product._id}>
                <ProductCard product={product} />
            </SpotlightCard>
        ))}
    </div>
  </div>;
}


const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const { addToCart } = useCart();
  const { toggleWishlist, isItemInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Reset state for navigation between product pages
        setLoading(true);
        setProduct(null);
        setError('');

        const response = await api.get(`/products/id/${productId}`);
        if (response.data.success) {
          setProduct(response.data.data);
          if (response.data.data.thumbnail) {
            setMainImage(response.data.data.thumbnail.url);
          } else if (response.data.data.images && response.data.data.images.length > 0) {
            setMainImage(response.data.data.images[0].url);
          }
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
    // Return the skeleton UI while loading
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
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    // Return the error/not found UI if there's an error OR if the product is still null after loading is false
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white pt-40 pb-20 px-4">
        <h1 className="text-5xl font-primary">PRODUCT NOT FOUND</h1>
        <p className="text-gray-400 mt-4">{error}</p>
        <Link to="/" className="mt-8 text-brand-accent hover:underline">Return to Home</Link>
      </div>
    );
  }

  // If we reach this point, `product` is guaranteed to be a valid object.
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <div className="text-sm text-gray-400 mb-8 flex items-center">
          <Link to="/" className="hover:text-white">Home</Link>
          <ChevronRight size={16} className="mx-1" />
          {/* +++ FIX: Added optional chaining as a safety measure +++ */}
          <Link to={`/style/${product.category?.slug || 'all'}`} className="hover:text-white capitalize">{product.category?.name || 'Category'}</Link>
          <ChevronRight size={16} className="mx-1" />
          <span className="text-white">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-2 justify-center">
              {/* +++ FIX: Added optional chaining +++ */}
              {product.images?.map(img => (
                <img 
                  key={img.public_id}
                  src={img.url}
                  alt="thumbnail"
                  onClick={() => setMainImage(img.url)}
                  className={`w-20 h-24 object-cover rounded-md cursor-pointer border-2 ${mainImage === img.url ? 'border-brand-accent' : 'border-gray-800'} hover:border-brand-accent transition-all`}
                />
              ))}
            </div>
            <div className="flex-grow overflow-hidden rounded-lg border border-gray-800">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-4xl lg:text-5xl font-bold text-white">{product.name}</h1>
            <p className="text-3xl text-brand-accent font-semibold my-4">${product.price}</p>
            <p className="text-gray-300 leading-relaxed mb-8">{product.description}</p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">SIZE</label>
              <div className="flex space-x-2">
                {['S', 'M', 'L', 'XL'].map(size => (
                  <button key={size} className="w-12 h-12 border border-gray-700 rounded-md text-white hover:border-brand-accent focus:border-brand-accent focus:text-brand-accent transition-colors">
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-auto pt-8">
              <button onClick={handleAddToCart} className={`w-full bg-brand-accent text-white font-bold py-4 rounded-md hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105 ${isAdding ? 'animate-pulse' : ''}`}>
                {isAdding ? 'ADDED!' : 'ADD TO CART'}
              </button>
              <button onClick={handleToggleWishlist} className={`p-4 border rounded-md transition-colors ${isItemInWishlist(product._id) ? 'border-brand-accent bg-brand-accent/20 text-brand-accent' : 'border-gray-700 text-white hover:border-brand-accent'}`} aria-label="Add to wishlist">
                <Heart fill={isItemInWishlist(product._id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        <ProductReviews productId={productId} />
        <RelatedProducts productId={productId} />
      </div>
    </div>
  );
};

export default Product;