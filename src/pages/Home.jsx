import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductsContext";

const Home = () => {
  const { products, loading } = useProducts();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Home;
