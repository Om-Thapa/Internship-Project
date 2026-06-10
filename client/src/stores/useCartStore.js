import { create } from "zustand";
// Todo: Add persist localStorage
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => (
        {
          // Cart UI
          isCartOpen: false,
  
          openCart: () => set({ isCartOpen: true }),
  
          closeCart: () => set({ isCartOpen: false }),
  
          // Cart Data
          items: [],
  
          addItem: (product) => {
            const items = get().items;
  
            const existingItem = items.find((item) => item.id === product.id);
  
            if (existingItem) {
              set({
                items: items.map((item) =>
                  item.id === product.id
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                      }
                    : item,
                ),
              });
  
              return;
            }
  
            set({
              items: [
                ...items,
                {
                  ...product,
                  quantity: 1,
                },
              ],
            });
          },
  
          removeItem: (id) =>
            set({
              items: get().items.filter((item) => item.id !== id),
            }),
  
          increaseQuantity: (id) =>
            set({
              items: get().items.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      quantity: item.quantity + 1,
                    }
                  : item,
              ),
            }),
  
          decreaseQuantity: (id) =>
            set({
              items: get()
                .items.map((item) =>
                  item.id === id
                    ? {
                        ...item,
                        quantity: item.quantity - 1,
                      }
                    : item,
                )
                .filter((item) => item.quantity > 0),
            }),
  
          clearCart: () =>
            set({
              items: [],
            }),
        }
    ),
    {
      name: "purepuff-cart",
    }
  )
);
