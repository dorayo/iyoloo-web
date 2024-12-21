import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
type UserInfo = RouterOutput["user"]["getCurrentUser"];

interface UserState {
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
  clearUser: () => void;
}

// store/user.ts
export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => {
          if (typeof window !== "undefined") {
            // 仅在客户端设置
            set({ user });
          }
        },
        clearUser: () => set({ user: null }),
      }),
      {
        name: "user-storage",
        skipHydration: true, // 跳过自动hydration
      },
    ),
  ),
);
