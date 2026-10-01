import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Flame,
  Clock,
  AlertCircle,
  Grid,
  List,
  Filter,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";

const fallbackSaleProducts = [
  {
    id: "1",
    name: "Classic Aviator",
    price: 139,
    originalPrice: 199,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.8,
    reviews: 124,
    discount: 30,
    tier: "flash",
    stockLeft: 5,
  },
  {
    id: "2",
    name: "Modern Round Frame",
    price: 119,
    originalPrice: 179,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=500&h=500&fit=crop",
    category: "Eyeglasses",
    rating: 4.6,
    reviews: 89,
    discount: 33,
    tier: "category",
    stockLeft: 8,
  },
  {
    id: "3",
    name: "Minimal Cat Eye",
    price: 104,
    originalPrice: 149,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.7,
    reviews: 156,
    discount: 30,
    tier: "category",
    stockLeft: 12,
  },
  {
    id: "4",
    name: "Premium Blue Light",
    price: 95,
    originalPrice: 159,
    image: "https://images.unsplash.com/photo-1508296695146-367ec3be0d35?w=500&h=500&fit=crop",
    category: "Computer Glasses",
    rating: 4.5,
    reviews: 67,
    discount: 40,
    tier: "flash",
    stockLeft: 3,
  },
  {
    id: "5",
    name: "Sports Performance",
    price: 149,
    originalPrice: 249,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "Sports",
    rating: 4.9,
    reviews: 201,
    discount: 40,
    tier: "flash",
    stockLeft: 2,
  },
  {
    id: "6",
    name: "Elegant Rectangle",
    price: 132,
    originalPrice: 189,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Eyeglasses",
    rating: 4.4,
    reviews: 45,
    discount: 30,
    tier: "category",
    stockLeft: 15,
  },
  {
    id: "7",
    name: "Vintage Wayfarer",
    price: 99,
    originalPrice: 179,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.6,
    reviews: 98,
    discount: 45,
    tier: "clearance",
    stockLeft: 6,
  },
  {
    id: "8",
    name: "Minimalist Clear",
    price: 79,
    originalPrice: 139,
    image: "https://images.unsplash.com/photo-1508296695146-367ec3be0d35?w=500&h=500&fit=crop",
    category: "Eyeglasses",
    rating: 4.3,
    reviews: 76,
    discount: 43,
    tier: "clearance",
    stockLeft: 4,
  },
  {
    id: "9",
    name: "Luxury Oversized",
    price: 179,
    originalPrice: 299,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.8,
    reviews: 142,
    discount: 40,
    tier: "flash",
    stockLeft: 7,
  },
  {
    id: "10",
    name: "Classic Round",
    price: 118,
    originalPrice: 169,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Eyeglasses",
    rating: 4.5,
    reviews: 88,
    discount: 30,
    tier: "category",
    stockLeft: 10,
  },
  {
    id: "11",
    name: "Urban Streetwear",
    price: 89,
    originalPrice: 159,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.7,
    reviews: 112,
    discount: 44,
    tier: "clearance",
    stockLeft: 3,
  },
  {
    id: "12",
    name: "Premium Titanium",
    price: 195,
    originalPrice: 279,
    image: "https://images.unsplash.com/photo-1508296695146-367ec3be0d35?w=500&h=500&fit=crop",
    category: "Eyeglasses",
    rating: 4.9,
    reviews: 167,
    discount: 30,
    tier: "category",
    stockLeft: 9,
  },
];

const CategorySaleSection = ({ category, products }: { category: string; products: typeof fallbackSaleProducts }) => {
  if (products.length === 0) return null;

  const categoryIcon: Record<string, string> = {
    Sunglasses: "☀️",
    Eyeglasses: "👓",
    "Computer Glasses": "💻",
    Sports: "⚽",
  };

  return (
    <div key={category}>
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
          <span>{categoryIcon[category as keyof typeof categoryIcon] || "🕶️"}</span>
          {category} Sale
        </h3>
        <p className="text-muted-foreground">
          {products.length} items on sale
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
        {products.map((product) => (
          <div key={product.id} className="relative">
            <ProductCard
              {...product}
              originalPrice={product.originalPrice}
              discount={product.discount}
            />
            {product.stockLeft <= 3 && (
              <div className="absolute top-24 left-3 right-3 bg-danger text-danger-foreground text-xs font-bold px-2 py-1 rounded z-10">
                Only {product.stockLeft} left!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Sale() {
  const { products: catalogProducts } = useProducts(fallbackSaleProducts);
  const allSaleProducts = catalogProducts
    .map((product) => {
      const fallback = fallbackSaleProducts.find((item) => item.id === product.id);
      const originalPrice = product.originalPrice;
      return {
        ...fallback,
        ...product,
        originalPrice,
        discount: originalPrice && originalPrice > product.price
          ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
          : 0,
        stockLeft: product.stock ?? 0,
      };
    })
    .filter((product) => product.discount > 0);
  const flashDeals = [...allSaleProducts]
    .filter((product) => product.stockLeft > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 3);
  const [sortBy, setSortBy] = useState("highest-discount");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [discountFilter, setDiscountFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Calculate sale stats
  const totalProducts = allSaleProducts.length;
  const averageDiscount = totalProducts
    ? Math.round(allSaleProducts.reduce((sum, product) => sum + product.discount, 0) / totalProducts)
    : 0;
  const totalSavings = allSaleProducts.reduce(
    (sum, product) => sum + ((product.originalPrice || product.price) - product.price),
    0
  );

  // Filter products
  let filteredProducts = allSaleProducts;

  if (discountFilter !== "all") {
    const [minDiscount, maxDiscount] = discountFilter.split("-").map(Number);
    filteredProducts = filteredProducts.filter(
      (p) => p.discount >= minDiscount && p.discount <= maxDiscount
    );
  }

  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter((p) => p.category === selectedCategory);
  }

  // Sort products
  if (sortBy === "highest-discount") {
    filteredProducts.sort((a, b) => b.discount - a.discount);
  } else if (sortBy === "lowest-price") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "stock-low") {
    filteredProducts.sort((a, b) => a.stockLeft - b.stockLeft);
  }

  const categories = Array.from(new Set(allSaleProducts.map((p) => p.category)));
  const sunglassProducts = allSaleProducts.filter((p) => p.category === "Sunglasses");
  const eyeglassProducts = allSaleProducts.filter((p) => p.category === "Eyeglasses");
  const computerGlassProducts = allSaleProducts.filter((p) => p.category === "Computer Glasses");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-accent/20 via-primary/10 to-accent/20 border-b border-border">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Flame className="w-8 h-8 text-accent" />
                  <span className="text-sm font-bold uppercase tracking-wider text-accent">
                    Current markdowns
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                  Save up to {Math.max(0, ...allSaleProducts.map((product) => product.discount))}%
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Explore frames with current catalog markdowns and limited available stock.
                </p>

                {/* Sale Stats */}
                <div className="flex flex-wrap gap-8 mb-8">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Items on Sale</p>
                    <p className="text-3xl font-bold text-foreground">{totalProducts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Savings</p>
                    <p className="text-3xl font-bold text-accent">{averageDiscount}% Off</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Savings Available</p>
                    <p className="text-3xl font-bold text-primary">
                      ${totalSavings.toFixed(0)}
                    </p>
                  </div>
                </div>

                <a href="#sale-items">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8">
                    Shop All Sale Items
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>

              {/* Countdown */}
              <div className="bg-card border-2 border-accent rounded-2xl p-8 text-center">
                <p className="text-muted-foreground text-sm mb-2 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Current deals
                </p>
                <p className="text-2xl font-bold text-foreground mb-2">{flashDeals.length} marked-down frames</p>
                <p className="text-xs text-muted-foreground">
                  Discounts and stock reflect the current catalog.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Flash Deals Carousel */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Flame className="w-8 h-8 text-accent" />
              Top Current Markdown
            </h2>
            <p className="text-muted-foreground">
              The most heavily discounted in-stock frames from the current catalog.
            </p>
          </div>

          {flashDeals.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {flashDeals.map((product) => (
                <div key={product.id} className="rounded-lg border-2 border-accent p-4">
                  <ProductCard {...product} />
                  {product.stockLeft <= 5 && <p className="mt-3 text-xs font-semibold text-danger">Only {product.stockLeft} left in stock.</p>}
                </div>
              ))}
            </div>
          ) : <p className="rounded-lg border border-border p-8 text-center text-muted-foreground">There are no marked-down products available right now.</p>}
        </section>

        {/* Filters & Sorting */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 bg-card border border-border rounded-lg p-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Discount Range</p>
              <Select value={discountFilter} onValueChange={setDiscountFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Discounts</SelectItem>
                  <SelectItem value="10-20">10% - 20% Off</SelectItem>
                  <SelectItem value="20-30">20% - 30% Off</SelectItem>
                  <SelectItem value="30-40">30% - 40% Off</SelectItem>
                  <SelectItem value="40-50">40% - 50% Off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Category</p>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-40">
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
              <p className="text-sm text-muted-foreground mb-2">Sort By</p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="highest-discount">Highest Discount</SelectItem>
                  <SelectItem value="lowest-price">Lowest Price</SelectItem>
                  <SelectItem value="stock-low">Limited Stock First</SelectItem>
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

        {/* All Sale Products */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-12">
          <h2 id="sale-items" className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            All Sale Items ({filteredProducts.length})
          </h2>

          {filteredProducts.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product) => (
                <div key={product.id}>
                  {viewMode === "grid" ? (
                    <div className="relative">
                      <ProductCard
                        {...product}
                        originalPrice={product.originalPrice}
                        discount={product.discount}
                      />
                      {product.stockLeft <= 3 && (
                        <div className="absolute top-24 left-3 right-3 bg-danger text-danger-foreground text-xs font-bold px-2 py-1 rounded z-10">
                          Only {product.stockLeft} left!
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-4 p-4 border border-border rounded-lg hover:border-primary">
                      <div className="w-32 h-32 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1 uppercase">
                          {product.category}
                        </p>
                        <h3 className="font-bold text-foreground mb-2">
                          {product.name}
                        </h3>
                        <div className="flex gap-4 mb-3">
                          <div>
                            <p className="text-2xl font-bold text-primary">
                              ${product.price}
                            </p>
                            <p className="text-xs text-muted-foreground line-through">
                              ${product.originalPrice}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <div className="px-3 py-1 bg-accent text-accent-foreground text-sm font-bold rounded">
                              -{product.discount}%
                            </div>
                            <div className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded">
                              Save ${(product.originalPrice - product.price).toFixed(0)}
                            </div>
                          </div>
                        </div>
                        {product.stockLeft <= 3 && (
                          <p className="text-xs font-bold text-danger mb-2">
                            Only {product.stockLeft} in stock!
                          </p>
                        )}
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No products found in this category with selected filters.
              </p>
            </div>
          )}
        </section>

        {/* Category Breakdown */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-12 border-t border-border">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Shop by Category
          </h2>

          <CategorySaleSection category="Sunglasses" products={sunglassProducts} />
          <CategorySaleSection category="Eyeglasses" products={eyeglassProducts} />
          <CategorySaleSection
            category="Computer Glasses"
            products={computerGlassProducts}
          />
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Still Looking for More?
              </h2>
              <p className="text-lg text-primary-foreground/90 mb-8">
                Check out our full collection of eyewear, including items not on sale.
              </p>
              <Link to="/shop">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-8">
                  Browse All Products
                  <ChevronRight className="w-5 h-5 ml-2" />
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
