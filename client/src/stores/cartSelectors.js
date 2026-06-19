import { useCartStore } from "./useCartStore";

/**
 * Total number of individual units across all cart items.
 * Used for the navbar badge.
 */
export const useCartCount = () =>
  useCartStore((state) =>
    (state.items ?? []).reduce((sum, item) => sum + item.quantity, 0),
  );

/**
 * Subtotal (price × quantity, pre-shipping, pre-discount).
 * Used for cart page and checkout summary.
 */
export const useCartTotal = () =>
  useCartStore((state) =>
    (state.items ?? []).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    ),
  );

/**
 * Whether the cart contains a specific product id.
 */
export const useIsInCart = (id) =>
  useCartStore((state) => (state.items ?? []).some((i) => i.id === id));

/**
 * Quantity of a specific product in the cart (0 if absent).
 */
export const useCartItemQty = (id) =>
  useCartStore(
    (state) => (state.items ?? []).find((i) => i.id === id)?.quantity ?? 0,
  );
