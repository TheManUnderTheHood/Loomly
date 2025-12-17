// Initialize Facebook SDK
export const initFacebookSDK = () => {
  return new Promise((resolve) => {
    // Load the SDK asynchronously
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie     : true,
        xfbml      : true,
        version    : 'v18.0'
      });
      resolve();
    };

    // Load the SDK script
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      document.body.appendChild(script);
    } else {
      // SDK already loaded
      resolve();
    }
  });
};
