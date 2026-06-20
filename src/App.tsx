import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Lookbook from "./pages/Lookbook";
import LookbookDetail from "./pages/LookbookDetail";
import AdminDashboard from "./AdminDashboard";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import ForgotPassword from "./pages/Forgotpassword";
import ResetPassword from "./pages/Resetpassword";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import RefundPolicy from "./pages/RefundPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import ExchangePolicy from "./pages/ExchangePolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import OrdersPayment from "./pages/OrdersPayment";
import { supabase } from "./lib/supabase";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AuthRedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        navigate("/reset-password");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return null;
}

export default function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <AuthRedirectHandler />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Content Pages */}
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/return-policy" element={<ReturnPolicy />} />
                <Route path="/exchange-policy" element={<ExchangePolicy />} />
                <Route path="/shipping" element={<ShippingPolicy />} />
                <Route path="/orders-payment" element={<OrdersPayment />} />

                {/* Shop Routes */}
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/lookbook" element={<Lookbook />} />
                <Route path="/lookbook/:id" element={<LookbookDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </WishlistProvider>
  );
}
