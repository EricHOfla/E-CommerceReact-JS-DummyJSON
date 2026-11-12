import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Category from "./pages/Category.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import Wishlist from "./pages/Wishlist.jsx"; 
import Cart from "./pages/Cart.jsx";
import About from "./pages/About.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Checkout from "./pages/Checkout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <div>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Home page (public overview) */}
        <Route path="/" element={<Home />} />

        {/* About page */}
        <Route path="/about" element={<About />} />

        {/* Product details */}
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Products - All products */}
        <Route path="/products" element={<Category />} />

        {/* Products - By category */}
        <Route path="/products/:name" element={<Category />} />

        {/* Demo checkout */}
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

        {/* Cart */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Wishlist */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
