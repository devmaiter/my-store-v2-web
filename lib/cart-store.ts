'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from './types';

export type CartLine = { product: Product; amount: number };

type CartState = {
  lines: CartLine[];
  add: (product: Product, amount?: number) => void;
  remove: (productId: number) => void;
  setAmount: (productId: number, amount: number) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (product, amount = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.product.id === product.id);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.product.id === product.id ? { ...l, amount: l.amount + amount } : l,
              ),
            };
          }
          return { lines: [...state.lines, { product, amount }] };
        }),
      remove: (productId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.product.id !== productId) })),
      setAmount: (productId, amount) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (l.product.id === productId ? { ...l, amount } : l))
            .filter((l) => l.amount > 0),
        })),
      clear: () => set({ lines: [] }),
      totalItems: () => get().lines.reduce((s, l) => s + l.amount, 0),
      totalPrice: () => get().lines.reduce((s, l) => s + l.amount * l.product.price, 0),
    }),
    { name: 'my-store-v2-cart' },
  ),
);
