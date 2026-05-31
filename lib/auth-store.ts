'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthUser = { id: number; email: string; role: string };

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  setSession: (token: string, user: AuthUser) => void;
  clear: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      clear: () => set({ token: null, user: null }),
    }),
    { name: 'my-store-v2-auth' },
  ),
);
