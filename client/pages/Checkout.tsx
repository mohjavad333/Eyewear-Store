import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Check,
  Lock,
  Truck,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { OrderCreationResult, useOrder } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const shippingMethods = [
  { id: "standard", name: "Standard Shipping", description: "5-7 business days", price: 10 },
  { id: "express", name: "Express Shipping", description: "2-3 business days", price: 25 },
  { id: "overnight", name: "Overnight Shipping", description: "Next business day", price: 45 },
];

const paymentMethods = [
  { id: "credit", name: "Credit Card", icon: "💳" },
  { id: "paypal", name: "PayPal", icon: "🅿" },
  { id: "apple", name: "Apple Pay", icon: "🍎" },
  { id: "google", name: "Google Pay", icon: "🔵" },
];

type Step = "cart" | "shipping" | "payment" | "confirmation";

export default function Checkout() {
  const { isAuthenticated } = useAuth();
  const {
    items: cartItems,
    loading: cartLoading,
    updateQuantity,
    removeItem,
    clearCart,
    shippingMethod: savedShippingMethod,
    giftWrap,
    coupon,
    couponDiscount,
    updateShipping,
  } = useCart();
  const { createOrder } = useOrder();
  const [currentStep, setCurrentStep] = useState<Step>("cart");
  const shippingMethod = savedShippingMethod || "standard";
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderId, setOrderId] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<OrderCreationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "USA",
  });

  const [cardInfo, setCardInfo] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = couponDiscount;
  const shipping = shippingMethods.find((m) => m.id === shippingMethod)?.price || 10;
  const giftWrapCost = giftWrap ? 5 : 0;
  const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
  const total = subtotal - discount + shipping + giftWrapCost + tax;
  const confirmationSubtotal = confirmedOrder?.subtotal ?? subtotal;
  const confirmationDiscount = confirmedOrder?.discount ?? discount;
  const confirmationCoupon = confirmedOrder?.coupon ?? coupon;
  const confirmationShipping = confirmedOrder?.shippingCost ?? shipping;
  const confirmationGiftWrap = confirmedOrder?.giftWrapCost ?? giftWrapCost;
  const confirmationTax = confirmedOrder?.tax ?? tax;
  const confirmationTotal = confirmedOrder?.total ?? total;
  const confirmationShippingMethod = confirmedOrder?.shippingMethod ?? shippingMethod;

  const handleUpdateQuantity = async (productId: string, quantity: number, variant?: string) => {
    await updateQuantity(productId, Math.max(0, quantity), variant);
  };

  const handleRemoveItem = async (productId: string, variant?: string) => {
    await removeItem(productId, variant);
  };

  const handleShippingAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress({ ...shippingAddress, [field]: value });
  };

  const handleCardInfoChange = (field: string, value: string) => {
    setCardInfo({ ...cardInfo, [field]: value });
  };

  const handleShippingMethodChange = async (method: string) => {
    setSubmitError("");
    try {
      await updateShipping(method, giftWrap, coupon);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to update shipping options.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || cartItems.length === 0 || isSubmitting) return;

    setSubmitError("");
    setIsSubmitting(true);

    try {
      await updateShipping(shippingMethod, giftWrap, coupon);
      const order = await createOrder({ shippingAddress, paymentMethod });

      setConfirmedOrder(order);
      setOrderId(order.id);
      setOrderNumber(order.orderNumber);
      await clearCart();
      setCurrentStep("confirmation");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We couldn't place your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isShippingComplete =
    shippingAddress.firstName &&
    shippingAddress.lastName &&
    shippingAddress.email &&
    shippingAddress.phone &&
    shippingAddress.address &&
    shippingAddress.city &&
    shippingAddress.state &&
    shippingAddress.zip;

  const isPaymentComplete =
    paymentMethod === "credit"
      ? cardInfo.cardholderName && cardInfo.cardNumber && cardInfo.expiryDate && cardInfo.cvv
      : true;

  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: "cart", label: "Cart Review", icon: "🛍️" },
    { id: "shipping", label: "Shipping", icon: "📦" },
    { id: "payment", label: "Payment", icon: "💳" },
    { id: "confirmation", label: "Order Confirmed", icon: "✓" },
  ];

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

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
            <Link to="/cart" className="hover:text-foreground transition-colors">
              Cart
            </Link>
            <span>/</span>
            <span className="text-foreground">Checkout</span>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  onClick={() => idx <= stepIndex && setCurrentStep(step.id)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold cursor-pointer transition-all ${
                    idx < stepIndex
                      ? "bg-success text-white"
                      : idx === stepIndex
                        ? "bg-primary text-white ring-2 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {idx < stepIndex ? <Check size={20} /> : idx + 1}
                </div>
                <div className="ml-3 flex-1">
                  <p
                    className={`font-semibold text-sm ${
                      idx <= stepIndex ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 ${
                      idx < stepIndex ? "bg-success" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            {/* Cart Review Step */}
            {currentStep === "cart" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Order Review</h2>
                  <div className="space-y-4">
                    {!isAuthenticated ? (
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-sm text-foreground mb-3">Sign in to load your saved cart and continue checkout.</p>
                        <Link to="/login">
                          <Button variant="outline">Sign In</Button>
                        </Link>
                      </div>
                    ) : cartLoading ? (
                      <p className="text-muted-foreground">Loading your saved cart...</p>
                    ) : cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <div
                          key={`${item.productId}-${item.variant}`}
                          className="flex gap-4 p-4 border border-border rounded-lg hover:border-border/75 transition-colors"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.variant}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 justify-end mb-2">
                              <button
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1, item.variant)}
                                className="px-2 py-1 hover:bg-muted rounded transition-colors"
                              >
                                −
                              </button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1, item.variant)}
                                className="px-2 py-1 hover:bg-muted rounded transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                            <button
                              onClick={() => handleRemoveItem(item.productId, item.variant)}
                              className="text-xs text-danger hover:underline mt-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">Your cart is empty</p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => setCurrentStep("shipping")}
                  className="w-full"
                  size="lg"
                  disabled={cartItems.length === 0}
                >
                  Continue to Shipping
                  <ChevronRight className="ml-2" size={20} />
                </Button>
              </div>
            )}

            {/* Shipping Step */}
            {currentStep === "shipping" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Input
                      placeholder="First Name"
                      value={shippingAddress.firstName}
                      onChange={(e) =>
                        handleShippingAddressChange("firstName", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Last Name"
                      value={shippingAddress.lastName}
                      onChange={(e) => handleShippingAddressChange("lastName", e.target.value)}
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      className="col-span-2"
                      value={shippingAddress.email}
                      onChange={(e) => handleShippingAddressChange("email", e.target.value)}
                    />
                    <Input
                      placeholder="Phone Number"
                      type="tel"
                      className="col-span-2"
                      value={shippingAddress.phone}
                      onChange={(e) => handleShippingAddressChange("phone", e.target.value)}
                    />
                    <Input
                      placeholder="Street Address"
                      className="col-span-2"
                      value={shippingAddress.address}
                      onChange={(e) => handleShippingAddressChange("address", e.target.value)}
                    />
                    <Input
                      placeholder="City"
                      value={shippingAddress.city}
                      onChange={(e) => handleShippingAddressChange("city", e.target.value)}
                    />
                    <Input
                      placeholder="State"
                      value={shippingAddress.state}
                      onChange={(e) => handleShippingAddressChange("state", e.target.value)}
                    />
                    <Input
                      placeholder="ZIP Code"
                      value={shippingAddress.zip}
                      onChange={(e) => handleShippingAddressChange("zip", e.target.value)}
                    />
                    <Select value={shippingAddress.country} onValueChange={(v) => handleShippingAddressChange("country", v)}>
                      <SelectTrigger className="col-span-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USA">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Mexico">Mexico</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">Shipping Method</h3>
                  <div className="space-y-3 mb-6">
                    {shippingMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => handleShippingMethodChange(method.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          shippingMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Truck size={20} className="text-primary" />
                            <div>
                              <p className="font-semibold">{method.name}</p>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-lg">
                            ${method.price === 0 ? "FREE" : method.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep("cart")} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep("payment")}
                    className="flex-1"
                    disabled={!isShippingComplete}
                  >
                    Continue to Payment
                    <ChevronRight className="ml-2" size={20} />
                  </Button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {currentStep === "payment" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 border rounded-lg transition-all flex items-center justify-center gap-2 font-semibold ${
                          paymentMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span>{method.icon}</span>
                        <span className="text-sm">{method.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {paymentMethod === "credit" && (
                  <div>
                    <h3 className="text-lg font-bold mb-4">Card Details</h3>
                    <div className="space-y-4 mb-6">
                      <Input
                        placeholder="Cardholder Name"
                        value={cardInfo.cardholderName}
                        onChange={(e) => handleCardInfoChange("cardholderName", e.target.value)}
                      />
                      <Input
                        placeholder="Card Number"
                        value={cardInfo.cardNumber}
                        onChange={(e) => handleCardInfoChange("cardNumber", e.target.value)}
                        maxLength={19}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="MM/YY"
                          value={cardInfo.expiryDate}
                          onChange={(e) => handleCardInfoChange("expiryDate", e.target.value)}
                        />
                        <Input
                          placeholder="CVV"
                          value={cardInfo.cvv}
                          onChange={(e) => handleCardInfoChange("cvv", e.target.value)}
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod !== "credit" && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-foreground/70">
                      You will be redirected to {paymentMethods.find((m) => m.id === paymentMethod)?.name} to complete your payment securely.
                    </p>
                  </div>
                )}

                <div className="p-4 bg-success/10 border border-success/20 rounded-lg flex gap-3">
                  <Lock size={20} className="text-success flex-shrink-0" />
                  <p className="text-sm">
                    Your payment information is encrypted and secure. We use industry-standard SSL
                    encryption.
                  </p>
                </div>

                {submitError && (
                  <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg">
                    <p className="text-sm text-danger">{submitError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep("shipping")} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    className="flex-1"
                    disabled={!isPaymentComplete || isSubmitting || !isAuthenticated}
                  >
                    {isSubmitting ? "Placing Order..." : "Place Order"}
                    {!isSubmitting && <ChevronRight className="ml-2" size={20} />}
                  </Button>
                </div>
              </div>
            )}

            {/* Order Confirmation */}
            {currentStep === "confirmation" && (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                    <Check size={32} className="text-success" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">Order Confirmed!</h2>
                  <p className="text-lg text-muted-foreground mb-1">Thank you for your purchase.</p>
                  <p className="text-2xl font-bold text-primary">{orderNumber}</p>
                </div>

                <div className="p-6 bg-muted rounded-lg space-y-3 text-left">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${confirmationSubtotal.toFixed(2)}</span>
                  </div>
                  {confirmationDiscount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount{confirmationCoupon ? ` (${confirmationCoupon})` : ""}</span>
                      <span>-${confirmationDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${confirmationShipping.toFixed(2)}</span>
                  </div>
                  {confirmationGiftWrap > 0 && (
                    <div className="flex justify-between">
                      <span>Gift wrap</span>
                      <span>${confirmationGiftWrap.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${confirmationTax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${confirmationTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                  <p className="text-sm font-semibold text-blue-900 mb-2">What's Next?</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Your order is saved in your account.</li>
                    <li>✓ Track its status and delivery details from your order history.</li>
                    <li>✓ Estimated delivery: {shippingMethods.find((m) => m.id === confirmationShippingMethod)?.description}</li>
                    <li>✓ Free returns within 30 days</li>
                  </ul>
                </div>

                <div className="flex gap-3 flex-col sm:flex-row">
                  <Link to={orderId ? `/orders/${orderId}` : "/orders"} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Order
                    </Button>
                  </Link>
                  <Link to="/shop" className="flex-1">
                    <Button className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 p-6 bg-muted rounded-xl space-y-4">
              <h3 className="font-bold text-lg">Order Summary</h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.variant}`} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} <span className="text-foreground font-semibold">x{item.quantity}</span>
                    </span>
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount{coupon ? ` (${coupon})` : ""}</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                {giftWrapCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gift wrap</span>
                    <span>${giftWrapCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 text-xs text-muted-foreground text-center space-y-2">
                <p className="flex items-center justify-center gap-2">
                  <Lock size={14} />
                  Secure Checkout
                </p>
                <p>30-Day Money Back Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
