import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    axios
      .get("https://dummyjson.com/products/categories")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          console.error("Unexpected categories format:", res.data);
        }
      })
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    navigate(category ? `/products/${category}` : "/products");
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div 
          className="flex items-center gap-4 cursor-pointer" 
          onClick={() => { 
            setSelectedCategory(""); 
            navigate("/products"); 
          }}
        >
          <h1 className="text-2xl font-bold text-indigo-600">EROH Shop</h1>
        </div>

        {/* Center: Categories */}
        <div className="hidden md:flex items-center gap-3">
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="border border-gray-300 rounded p-2 text-gray-700 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={cat.slug || index} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Right: User Info & Actions */}
        <div className="flex items-center gap-4">
          {/* Admin Dashboard */}
          {/* {user?.role === "admin" && ( */}
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition"
            >
              Dashboard
            </button>
          {/* )} */}

          {/* Cart & Wishlist */}
          {user && (
            <>
              <span 
                className="bg-gray-100 px-2 py-1 rounded text-gray-700 hover:bg-gray-200 cursor-pointer" 
                onClick={() => navigate("/cart")}
              >
                Cart: {cart.length}
              </span>
              <span 
                className="bg-gray-100 px-2 py-1 rounded text-gray-700 hover:bg-gray-200 cursor-pointer" 
                onClick={() => navigate("/wishlist")}
              >
                Wishlist: {wishlist.length}
              </span>
            </>
          )}

          {/* Login / Logout */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Hi, {user.firstName}</span>
              <button
                onClick={() => { 
                  logout(); 
                  navigate("/login"); 
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;