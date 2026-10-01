import { Link } from "react-router-dom";
import { ArrowRight, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";

// Mock product data
const fallbackProducts = [
  {
    id: "1",
    name: "Classic Aviator",
    price: 199,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.8,
    reviews: 124,
    originalPrice: 249,
    discount: 20,
  },
  {
    id: "2",
    name: "Modern Round Frame",
    price: 179,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=500&h=500&fit=crop",
    category: "Eyeglasses",
    rating: 4.6,
    reviews: 89,
    isNew: true,
  },
  {
    id: "3",
    name: "Minimal Cat Eye",
    price: 149,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: "4",
    name: "Premium Blue Light",
    price: 159,
    image: "https://images.unsplash.com/photo-1508296695146-367ec3be0d35?w=500&h=500&fit=crop",
    category: "Computer Glasses",
    rating: 4.5,
    reviews: 67,
    isNew: true,
  },
  {
    id: "5",
    name: "Sports Performance",
    price: 249,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "Sports",
    rating: 4.9,
    reviews: 201,
    originalPrice: 299,
    discount: 17,
  },
  {
    id: "6",
    name: "Elegant Rectangle",
    price: 189,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Eyeglasses",
    rating: 4.4,
    reviews: 45,
  },
];

// Category definitions
const categories = [
  {
    id: "sunglasses",
    name: "Sunglasses",
    description: "Protect your eyes in style with our premium collection of sunglasses.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop",
    icon: "☀️",
    href: "/categories/sunglasses",
  },
  {
    id: "eyeglasses",
    name: "Eyeglasses",
    description: "Premium optical frames for everyday wear from top designers.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=600&h=400&fit=crop",
    icon: "👓",
    href: "/categories/eyeglasses",
  },
  {
    id: "blue-light",
    name: "Blue Light Glasses",
    description: "Reduce screen fatigue with our blue light filtering collection.",
    image: "https://images.unsplash.com/photo-1508296695146-367ec3be0d35?w=600&h=400&fit=crop",
    icon: "💻",
    href: "/categories/blue-light",
  },
  {
    id: "sports",
    name: "Sports Eyewear",
    description: "Performance eyewear designed for athletes and active lifestyles.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop",
    icon: "⚽",
    href: "/categories/sports",
  },
];

// Subcategories
const subcategories = [
  { name: "Aviator", href: "/shop?style=aviator" },
  { name: "Cat Eye", href: "/shop?style=cat-eye" },
  { name: "Round Frame", href: "/shop?style=round" },
  { name: "Wayfarer", href: "/shop?style=wayfarer" },
  { name: "Oversized", href: "/shop?style=oversized" },
  { name: "Rectangle", href: "/shop?style=rectangle" },
  { name: "Square", href: "/shop?style=square" },
  { name: "Shield", href: "/shop?style=shield" },
];

export default function Categories() {
  const { products } = useProducts(fallbackProducts);
  const brands = Array.from(new Set(products.map((product) => product.brand).filter(Boolean))) as string[];

  const getProductsForCategory = (categoryId: string) =>
    products.filter((product) => {
      const productCategory = product.category.toLowerCase();
      const lensType = product.lensType?.toLowerCase() || "";
      if (categoryId === "blue-light") {
        return productCategory.includes("computer") || lensType.includes("blue light");
      }
      return productCategory.includes(categoryId);
    });

  const getFeaturedProducts = (categoryId: string) =>
    getProductsForCategory(categoryId).slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b border-border">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Browse by Category
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our carefully curated collections of premium eyewear tailored to your lifestyle and needs.
            </p>
          </div>
        </section>

        {/* Main Categories Grid */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.href}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl bg-muted aspect-video mb-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl">{category.icon}</span>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-6 border border-border group-hover:border-primary group-hover:shadow-lg transition-all">
                  <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">
                      {getProductsForCategory(category.id).length} products
                    </span>
                    <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured by Category */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-12">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured in Each Category
            </h2>
            <p className="text-muted-foreground">
              Handpicked bestsellers and customer favorites
            </p>
          </div>

          <div className="space-y-16">
            {categories.map((category) => {
              const featured = getFeaturedProducts(category.id);
              if (featured.length === 0) return null;

              return (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                        <span>{category.icon}</span>
                        {category.name}
                      </h3>
                    </div>
                    <Link to={category.href}>
                      <Button variant="outline">
                        View All
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {featured.map((product) => (
                      <ProductCard key={product.id} {...product} />
                    ))}
                  </div>

                  <div className="border-t border-border mt-16" />
                </div>
              );
            })}
          </div>
        </section>

        {/* Frame Styles Section */}
        <section className="bg-muted py-12">
          <div className="container mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Shop by Frame Style
              </h2>
              <p className="text-muted-foreground">
                Find your perfect frame shape
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {subcategories.map((style) => (
                <Link
                  key={style.name}
                  to={style.href}
                  className="group"
                >
                  <div className="bg-card border border-border rounded-lg p-6 group-hover:border-primary group-hover:shadow-md transition-all">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      {style.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Search available {style.name.toLowerCase()} frames
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-12">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Shop by Brand
            </h2>
            <p className="text-muted-foreground">
              Explore collections from premium designers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand}
                to={`/shop?brand=${encodeURIComponent(brand.toLowerCase())}`}
                className="group"
              >
                <div className="bg-card border border-border rounded-lg p-6 text-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {brand}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Material Filter Section */}
        <section className="bg-primary/5 border-y border-border py-12">
          <div className="container mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Filter by Frame Material
              </h2>
              <p className="text-muted-foreground">
                Choose the perfect material for your style and comfort
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Metal", icon: "🔩" },
                { name: "Acetate", icon: "🎨" },
                { name: "Titanium", icon: "💪" },
                { name: "Mixed Material", icon: "🎭" },
              ].map((material) => (
                <Link
                  key={material.name}
                  to={`/shop?material=${material.name.toLowerCase()}`}
                  className="group"
                >
                  <div className="bg-card border border-border rounded-lg p-6 text-center group-hover:border-primary group-hover:shadow-md transition-all">
                    <div className="text-3xl mb-3">{material.icon}</div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {material.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Lens Type Section */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-12">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Shop by Lens Type
            </h2>
            <p className="text-muted-foreground">
              Find the right lenses for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "UV Protection",
                description: "Block harmful UV rays",
                href: "/shop?lens=uv",
              },
              {
                name: "Polarized",
                description: "Reduce glare and reflections",
                href: "/shop?lens=polarized",
              },
              {
                name: "Blue Light Filter",
                description: "Reduce screen eye strain",
                href: "/shop?lens=blue-light",
              },
              {
                name: "Photochromic",
                description: "Light-adaptive lenses",
                href: "/shop?lens=photochromic",
              },
            ].map((lensType) => (
              <Link key={lensType.name} to={lensType.href} className="group">
                <div className="bg-card border border-border rounded-lg p-6 group-hover:border-primary group-hover:shadow-lg transition-all">
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {lensType.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {lensType.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Our expert opticians are here to help you find the perfect eyewear for your unique style and vision needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-8">
                    Contact Our Experts
                  </Button>
                </Link>
                <Link to="/shop">
                  <Button
                    variant="outline"
                    className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary h-12 px-8"
                  >
                    Browse All Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
