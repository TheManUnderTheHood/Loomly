import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import toast from 'react-hot-toast';

const AccountDetails = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ fullName: '', email: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Updating details...');
    try {
      const response = await api.patch('/users/update-account', formData);
      if (response.data.success) {
        toast.success('Account details updated!', { id: toastId });
        // Note: You might want to update the user in AuthContext here for immediate reflection
        // For simplicity, the change will be visible on next login/refresh.
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4">Account Details</h3>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>
        <div className="pt-2">
          <button type="submit" disabled={loading} className="bg-brand-accent text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-80 transition-all disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;