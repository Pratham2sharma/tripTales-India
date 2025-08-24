import { create } from "zustand";
import axios from "axios";

interface Cineplace {
  _id: string;
  name: string;
  description: string;
  movie: string;
  images: string[];
  state: string;
  bestTimeToVisit: string;
  travelTips: string;
  averageBudget: string;
  latitude: number;
  longitude: number;
}

interface CineplaceStore {
  cineplaces: Cineplace[];
  selectedCineplace: Cineplace | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;

  fetchCineplaces: () => Promise<void>;
  fetchCineplaceById: (id: string) => Promise<void>;
  createCineplace: (data: Omit<Cineplace, "_id">) => Promise<void>;
  updateCineplace: (
    id: string,
    data: Partial<Omit<Cineplace, "_id">>
  ) => Promise<void>;
  deleteCineplace: (id: string) => Promise<void>;
  clearSelectedCineplace: () => void;
}

const API_BASE_URL = "http://localhost:5000/api";

const useCineplaceStore = create<CineplaceStore>((set, get) => ({
  cineplaces: [],
  selectedCineplace: null,
  loading: false,
  detailLoading: false,
  error: null,

  fetchCineplaces: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/cineplace`);
      set({ cineplaces: response.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch cineplaces",
        loading: false,
      });
    }
  },

  fetchCineplaceById: async (id: string) => {
    set({ detailLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/cineplace/${id}`);
      set({ selectedCineplace: response.data, detailLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch cineplace details",
        detailLoading: false,
      });
    }
  },

  createCineplace: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/cineplace`, data);
      const { cineplaces } = get();
      set({
        cineplaces: [...cineplaces, response.data],
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create cineplace",
        loading: false,
      });
      throw error;
    }
  },

  updateCineplace: async (id: string, data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${API_BASE_URL}/cineplace/${id}`, data);
      const { cineplaces } = get();
      set({
        cineplaces: cineplaces.map((cineplace) =>
          cineplace._id === id ? response.data : cineplace
        ),
        selectedCineplace: response.data,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update cineplace",
        loading: false,
      });
      throw error;
    }
  },

  deleteCineplace: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}/cineplace/${id}`);
      const { cineplaces } = get();
      set({
        cineplaces: cineplaces.filter((cineplace) => cineplace._id !== id),
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete cineplace",
        loading: false,
      });
      throw error;
    }
  },

  clearSelectedCineplace: () => {
    set({ selectedCineplace: null });
  },
}));

export default useCineplaceStore;
