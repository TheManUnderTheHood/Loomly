import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Stripe from "stripe";
import { Cart } from "../models/cart.model.js";

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

const createCheckoutSession = asyncHandler(async (req, res) => {
    if (!stripe) {
        throw new ApiError(503, "Stripe payments are not configured");
    }

    const cart = await Cart.findOne({ owner: req.user._id }).populate("items.product", "name price");
    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Your cart is empty");
    }

        const lineItems = cart.items.map((item) => {
        if (!item.product) {
            throw new ApiError(400, "Your cart contains an unavailable product");
        }
        return {
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.product.name,
                },
                unit_amount: Math.round(item.product.price * 100),
            },
            quantity: item.quantity,
        };
    });

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        ui_mode: "elements",
        line_items: lineItems,
        return_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/orders`,
        metadata: {
            company: "Loomly",
            userId: req.user._id.toString(),
            cartId: cart._id.toString(),
        },
    });

    res.status(200).json(
        new ApiResponse(200, { client_secret: session.client_secret }, "Checkout session created successfully")
    );
});

const sendStripeApiKey = asyncHandler(async (req, res) => {
    const stripeApiKey = process.env.STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_API_KEY;

    if (!stripeApiKey) {
        throw new ApiError(500, "Stripe publishable key is not configured");
    }

    res.status(200).json(
        new ApiResponse(200, { stripeApiKey }, "Stripe API Key sent successfully")
    );
});

export {
    createCheckoutSession,
    sendStripeApiKey
};
