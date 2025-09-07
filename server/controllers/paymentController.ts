import { Request, Response } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import User from "../models/User";

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

// Initialize Razorpay instance
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createOrder = async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  const options = {
    amount: 50 * 100, // 5000 paise = Rs. 50
    currency: "INR",
    receipt: `receipt_order_${new Date().getTime()}`,
    notes: {
      userId: userId,
    },
  };

  try {
    const order = await instance.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Find user by order ID - assuming order ID contains user info or you have an orders collection
export const handleRazorpayWebhook = async (req: Request, res: Response) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;
    const signature = req.headers["x-razorpay-signature"] as string;

    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET not configured");
      return res.status(500).json({ status: "Server configuration error" });
    }

    // Validate signature
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(req.body);
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      console.warn("Webhook signature mismatch!");
      return res.status(400).json({ status: "Invalid signature" });
    }

    // Parse event
    const event = JSON.parse(req.body.toString());

    if (event.event === "payment.captured") {
      const { order_id, id: payment_id, notes } = event.payload.payment.entity;

      // ++ GET THE USER ID FROM THE NOTES OBJECT ++
      const userId = notes.userId;

      if (!userId) {
        console.error(
          `Webhook Error: userId not found in notes for order: ${order_id}`
        );
        // Acknowledge the webhook but log the error
        return res.json({ status: "ok, but user not found in notes" });
      }

      const user = await User.findById(userId);

      if (!user) {
        console.error(
          `Webhook Error: User with ID ${userId} not found for order: ${order_id}`
        );
        return res.status(404).json({ status: "User not found" });
      }

      // Idempotency check: If user has an ACTIVE premium plan, do nothing.
      if (
        user.subscription.plan === "premium" &&
        user.subscription.expiresAt &&
        user.subscription.expiresAt > new Date()
      ) {
        console.log(
          `Webhook Info: User ${user._id} already has an ACTIVE premium subscription.`
        );
        return res.json({ status: "ok" });
      }

      // Upgrade to premium
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      user.subscription.plan = "premium";
      user.subscription.razorpayPaymentId = payment_id;
      user.subscription.razorpayOrderId = order_id;
      user.subscription.expiresAt = expiresAt;

      await user.save();
      console.log(
        `Webhook Success: User ${
          user._id
        } upgraded to premium until ${expiresAt.toISOString()}`
      );
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ status: "Internal server error" });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const userId = req.headers['x-user-id'] as string;

  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: "Missing payment details." });
  }

  // 1. VERIFY THE SIGNATURE
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest("hex");

  if (digest !== razorpay_signature) {
    return res
      .status(400)
      .json({ message: "Payment verification failed: Invalid signature." });
  }

  // 2. SIGNATURE IS VALID, NOW UPDATE THE DATABASE
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // You can check if the webhook has already processed this, but it's not strictly
    // necessary as the idempotency check handles it.
    if (
      user.subscription.plan === "premium" &&
      user.subscription.expiresAt &&
      user.subscription.expiresAt > new Date()
    ) {
      return res.json({
        status: "success",
        message:
          "Payment verified successfully! Your subscription was already active.",
      });
    }

    // Upgrade the user to premium
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    user.subscription.plan = "premium";
    user.subscription.razorpayPaymentId = razorpay_payment_id;
    user.subscription.razorpayOrderId = razorpay_order_id;
    user.subscription.expiresAt = expiresAt;

    await user.save();

    console.log(`Verification Success: User ${user._id} upgraded to premium.`);

    res.json({
      status: "success",
      message: "Payment verified successfully! You are now a premium member.",
    });
  } catch (error) {
    console.error("Error updating user after payment verification:", error);
    res
      .status(500)
      .json({ message: "Server error while updating subscription." });
  }
};
