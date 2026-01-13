import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios"; // your axios instance

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem("products");
    return stored ? JSON.parse(stored) : [];
  });

  const [loading, setLoading] = useState(products.length === 0);

  // Load from API only if localStorage is empty
  useEffect(() => {
    const fetchProducts = async () => {
      if (products.length > 0) {
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
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [products.length]);

  // Keep localStorage in sync whenever products change
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
