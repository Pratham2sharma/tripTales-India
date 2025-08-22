import { create } from "zustand";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UserStore {
  users: User[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      set({ users: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ loading: false });
    }
  },
}));
