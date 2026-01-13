import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios"; // your axios instance

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  // 1️⃣ Load from localStorage first
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem("products");
    return stored ? JSON.parse(stored) : [];
  });

  const [loading, setLoading] = useState(products.length === 0);

  // 2️⃣ Fetch from API only if localStorage is empty
  useEffect(() => {
    const fetchProducts = async () => {
      if (products.length > 0) {
        // Already have products in localStorage
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/products");
        const fetchedProducts = res.data.products;
        setProducts(fetchedProducts);
        localStorage.setItem("products", JSON.stringify(fetchedProducts));
      } catch (err) {
        console.error("Failed to fetch products:", err);
        alert("Failed to load products from API.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [products.length]);

  // 3️⃣ Keep localStorage in sync whenever products change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  return (
    <ProductsContext.Provider value={{ products, setProducts, loading }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
