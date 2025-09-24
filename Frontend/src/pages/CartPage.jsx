import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CartPage = () => {
  const { cart, loading, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleRemove = async (productId) => {
    const toastId = toast.loading("Removing item...");
    const result = await removeFromCart(productId);
    if (result.success) {
      toast.success(result.message, { id: toastId });
    } else {
      toast.error(result.message, { id: toastId });
    }
  };

  if (loading) {
      return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Cart...</div>;
  }
  
  if (!cart || cart.cart.items.length === 0) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center pt-24 px-4">
            <h1 className="text-5xl font-primary tracking-widest">YOUR BAG IS EMPTY</h1>
            <p className="text-gray-400 mt-4">Looks like you haven't added anything to your bag yet.</p>
            <Link to="/" className="mt-8 bg-brand-accent text-white font-bold py-3 px-8 rounded-md hover:bg-opacity-80 transition-all">
                CONTINUE SHOPPING
            </Link>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-5xl font-primary tracking-widest text-center uppercase mb-12">Shopping Bag</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.cart.items.map(item => (
              <div key={item.product._id} className="flex items-center bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                <Link to={`/product/${item.product._id}`}>
                    <img src={item.product.productImage.url} alt={item.product.name} className="w-24 h-32 object-cover rounded-md" />
                </Link>
                <div className="ml-4 flex-grow">
                  <Link to={`/product/${item.product._id}`}>
                    <h2 className="font-bold text-lg hover:text-brand-accent transition-colors">{item.product.name}</h2>
                  </Link>
                  <p className="text-gray-400">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">${(item.product.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => handleRemove(item.product._id)} className="text-sm text-red-500 hover:underline mt-2">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1 bg-gray-900/50 p-6 rounded-lg border border-gray-800 h-fit">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cart.cartTotalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="border-t border-gray-700 my-4"></div>
              <div className="flex justify-between font-bold text-white text-xl">
                <span>Total</span>
                <span>${cart.cartTotalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="w-full mt-6 bg-brand-accent text-white font-bold py-3 rounded-md hover:bg-opacity-80 transition-all">
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;