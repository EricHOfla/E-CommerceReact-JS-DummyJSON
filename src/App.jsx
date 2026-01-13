import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/Login.jsx";
import Category from "./pages/Category.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import Wishlist from "./pages/Wishlist.jsx"; 
import Cart from "./pages/Cart.jsx"; 

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <>
      <div className="p-4">
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Products */}
          <Route
            path="/products/*"
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:name"
            element={
              <ProtectedRoute>
                <Category />
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

          
          <Route
            path="/card/:id"
            element={
              <ProtectedRoute>
                <Cart />
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

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
