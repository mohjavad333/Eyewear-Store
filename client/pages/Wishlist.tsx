import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Share2,
  Trash2,
  ShoppingCart,
  Eye,
  Copy,
  Facebook,
  Twitter,
  Mail,
  ArrowRight,
  Filter,
  Grid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

// Recommended products (not in wishlist)
const recommendedProducts = [
  {
    id: "5",
    name: "Sports Performance",
    price: 249,
    originalPrice: 299,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "Sports",
    rating: 4.9,
    reviews: 201,
    discount: 17,
  },
  {
    id: "2",
    name: "Modern Round Frame",
    price: 179,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Eyeglasses",
    rating: 4.5,
    reviews: 88,
  },
  {
    id: "6",
    name: "Elegant Rectangle",
    price: 189,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.7,
    reviews: 112,
    discount: 16,
  },
  {
    id: "4",
    name: "Premium Blue Light",
    price: 159,
    image: "https://images.unsplash.com/photo-1508296695146-367ec3be0d35?w=500&h=500&fit=crop",
    category: "Eyeglasses",
    rating: 4.3,
    reviews: 76,
  },
];

export default function Wishlist() {
  const { isAuthenticated } = useAuth();
  const { items: wishlistItems, loading, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter items
  let filteredItems = [...wishlistItems];
  if (filterCategory !== "all") {
    filteredItems = filteredItems.filter((item) => item.category === filterCategory);
  }

  // Sort items
  if (sortBy === "newest") {
    filteredItems.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
  } else if (sortBy === "price-low") {
    filteredItems.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredItems.sort((a, b) => b.price - a.price);
  } else if (sortBy === "discount") {
    filteredItems.sort((a, b) => (b.discount || 0) - (a.discount || 0));
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      await removeItem(productId);
    } catch (error) {
      console.error("Failed to remove wishlist item:", error);
    }
  };

  const addWishlistItemToCart = async (item: (typeof wishlistItems)[number]) => {
    try {
      await addToCart({
        productId: item.productId,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        category: item.category,
        quantity: 1,
      });
    } catch (error) {
      console.error("Failed to add wishlist item to cart:", error);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const categories = Array.from(new Set(wishlistItems.map((item) => item.category)));

  // Wishlist stats
  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
  const totalOriginalValue = wishlistItems.reduce((sum, item) => sum + (item.originalPrice || item.price), 0);
  const totalSavings = totalOriginalValue - totalValue;

  // Empty state
  if (!isAuthenticated || loading || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Heart className="w-16 h-16 text-muted-foreground opacity-50" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {!isAuthenticated ? "Sign in to view your wishlist" : loading ? "Loading your wishlist..." : "Your Wishlist is Empty"}
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                {!isAuthenticated
                  ? "Sign in to save favorite eyewear and access it across your devices."
                  : loading
                  ? "We are loading your saved items."
                  : "Start adding your favorite eyewear to your wishlist and never lose track of items you love."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <Link to="/shop">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8">
                      Explore Shop
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8">
                      Sign In
                    </Button>
                  </Link>
                )}
                <Link to="/categories">
                  <Button variant="outline" className="h-12 px-8">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recommended Products */}
          <section className="container mx-auto max-w-7xl px-4 md:px-8 py-12 border-t border-border">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Discover Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} {...product} isNew={false} />
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  My Wishlist
                </h1>
                <p className="text-muted-foreground">
                  {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved
                </p>
              </div>

              <Button
                onClick={() => setShowShareModal(!showShareModal)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Wishlist
              </Button>
            </div>

            {/* Share Modal */}
            {showShareModal && (
              <div className="mt-6 bg-card rounded-lg border border-border p-6">
                <h3 className="font-bold text-foreground mb-4">Share Your Wishlist</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={window.location.href}
                      readOnly
                      className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-muted"
                    />
                    <Button
                      size="sm"
                      onClick={copyShareLink}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  {copiedLink && (
                    <p className="text-xs text-success font-medium">✓ Link copied!</p>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Wishlist Stats */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Items</p>
              <p className="text-3xl font-bold text-foreground">{wishlistItems.length}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Value</p>
              <p className="text-3xl font-bold text-primary">${totalValue.toFixed(0)}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Potential Savings</p>
              <p className="text-3xl font-bold text-success">${totalSavings.toFixed(0)}</p>
            </div>
          </div>
        </section>

        {/* Filters & Controls */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 bg-card border border-border rounded-lg p-4">
            <div className="flex-1">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="discount">Biggest Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-1 border border-border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Wishlist Items */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-8">
          {filteredItems.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
                  : "space-y-4"
              }
            >
              {filteredItems.map((item) => (
                <div key={item.productId}>
                  {viewMode === "grid" ? (
                    <div className="bg-card rounded-lg border border-border overflow-hidden group hover:border-primary transition-colors">
                      <div className="relative aspect-square bg-muted overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {item.discount && (
                            <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">
                              -{item.discount}%
                            </span>
                          )}
                          {!item.inStock && (
                            <span className="px-3 py-1 bg-danger text-danger-foreground text-xs font-bold rounded-full">
                              Out of Stock
                            </span>
                          )}
                          {item.stockCount <= 3 && item.inStock && (
                            <span className="px-3 py-1 bg-warning text-warning-foreground text-xs font-bold rounded-full">
                              Only {item.stockCount} left
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={!item.inStock}
                            onClick={() => addWishlistItemToCart(item)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Cart
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => removeFromWishlist(item.productId)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                          {item.category}
                        </p>
                        <h3 className="font-bold text-foreground mb-2 line-clamp-2">
                          {item.name}
                        </h3>

                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-lg font-bold text-primary">
                            ${item.price}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${item.originalPrice}
                            </span>
                          )}
                        </div>

                        {item.reviews && (
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-accent">★</span>
                            <span className="text-muted-foreground">
                              {item.rating} ({item.reviews})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 p-4 border border-border rounded-lg hover:border-primary">
                      <div className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1 uppercase">
                          {item.category}
                        </p>
                        <h3 className="font-bold text-foreground mb-2">
                          {item.name}
                        </h3>
                        <div className="flex gap-4 mb-3 text-sm">
                          <div>
                            <p className="font-bold text-primary">
                              ${item.price}
                            </p>
                            {item.originalPrice && (
                              <p className="text-muted-foreground line-through text-xs">
                                ${item.originalPrice}
                              </p>
                            )}
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              {item.inStock
                                ? `${item.stockCount} in stock`
                                : "Out of stock"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={!item.inStock}
                            onClick={() => addWishlistItemToCart(item)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Add to Cart
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromWishlist(item.productId)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                No items found in this category.
              </p>
              <Button
                onClick={() => {
                  setFilterCategory("all");
                  setSortBy("newest");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </section>

        {/* Recommended Products */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-12 border-t border-border">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Complete Your Collection
            </h2>
            <p className="text-muted-foreground">
              Items you might also like
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} {...product} isNew={false} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Shop?
              </h2>
              <p className="text-lg text-primary-foreground/90 mb-8">
                Add items from your wishlist to your cart and enjoy premium eyewear.
              </p>
              <Link to="/shop">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-8">
                  Continue Shopping
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
