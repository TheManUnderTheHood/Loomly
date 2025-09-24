import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cart, cartItemCount, fetchCart } = useCart();
  const { createOrder } = useOrder();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    country: 'USA', // Default value
    pinCode: '',
  });

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Placing your order...");

    const result = await createOrder(shippingInfo);

    if (result.success) {
      toast.success(result.message, { id: toastId });
      // Refetch the cart to show it's empty
      await fetchCart();
      // Redirect to the order history page
      navigate('/orders');
    } else {
      toast.error(result.message, { id: toastId });
    }
    setLoading(false);
  };
  
  if (cartItemCount === 0) {
      navigate("/cart"); // Redirect if cart is empty
      return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-5xl font-primary tracking-widest text-center uppercase mb-12">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Shipping Details Form */}
          <div className="lg:col-span-3 bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                <input type="text" name="address" id="address" required onChange={handleChange} className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-400 mb-1">City</label>
                  <input type="text" name="city" id="city" required onChange={handleChange} className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-400 mb-1">State / Province</label>
                  <input type="text" name="state" id="state" required onChange={handleChange} className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pinCode" className="block text-sm font-medium text-gray-400 mb-1">ZIP / Postal Code</label>
                  <input type="text" name="pinCode" id="pinCode" required onChange={handleChange} className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                  <input type="text" name="country" id="country" value={shippingInfo.country} required onChange={handleChange} className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"/>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2 h-fit">
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-2">
                {cart?.cart?.items.map(item => (
                  <div key={item.product._id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 truncate">{item.product.name} <span className="text-gray-500">x{item.quantity}</span></span>
                    <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-700 my-4"></div>
              <div className="flex justify-between font-bold text-white text-xl">
                <span>Total</span>
                <span>${cart?.cartTotalPrice?.toFixed(2)}</span>
              </div>
            </div>
             <button onClick={handlePlaceOrder} disabled={loading} className="w-full mt-6 bg-brand-accent text-white font-bold py-4 rounded-md hover:bg-opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Processing..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;