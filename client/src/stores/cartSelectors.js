import { useCartStore } from "./useCartStore";

export const useCartCount = () =>
  useCartStore((state) =>
    (state.items ?? []).reduce(
      (sum, item) => sum + item.quantity,
      0
    )
  );

export const useCartTotal = () =>
  useCartStore((state) =>
    (state.items ?? []).reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    )
  );