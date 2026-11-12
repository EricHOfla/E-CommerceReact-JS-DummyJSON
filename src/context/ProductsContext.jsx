import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const ProductsContext = createContext(null);

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/products", { params: { limit: 100 } });
        if (!Array.isArray(data?.products)) {
          throw new Error("The product service returned an unexpected response.");
        }
        if (active) setProducts(data.products);
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "We couldn't load products. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      active = false;
    };
  }, []);

  return (
    <ProductsContext.Provider value={{ products, setProducts, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) throw new Error("useProducts must be used within a ProductsProvider");
  return context;
};
