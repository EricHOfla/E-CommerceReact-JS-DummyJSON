import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);

const readWishlist = () => {
  try {
    const value = JSON.parse(localStorage.getItem("wishlist") || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    localStorage.removeItem("wishlist");
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(readWishlist);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    if (!product?.id) return;
    setWishlist((current) =>
      current.some((item) => item.id === product.id)
        ? current
        : [...current, product]
    );
  };

  const removeFromWishlist = (id) =>
    setWishlist((current) => current.filter((item) => item.id !== id));

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
