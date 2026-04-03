import { create } from 'zustand';

interface UserStore {
  userId: string | null;
  email: string | null;
  username: string | null;
  level: number;
  totalFlavorScore: number;
  setUser: (id: string, email: string, username: string) => void;
  updateStats: (level: number, flavorScore: number) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userId: null,
  email: null,
  username: null,
  level: 1,
  totalFlavorScore: 0,
  setUser: (id, email, username) =>
    set({ userId: id, email, username }),
  updateStats: (level, flavorScore) =>
    set({ level, totalFlavorScore: flavorScore }),
  clearUser: () =>
    set({
      userId: null,
      email: null,
      username: null,
      level: 1,
      totalFlavorScore: 0,
    }),
}));
