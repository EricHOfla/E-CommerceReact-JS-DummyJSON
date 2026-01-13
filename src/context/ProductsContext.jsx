// src/context/ProductsContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios"; // make sure baseURL is https://dummyjson.com

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    // 1️⃣ Load from localStorage first
    const stored = localStorage.getItem("products");
    return stored ? JSON.parse(stored) : [];
  });

  const [loading, setLoading] = useState(products.length === 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      // 2️⃣ If localStorage already has data, skip API
      if (products.length > 0) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/products");
        const fetchedProducts = res.data.products;
        setProducts(fetchedProducts);

        // Save to localStorage
        localStorage.setItem("products", JSON.stringify(fetchedProducts));
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products from API");
        alert("Failed to load products from API");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [products.length]);

  // Keep localStorage in sync when products change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  return (
    <ProductsContext.Provider value={{ products, setProducts, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
