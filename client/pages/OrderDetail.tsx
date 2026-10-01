import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Check,
  CreditCard,
  MapPin,
  Package,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { OrderDetail as OrderDetailData, useOrder } from "@/context/OrderContext";

const statusSteps = [
  { id: "pending", label: "Order placed", description: "We've received your order." },
  { id: "processing", label: "Processing", description: "Your order is being prepared." },
  { id: "shipped", label: "Shipped", description: "Your order is on its way." },
  { id: "delivered", label: "Delivered", description: "Your order has arrived." },
];

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const paymentLabels: Record<string, string> = {
  credit: "Credit card",
  paypal: "PayPal",
  apple: "Apple Pay",
  google: "Google Pay",
};

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusIndex(status: string) {
  return statusSteps.findIndex((step) => step.id === status);
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { loadOrderDetail, cancelOrder } = useOrder();
  const [order, setOrder] = useState<OrderDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");
    loadOrderDetail(id)
      .then(setOrder)
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "Unable to load this order.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!id || !order || canceling) return;

    setCanceling(true);
    setError("");
    try {
      await cancelOrder(id);
      const updatedOrder = await loadOrderDetail(id);
      setOrder(updatedOrder);
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : "Unable to cancel this order.");
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order || error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md">
            <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Order unavailable</h1>
            <p className="text-muted-foreground mb-6">
              {error || "We couldn't find this order in your account."}
            </p>
            <Link to="/orders">
              <Button>Back to Orders</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isCancelled = order.orderStatus === "cancelled";
  const currentStatusIndex = getStatusIndex(order.orderStatus);
  const canCancel = order.orderStatus === "pending" || order.orderStatus === "processing";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/orders" className="hover:text-foreground transition-colors">Orders</Link>
            <span>/</span>
            <span className="text-foreground">{order.orderNumber}</span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft size={16} />
              Back to Orders
            </Link>
            <h1 className="text-3xl font-bold mb-2">{order.orderNumber}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Calendar size={16} />
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${isCancelled ? "bg-gray-100 text-gray-700" : "bg-primary/10 text-primary"}`}>
              {statusLabels[order.orderStatus] || order.orderStatus}
            </span>
            {canCancel && (
              <Button variant="outline" onClick={handleCancel} disabled={canceling}>
                <XCircle size={16} className="mr-2" />
                {canceling ? "Cancelling..." : "Cancel Order"}
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg text-sm text-danger">
            {error}
          </div>
        )}

        {!isCancelled ? (
          <section className="rounded-xl border border-border bg-card p-6 mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold">Delivery progress</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {order.orderStatus === "delivered"
                    ? "Your order has been delivered."
                    : `Estimated delivery: ${formatDate(order.estimatedDelivery)}`}
                </p>
              </div>
              <Truck className="text-primary" size={28} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {statusSteps.map((step, index) => {
                const complete = index <= currentStatusIndex;
                return (
                  <div key={step.id} className="relative">
                    {index < statusSteps.length - 1 && (
                      <div className={`hidden sm:block absolute top-5 left-10 w-full h-0.5 ${index < currentStatusIndex ? "bg-success" : "bg-border"}`} />
                    )}
                    <div className="relative flex sm:block items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${complete ? "bg-success text-white" : "bg-muted text-muted-foreground"}`}>
                        {complete ? <Check size={18} /> : index + 1}
                      </div>
                      <div className="sm:mt-3">
                        <p className={`font-semibold text-sm ${complete ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {order.trackingNumber && (
              <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm text-muted-foreground">Tracking number</span>
                <span className="font-mono font-semibold">{order.trackingNumber}</span>
              </div>
            )}
          </section>
        ) : (
          <section className="rounded-xl border border-gray-200 bg-gray-50 p-6 mb-8 flex items-start gap-3">
            <RotateCcw className="text-gray-600 mt-0.5" size={22} />
            <div>
              <h2 className="font-bold text-gray-900">This order was cancelled</h2>
              <p className="text-sm text-gray-600 mt-1">If you were charged, your refund will be processed according to your payment provider's timeline.</p>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold mb-5">Items in this order</h2>
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div key={`${item.productId}-${item.variant}`} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-muted" />
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wide text-primary font-semibold">{item.category}</p>
                    <h3 className="font-semibold mt-1">{item.name}</h3>
                    {item.variant && <p className="text-sm text-muted-foreground">{item.variant}</p>}
                    <p className="text-sm text-muted-foreground mt-1">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 h-fit">
            <h2 className="text-xl font-bold mb-5">Order summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-${order.discount.toFixed(2)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>${order.shippingCost.toFixed(2)}</span></div>
              {order.giftWrapCost > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Gift wrap</span><span>${order.giftWrapCost.toFixed(2)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${order.tax.toFixed(2)}</span></div>
              <div className="pt-3 border-t border-border flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">${order.total.toFixed(2)}</span></div>
            </div>
            <div className="mt-6 pt-5 border-t border-border space-y-3 text-sm">
              <div className="flex items-start gap-3"><CreditCard size={18} className="text-muted-foreground mt-0.5" /><div><p className="font-semibold">Payment</p><p className="text-muted-foreground">{paymentLabels[order.paymentMethod] || order.paymentMethod} · {order.paymentStatus}</p></div></div>
              <div className="flex items-start gap-3"><Truck size={18} className="text-muted-foreground mt-0.5" /><div><p className="font-semibold">Shipping</p><p className="text-muted-foreground capitalize">{order.shippingMethod}</p></div></div>
            </div>
          </section>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4"><MapPin size={20} className="text-primary" /><h2 className="text-lg font-bold">Shipping address</h2></div>
            <p className="text-sm leading-6 text-muted-foreground">
              <span className="text-foreground font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</span><br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
              {order.shippingAddress.country}<br />
              {order.shippingAddress.phone}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4"><Package size={20} className="text-primary" /><h2 className="text-lg font-bold">Need help?</h2></div>
            <p className="text-sm text-muted-foreground mb-4">Our support team can help with delivery updates, returns, or exchanges.</p>
            <Link to="/contact"><Button variant="outline">Contact Support</Button></Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
