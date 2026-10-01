import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const isAdmin = user?.role === "admin";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { label: "Shop", href: "/shop" },
    { label: "Categories", href: "/categories" },
    { label: "Sale", href: "/sale" },
    { label: "Blog", href: "/blog" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleMobileSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-secondary text-secondary-foreground py-2 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl flex justify-between items-center text-xs md:text-sm">
          <p>Free shipping on orders over $100</p>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:opacity-80">
              Contact Us
            </Link>
            <Link to="/about" className="hover:opacity-80">
              About
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="px-4 md:px-8 py-4">
        <div className="container mx-auto max-w-7xl">
          {/* Desktop layout */}
          <div className="hidden md:flex items-center justify-between gap-8">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold text-primary flex-shrink-0"
            >
              Optics
            </Link>

            {/* Navigation */}
            <nav className="flex gap-8 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <form onSubmit={handleSearch} className="relative hidden lg:flex">
                <Input
                  placeholder="Search eyewear..."
                  className="w-48 pl-10 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
              <Link to="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:bg-muted"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:bg-muted relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                </Button>
              </Link>

              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-muted">
                    Admin
                  </Button>
                </Link>
              )}

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link to="/profile">
                    <Button
                      variant="ghost"
                      size="icon"
                      title={user?.firstName}
                      className="text-foreground hover:bg-muted"
                    >
                      <User className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    title="Logout"
                    className="text-foreground hover:bg-muted"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile layout */}
          <div className="md:hidden flex items-center justify-between gap-4">
            <Link
              to="/"
              className="text-xl font-bold text-primary flex-shrink-0"
            >
              Optics
            </Link>

            <div className="flex items-center gap-2 flex-1 justify-end">
              <Link to={searchQuery.trim() ? `/search?q=${encodeURIComponent(searchQuery)}` : "/search"}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:bg-muted"
                  onClick={() => {
                    if (searchQuery.trim()) {
                      setSearchQuery("");
                    }
                  }}
                >
                  <Search className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:bg-muted relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-foreground hover:bg-muted"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-border flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border flex gap-2">
                {isAdmin && (
                  <Link to="/admin" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full text-primary">Admin</Button>
                  </Link>
                )}
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Profile</Button>
                    </Link>
                    <Button
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link to="/register" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
