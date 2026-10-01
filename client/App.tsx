import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { WishlistProvider } from "./context/WishlistContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SizeGuide from "./pages/SizeGuide";
import Legal from "./pages/Legal";
import Blog from "./pages/Blog";
import Article from "./pages/Article";
import Sitemap from "./pages/Sitemap";
import Categories from "./pages/Categories";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Sale from "./pages/Sale";
import Wishlist from "./pages/Wishlist";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <WishlistProvider>
              <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />

          {/* Search Route */}
          <Route path="/search" element={<Search />} />

          {/* Shop Routes */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Category Routes */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/sunglasses" element={<Shop initialCategory="sunglasses" />} />
          <Route path="/categories/eyeglasses" element={<Shop initialCategory="eyeglasses" />} />
          <Route path="/categories/blue-light" element={<Shop initialCategory="blue-light" />} />
          <Route path="/categories/sports" element={<Shop initialCategory="sports" />} />

          {/* Special Routes */}
          <Route path="/sale" element={<Sale />} />

          {/* Cart & Checkout Routes */}
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<Legal />} />

          {/* Admin */}
          <Route path="/admin" element={<Admin />} />

          {/* Account Routes */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Content Routes */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/article/:slug" element={<Article />} />

          {/* Info Routes */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Legal />} />
          <Route path="/terms" element={<Legal />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/accessibility" element={<Legal />} />
          <Route path="/security" element={<Legal />} />
          <Route path="/sitemap" element={<Sitemap />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
            </WishlistProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
