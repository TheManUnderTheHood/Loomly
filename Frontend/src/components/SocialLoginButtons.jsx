import { useState } from 'react';
import toast from 'react-hot-toast';

const SocialLoginButtons = ({ onSuccess }) => {
  const [loading, setLoading] = useState({ google: false, facebook: false });

  const handleGoogleLogin = async () => {
    setLoading(prev => ({ ...prev, google: true }));
    const toastId = toast.loading('Connecting to Google...');
    
    try {
      // Load Google Sign-In library
      if (!window.google) {
        throw new Error('Google Sign-In SDK not loaded');
      }

      // Initialize Google Sign-In
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            // Decode the JWT token to get user info
            const userData = JSON.parse(atob(response.credential.split('.')[1]));
            
            await onSuccess({
              provider: 'google',
              googleId: userData.sub,
              email: userData.email,
              fullName: userData.name,
              avatar: userData.picture,
            });
            
            toast.success('Logged in with Google!', { id: toastId });
          } catch (error) {
            console.error('Google login error:', error);
            toast.error(error.response?.data?.message || 'Failed to login with Google', { id: toastId });
          } finally {
            setLoading(prev => ({ ...prev, google: false }));
          }
        },
      });

      // Show the One Tap prompt
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error('Google SDK error:', error);
      toast.error('Google Sign-In not available. Please check your configuration.', { id: toastId });
      setLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleFacebookLogin = () => {
    setLoading(prev => ({ ...prev, facebook: true }));
    const toastId = toast.loading('Connecting to Facebook...');
    
    try {
      if (!window.FB) {
        throw new Error('Facebook SDK not loaded');
      }

      window.FB.login(
        (response) => {
          if (response.authResponse) {
            // Get user profile
            window.FB.api('/me', { fields: 'id,name,email,picture' }, async (userData) => {
              try {
                await onSuccess({
                  provider: 'facebook',
                  facebookId: userData.id,
                  email: userData.email,
                  fullName: userData.name,
                  avatar: userData.picture?.data?.url,
                });
                
                toast.success('Logged in with Facebook!', { id: toastId });
              } catch (error) {
                console.error('Facebook login error:', error);
                toast.error(error.response?.data?.message || 'Failed to login with Facebook', { id: toastId });
              } finally {
                setLoading(prev => ({ ...prev, facebook: false }));
              }
            });
          } else {
            toast.error('Facebook login cancelled', { id: toastId });
            setLoading(prev => ({ ...prev, facebook: false }));
          }
        },
        { scope: 'public_profile,email' }
      );
    } catch (error) {
      console.error('Facebook SDK error:', error);
      toast.error('Facebook Sign-In not available. Please check your configuration.', { id: toastId });
      setLoading(prev => ({ ...prev, facebook: false }));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-700"></div>
        <span className="px-4 text-gray-400 text-sm">OR CONTINUE WITH</span>
        <div className="flex-grow border-t border-gray-700"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading.google}
        className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 rounded-md hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {loading.google ? 'Connecting...' : 'Google'}
      </button>

      <button
        type="button"
        onClick={handleFacebookLogin}
        disabled={loading.facebook}
        className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-semibold py-3 rounded-md hover:bg-[#166FE5] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        {loading.facebook ? 'Connecting...' : 'Facebook'}
      </button>
    </div>
  );
};

export default SocialLoginButtons;
