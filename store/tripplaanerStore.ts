import { create } from "zustand";

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
  generateTripPlan: (formData: {
    people: number;
    budget: number;
    destination: string;
    duration: number;
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
