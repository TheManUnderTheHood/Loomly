import { createContext, useState, useContext, useEffect } from "react";
import api from "../api";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // To check initial auth status

  // Get the fetch/clear functions from the other contexts
  const { fetchCart, clearCart } = useCart();
  const { fetchWishlist, clearWishlist } = useWishlist();

  // This effect runs on initial app load to check for an existing session
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await api.get("/users/current-user");
        if (response.data.success) {
          setUser(response.data.data);
          setIsAuthenticated(true);
          // User is logged in, fetch their data in parallel
          await Promise.all([fetchCart(), fetchWishlist()]);
        }
      } catch (error) {
        // User is not logged in or token is invalid
        setUser(null);
        setIsAuthenticated(false);
        // Ensure any stale data is cleared
        clearCart();
        clearWishlist();
      } finally {
        setLoading(false);
      }
    };
    checkUserStatus();
  }, []); // Note: Empty dependency array means this runs only once on mount

  const login = async (credentials) => {
    const response = await api.post("/users/login", credentials);
    if (response.data.success) {
      setUser(response.data.data.user);
      setIsAuthenticated(true);
      // After successful login, fetch all user-specific data
      await Promise.all([fetchCart(), fetchWishlist()]);
    }
    return response.data;
  };

  const logout = async () => {
    await api.post("/users/logout");
    setUser(null);
    setIsAuthenticated(false);
    // After logout, clear all user-specific data
    clearCart();
    clearWishlist();
  };
  
  const register = async (formData) => {
    // FormData is used for multipart requests (i.e., with file uploads)
    const response = await api.post("/users/register", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};