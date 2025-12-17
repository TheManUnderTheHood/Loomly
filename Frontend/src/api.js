import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Axios Response Interceptor for Token Refresh
api.interceptors.response.use(
  (response) => response, // Directly return successful responses
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401, it's not a retry, AND the failed request was NOT for the refresh-token endpoint itself.
    // +++ THIS IS THE CRITICAL FIX +++
    if (error.response.status === 401 && originalRequest.url !== "/users/refresh-token" && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried

      try {
        // Attempt to refresh the access token
        await api.post("/users/refresh-token");
        
        // If successful, the new cookie is set automatically. Retry the original request.
        return api(originalRequest);

      } catch (refreshError) {
        // If the refresh attempt itself fails, the session is truly invalid.
        console.error("Session expired. Please log in again.");
        // Optional: you could programmatically log the user out here
        // logout(); 
        return Promise.reject(refreshError);
      }
    }

    // For all other errors (or if the refresh token call fails), just reject the promise
    return Promise.reject(error);
  }
);

export default api;