import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, KeyRound, User, Image as ImageIcon } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('password', formData.password);
    if (avatar) {
      data.append('avatar', avatar);
    }
    
    try {
      const response = await register(data);
      if (response.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center pt-24 px-4">
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8 w-full max-w-sm shadow-xl shadow-brand-accent/10">
        <h2 className="text-center text-3xl font-primary tracking-widest uppercase mb-6">Create Account</h2>
        {error && <p className="bg-red-900/50 text-red-300 border border-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
        {success && <p className="bg-green-900/50 text-green-300 border border-green-700 p-3 rounded-md mb-4 text-sm">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"/></div>
          <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" name="username" placeholder="Username" onChange={handleChange} required className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"/></div>
          <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"/></div>
          <div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"/></div>
          <div><label htmlFor="avatar" className="text-sm text-gray-400">Avatar (Optional)</label><input type="file" name="avatar" id="avatar" onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-accent/20 file:text-brand-accent hover:file:bg-brand-accent/30 mt-1"/></div>
          <button type="submit" disabled={loading} className="w-full bg-brand-accent text-white font-bold py-3 rounded-md hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Creating...' : 'CREATE ACCOUNT'}
          </button>
          <div className="text-center text-gray-400 text-sm">
            Already have an account? <Link to="/login" className="text-brand-accent hover:underline">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;