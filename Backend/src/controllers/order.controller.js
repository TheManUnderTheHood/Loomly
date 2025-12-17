import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

const createOrder = asyncHandler(async (req, res) => {
  const { shippingInfo } = req.body;
  const userId = req.user._id;

  if (!shippingInfo) {
    throw new ApiError(400, "Shipping information is required");
  }

  const cart = await Cart.findOne({ owner: userId }).populate("items.product", "name price stock thumbnail");
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Your cart is empty");
  }

  let totalPrice = 0;
  const orderItems = [];

  for (const item of cart.items) {
    if (!item.product) {
      // This can happen if a product was deleted but still exists in a user's cart
      throw new ApiError(404, `A product in your cart could not be found. Please remove it and try again.`);
    }

    if (item.product.stock < item.quantity) {
      throw new ApiError(400, `Not enough stock for ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}`);
    }

    totalPrice += item.product.price * item.quantity;

    // +++ FIX: Provide a fallback placeholder image if thumbnail.url is missing +++
    const imageUrl = item.product.thumbnail?.url || 'https://via.placeholder.com/150?text=No+Image';

    orderItems.push({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      image: imageUrl, // Use the safe imageUrl variable
      product: item.product._id,
    });
  }

  const order = await Order.create({
    shippingInfo,
    orderItems,
    totalPrice,
    owner: userId,
    paymentInfo: { status: "succeeded" },
    trackingHistory: [
      {
        status: "Processing",
        timestamp: new Date(),
        note: "Order placed successfully",
      },
    ],
  });

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }

  await Cart.findByIdAndDelete(cart._id);

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully"));
});


// --- User-specific routes ---
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ owner: req.user._id }).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Your orders fetched successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  if (!mongoose.isValidObjectId(orderId)) {
    throw new ApiError(400, "Invalid Order ID");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Ensure the user owns the order or is an admin
  if (order.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    throw new ApiError(403, "You are not authorized to view this order");
  }

  return res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
});

// --- Admin-only routes ---
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("owner", "fullName email").sort({createdAt: -1});
  return res.status(200).json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(orderId)) {
        throw new ApiError(400, "Invalid Order ID");
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (!["Processing", "Shipped", "Delivered", "Cancelled"].includes(status)) {
        throw new ApiError(400, "Invalid order status");
    }

    order.orderStatus = status;
    if (status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    // Add to tracking history
    const statusNotes = {
      Processing: "Order is being prepared",
      Shipped: "Order has been shipped and is on its way",
      Delivered: "Order has been delivered successfully",
      Cancelled: "Order has been cancelled",
    };

    order.trackingHistory.push({
      status,
      timestamp: new Date(),
      note: statusNotes[status] || "Status updated",
    });

    await order.save();

    return res.status(200).json(new ApiResponse(200, order, "Order status updated"));
});


export { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };