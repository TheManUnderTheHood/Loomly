import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

const processPayment = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        throw new ApiError(400, "Amount is required");
    }

    if (!stripe) {
        throw new ApiError(503, "Stripe payments are not configured");
    }

    const myPayment = await stripe.paymentIntents.create({
        amount: amount,
        currency: "inr", // default to INR or anything you use
        metadata: {
            company: "Loomly",
        },
    });

    res.status(200).json(
        new ApiResponse(200, { client_secret: myPayment.client_secret }, "Payment intent created successfully")
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
    processPayment,
    sendStripeApiKey
};
