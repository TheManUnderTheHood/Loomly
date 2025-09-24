import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

const getUserCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ owner: req.user._id }).populate({
    path: "items.product",
    select: "name price productImage stock",
  });

  if (!cart) {
    return res
      .status(200)
      .json(new ApiResponse(200, { items: [] }, "Cart is empty"));
  }

  // Optional: Calculate total price on the backend
  let cartTotalPrice = 0;
  cart.items.forEach(item => {
    if (item.product) {
      cartTotalPrice += item.product.price * item.quantity;
    }
  });

  return res.status(200).json(new ApiResponse(200, { cart, cartTotalPrice }, "Cart fetched successfully"));
});

const addItemToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid Product ID");
    }

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");
    if (product.stock < quantity) throw new ApiError(400, "Not enough stock available");

    let cart = await Cart.findOne({ owner: userId });
    if (!cart) {
        cart = await Cart.create({ owner: userId, items: [] });
    }

    const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (productIndex > -1) {
        // Product already in cart, update quantity
        cart.items[productIndex].quantity += quantity;
    } else {
        // Add new product to cart
        cart.items.push({ product: productId, quantity });
    }
    
    await cart.save();

    return res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
});

const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(productId) || !quantity || quantity < 1) {
        throw new ApiError(400, "Valid Product ID and quantity are required");
    }
    
    const cart = await Cart.findOne({ owner: userId });
    if (!cart) throw new ApiError(404, "Cart not found");

    const productIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (productIndex === -1) throw new ApiError(404, "Product not in cart");

    cart.items[productIndex].quantity = quantity;
    await cart.save();
    
    return res.status(200).json(new ApiResponse(200, cart, "Cart item quantity updated"));
});


const removeItemFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params; // Get ID from URL parameter
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid Product ID");
    }

    const cart = await Cart.findOneAndUpdate(
        { owner: userId },
        { $pull: { items: { product: productId } } },
        { new: true } // Return the updated document
    );

    if (!cart) throw new ApiError(404, "Cart not found or item not in cart");

    return res.status(200).json(new ApiResponse(200, cart, "Item removed from cart"));
});

export { getUserCart, addItemToCart, updateCartItemQuantity, removeItemFromCart };