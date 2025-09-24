import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, KeyRound } from 'lucide-react';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Use the email for the 'username' field if your backend accepts it
      const response = await login({ email: credentials.email, password: credentials.password });
      if (response.success) {
        navigate('/'); // Redirect to home on successful login
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
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
        <h2 className="text-center text-3xl font-primary tracking-widest uppercase mb-6">Login</h2>
        {error && <p className="bg-red-900/50 text-red-300 border border-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="email" name="email" placeholder="Email" value={credentials.email} onChange={handleChange} required className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent" />
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleChange} required className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-brand-accent text-white font-bold py-3 rounded-md hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Entering...' : 'ENTER THE VOID'}
          </button>
          <div className="text-center text-gray-400 text-sm">
            Don't have an account? <Link to="/register" className="text-brand-accent hover:underline">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;