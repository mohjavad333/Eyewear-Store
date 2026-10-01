import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Archive,
  BarChart3,
  Check,
  ChevronRight,
  CircleDollarSign,
  Loader2,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;
type AdminSection = "overview" | "orders" | "products" | "promotions";

type AdminStats = {
  orders: number;
  products: number;
  activeProducts: number;
  promotions: number;
  users: number;
  lowStock: number;
};

type AdminOrder = {
  _id: string;
  orderNumber: string;
  orderStatus: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  total: number;
  createdAt: string;
  items: { quantity: number }[];
  userId?: { firstName?: string; lastName?: string; email?: string };
};

type AdminProduct = {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  active: boolean;
  brand?: string;
};

type AdminPromotion = {
  _id: string;
  code: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  active: boolean;
  startsAt?: string;
  endsAt?: string;
  usageCount: number;
  usageLimit?: number;
};

type ProductForm = {
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  category: string;
  stock: string;
  active: boolean;
};

type PromotionForm = {
  code: string;
  name: string;
  type: "percentage" | "fixed";
  value: string;
  startsAt: string;
  endsAt: string;
  active: boolean;
  usageLimit: string;
};

const emptyProduct: ProductForm = {
  name: "",
  price: "",
  originalPrice: "",
  image: "",
  category: "Sunglasses",
  stock: "0",
  active: true,
};

const emptyPromotion: PromotionForm = {
  code: "",
  name: "",
  type: "percentage",
  value: "",
  startsAt: "",
  endsAt: "",
  active: true,
  usageLimit: "",
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900",
  processing: "bg-blue-100 text-blue-900",
  shipped: "bg-indigo-100 text-indigo-900",
  delivered: "bg-emerald-100 text-emerald-900",
  cancelled: "bg-gray-200 text-gray-800",
};

export default function Admin() {
  const { user, token, loading: authLoading, isAuthenticated } = useAuth();
  const [section, setSection] = useState<AdminSection>("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [promotions, setPromotions] = useState<AdminPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [savingId, setSavingId] = useState("");
  const [orderDrafts, setOrderDrafts] = useState<Record<string, { status: string; trackingNumber: string; estimatedDelivery: string }>>({});
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productSaving, setProductSaving] = useState(false);
  const [promotionForm, setPromotionForm] = useState<PromotionForm>(emptyPromotion);
  const [editingPromotionId, setEditingPromotionId] = useState<string | null>(null);
  const [promotionSaving, setPromotionSaving] = useState(false);

  const apiFetch = async (path: string, init: RequestInit = {}) => {
    const response = await fetch(`/api/admin${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(init.headers || {}),
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Admin request failed");
    return data;
  };

  const loadAdminData = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const [statsData, ordersData, productsData, promotionsData] = await Promise.all([
        apiFetch("/stats"),
        apiFetch("/orders"),
        apiFetch("/products"),
        apiFetch("/promotions"),
      ]);
      setStats(statsData.stats);
      setOrders(ordersData.orders || []);
      setProducts(productsData.products || []);
      setPromotions(promotionsData.promotions || []);
      setOrderDrafts(
        (ordersData.orders || []).reduce(
          (drafts: typeof orderDrafts, order: AdminOrder) => ({
            ...drafts,
            [order._id]: {
              status: order.orderStatus,
              trackingNumber: order.trackingNumber || "",
              estimatedDelivery: order.estimatedDelivery
                ? new Date(order.estimatedDelivery).toISOString().slice(0, 10)
                : "",
            },
          }),
          {}
        )
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role === "admin") {
      loadAdminData();
    }
  }, [authLoading, isAuthenticated, token, user?.role]);

  const activeProducts = useMemo(() => products.filter((product) => product.active), [products]);

  const updateOrderDraft = (orderId: string, field: "status" | "trackingNumber" | "estimatedDelivery", value: string) => {
    setOrderDrafts((current) => ({
      ...current,
      [orderId]: { ...current[orderId], [field]: value },
    }));
  };

  const saveOrder = async (orderId: string) => {
    const draft = orderDrafts[orderId];
    if (!draft) return;
    setSavingId(orderId);
    setNotice("");
    try {
      const result = await apiFetch(`/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify(draft),
      });
      setNotice("Order updated successfully.");
      await loadAdminData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to update order");
    } finally {
      setSavingId("");
    }
  };

  const submitProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    setProductSaving(true);
    setError("");
    try {
      await apiFetch(editingProductId ? `/products/${editingProductId}` : "/products", {
        method: editingProductId ? "PUT" : "POST",
        body: JSON.stringify({
          ...productForm,
          price: Number(productForm.price),
          originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
          stock: Number(productForm.stock),
        }),
      });
      setProductForm(emptyProduct);
      setEditingProductId(null);
      setNotice(editingProductId ? "Product updated successfully." : "Product created successfully.");
      await loadAdminData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to save product");
    } finally {
      setProductSaving(false);
    }
  };

  const editProduct = (product: AdminProduct) => {
    setEditingProductId(product.productId);
    setProductForm({
      name: product.name,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      image: product.image,
      category: product.category,
      stock: String(product.stock),
      active: product.active,
    });
    setSection("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const archiveProduct = async (productId: string) => {
    if (!window.confirm("Archive this product from the catalog?")) return;
    try {
      await apiFetch(`/products/${productId}`, { method: "DELETE" });
      setNotice("Product archived.");
      await loadAdminData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to archive product");
    }
  };

  const submitPromotion = async (event: React.FormEvent) => {
    event.preventDefault();
    setPromotionSaving(true);
    setError("");
    try {
      await apiFetch(editingPromotionId ? `/promotions/${editingPromotionId}` : "/promotions", {
        method: editingPromotionId ? "PUT" : "POST",
        body: JSON.stringify({
          ...promotionForm,
          value: Number(promotionForm.value),
          usageLimit: promotionForm.usageLimit ? Number(promotionForm.usageLimit) : undefined,
        }),
      });
      setPromotionForm(emptyPromotion);
      setEditingPromotionId(null);
      setNotice(editingPromotionId ? "Promotion updated successfully." : "Promotion created successfully.");
      await loadAdminData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to save promotion");
    } finally {
      setPromotionSaving(false);
    }
  };

  const editPromotion = (promotion: AdminPromotion) => {
    setEditingPromotionId(promotion._id);
    setPromotionForm({
      code: promotion.code,
      name: promotion.name,
      type: promotion.type,
      value: String(promotion.value),
      startsAt: promotion.startsAt ? promotion.startsAt.slice(0, 10) : "",
      endsAt: promotion.endsAt ? promotion.endsAt.slice(0, 10) : "",
      active: promotion.active,
      usageLimit: promotion.usageLimit ? String(promotion.usageLimit) : "",
    });
    setSection("promotions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deletePromotion = async (promotionId: string) => {
    if (!window.confirm("Delete this promotion?")) return;
    try {
      await apiFetch(`/promotions/${promotionId}`, { method: "DELETE" });
      setNotice("Promotion deleted.");
      await loadAdminData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to delete promotion");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading admin workspace...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-md text-center space-y-4">
            <Archive className="w-12 h-12 text-muted-foreground mx-auto" />
            <h1 className="text-3xl font-bold">Admin access required</h1>
            <p className="text-muted-foreground">This workspace is limited to authorized store administrators.</p>
            <Link to="/"><Button>Return home</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const navigation: { id: AdminSection; label: string; icon: typeof BarChart3 }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "orders", label: "Orders", icon: Truck },
    { id: "products", label: "Products", icon: ShoppingBag },
    { id: "promotions", label: "Promotions", icon: Tag },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-2">Optics control room</p>
            <h1 className="text-3xl md:text-4xl font-bold">Admin workspace</h1>
            <p className="text-muted-foreground mt-2">Manage the catalog, fulfillment, and promotional calendar.</p>
          </div>
          <Button variant="outline" onClick={loadAdminData} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh data
          </Button>
        </div>

        {(error || notice) && (
          <div className={`mb-6 rounded-lg border p-4 flex items-start justify-between gap-4 ${error ? "bg-danger/10 border-danger/20 text-danger" : "bg-success/10 border-success/20 text-success"}`}>
            <p className="text-sm">{error || notice}</p>
            <button aria-label="Dismiss message" onClick={() => { setError(""); setNotice(""); }}><X className="w-4 h-4" /></button>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 border-b border-border">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors ${section === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {section === "overview" && (
          <section className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                ["Orders", stats?.orders || 0, Package, "text-blue-600"],
                ["Products", stats?.products || 0, ShoppingBag, "text-primary"],
                ["Active", stats?.activeProducts || 0, Check, "text-success"],
                ["Promotions", stats?.promotions || 0, Tag, "text-accent"],
                ["Customers", stats?.users || 0, Users, "text-indigo-600"],
                ["Low stock", stats?.lowStock || 0, Archive, "text-danger"],
              ].map(([label, value, Icon, color]) => {
                const StatIcon = Icon as typeof BarChart3;
                return (
                  <div key={String(label)} className="bg-card border border-border rounded-xl p-4">
                    <StatIcon className={`w-5 h-5 ${color} mb-3`} />
                    <p className="text-2xl font-bold">{value as number}</p>
                    <p className="text-xs text-muted-foreground mt-1">{String(label)}</p>
                  </div>
                );
              })}
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div><h2 className="text-xl font-bold">Recent orders</h2><p className="text-sm text-muted-foreground">Latest fulfillment activity</p></div>
                  <button className="text-sm text-primary font-semibold" onClick={() => setSection("orders")}>View all</button>
                </div>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between gap-3 border-b border-border/70 pb-3 last:border-0 last:pb-0">
                      <div><p className="font-semibold text-sm">{order.orderNumber}</p><p className="text-xs text-muted-foreground">{order.userId?.email || "Customer"}</p></div>
                      <div className="text-right"><p className="font-semibold text-sm">${order.total.toFixed(2)}</p><span className={`text-[11px] px-2 py-1 rounded-full capitalize ${statusStyles[order.orderStatus] || "bg-muted"}`}>{order.orderStatus}</span></div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div><h2 className="text-xl font-bold">Inventory watch</h2><p className="text-sm text-muted-foreground">Products needing attention</p></div>
                  <button className="text-sm text-primary font-semibold" onClick={() => setSection("products")}>Manage</button>
                </div>
                <div className="space-y-3">
                  {products.filter((product) => product.stock <= 5 && product.active).slice(0, 5).map((product) => (
                    <div key={product.productId} className="flex items-center gap-3 border-b border-border/70 pb-3 last:border-0 last:pb-0">
                      <img src={product.image} alt="" className="w-10 h-10 rounded-md object-cover" />
                      <div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{product.name}</p><p className="text-xs text-muted-foreground">{product.category}</p></div>
                      <span className="text-sm font-semibold text-danger">{product.stock} left</span>
                    </div>
                  ))}
                  {products.filter((product) => product.stock <= 5 && product.active).length === 0 && <p className="text-sm text-muted-foreground">All active products have healthy stock.</p>}
                </div>
              </div>
            </div>
          </section>
        )}

        {section === "orders" && (
          <section className="space-y-4">
            <div className="flex items-end justify-between"><div><h2 className="text-2xl font-bold">Order fulfillment</h2><p className="text-sm text-muted-foreground">Update status, tracking, and delivery estimates.</p></div><span className="text-sm text-muted-foreground">{orders.length} orders</span></div>
            <div className="space-y-4">
              {orders.map((order) => {
                const draft = orderDrafts[order._id];
                return <div key={order._id} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                    <div><div className="flex items-center gap-3"><h3 className="font-bold text-lg">{order.orderNumber}</h3><span className={`text-xs px-2.5 py-1 rounded-full capitalize ${statusStyles[order.orderStatus] || "bg-muted"}`}>{order.orderStatus}</span></div><p className="text-sm text-muted-foreground mt-1">{order.userId?.firstName} {order.userId?.lastName} · {order.userId?.email || "No email"}</p></div>
                    <div className="text-left md:text-right"><p className="font-bold">${order.total.toFixed(2)}</p><p className="text-xs text-muted-foreground">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items · {new Date(order.createdAt).toLocaleDateString()}</p></div>
                  </div>
                  {draft && <div className="grid md:grid-cols-4 gap-3 items-end">
                    <div className="space-y-1.5"><Label>Status</Label><select value={draft.status} onChange={(event) => updateOrderDraft(order._id, "status", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm capitalize">{orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></div>
                    <div className="space-y-1.5 md:col-span-1"><Label htmlFor={`tracking-${order._id}`}>Tracking number</Label><Input id={`tracking-${order._id}`} value={draft.trackingNumber} onChange={(event) => updateOrderDraft(order._id, "trackingNumber", event.target.value)} placeholder="Optional" /></div>
                    <div className="space-y-1.5"><Label htmlFor={`delivery-${order._id}`}>Estimated delivery</Label><Input id={`delivery-${order._id}`} type="date" value={draft.estimatedDelivery} onChange={(event) => updateOrderDraft(order._id, "estimatedDelivery", event.target.value)} /></div>
                    <Button onClick={() => saveOrder(order._id)} disabled={savingId === order._id}><Check className="w-4 h-4 mr-2" />{savingId === order._id ? "Saving..." : "Save update"}</Button>
                  </div>}
                </div>;
              })}
              {orders.length === 0 && <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">No orders available.</div>}
            </div>
          </section>
        )}

        {section === "products" && (
          <section className="space-y-6">
            <div><h2 className="text-2xl font-bold">Product management</h2><p className="text-sm text-muted-foreground">Manage catalog details, visibility, pricing, and inventory.</p></div>
            <form onSubmit={submitProduct} className="bg-card border border-border rounded-xl p-5 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="md:col-span-2 lg:col-span-2 space-y-1.5"><Label htmlFor="product-name">Product name</Label><Input id="product-name" value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} required /></div>
              <div className="space-y-1.5"><Label htmlFor="product-price">Price</Label><Input id="product-price" type="number" min="0" step="0.01" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} required /></div>
              <div className="space-y-1.5"><Label htmlFor="product-original-price">Original price</Label><Input id="product-original-price" type="number" min="0" step="0.01" value={productForm.originalPrice} onChange={(event) => setProductForm({ ...productForm, originalPrice: event.target.value })} /></div>
              <div className="md:col-span-2 space-y-1.5"><Label htmlFor="product-image">Image URL</Label><Input id="product-image" type="url" value={productForm.image} onChange={(event) => setProductForm({ ...productForm, image: event.target.value })} required /></div>
              <div className="space-y-1.5"><Label htmlFor="product-category">Category</Label><Input id="product-category" value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} required /></div>
              <div className="space-y-1.5"><Label htmlFor="product-stock">Stock</Label><Input id="product-stock" type="number" min="0" step="1" value={productForm.stock} onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} required /></div>
              <div className="flex items-center gap-2 md:col-span-2"><input id="product-active" type="checkbox" checked={productForm.active} onChange={(event) => setProductForm({ ...productForm, active: event.target.checked })} /><Label htmlFor="product-active">Visible in catalog</Label></div>
              <div className="flex gap-2 lg:col-span-2 justify-end"><Button type="button" variant="outline" onClick={() => { setProductForm(emptyProduct); setEditingProductId(null); }}><X className="w-4 h-4 mr-2" />Clear</Button><Button type="submit" disabled={productSaving}>{editingProductId ? <Pencil className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}{productSaving ? "Saving..." : editingProductId ? "Update product" : "Add product"}</Button></div>
            </form>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between"><h3 className="font-bold">Catalog ({activeProducts.length} active)</h3><span className="text-xs text-muted-foreground">{products.length} total records</span></div>
              <div className="divide-y divide-border">
                {products.map((product) => <div key={product.productId} className="p-4 flex flex-col md:flex-row md:items-center gap-4"><img src={product.image} alt="" className="w-14 h-14 rounded-lg object-cover bg-muted" /><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><p className="font-semibold truncate">{product.name}</p>{!product.active && <span className="text-[11px] px-2 py-1 rounded-full bg-muted text-muted-foreground">Archived</span>}</div><p className="text-sm text-muted-foreground">{product.category} · {product.brand || "Independent"}</p></div><div className="text-sm"><p className="font-semibold">${product.price.toFixed(2)}</p><p className={product.stock <= 5 ? "text-danger" : "text-muted-foreground"}>{product.stock} in stock</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => editProduct(product)}><Pencil className="w-4 h-4 mr-1" />Edit</Button>{product.active && <Button variant="outline" size="sm" onClick={() => archiveProduct(product.productId)}><Archive className="w-4 h-4 mr-1" />Archive</Button>}</div></div>)}
              </div>
            </div>
          </section>
        )}

        {section === "promotions" && (
          <section className="space-y-6">
            <div><h2 className="text-2xl font-bold">Promotion management</h2><p className="text-sm text-muted-foreground">Create and control discount codes and campaign windows.</p></div>
            <form onSubmit={submitPromotion} className="bg-card border border-border rounded-xl p-5 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5"><Label htmlFor="promotion-code">Code</Label><Input id="promotion-code" value={promotionForm.code} onChange={(event) => setPromotionForm({ ...promotionForm, code: event.target.value.toUpperCase() })} placeholder="SUMMER25" required /></div>
              <div className="md:col-span-2 space-y-1.5"><Label htmlFor="promotion-name">Campaign name</Label><Input id="promotion-name" value={promotionForm.name} onChange={(event) => setPromotionForm({ ...promotionForm, name: event.target.value })} required /></div>
              <div className="space-y-1.5"><Label htmlFor="promotion-type">Discount type</Label><select id="promotion-type" value={promotionForm.type} onChange={(event) => setPromotionForm({ ...promotionForm, type: event.target.value as PromotionForm["type"] })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="percentage">Percentage</option><option value="fixed">Fixed amount</option></select></div>
              <div className="space-y-1.5"><Label htmlFor="promotion-value">Value</Label><Input id="promotion-value" type="number" min="0" step="0.01" value={promotionForm.value} onChange={(event) => setPromotionForm({ ...promotionForm, value: event.target.value })} required /></div>
              <div className="space-y-1.5"><Label htmlFor="promotion-start">Starts</Label><Input id="promotion-start" type="date" value={promotionForm.startsAt} onChange={(event) => setPromotionForm({ ...promotionForm, startsAt: event.target.value })} /></div>
              <div className="space-y-1.5"><Label htmlFor="promotion-end">Ends</Label><Input id="promotion-end" type="date" value={promotionForm.endsAt} onChange={(event) => setPromotionForm({ ...promotionForm, endsAt: event.target.value })} /></div>
              <div className="space-y-1.5"><Label htmlFor="promotion-limit">Usage limit</Label><Input id="promotion-limit" type="number" min="1" step="1" value={promotionForm.usageLimit} onChange={(event) => setPromotionForm({ ...promotionForm, usageLimit: event.target.value })} placeholder="Unlimited" /></div>
              <div className="flex items-center gap-2"><input id="promotion-active" type="checkbox" checked={promotionForm.active} onChange={(event) => setPromotionForm({ ...promotionForm, active: event.target.checked })} /><Label htmlFor="promotion-active">Active</Label></div>
              <div className="flex gap-2 lg:col-span-3 justify-end"><Button type="button" variant="outline" onClick={() => { setPromotionForm(emptyPromotion); setEditingPromotionId(null); }}><X className="w-4 h-4 mr-2" />Clear</Button><Button type="submit" disabled={promotionSaving}>{editingPromotionId ? <Pencil className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}{promotionSaving ? "Saving..." : editingPromotionId ? "Update promotion" : "Create promotion"}</Button></div>
            </form>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border"><h3 className="font-bold">Campaigns ({promotions.length})</h3></div>
              <div className="divide-y divide-border">
                {promotions.map((promotion) => <div key={promotion._id} className="p-4 flex flex-col md:flex-row md:items-center gap-4"><div className="w-24 h-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary tracking-wider">{promotion.code}</div><div className="flex-1"><p className="font-semibold">{promotion.name}</p><p className="text-sm text-muted-foreground">{promotion.type === "percentage" ? `${promotion.value}% off` : `$${promotion.value.toFixed(2)} off`} · Used {promotion.usageCount}{promotion.usageLimit ? ` of ${promotion.usageLimit}` : " times"}</p></div><div><span className={`text-xs px-2.5 py-1 rounded-full ${promotion.active ? "bg-emerald-100 text-emerald-900" : "bg-muted text-muted-foreground"}`}>{promotion.active ? "Active" : "Inactive"}</span></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => editPromotion(promotion)}><Pencil className="w-4 h-4 mr-1" />Edit</Button><Button variant="outline" size="sm" onClick={() => deletePromotion(promotion._id)}><Trash2 className="w-4 h-4 mr-1" />Delete</Button></div></div>)}
                {promotions.length === 0 && <div className="p-12 text-center text-muted-foreground">No promotions created yet.</div>}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
