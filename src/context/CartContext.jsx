import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

const readCart = () => {
  try {
    const value = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    localStorage.removeItem("cart");
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(readCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (!product?.id) return;
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      return existing
        ? current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: Math.max(1, Number(item.quantity) || 1) + 1 }
              : item
          )
        : [...current, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    const nextQuantity = Number(quantity);
    if (!Number.isInteger(nextQuantity) || nextQuantity < 1) return;
    setCart((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: nextQuantity } : item
      )
    );
  };

  const removeFromCart = (id) =>
    setCart((current) => current.filter((item) => item.id !== id));

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
