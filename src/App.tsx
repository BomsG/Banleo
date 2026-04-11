import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
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
import StaticPage from "./pages/StaticPage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/about"
                  element={
                    <StaticPage
                      title="About Us"
                      content="Banleo is a luxury fashion brand dedicated to effortless style and everyday confidence."
                    />
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <StaticPage
                      title="Contact"
                      content="Get in touch with our customer support team for any inquiries."
                    />
                  }
                />
                <Route
                  path="/shipping"
                  element={
                    <StaticPage
                      title="Shipping & Returns"
                      content="Learn more about our shipping policies and return procedures."
                    />
                  }
                />
                <Route
                  path="/privacy"
                  element={
                    <StaticPage
                      title="Privacy Policy"
                      content="We value your privacy and are committed to protecting your personal data."
                    />
                  }
                />
                <Route
                  path="/collections"
                  element={
                    <StaticPage
                      title="Collections"
                      content="Explore our curated seasonal collections and limited edition pieces."
                    />
                  }
                />
                <Route
                  path="/brand"
                  element={
                    <StaticPage
                      title="Our Brand"
                      content="Discover the story behind Banleo and our commitment to luxury fashion."
                    />
                  }
                />

                {/* Protected Routes - Prompt login for any other request */}
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
