import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  logout(): unknown;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      logout: () => {
        (set({ accessToken: null }), localStorage.removeItem("auth-storage"));
      }, // ⭐ hapus token
    }),
    {
      name: "auth-storage", // nama key di localStorage
    },
  ),
);
interface UserState {
  user: {
    id: number;
    email: string;
    name: string;
    foto: string;
    roleId: number;
    roleName: string;
    divisiId: number;
    divisiName: string;
    mentorId: number;
    mentorName: string;
    nim: string;
  };
  setUser: (user: any) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        id: 0,
        email: "",
        name: "",
        foto: "",
        roleId: 0,
        roleName: "",
        divisiId: 0,
        divisiName: "",
        mentorId: 0,
        mentorName: "",
        nim: "",
      },
      setUser: (user) => set({ user: user }),
    }),
    {
      name: "user-storage", // nama key di localStorage
    },
  ),
);
