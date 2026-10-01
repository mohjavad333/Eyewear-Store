import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  AlertCircle,
  Truck,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

// Recommended products for empty cart
const recommendedProducts = [
  {
    id: "7",
    name: "Vintage Wayfarer",
    price: 179,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.6,
    reviews: 98,
  },
  {
    id: "9",
    name: "Luxury Oversized",
    price: 299,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "Sunglasses",
    rating: 4.8,
    reviews: 142,
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
  },
];

const shippingCosts: Record<string, number> = {
  standard: 10,
  express: 25,
  overnight: 45,
};

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const {
    items,
    updateQuantity,
    removeItem,
    updateShipping,
    shippingMethod: savedShippingMethod,
    giftWrap,
    coupon,
    couponDiscount,
  } = useCart();
  const shippingMethod = savedShippingMethod || "standard";
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = shippingCosts[shippingMethod];
  const giftWrapCost = giftWrap ? 5 : 0;
  const discount = couponDiscount;
  const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
  const total = subtotal + shipping + giftWrapCost + tax - discount;

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number,
    variant?: string
  ) => {
    try {
      await updateQuantity(productId, newQuantity, variant);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (productId: string, variant?: string) => {
    try {
      await removeItem(productId, variant);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleShippingChange = async (method: string) => {
    try {
      await updateShipping(method, giftWrap, coupon);
    } catch (error) {
      console.error("Failed to update shipping:", error);
    }
  };

  const handleGiftWrapChange = async (checked: boolean) => {
    try {
      await updateShipping(shippingMethod, checked, coupon);
    } catch (error) {
      console.error("Failed to update gift wrap:", error);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    setCouponError("");
    try {
      await updateShipping(shippingMethod, giftWrap, couponCode);
      setCouponCode("");
    } catch (error) {
      setCouponError(error instanceof Error ? error.message : "Unable to apply promotion");
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <ShoppingBag className="w-16 h-16 text-muted-foreground opacity-50" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Looks like you haven't added any items yet. Explore our collection and find the perfect eyewear for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8">
                    Continue Shopping
                  </Button>
                </Link>
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
              You Might Like
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
        <section className="bg-primary/5 border-b border-border">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Shopping Cart
            </h1>
            <p className="text-muted-foreground mt-2">
              {items.length} item{items.length !== 1 ? "s" : ""} in your cart
            </p>
          </div>
        </section>

        {/* Cart Content */}
        <div className="container mx-auto max-w-7xl px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                {/* Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-muted border-b border-border font-semibold text-sm">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-3 text-right">Total</div>
                </div>

                {/* Items */}
                <div className="divide-y divide-border">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variant}`}
                      className="p-4 grid grid-cols-1 md:grid-cols-12 md:gap-4 md:items-center"
                    >
                      {/* Product Info */}
                      <div className="md:col-span-5 flex gap-4 mb-4 md:mb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                        <div>
                          <h3 className="font-semibold text-foreground">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.variant}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-2 flex items-center justify-between md:justify-center mb-4 md:mb-0">
                        <span className="text-sm text-muted-foreground md:hidden">Qty:</span>
                        <div className="flex items-center gap-2 border border-border rounded-lg p-1">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                Math.max(1, item.quantity - 1),
                                item.variant
                              )
                            }
                            className="p-1 hover:bg-muted rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.productId, item.quantity + 1, item.variant)
                            }
                            className="p-1 hover:bg-muted rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="md:col-span-2 text-right mb-4 md:mb-0">
                        <span className="md:hidden text-sm text-muted-foreground">Price: </span>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>

                      {/* Total & Remove */}
                      <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-4">
                        <p className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.productId, item.variant)}
                          className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link to="/shop">
                  <Button variant="outline" className="w-full md:w-auto">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24 space-y-6">
                <h2 className="text-lg font-bold text-foreground">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 border-b border-border pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Shipping</p>
                    <div className="space-y-2">
                      {Object.entries(shippingCosts).map(([method, cost]) => (
                        <label key={method} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="shipping"
                            value={method}
                            checked={shippingMethod === method}
                            onChange={(e) => handleShippingChange(e.target.value)}
                            className="w-4 h-4"
                          />
                          <span className="text-xs text-foreground flex-1 capitalize">
                            {method === "standard"
                              ? "Standard (5-7 days)"
                              : method === "express"
                              ? "Express (2-3 days)"
                              : "Overnight"}
                          </span>
                          <span className="text-xs font-medium text-foreground">
                            ${cost.toFixed(2)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Gift Wrap */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="gift-wrap"
                      checked={giftWrap}
                      onCheckedChange={(checked) => handleGiftWrapChange(checked as boolean)}
                    />
                    <Label htmlFor="gift-wrap" className="text-xs cursor-pointer">
                      Gift wrap (+$5)
                    </Label>
                  </div>
                </div>

                {/* Coupon */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="text-xs"
                      disabled={!!coupon}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={applyCoupon}
                      disabled={!!coupon || !couponCode.trim()}
                    >
                      {coupon ? "Applied" : "Apply"}
                    </Button>
                  </div>
                  {coupon && (
                    <p className="text-xs text-success flex items-center gap-1">
                      ✓ {coupon} applied
                    </p>
                  )}
                  {couponError && <p className="text-xs text-danger">{couponError}</p>}
                  <p className="text-xs text-muted-foreground">
                    Enter an active promotion code from our current offers.
                  </p>
                </div>

                {/* Discount */}
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                {/* Tax */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium text-foreground">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                {/* Total */}
                <div className="bg-primary/5 border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                {isAuthenticated ? (
                  <Link to="/checkout">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12">
                      Proceed to Checkout
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login?redirect=/checkout">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12">
                      Login to Checkout
                    </Button>
                  </Link>
                )}

                {/* Trust Badges */}
                <div className="space-y-3 text-center text-xs text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Secure checkout
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Truck className="w-4 h-4" />
                    Free returns on orders over $100
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mt-8 bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm mb-1">
                Free shipping on orders over $100!
              </p>
              <p className="text-xs text-muted-foreground">
                Add ${Math.max(0, 100 - subtotal).toFixed(2)} more to your order to qualify for free standard shipping.
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        {items.length > 0 && (
          <section className="container mx-auto max-w-7xl px-4 md:px-8 py-12 border-t border-border mt-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              You Might Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} {...product} isNew={false} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
