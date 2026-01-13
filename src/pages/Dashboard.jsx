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
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [message, setMessage] = useState(null); 

  
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
      price,
      thumbnail: image || "https://via.placeholder.com/80"
    };

    syncStorage([newProduct, ...products]);
    showMessage("Product created successfully!");

    setTitle("");
    setPrice("");
    setImage("");
    setShowForm(false);
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditTitle(product.title);
    setEditPrice(product.price);
    setEditImage(product.thumbnail);
  };

  
  const updateProduct = (id) => {
    const updated = products.map((p) =>
      p.id === id
        ? { ...p, title: editTitle, price: editPrice, thumbnail: editImage }
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
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

 
  const totalValue = products.reduce((sum, p) => sum + Number(p.price || 0), 0);

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
              { name: "dashboard", label: "Dashboard" },
              { name: "products", label: "Products" },
              { name: "orders", label: "Orders" },
              { name: "customers", label: "Customers" },
              { name: "analytics", label: "Analytics" },
              { name: "settings", label: "Settings" },
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.name
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
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
                  <form onSubmit={createProduct} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                      placeholder="Product title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
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
                      placeholder="Image URL"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
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
                  <h2 className="text-2xl font-bold text-gray-900">Product Inventory</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                            No products yet
                          </td>
                        </tr>
                      ) : (
                        products.map((product) => (
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
                                <input
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="border border-gray-300 p-2 rounded-lg w-full"
                                />
                              ) : (
                                <span className="text-gray-900 font-medium">{product.title}</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {editingId === product.id ? (
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                  className="border border-gray-300 p-2 rounded-lg w-32"
                                />
                              ) : (
                                <span className="text-gray-900 font-semibold">${parseFloat(product.price || 0).toFixed(2)}</span>
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
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
