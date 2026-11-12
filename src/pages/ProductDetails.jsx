import { useMemo, useState } from "react";
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
  const [selectedImage, setSelectedImage] = useState("");
  const product = useMemo(
    () => products.find((item) => String(item.id) === id),
    [products, id]
  );

  const galleryImages = product ? [...new Set([product.thumbnail, ...(product.images || [])].filter(Boolean))] : [];
  const activeImage = galleryImages.includes(selectedImage) ? selectedImage : galleryImages[0] || "";

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
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Link to="/products" className="text-sm font-medium text-blue-700 hover:text-blue-900">← Back to products</Link>
          {loading ? (
            <p className="py-24 text-center text-gray-600" role="status">Loading product…</p>
          ) : error ? (
            <div className="my-10 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
          ) : !product ? (
            <div className="my-10 rounded-xl border border-gray-200 bg-white p-10 text-center">
              <h1 className="text-2xl font-semibold text-gray-900">Product not found</h1>
              <p className="mt-2 text-gray-600">This product may have been removed or the link is incorrect.</p>
              <Link to="/products" className="mt-5 inline-flex rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white">Browse products</Link>
            </div>
          ) : (
            <section className="mt-6 grid gap-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-2 md:p-8">
              <div className="flex min-h-80 items-center justify-center rounded-xl bg-gray-100 p-5">
                <img src={activeImage || product.thumbnail || product.images?.[0]} alt={product.title} className="max-h-[460px] w-full object-contain" />
              </div>
              {galleryImages.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-3 md:col-start-1" aria-label="Product images">
                  {galleryImages.map((image, index) => (
                    <button key={image} type="button" onClick={() => setSelectedImage(image)} aria-label={"View product image " + (index + 1)} aria-pressed={activeImage === image} className={"h-16 w-16 overflow-hidden rounded-lg border-2 bg-white p-1 " + (selectedImage === image ? "border-blue-600" : "border-gray-200 hover:border-blue-300")}>
                      <img src={image} alt="" className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
              <div className="flex flex-col justify-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">{product.category}</p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">{product.title}</h1>
                {product.brand && <p className="mt-2 text-sm text-gray-500">Brand: {product.brand}</p>}
                {product.rating != null && <p className="mt-4 text-sm text-amber-600">★ {Number(product.rating).toFixed(1)} / 5</p>}
                <p className="mt-5 text-3xl font-bold text-gray-900">${Number(product.price || 0).toFixed(2)}</p>
                <p className="mt-5 leading-7 text-gray-600">{product.description || "No product description is available."}</p>
                <p className={`mt-4 text-sm font-medium ${product.stock > 0 ? "text-emerald-700" : "text-red-600"}`}>
                  {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => requireLogin(() => { addToCart(product); navigate("/cart"); })} disabled={product.stock === 0} className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-400">Add to cart</button>
                  <button onClick={() => requireLogin(() => addToWishlist(product))} aria-pressed={wishlist.some((item) => item.id === product.id)} className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-800 transition hover:bg-gray-50">
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
