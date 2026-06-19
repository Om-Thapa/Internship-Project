import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      // ── UI state ──────────────────────────────────────────
      isCartOpen: false,
      openCart:   () => set({ isCartOpen: true  }),
      closeCart:  () => set({ isCartOpen: false }),

      // ── Data ─────────────────────────────────────────────
      items: [],

      // Add item — merges quantity if already in cart
      addItem: (product) => {
        const items       = get().items;
        const existing    = items.find((i) => i.id === product.id);
        const maxStock    = product.stock ?? 999;

        if (existing) {
          // Don't exceed available stock
          if (existing.quantity >= maxStock) return;
          set({
            items: items.map((i) =>
              i.id === product.id
                ? { ...i, quantity: Math.min(i.quantity + 1, maxStock) }
                : i,
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      increaseQuantity: (id) =>
        set({
          items: get().items.map((i) =>
            i.id === id
              ? { ...i, quantity: Math.min(i.quantity + 1, i.stock ?? 999) }
              : i,
          ),
        }),

      decreaseQuantity: (id) =>
        set({
          items: get()
            .items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
            )
            .filter((i) => i.quantity > 0),
        }),

      // Update quantity to exact value (for input fields)
      setQuantity: (id, qty) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        const clamped = Math.max(1, Math.min(qty, item.stock ?? 999));
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: clamped } : i,
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      // Sync prices from server after re-fetch (prevents stale price exploits)
      syncPrices: (serverProducts) => {
        const map = Object.fromEntries(serverProducts.map((p) => [p.id, p]));
        set({
          items: get().items.map((i) =>
            map[i.id]
              ? { ...i, price: map[i.id].price, stock: map[i.id].stock }
              : i,
          ),
        });
      },
    }),
    {
      name:    "purepuff-cart",
      storage: createJSONStorage(() => localStorage),
      // Only persist items list, not UI state
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
