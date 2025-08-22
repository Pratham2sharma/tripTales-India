import { create } from "zustand";

interface TripPlan {
  itineraries: string[];
  rawResponse: string;
}

interface TripPlannerState {
  loading: boolean;
  error: string | null;
  tripPlan: TripPlan | null;
  generateTripPlan: (formData: {
    numberOfPeople: string;
    budget: string;
    destinations: string;
    time: string;
  }) => Promise<void>;
}

export const useTripPlannerStore = create<TripPlannerState>((set) => ({
  loading: false,
  error: null,
  tripPlan: null,

  generateTripPlan: async (formData) => {
    try {
      set({ loading: true, error: null, tripPlan: null });

      const res = await fetch("http://localhost:5000/api/trip/plantrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch trip plan");
      }

      const data = await res.json();

      set({
        tripPlan: {
          itineraries: data.itineraries || [],
          rawResponse: data.raw || "",
        },
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
