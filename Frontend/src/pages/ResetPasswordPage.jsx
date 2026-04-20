import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    const toastId = toast.loading('Resetting password...');

    try {
      const response = await api.post(`/users/reset-password/${token}`, { newPassword: password });
      toast.success(response.data.message || 'Password reset successfully!', { id: toastId });
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-40 px-4">
      <div className="max-w-md mx-auto bg-gray-900/50 p-8 rounded-lg border border-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6 text-brand-accent">Set New Password</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
            <input
              type="password"
              id="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            className={`w-full py-3 rounded-md font-bold transition-all ${
              isLoading || !password || !confirmPassword
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-brand-accent text-white hover:bg-opacity-80'
            }`}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
