import { createContext, useState, useContext } from "react";
import api from "../api";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false); // Used for specific cart actions

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await api.get("/cart/");
      setCart(response.data.data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
      setCart(null); // Ensure cart is null on error
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart(null);
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post("/cart/", { productId, quantity });
      // Refetch the cart to get the most up-to-date state
      await fetchCart();
      return { success: true, message: "Item added to cart!" };
    } catch (error) {
      console.error("Failed to add item to cart", error);
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred",
      };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/cart/item/${productId}`);
      await fetchCart();
      return { success: true, message: "Item removed from cart." };
    } catch (error) {
      console.error("Failed to remove item from cart", error);
      return { success: false, message: error.response?.data?.message || "An error occurred" };
    }
  };

  const value = {
    cart,
    cartItemCount: cart?.cart?.items?.length || 0,
    loading,
    addToCart,
    removeFromCart,
    fetchCart, // Expose for AuthContext
    clearCart, // Expose for AuthContext
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};