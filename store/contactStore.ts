import { create } from "zustand";
import axios from "axios";

// Define the shape of your form data
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// Define the possible statuses for the API call
type Status = "idle" | "loading" | "success" | "error";

// Define the state shape for the store
interface ContactState {
  status: Status;
  error: string | null;
  sendContactForm: (formData: ContactFormData) => Promise<void>;
  resetStatus: () => void;
}

export const contactStore = create<ContactState>((set) => ({
  // Initial state
  status: "idle",
  error: null,

  // 2. UPDATED action to use axios
  sendContactForm: async (formData) => {
    set({ status: "loading", error: null });
    try {
      // axios.post automatically stringifies the object and sets headers
      await axios.post("http://localhost:5000/api/send", formData);

      // If the line above doesn't throw an error, the request was successful
      set({ status: "success" });
    } catch (error: any) {
      // axios automatically throws an error for bad responses (4xx or 5xx)
      let errorMessage = "An unexpected error occurred.";

      // Check if it's an axios error and get the message from our API response
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || "Failed to send message.";
      } else {
        errorMessage = error.message;
      }

      set({ status: "error", error: errorMessage });
    }
  },

  resetStatus: () => {
    set({ status: "idle", error: null });
  },
}));
