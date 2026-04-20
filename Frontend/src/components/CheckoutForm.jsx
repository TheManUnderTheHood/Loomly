import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import Loader from './Loader';
import { formatINR } from '../utils/currency';

const CheckoutForm = ({ amount, shippingInfo, createOrder, fetchCart, navigate }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Processing payment...");

    // Confirm the payment with Stripe
    const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
            // Optional: return_url could be your order success page, 
            // but we'll handle the redirect manually here if we use redirect: "if_required"
        },
        redirect: "if_required", // Prevent automatic redirect so we can hit our API
    });

    if (result.error) {
        toast.error(result.error.message, { id: toastId });
        setLoading(false);
    } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        // Payment succeeded, now create the order in OUR backend
        
        const backendResult = await createOrder({
            ...shippingInfo,
            paymentInfo: {
                id: result.paymentIntent.id,
                status: result.paymentIntent.status
            }
        });

        if (backendResult.success) {
            toast.success("Payment completed and order placed!", { id: toastId });
            await fetchCart();
            navigate('/orders');
        } else {
            // Edge case: Paid on stripe, but failed to save in our DB
            toast.error("Payment succeeded, but failed to save order. Contact support.", { id: toastId });
        }
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement className="mb-4 theme-dark" options={{ theme: 'night' }} />
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className={`w-full py-4 text-white font-bold rounded-md bg-gradient-to-r from-brand-accent to-red-600 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-brand-accent/30'}`}
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader size="xs" className="border-white/40 border-t-white" />
            Processing...
          </span>
        ) : `Pay ${formatINR(amount)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;