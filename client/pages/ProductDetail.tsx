import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
  Check,
  ChevronLeft,
  Share2,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { useProducts } from "@/hooks/use-products";
import ProductCard from "@/components/ProductCard";

// Mock detailed product data
const productDatabase: Record<string, any> = {
  "1": {
    id: "1",
    name: "Classic Aviator",
    price: 199,
    originalPrice: 249,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop&blend=https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&blend-mode=overlay",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
    ],
    category: "Sunglasses",
    brand: "Ray-Ban",
    material: "Metal",
    color: "Gold",
    gender: "Unisex",
    lensType: "UV Protection",
    frameSize: "Large",
    description:
      "Timeless Classic Aviator sunglasses featuring premium UV protection and durable metal construction. Perfect for everyday wear with a sophisticated edge.",
    details: [
      "100% UV Protection (UVA/UVB)",
      "Impact-resistant lenses",
      "Adjustable nose pads",
      "Premium metal frame",
      "Lightweight titanium",
      "Anti-glare coating",
    ],
    specs: {
      "Frame Material": "Titanium Alloy",
      "Lens Material": "Polycarbonate",
      "Lens Type": "Polarized & UV400",
      "Width": "140mm",
      "Height": "50mm",
      "Bridge": "18mm",
      "Weight": "28g",
      "Country of Origin": "Italy",
    },
    stock: 15,
    inStock: true,
    colors: [
      { name: "Gold", hex: "#FFD700" },
      { name: "Silver", hex: "#C0C0C0" },
      { name: "Black", hex: "#000000" },
    ],
    sizes: ["Small", "Medium", "Large"],
    shippingOptions: [
      { name: "Standard (5-7 days)", price: 10, days: "5-7" },
      { name: "Express (2-3 days)", price: 25, days: "2-3" },
      { name: "Overnight", price: 45, days: "Next day" },
    ],
    warranty: "2-Year Premium Warranty",
    returnPolicy: "30-Day Money Back Guarantee",
  },
  "2": {
    id: "2",
    name: "Modern Round Frame",
    price: 179,
    rating: 4.6,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=800&h=800&fit=crop",
    ],
    category: "Eyeglasses",
    brand: "Warby Parker",
    material: "Acetate",
    color: "Black",
    gender: "Unisex",
    lensType: "Blue Light Filter",
    frameSize: "Medium",
    description:
      "Stylish round-frame eyeglasses with blue light filtering technology. Ideal for digital screen users looking for comfort and style.",
    details: [
      "Blue Light Filtering Lenses",
      "Acetate frame construction",
      "Anti-glare coating",
      "Lightweight design",
      "Comfortable fit",
      "Includes protective case",
    ],
    specs: {
      "Frame Material": "Acetate",
      "Lens Type": "Blue Light Filter",
      "Width": "145mm",
      "Height": "48mm",
      "Bridge": "20mm",
      "Weight": "32g",
    },
    stock: 22,
    inStock: true,
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Tortoise", hex: "#8B4513" },
      { name: "Crystal", hex: "#E0E0E0" },
    ],
    sizes: ["Small", "Medium", "Large"],
    shippingOptions: [
      { name: "Standard (5-7 days)", price: 10, days: "5-7" },
      { name: "Express (2-3 days)", price: 25, days: "2-3" },
    ],
    warranty: "1-Year Standard Warranty",
    returnPolicy: "30-Day Money Back Guarantee",
  },
  "3": {
    id: "3",
    name: "Minimal Cat Eye",
    price: 149,
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
    ],
    category: "Sunglasses",
    brand: "Gucci",
    material: "Acetate",
    color: "Tortoise",
    gender: "Women",
    lensType: "Polarized",
    frameSize: "Small",
    description:
      "Elegant cat-eye sunglasses with a sophisticated tortoise pattern. Features premium polarized lenses for enhanced visual clarity.",
    details: [
      "Polarized lenses reduce glare",
      "100% UV protection",
      "Acetate frame",
      "Fashion-forward design",
      "Lightweight and durable",
      "Perfect for sun protection",
    ],
    specs: {
      "Frame Material": "Acetate",
      "Lens Type": "Polarized",
      "Width": "135mm",
      "Height": "52mm",
      "Bridge": "17mm",
      "Weight": "24g",
    },
    stock: 8,
    inStock: true,
    colors: [
      { name: "Tortoise", hex: "#8B4513" },
      { name: "Black", hex: "#000000" },
      { name: "Rose Gold", hex: "#B76E79" },
    ],
    sizes: ["Small", "Medium"],
    shippingOptions: [
      { name: "Standard (5-7 days)", price: 10, days: "5-7" },
      { name: "Express (2-3 days)", price: 25, days: "2-3" },
    ],
    warranty: "2-Year Premium Warranty",
    returnPolicy: "30-Day Money Back Guarantee",
  },
};

const fallbackProducts = Object.values(productDatabase);

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isSaved } = useWishlist();
  const { products: catalogProducts } = useProducts(fallbackProducts);
  const productId = id || "1";
  const fallbackProduct = productDatabase[productId];
  const [product, setProduct] = useState(fallbackProduct);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [productLoading, setProductLoading] = useState(true);
  const isFavorite = product ? isSaved(product.id) : false;
  const [selectedShipping, setSelectedShipping] = useState(0);

  useEffect(() => {
    let active = true;

    setProduct(fallbackProduct);
    setProductLoading(true);
    fetch(`/api/products/${productId}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Product unavailable");
        return response.json();
      })
      .then((data) => {
        if (active && data.product) {
          setProduct((current: any) => ({
            ...(current || {}),
            ...data.product,
            id: data.product.productId,
            stock: data.product.stock,
            inStock: data.product.inStock,
          }));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) {
          setSelectedColor(fallbackProduct?.colors?.[0]?.name || "");
          setSelectedSize(fallbackProduct?.sizes?.[0] || "");
          setQuantity(1);
          setProductLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [productId]);

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      if (isFavorite) {
        await removeWishlistItem(product.id);
      } else {
        await addWishlistItem({
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          category: product.category,
          rating: product.rating,
          reviews: product.reviews,
          discount,
          inStock: product.inStock,
          stockCount: product.stock,
        });
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied.");
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        toast.error("Unable to share this product right now.");
      }
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    await addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      quantity,
      variant: [selectedColor, selectedSize].filter(Boolean).join(" / ") || undefined,
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{productLoading ? "Loading product…" : "Product not found"}</h1>
            {!productLoading && <Link to="/shop"><Button>Back to Shop</Button></Link>}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const relatedProducts = catalogProducts
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-foreground transition-colors">
              Shop
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl bg-muted aspect-square flex items-center justify-center">
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-danger text-white px-4 py-2 rounded-full font-semibold">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative overflow-hidden rounded-lg aspect-square border-2 transition-all ${
                      selectedImage === idx
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-primary mb-2">{product.brand}</p>
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{product.name}</h1>
                </div>
                <button
                  onClick={handleFavorite}
                  aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <Heart
                    size={24}
                    className={isFavorite ? "fill-danger text-danger" : "text-muted-foreground"}
                  />
                </button>
              </div>

              {/* Rating */}
              {product.rating !== undefined && product.reviews !== undefined && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{product.description || `${product.category} frame by ${product.brand || "Optics"}. Review the product specifications below for available details.`}</p>
            </div>

            {/* Selectors */}
            <div className="space-y-4 py-4 border-y border-border">
              {/* Color Selection */}
              {product.colors?.length > 0 && <div>
                <label className="text-sm font-semibold block mb-3">Color</label>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color: any) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`group relative w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? "border-foreground"
                          : "border-border hover:border-foreground/50"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check size={20} className="absolute inset-0 m-auto text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="text-sm font-semibold block mb-3">Size</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((size: string) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="text-sm font-semibold block mb-3">Quantity</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    −
                  </button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                  <span className="text-sm text-muted-foreground ml-2">({product.stock} in stock)</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!product.inStock || product.stock < 1}>
                <ShoppingCart className="mr-2" size={20} />
                {product.inStock && product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button size="lg" variant="outline" onClick={handleShare} aria-label="Share product">
                <Share2 size={20} />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="space-y-2 py-4 border-y border-border">
              <div className="flex items-start gap-3">
                <Check size={20} className="text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">{product.warranty || "Warranty details"}</p>
                  <p className="text-xs text-muted-foreground">Contact support for warranty information.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">{product.returnPolicy || "Returns information"}</p>
                  <p className="text-xs text-muted-foreground">Review our returns terms or contact support for assistance.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck size={20} className="text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Free Shipping on Orders $100+</p>
                  <p className="text-xs text-muted-foreground">Fast & reliable delivery</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw size={20} className="text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">Pre-paid shipping labels included</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Tabs Section */}
      <div className="border-t border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Product Highlights</h3>
                <ul className="space-y-3">
                  {(product.details?.length ? product.details : [
                    product.category,
                    product.brand && `Brand: ${product.brand}`,
                    product.material && `Frame material: ${product.material}`,
                    product.lensType && `Lens type: ${product.lensType}`,
                  ].filter(Boolean)).map((detail: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check size={20} className="text-success flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specs" className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(product.specs || {
                    Category: product.category,
                    Brand: product.brand || "Not specified",
                    Material: product.material || "Not specified",
                    Color: product.color || "Not specified",
                    Lens: product.lensType || "Not specified",
                    Size: product.frameSize || "Not specified",
                  }).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">{key}</p>
                      <p className="text-foreground">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Shipping Tab */}
            <TabsContent value="shipping" className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Shipping Options</h3>
                <div className="space-y-3">
                  {product.shippingOptions?.map((option: any, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedShipping(idx)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedShipping === idx
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{option.name}</p>
                          <p className="text-sm text-muted-foreground">Delivery in {option.days}</p>
                        </div>
                        <p className="font-semibold">
                          {option.price === 0 ? "FREE" : `$${option.price}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Return Policy</h3>
                <p className="text-foreground/80 mb-3">
                  We offer a hassle-free return policy for all products. If you're not completely
                  satisfied with your purchase, you can return it within 30 days for a full
                  refund or exchange.
                </p>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>• Original condition with all packaging</li>
                  <li>• Pre-paid return shipping included</li>
                  <li>• Free exchanges on sizing issues</li>
                  <li>• No questions asked refund policy</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 border-t border-border/50">
        <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {relatedProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              id={prod.id}
              name={prod.name}
              price={prod.price}
              originalPrice={prod.originalPrice}
              image={prod.image}
              category={prod.category}
              rating={prod.rating}
              reviews={prod.reviews}
              discount={
                prod.originalPrice
                  ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                  : 0
              }
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
