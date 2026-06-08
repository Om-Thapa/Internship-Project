import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider
      value={{
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);