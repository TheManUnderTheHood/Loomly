import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Sending recovery link...');

    try {
      const response = await api.post('/users/forgot-password', { email });
      toast.success(response.data.message || 'Recovery email sent!', { id: toastId });
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send recovery email.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-40 px-4">
      <div className="max-w-md mx-auto bg-gray-900/50 p-8 rounded-lg border border-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6 text-brand-accent">Forgot Password</h1>
        <p className="text-gray-400 text-center mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className={`w-full py-3 rounded-md font-bold transition-all ${
              isLoading || !email
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-brand-accent text-white hover:bg-opacity-80'
            }`}
          >
            {isLoading ? 'Sending...' : 'Send Recovery Link'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Remembered your password? <Link to="/login" className="text-brand-accent hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
