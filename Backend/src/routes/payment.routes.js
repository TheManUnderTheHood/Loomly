import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { processPayment, sendStripeApiKey } from "../controllers/payment.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/process").post(processPayment);
router.route("/stripekey").get(sendStripeApiKey);

export default router;