import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Sparkles,
  ShoppingBag,
  Truck,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";

// Mock product data
const fallbackFeaturedProducts = [
  {
    id: "1",
    name: "Classic Aviator",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.8,
    reviews: 124,
    isNew: false,
    originalPrice: 249,
    discount: 20,
  },
  {
    id: "2",
    name: "Modern Round Frame",
    price: 179,
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=500&h=500&fit=crop",
    category: "Eyeglasses",
    rating: 4.6,
    reviews: 89,
    isNew: true,
  },
  {
    id: "3",
    name: "Minimal Cat Eye",
    price: 149,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.7,
    reviews: 156,
    isNew: false,
  },
  {
    id: "4",
    name: "Premium Blue Light",
    price: 159,
    image:
      "https://images.unsplash.com/photo-1508296695146-367ec3be0d35?w=500&h=500&fit=crop",
    category: "Computer Glasses",
    rating: 4.5,
    reviews: 67,
    isNew: true,
  },
];

const categories = [
  {
    name: "Sunglasses",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop",
    href: "/categories/sunglasses",
  },
  {
    name: "Eyeglasses",
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=300&h=300&fit=crop",
    href: "/categories/eyeglasses",
  },
  {
    name: "Blue Light",
    image:
      "https://images.unsplash.com/photo-1508296695146-367ec3be0d35?w=300&h=300&fit=crop",
    href: "/categories/blue-light",
  },
  {
    name: "Sports",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    href: "/categories/sports",
  },
];

const brands = [
  { name: "Ray-Ban", logo: "RB" },
  { name: "Oakley", logo: "OA" },
  { name: "Warby Parker", logo: "WP" },
  { name: "Prada", logo: "PR" },
  { name: "Gucci", logo: "GU" },
  { name: "Chanel", logo: "CH" },
];

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $100",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: ShoppingBag,
    title: "Premium Quality",
    description: "Authentic designer frames",
  },
  {
    icon: Sparkles,
    title: "Expert Support",
    description: "Chat with our opticians",
  },
];

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const { products } = useProducts(fallbackFeaturedProducts);
  const featuredProducts = products.slice(0, 4);

  const handleNewsletterSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newsletterLoading || !newsletterEmail.trim()) return;

    setNewsletterLoading(true);
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Subscription failed");
      toast.success(data.message || "Thanks for subscribing!");
      setNewsletterEmail("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to subscribe right now.");
    } finally {
      setNewsletterLoading(false);
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (query) navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const searchPopularStyle = (style: string) => {
    navigate(`/search?q=${encodeURIComponent(style)}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                  See the World in Style
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                  Discover our curated collection of premium eyewear from the
                  world's finest designers. Premium quality, affordable prices.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link to="/shop">
                    <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base">
                      Shop Now
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/shop">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto h-12 px-8 text-base"
                    >
                      Explore Collection
                    </Button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-4 md:gap-6 text-xs md:text-sm">
                  {["5,000+ Happy Customers", "30-Day Returns", "Certified Sellers"].map(
                    (badge) => (
                      <div key={badge} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span>{badge}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop"
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-12">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="search"
              placeholder="Search for frames, brands, or styles..."
              className="w-full pl-12 pr-4 h-14 text-base rounded-lg"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Popular:</span>
            {["Aviator", "Cat Eye", "Round Frame", "Square Frame"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => searchPopularStyle(tag)}
                className="px-3 py-1 bg-muted text-foreground rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-12">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Shop by Category
            </h2>
            <p className="text-muted-foreground">
              Find the perfect pair for your needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="group relative overflow-hidden rounded-lg aspect-square"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-end p-4">
                  <h3 className="text-white font-semibold text-lg">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-12">
          <div className="mb-12">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Featured Collection
                </h2>
                <p className="text-muted-foreground">
                  Hand-picked frames loved by thousands
                </p>
              </div>
              <Link to="/shop" className="hidden md:inline-block">
                <Button variant="outline">
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="mt-8 md:hidden flex justify-center">
            <Link to="/shop">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                View All Products
              </Button>
            </Link>
          </div>
        </section>

        {/* Brands Section */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            Trusted Brands
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center justify-center p-6 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {brand.logo}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {brand.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-primary text-primary-foreground my-12">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Never Miss a Trend
              </h2>
              <p className="text-primary-foreground/90 mb-8">
                Subscribe to our newsletter for exclusive offers, new arrivals,
                and eyewear tips.
              </p>

              <form
                onSubmit={handleNewsletterSubscribe}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-primary-foreground text-foreground placeholder:text-muted-foreground"
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  required
                />
                <Button
                  className="bg-accent text-accent-foreground hover:bg-accent/90 px-8"
                  type="submit"
                  disabled={newsletterLoading}
                >
                  {newsletterLoading ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>

              <p className="text-xs text-primary-foreground/75 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Preview Section */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-12">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              From Our Blog
            </h2>
            <p className="text-muted-foreground">
              Expert tips and trends in eyewear
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                slug: "choose-sunglasses",
                title: "How to Choose the Right Sunglasses",
                excerpt:
                  "Find a comfortable frame shape and understand the lens features that matter for everyday sun protection.",
                image:
                  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
                date: "June 12, 2025",
              },
              {
                slug: "blue-light-lenses",
                title: "A Practical Guide to Blue-Light Lenses",
                excerpt:
                  "Understand lens options, screen habits, and ways to find a comfortable setup.",
                image:
                  "https://images.unsplash.com/photo-1508296695146-367ec3be0d35?w=400&h=300&fit=crop",
                date: "June 5, 2025",
              },
              {
                slug: "frame-care",
                title: "Keep Your Frames Looking Their Best",
                excerpt: "Simple cleaning and storage habits help protect your frames and lenses.",
                image:
                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
                date: "May 28, 2025",
              },
            ].map((article) => (
              <Link key={article.title} to={`/article/${article.slug}`} className="group">
                <div className="rounded-lg overflow-hidden mb-4 bg-muted aspect-video flex items-center justify-center">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {article.date}
                </p>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link to="/blog">
              <Button variant="outline">
                Read All Articles
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
