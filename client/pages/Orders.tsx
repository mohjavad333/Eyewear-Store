import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useOrder } from "@/context/OrderContext";

const statusColors: Record<string, { bg: string; text: string; badge: string }> = {
  pending: {
    bg: "bg-yellow-50",
    text: "text-yellow-900",
    badge: "bg-yellow-200 text-yellow-800",
  },
  processing: {
    bg: "bg-blue-50",
    text: "text-blue-900",
    badge: "bg-blue-200 text-blue-800",
  },
  shipped: {
    bg: "bg-indigo-50",
    text: "text-indigo-900",
    badge: "bg-indigo-200 text-indigo-800",
  },
  delivered: {
    bg: "bg-green-50",
    text: "text-green-900",
    badge: "bg-green-200 text-green-800",
  },
  cancelled: {
    bg: "bg-gray-50",
    text: "text-gray-900",
    badge: "bg-gray-200 text-gray-800",
  },
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function Orders() {
  const { orders, loading, loadOrders } = useOrder();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = selectedStatus
    ? orders.filter((order) => order.status === selectedStatus)
    : orders;

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
            <Link to="/profile" className="hover:text-foreground transition-colors">
              Profile
            </Link>
            <span>/</span>
            <span className="text-foreground">Orders</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Order History</h1>
          <p className="text-muted-foreground">View and manage your orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <p className="text-sm text-muted-foreground mb-1">Shipped</p>
            <p className="text-2xl font-bold text-blue-600">{stats.shipped}</p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <p className="text-sm text-muted-foreground mb-1">Delivered</p>
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedStatus(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition-colors ${
              selectedStatus === null
                ? "bg-primary text-primary-foreground"
                : "border border-border hover:border-primary/50"
            }`}
          >
            All Orders
          </button>
          {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition-colors capitalize ${
                selectedStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:border-primary/50"
              }`}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-6">
              {selectedStatus
                ? `You don't have any ${selectedStatus} orders.`
                : "You haven't placed any orders yet."}
            </p>
            <Link to="/shop">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const colors = statusColors[order.status];
              return (
                <Link key={order.id} to={`/orders/${order.id}`}>
                  <div
                    className={`p-6 rounded-lg border border-border hover:border-border/75 transition-colors cursor-pointer ${colors.bg}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${colors.badge}`}
                          >
                            {statusLabels[order.status]}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div>
                            {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-2">
                          <DollarSign size={16} />
                          <span className="text-2xl font-bold">${order.total.toFixed(2)}</span>
                        </div>
                        <ChevronRight size={20} className="text-muted-foreground ml-auto" />
                      </div>
                    </div>

                    {/* Estimated Delivery */}
                    {order.estimatedDelivery && order.status !== "delivered" && (
                      <div className="pt-4 border-t border-border/25">
                        <p className="text-sm">
                          Estimated delivery:{" "}
                          <span className="font-semibold">
                            {new Date(order.estimatedDelivery).toLocaleDateString()}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
