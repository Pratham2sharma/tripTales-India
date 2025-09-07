import { create } from "zustand";
import axios from "axios";

interface Itinerary {
  title: string;
  days: string[];
  estimated_budget: number;
}

interface TripPlan {
  itineraries: Itinerary[];
  rawResponse?: string;
}

interface TripPlannerState {
  loading: boolean;
  error: string | null;
  tripPlan: TripPlan | null;
  isPaywallHit: boolean; // ++ ADD: State to track if the paywall was hit
  generateTripPlan: (formData: {
    people: number;
    budget: number;
    destination: string;
    duration: number;
  }) => Promise<void>;
  resetPaywall: () => void; // ++ ADD: Action to close the upgrade modal
}

export const useTripPlannerStore = create<TripPlannerState>((set) => ({
  loading: false,
  error: null,
  tripPlan: null,
  isPaywallHit: false, // ++ ADD: Initial state

  // ++ ADD: Function to reset the paywall state (to close the modal)
  resetPaywall: () => set({ isPaywallHit: false, error: null }),

  generateTripPlan: async (formData) => {
    // Reset state before a new request
    set({ loading: true, error: null, tripPlan: null, isPaywallHit: false });

    try {
      // Switched to Axios as it simplifies handling response errors
      const response = await axios.post<TripPlan>(
        "/api/generate-trip", // Call your Next.js API route
        formData
      );

      set({
        tripPlan: response.data,
        loading: false,
      });
    } catch (error: unknown) {
      // ++ MODIFY: This is the updated error handling logic
      if (axios.isAxiosError(error) && error.response?.status === 402) {
        // --- THIS IS THE PAYWALL ERROR ---
        set({
          loading: false,
          isPaywallHit: true, // Trigger the modal in the UI
          error:
            error.response.data.error ||
            "You have reached your free plan limit.",
        });
      } else if (axios.isAxiosError(error) && error.response?.status === 401) {
        // --- THIS IS AUTHENTICATION ERROR - REDIRECT TO LOGIN ---
        set({ loading: false, error: null });
        window.location.href = "/login";
      } else {
        // --- THIS HANDLES ALL OTHER ERRORS ---
        let errorMessage =
          "An unexpected error occurred while generating your trip plan.";
        if (axios.isAxiosError(error) && error.response?.data?.error) {
          errorMessage = error.response.data.error;
        }
        set({ error: errorMessage, loading: false });
      }
    }
  },
}));
