import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, wishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notice, setNotice] = useState("");
  const saved = wishlist.some((item) => item.id === product.id);
  const price = Number(product.price || 0);
  const oldPrice = product.discountPercentage > 0
    ? price / (1 - product.discountPercentage / 100)
    : null;

  const requireAccount = () => {
    if (isAuthenticated) return true;
    navigate("/login", { state: { from: { pathname: `/product/${product.id}` } } });
    return false;
  };

  const handleAdd = () => {
    if (!requireAccount()) return;
    addToCart(product);
    setNotice("Added to your cart");
  };

  const handleWishlist = () => {
    if (!requireAccount()) return;
    addToWishlist(product);
    setNotice(saved ? "Already in your wishlist" : "Saved to your wishlist");
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-50 p-5">
        <Link to={`/product/${product.id}`} className="flex h-full w-full items-center justify-center" aria-label={`View ${product.title}`}>
          <img
            src={product.thumbnail || product.images?.[0] || "https://via.placeholder.com/400"}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
          />
        </Link>
        {product.discountPercentage > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
            Save {Math.round(product.discountPercentage)}%
          </span>
        )}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={saved ? "Save product to wishlist" : "Add product to wishlist"}
          aria-pressed={saved}
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${saved ? "border-rose-200 bg-rose-50 text-rose-600" : "border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:text-rose-600"}`}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
          </svg>
        </button>
        {product.stock > 0 && product.stock < 10 && (
          <span className="absolute bottom-3 left-3 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
            Only {product.stock} left
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{product.brand || product.category || "Featured"}</span>
          {product.rating != null && (
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-700">
              <span className="text-amber-500">★</span>{Number(product.rating).toFixed(1)}
            </span>
          )}
        </div>
        <Link to={`/product/${product.id}`} className="line-clamp-2 min-h-12 text-sm font-semibold leading-6 text-slate-900 transition hover:text-blue-700 sm:text-base">
          {product.title}
        </Link>
        {product.description && <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{product.description}</p>}
        <div className="mt-auto pt-4">
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-950">${price.toFixed(2)}</span>
            {oldPrice && <span className="text-xs text-slate-400 line-through">${oldPrice.toFixed(2)}</span>}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 7H6M10 21h.01M18 21h.01" />
            </svg>
            {product.stock === 0 ? "Out of stock" : "Add to cart"}
          </button>
          {notice && <p role="status" className="mt-2 text-center text-xs font-medium text-emerald-700">{notice}</p>}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
