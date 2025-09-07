// src/routes/payment.routes.ts

import { Router, raw } from "express";
import {
  handleRazorpayWebhook,
  createOrder,
  verifyPayment,
} from "../controllers/paymentController";
// Import your other controllers
// import { createOrder, verifyPayment } from "../controllers/payment.controller";

const router = Router();

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

// The webhook route MUST use the express.raw() middleware
// to be able to verify the signature
router.post(
  "/webhook",
  raw({ type: "application/json" }),
  handleRazorpayWebhook
);

export default router;
