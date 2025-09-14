import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Configure axios defaults
axios.defaults.timeout = 10000; // 10 seconds timeout

// interface BasicDestination {
//   _id: string;
//   name: string;
//   description: string;
//   state: string;
// }

interface Destination {
  _id: string;
  name: string;
  description: string;
  images: string[];
  state: string;
  bestTimeToVisit: string;
  travelTips: string;
  averageBudget: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

interface DestinationStore {
  destinations: Destination[];
  selectedDestination: Destination | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;

  // Actions
  fetchDestinations: () => Promise<void>;
  fetchDestinationById: (id: string) => Promise<void>;
  createDestination: (destinationData: any) => Promise<void>;
  updateDestination: (id: string, destinationData: any) => Promise<void>;
  deleteDestination: (id: string) => Promise<void>;
  clearSelectedDestination: () => void;
}

const useDestinationStore = create<DestinationStore>((set, get) => ({
  destinations: [],
  selectedDestination: null,
  loading: false,
  detailLoading: false,
  error: null,

  fetchDestinations: async () => {
    set({ loading: true, error: null });
    try {
      console.log(
        "Fetching destinations from:",
        `${API_BASE_URL}/destinations`
      );
      const response = await axios.get(`${API_BASE_URL}/destinations`);
      console.log("Destinations fetched successfully:", response.data);
      set({ destinations: response.data, loading: false });
    } catch (error: any) {
      console.error("Error fetching destinations:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch destinations";
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  fetchDestinationById: async (id: string) => {
    set({ detailLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/destinations/${id}`);
      set({ selectedDestination: response.data, detailLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        detailLoading: false,
      });
    }
  },

  // Updated to add the full destination object to the state
  createDestination: async (destinationData: any) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${API_BASE_URL}/destinations`,
        destinationData,
        { headers: { "Content-Type": "application/json" } }
      );
      // Add the full new destination to the array
      set((state) => ({
        destinations: [...state.destinations, response.data],
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // Updated to update the state with the full destination object
  updateDestination: async (id: string, destinationData: any) => {
    set({ detailLoading: true, error: null });
    try {
      const response = await axios.put(
        `${API_BASE_URL}/destinations/${id}`,
        destinationData,
        { headers: { "Content-Type": "application/json" } }
      );

      set((state) => ({
        destinations: state.destinations.map((dest) =>
          dest._id === id ? response.data : dest
        ),
        selectedDestination: response.data,
        detailLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        detailLoading: false,
      });
    }
  },

  deleteDestination: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}/destinations/${id}`);

      set((state) => ({
        destinations: state.destinations.filter((dest) => dest._id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  clearSelectedDestination: () => {
    set({ selectedDestination: null });
  },
}));

export default useDestinationStore;
