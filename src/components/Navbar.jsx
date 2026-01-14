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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // You can implement search functionality here
      console.log("Searching for:", searchQuery);
      // For now, just navigate to products page
      navigate("/products");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowUserMenu(false);
    setMobileMenuOpen(false);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +250 785263931
            </span>
            <span className="hidden md:flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              support@erohshop.com
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Free Shipping on Orders Over $50</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center gap-4">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => { 
              setSelectedCategory(""); 
              navigate("/products"); 
            }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              EROH Shop
            </h1>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                type="submit"
                className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Categories Dropdown - Desktop */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-gray-700 font-medium">Categories</span>
                <svg className={`w-4 h-4 text-gray-700 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showCategoryMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowCategoryMenu(false)}></div>
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 max-h-96 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedCategory("");
                        navigate("/products");
                        setShowCategoryMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 transition-colors font-medium"
                    >
                      All Categories
                    </button>
                    {categories.map((cat, index) => (
                      <button
                        key={cat.slug || index}
                        onClick={() => {
                          setSelectedCategory(cat.slug);
                          navigate(`/products/${cat.slug}`);
                          setShowCategoryMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 capitalize transition-colors"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Cart */}
            {user && (
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </button>
            )}

            {/* Wishlist */}
            {user && (
              <button
                onClick={() => navigate("/wishlist")}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </div>
                  <span className="hidden md:inline text-gray-700 font-medium">{user.firstName}</span>
                  <svg className={`w-4 h-4 text-gray-700 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}></div>
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          navigate("/dashboard");
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 flex items-center gap-2 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
              >
                Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <form onSubmit={handleSearch} className="lg:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            <div className="border-b border-gray-200 pb-2">
              <p className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase">Categories</p>
              <button
                onClick={() => {
                  setSelectedCategory("");
                  navigate("/products");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-700"
              >
                All Categories
              </button>
              {categories.slice(0, 10).map((cat, index) => (
                <button
                  key={cat.slug || index}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    navigate(`/products/${cat.slug}`);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-700 capitalize"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;