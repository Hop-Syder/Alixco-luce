import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminAuthProvider, useAdminAuth } from "./contexts/AdminAuthContext";
import { CartProvider } from "./contexts/CartContext";

import PublicLayout from "./components/PublicLayout";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Services from "./pages/Services";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminServices from "./pages/admin/AdminServices";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminCustomers from "./pages/admin/AdminCustomers";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const CustomerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center">Chargement…</div>;
  if (!user) return <Navigate to="/connexion" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();
  if (loading) return <div className="p-10 text-center">Chargement…</div>;
  if (!admin) return <Navigate to="/admin/connexion" replace />;
  return children;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <AdminAuthProvider>
            <CartProvider>
              <Toaster position="top-right" richColors closeButton data-testid="toast-region" />
              <ScrollToTop />
              <Routes>
                {/* Public */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalogue" element={<Catalog />} />
                  <Route path="/produit/:id" element={<ProductDetail />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/panier" element={<Cart />} />
                  <Route path="/a-propos" element={<About />} />
                  <Route path="/connexion" element={<Login />} />
                  <Route path="/inscription" element={<Register />} />
                  <Route path="/mon-compte" element={<CustomerRoute><Profile /></CustomerRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* Admin */}
                <Route path="/admin/connexion" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="produits" element={<AdminProducts />} />
                  <Route path="produits/nouveau" element={<AdminProductForm />} />
                  <Route path="produits/:id" element={<AdminProductForm />} />
                  <Route path="services" element={<AdminServices />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="commandes" element={<AdminOrders />} />
                  <Route path="commandes/:id" element={<AdminOrderDetail />} />
                  <Route path="clients" element={<AdminCustomers />} />
                </Route>
              </Routes>
            </CartProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
