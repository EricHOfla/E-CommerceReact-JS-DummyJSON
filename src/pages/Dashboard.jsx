import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [discount, setDiscount] = useState("");
  const [rating, setRating] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editDiscount, setEditDiscount] = useState("");
  const [editRating, setEditRating] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [message, setMessage] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title"); 

  
  useEffect(() => {
    const loadProducts = async () => {
      const stored = localStorage.getItem("products");

      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        try {
          const res = await api.get("/products");
          setProducts(res.data.products);
          localStorage.setItem("products", JSON.stringify(res.data.products));
        } catch (err) {
          console.error(err);
          showMessage("Failed to load products", "error");
        }
      }
    };

    loadProducts();
  }, []);

 
  const syncStorage = (data) => {
    setProducts(data);
    localStorage.setItem("products", JSON.stringify(data));
  };

 
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });

    // Hide after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

 
  const createProduct = (e) => {
    e.preventDefault();

    const newProduct = {
      id: Date.now(),
      title,
      price: parseFloat(price),
      thumbnail: image || "https://via.placeholder.com/300",
      description: description || "No description available",
      brand: brand || "Unbranded",
      category: category || "general",
      stock: parseInt(stock) || 0,
      discountPercentage: parseFloat(discount) || 0,
      rating: parseFloat(rating) || 0
    };

    syncStorage([newProduct, ...products]);
    showMessage("Product created successfully!");

    // Clear all fields
    setTitle("");
    setPrice("");
    setImage("");
    setDescription("");
    setBrand("");
    setCategory("");
    setStock("");
    setDiscount("");
    setRating("");
    setShowForm(false);
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditTitle(product.title);
    setEditPrice(product.price);
    setEditImage(product.thumbnail);
    setEditDescription(product.description || "");
    setEditBrand(product.brand || "");
    setEditCategory(product.category || "");
    setEditStock(product.stock || "");
    setEditDiscount(product.discountPercentage || "");
    setEditRating(product.rating || "");
  };

  
  const updateProduct = (id) => {
    const updated = products.map((p) =>
      p.id === id
        ? { 
            ...p, 
            title: editTitle, 
            price: parseFloat(editPrice), 
            thumbnail: editImage,
            description: editDescription,
            brand: editBrand,
            category: editCategory,
            stock: parseInt(editStock) || 0,
            discountPercentage: parseFloat(editDiscount) || 0,
            rating: parseFloat(editRating) || 0
          }
        : p
    );

    syncStorage(updated);
    setEditingId(null);
    showMessage("Product updated successfully!");
  };

 
  const deleteProduct = (id) => {
    if (!window.confirm("Delete this product?")) return;

    syncStorage(products.filter((p) => p.id !== id));
    showMessage("Product deleted successfully!", "warning");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditPrice("");
    setEditImage("");
    setEditDescription("");
    setEditBrand("");
    setEditCategory("");
    setEditStock("");
    setEditDiscount("");
    setEditRating("");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

 
  const totalValue = products.reduce((sum, p) => sum + Number(p.price || 0), 0);

  // Filter and sort products
  const filteredProducts = products
    .filter((p) => 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "title") return a.title?.localeCompare(b.title);
      if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ALERT MESSAGE */}
      {message && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white z-50
          ${message.type === "success" ? "bg-green-600" : ""}
          ${message.type === "error" ? "bg-red-600" : ""}
          ${message.type === "warning" ? "bg-yellow-500 text-black" : ""}`}
        >
          {message.text}
        </div>
      )}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-indigo-600">EROH Shop Admin</h1>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 border-l pl-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {[
              { name: "dashboard", label: "Dashboard", icon: "📊" },
              { name: "products", label: "Products", icon: "📦" },
              { name: "orders", label: "Orders", icon: "🛒" },
              { name: "customers", label: "Customers", icon: "👥" },
              { name: "analytics", label: "Analytics", icon: "📈" },
              { name: "settings", label: "Settings", icon: "⚙️" },
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.name
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              <span className="text-xl">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Dashboard Overview */}
          {activeTab === "dashboard" && (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back, {user?.firstName}! Here's what's happening today.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">📦</div>
                    <div className="bg-white bg-opacity-30 rounded-lg px-3 py-1 text-sm">Products</div>
                  </div>
                  <p className="text-3xl font-bold mb-1">{products.length}</p>
                  <p className="text-blue-100 text-sm">Total Products</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">💰</div>
                    <div className="bg-white bg-opacity-30 rounded-lg px-3 py-1 text-sm">Revenue</div>
                  </div>
                  <p className="text-3xl font-bold mb-1">${totalValue.toFixed(2)}</p>
                  <p className="text-green-100 text-sm">Total Value</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">🛒</div>
                    <div className="bg-white bg-opacity-30 rounded-lg px-3 py-1 text-sm">Orders</div>
                  </div>
                  <p className="text-3xl font-bold mb-1">128</p>
                  <p className="text-purple-100 text-sm">Total Orders</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">👥</div>
                    <div className="bg-white bg-opacity-30 rounded-lg px-3 py-1 text-sm">Users</div>
                  </div>
                  <p className="text-3xl font-bold mb-1">1,249</p>
                  <p className="text-orange-100 text-sm">Active Customers</p>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setActiveTab("products")}
                      className="w-full flex items-center gap-4 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <div className="text-3xl">➕</div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">Add New Product</p>
                        <p className="text-sm text-gray-600">Create a new product listing</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => setActiveTab("orders")}
                      className="w-full flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <div className="text-3xl">📋</div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">View Orders</p>
                        <p className="text-sm text-gray-600">Manage customer orders</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => setActiveTab("analytics")}
                      className="w-full flex items-center gap-4 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                      <div className="text-3xl">📊</div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">View Analytics</p>
                        <p className="text-sm text-gray-600">Check sales performance</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 pb-4 border-b">
                      <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">New order received</p>
                        <p className="text-xs text-gray-500">Order #1234 - $299.99</p>
                        <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pb-4 border-b">
                      <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">Product updated</p>
                        <p className="text-xs text-gray-500">iPhone 14 Pro Max</p>
                        <p className="text-xs text-gray-400 mt-1">15 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pb-4 border-b">
                      <div className="w-2 h-2 mt-2 rounded-full bg-purple-500"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">New customer registered</p>
                        <p className="text-xs text-gray-500">John Doe</p>
                        <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-orange-500"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">Low stock alert</p>
                        <p className="text-xs text-gray-500">3 products running low</p>
                        <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "products" && (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Management</h1>
                <p className="text-gray-600">Manage your products and inventory</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
                  <p className="text-gray-500 text-sm font-medium">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{products.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                  <p className="text-gray-500 text-sm font-medium">Total Value</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">${totalValue.toFixed(2)}</p>
                </div>

               <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gray-500">
                      <p className="text-gray-500 text-sm font-medium">Average Price</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        ${products.length > 0 ? (products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / products.length).toFixed(2) : '0.00'}
                      </p>
                    </div>
              </div>

              {/* Add Product Form */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    {showForm ? "Cancel" : "Add Product"}
                  </button>
                </div>

                {showForm && (
                  <form onSubmit={createProduct} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        placeholder="Product title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <input
                        placeholder="Brand"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        placeholder="Price"
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <input
                        placeholder="Stock"
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        placeholder="Discount %"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        placeholder="Rating (0-5)"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <input
                      placeholder="Image URL"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <textarea
                      placeholder="Product description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="4"
                      className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    ></textarea>

                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      Create Product
                    </button>
                  </form>
                )}
              </div>

              {/* Product Table */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-2xl font-bold text-gray-900">Product Inventory</h2>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="title">Sort by Name</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                            {searchQuery ? "No products found matching your search" : "No products yet"}
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              {editingId === product.id ? (
                                <input
                                  value={editImage}
                                  onChange={(e) => setEditImage(e.target.value)}
                                  placeholder="Image URL"
                                  className="border border-gray-300 p-2 rounded-lg w-full"
                                />
                              ) : (
                                <img
                                  src={product.thumbnail || "https://via.placeholder.com/80"}
                                  alt={product.title}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {editingId === product.id ? (
                                <div className="space-y-2">
                                  <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="Title"
                                    className="border border-gray-300 p-2 rounded-lg w-full"
                                  />
                                  <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="Description"
                                    rows="2"
                                    className="border border-gray-300 p-2 rounded-lg w-full text-sm resize-none"
                                  ></textarea>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-gray-900 font-medium">{product.title}</p>
                                  {product.description && (
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {editingId === product.id ? (
                                <input
                                  value={editBrand}
                                  onChange={(e) => setEditBrand(e.target.value)}
                                  placeholder="Brand"
                                  className="border border-gray-300 p-2 rounded-lg w-full"
                                />
                              ) : (
                                <span className="text-gray-700">{product.brand || "-"}</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {editingId === product.id ? (
                                <input
                                  value={editCategory}
                                  onChange={(e) => setEditCategory(e.target.value)}
                                  placeholder="Category"
                                  className="border border-gray-300 p-2 rounded-lg w-full"
                                />
                              ) : (
                                <span className="text-gray-700 capitalize">{product.category || "-"}</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {editingId === product.id ? (
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                  className="border border-gray-300 p-2 rounded-lg w-24"
                                />
                              ) : (
                                <span className="text-gray-900 font-semibold">${parseFloat(product.price || 0).toFixed(2)}</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {editingId === product.id ? (
                                <input
                                  type="number"
                                  value={editStock}
                                  onChange={(e) => setEditStock(e.target.value)}
                                  placeholder="Stock"
                                  className="border border-gray-300 p-2 rounded-lg w-20"
                                />
                              ) : (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  (product.stock || 0) > 20 ? 'bg-green-100 text-green-800' :
                                  (product.stock || 0) > 0 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {product.stock || 0}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {editingId === product.id ? (
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max="100"
                                  value={editDiscount}
                                  onChange={(e) => setEditDiscount(e.target.value)}
                                  placeholder="Discount"
                                  className="border border-gray-300 p-2 rounded-lg w-20"
                                />
                              ) : (
                                <span className="text-gray-700">
                                  {product.discountPercentage ? `${parseFloat(product.discountPercentage).toFixed(1)}%` : "-"}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {editingId === product.id ? (
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="5"
                                  value={editRating}
                                  onChange={(e) => setEditRating(e.target.value)}
                                  placeholder="Rating"
                                  className="border border-gray-300 p-2 rounded-lg w-20"
                                />
                              ) : (
                                <div className="flex items-center gap-1">
                                  <span className="text-yellow-500">★</span>
                                  <span className="text-gray-700">{product.rating ? parseFloat(product.rating).toFixed(1) : "-"}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex gap-2 justify-end">
                                {editingId === product.id ? (
                                  <>
                                    <button
                                      onClick={() => updateProduct(product.id)}
                                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={cancelEdit}
                                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => startEdit(product)}
                                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => deleteProduct(product.id)}
                                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Orders Management</h1>
                <p className="text-gray-600">Track and manage customer orders</p>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#1234</td>
                        <td className="px-6 py-4 text-sm text-gray-600">John Doe</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Jan 14, 2026</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">$299.99</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#1233</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Jane Smith</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Jan 13, 2026</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">$149.50</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Processing
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#1232</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Bob Johnson</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Jan 13, 2026</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">$599.00</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Shipped
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Customers Tab */}
          {activeTab === "customers" && (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Customers</h1>
                <p className="text-gray-600">Manage your customer base</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                      JD
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">John Doe</h3>
                      <p className="text-sm text-gray-500">john.doe@email.com</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600"><span className="font-medium">Orders:</span> 12</p>
                    <p className="text-gray-600"><span className="font-medium">Total Spent:</span> $2,450</p>
                    <p className="text-gray-600"><span className="font-medium">Joined:</span> Dec 2025</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      JS
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Jane Smith</h3>
                      <p className="text-sm text-gray-500">jane.smith@email.com</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600"><span className="font-medium">Orders:</span> 8</p>
                    <p className="text-gray-600"><span className="font-medium">Total Spent:</span> $1,890</p>
                    <p className="text-gray-600"><span className="font-medium">Joined:</span> Nov 2025</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold">
                      BJ
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Bob Johnson</h3>
                      <p className="text-sm text-gray-500">bob.j@email.com</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600"><span className="font-medium">Orders:</span> 15</p>
                    <p className="text-gray-600"><span className="font-medium">Total Spent:</span> $3,200</p>
                    <p className="text-gray-600"><span className="font-medium">Joined:</span> Oct 2025</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
                <p className="text-gray-600">Track your store performance</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Sales Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-gray-600">Today</span>
                      <span className="text-xl font-bold text-gray-900">$1,234</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-gray-600">This Week</span>
                      <span className="text-xl font-bold text-gray-900">$8,456</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-gray-600">This Month</span>
                      <span className="text-xl font-bold text-gray-900">$34,290</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">This Year</span>
                      <span className="text-xl font-bold text-gray-900">$156,780</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Products</h3>
                  <div className="space-y-3">
                    {products.slice(0, 5).map((product, index) => (
                      <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                        <img 
                          src={product.thumbnail || "https://via.placeholder.com/40"} 
                          alt={product.title} 
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                          <p className="text-xs text-gray-500">42 sales</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">${product.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-600">Manage your store settings</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Store Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                      <input 
                        type="text" 
                        defaultValue="EROH Shop" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Store Email</label>
                      <input 
                        type="email" 
                        defaultValue="contact@erohshop.com" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                        <option>USD - US Dollar</option>
                        <option>EUR - Euro</option>
                        <option>GBP - British Pound</option>
                      </select>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                      <span className="text-gray-700">Email notifications for new orders</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                      <span className="text-gray-700">Low stock alerts</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
                      <span className="text-gray-700">Marketing updates</span>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
