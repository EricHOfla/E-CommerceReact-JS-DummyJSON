import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useProducts } from "../context/ProductsContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, wishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const product = useMemo(
    () => products.find((item) => String(item.id) === id),
    [products, id]
  );

  const requireLogin = (action) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/product/${id}` } } });
      return;
    }
    action();
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Link to="/products" className="text-sm font-medium text-blue-700 hover:text-blue-900">← Back to products</Link>
          {loading ? (
            <p className="py-24 text-center text-slate-600" role="status">Loading product…</p>
          ) : error ? (
            <div className="my-10 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
          ) : !product ? (
            <div className="my-10 rounded-xl border border-slate-200 bg-white p-10 text-center">
              <h1 className="text-2xl font-semibold text-slate-900">Product not found</h1>
              <p className="mt-2 text-slate-600">This product may have been removed or the link is incorrect.</p>
              <Link to="/products" className="mt-5 inline-flex rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white">Browse products</Link>
            </div>
          ) : (
            <section className="mt-6 grid gap-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2 md:p-8">
              <div className="flex min-h-80 items-center justify-center rounded-xl bg-slate-50 p-5">
                <img src={product.thumbnail || product.images?.[0]} alt={product.title} className="max-h-[460px] w-full object-contain" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">{product.category}</p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{product.title}</h1>
                {product.brand && <p className="mt-2 text-sm text-slate-500">Brand: {product.brand}</p>}
                {product.rating != null && <p className="mt-4 text-sm text-amber-600">★ {Number(product.rating).toFixed(1)} / 5</p>}
                <p className="mt-5 text-3xl font-bold text-slate-950">${Number(product.price || 0).toFixed(2)}</p>
                <p className="mt-5 leading-7 text-slate-600">{product.description || "No product description is available."}</p>
                <p className={`mt-4 text-sm font-medium ${product.stock > 0 ? "text-emerald-700" : "text-red-600"}`}>
                  {product.stock > 0 ? `${product.stock} available` : "Stock information unavailable"}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => requireLogin(() => { addToCart(product); navigate("/cart"); })} className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">Add to cart</button>
                  <button onClick={() => requireLogin(() => addToWishlist(product))} aria-pressed={wishlist.some((item) => item.id === product.id)} className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-50">
                    {wishlist.some((item) => item.id === product.id) ? "Saved to wishlist" : "Add to wishlist"}
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
};

export default ProductDetails;
