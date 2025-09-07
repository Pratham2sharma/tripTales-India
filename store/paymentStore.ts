import { create } from "zustand";
import axios from "axios";

// Interface for the successful payment response from Razorpay
interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Define the state and actions for our store
interface PaymentState {
  loading: boolean;
  error: string | null;
  initiatePayment: () => Promise<void>;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  loading: false,
  error: null,

  initiatePayment: async () => {
    set({ loading: true, error: null });

    try {
      // Step 1: Load Razorpay script if not already loaded
      if (typeof window !== "undefined" && !(window as any).Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Step 2: Create an order on your server
      const { data: order } = await axios.post("/api/payment/create-order");

      // Step 3: Get Razorpay Key ID from environment
      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) {
        console.error("NEXT_PUBLIC_RAZORPAY_KEY_ID not found in environment");
        throw new Error("Razorpay Key ID is not configured.");
      }
      console.log(
        "Using Razorpay Key ID:",
        razorpayKeyId.substring(0, 10) + "..."
      );

      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: "INR",
        name: "Triptales India",
        description: "AI Trip Planner - Premium Subscription",
        order_id: order.id,

        // Step 4: Define the success handler
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            // Step 5: Verify the payment
            const verificationResponse = await axios.post(
              "/api/payment/verify",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }
            );
            alert(verificationResponse.data.message);
            window.location.href = "/tripplanner"; // Redirect on success
          } catch (error) {
            console.error("Payment verification failed:", error);
            set({
              loading: false,
              error:
                "Payment verification failed. If the amount was debited, please contact support.",
            });
          }
        },
        prefill: {
          // You can prefill user data here
        },
        theme: {
          color: "#3B82F6",
        },
        // This is important for UX: handle when the user closes the modal
        modal: {
          ondismiss: () => {
            console.log("User closed the payment modal.");
            set({ loading: false }); // Reset loading state if modal is closed
          },
        },
      };

      // Step 6: Open the Razorpay checkout modal
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      
      // Check if it's an authentication error
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        set({ loading: false, error: null });
        window.location.href = "/login";
        return;
      }
      
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Could not initiate payment. Please try again.";
      set({ loading: false, error: errorMessage });
    }
  },
}));
