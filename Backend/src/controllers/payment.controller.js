import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const processPayment = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        throw new ApiError(400, "Amount is required");
    }

    const myPayment = await stripe.paymentIntents.create({
        amount: amount,
        currency: "inr", // default to INR or anything you use
        metadata: {
            company: "Flasher",
        },
    });

    res.status(200).json(
        new ApiResponse(200, { client_secret: myPayment.client_secret }, "Payment intent created successfully")
    );
});

const sendStripeApiKey = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, { stripeApiKey: process.env.STRIPE_API_KEY }, "Stripe API Key sent successfully")
    );
});

export {
    processPayment,
    sendStripeApiKey
};
