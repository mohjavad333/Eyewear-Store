import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, Heart, MapPin, Package, Pencil, Plus, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { useOrder } from "@/context/OrderContext";
import { useWishlist } from "@/context/WishlistContext";

interface Address {
  _id: string;
  type: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

interface AddressDraft extends Omit<Address, "_id"> {}

const emptyAddress: AddressDraft = {
  type: "shipping",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "USA",
  isDefault: false,
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, token, updateProfile, logout } = useAuth();
  const { orders, loading: ordersLoading, loadOrders } = useOrder();
  const { items: wishlistItems, loading: wishlistLoading, removeItem } = useWishlist();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressDraft, setAddressDraft] = useState<AddressDraft>(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ firstName: "", lastName: "", phone: "" });
  const [editingProfile, setEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProfileDraft({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
    });
  }, [user]);

  useEffect(() => {
    if (!token) return;

    let active = true;
    setLoading(true);
    Promise.all([
      fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
      loadOrders(),
    ])
      .then(async ([response]) => {
        if (!response.ok) throw new Error("Unable to load your account details");
        const data = await response.json();
        if (active) setAddresses(data.user.addresses || []);
      })
      .catch((error) => {
        if (active) toast.error(error instanceof Error ? error.message : "Unable to load your account");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateProfile(profileDraft);
      setEditingProfile(false);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update profile");
    }
  };

  const openAddressForm = (address?: Address) => {
    if (address) {
      const { _id, ...draft } = address;
      setAddressDraft(draft);
      setEditingAddressId(_id);
    } else {
      setAddressDraft({ ...emptyAddress, isDefault: addresses.length === 0 });
      setEditingAddressId(null);
    }
    setAddressFormOpen(true);
  };

  const saveAddress = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setAddressSaving(true);

    try {
      const response = await fetch(
        editingAddressId ? `/api/auth/addresses/${editingAddressId}` : "/api/auth/addresses",
        {
          method: editingAddressId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(addressDraft),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save address");
      setAddresses(data.addresses || []);
      setAddressFormOpen(false);
      setEditingAddressId(null);
      setAddressDraft(emptyAddress);
      toast.success(editingAddressId ? "Address updated." : "Address added.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save address");
    } finally {
      setAddressSaving(false);
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/auth/addresses/${addressId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to delete address");
      setAddresses(data.addresses || []);
      toast.success("Address deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete address");
    }
  };

  const handleRemoveWishlistItem = async (productId: string) => {
    try {
      await removeItem(productId);
      toast.success("Removed from wishlist.");
    } catch {
      toast.error("Unable to update your wishlist.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-10 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <UserRound className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Your Optics account</p>
              <h1 className="text-3xl font-bold">{user?.firstName} {user?.lastName}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" onClick={() => { setActiveTab("settings"); setEditingProfile(true); }}>
              <Pencil className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          </div>
        </section>

        <div className="container mx-auto max-w-7xl px-4 md:px-8 py-8">
          {loading ? (
            <div className="py-20 text-center text-muted-foreground">Loading your account…</div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Orders", value: orders.length, icon: Package },
                    { label: "Saved frames", value: wishlistItems.length, icon: Heart },
                    { label: "Addresses", value: addresses.length, icon: MapPin },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-lg border border-border bg-card p-6 text-center">
                      <Icon className="w-7 h-7 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="text-2xl font-bold">{value}</p>
                    </div>
                  ))}
                </div>
                <section className="rounded-lg border border-border bg-card">
                  <div className="p-5 border-b border-border flex items-center justify-between">
                    <h2 className="font-bold text-lg">Recent orders</h2>
                    <Button variant="ghost" onClick={() => setActiveTab("orders")}>View all</Button>
                  </div>
                  {ordersLoading ? <p className="p-5 text-muted-foreground">Loading orders…</p> : orders.slice(0, 3).length ? (
                    <div className="divide-y divide-border">
                      {orders.slice(0, 3).map((order) => (
                        <Link key={order.id} to={`/orders/${order.id}`} className="p-5 flex items-center justify-between gap-4 hover:bg-muted/50">
                          <div><p className="font-semibold">{order.orderNumber}</p><p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()} · {order.itemCount} item{order.itemCount === 1 ? "" : "s"}</p></div>
                          <div className="text-right"><p className="font-semibold">${order.total.toFixed(2)}</p><p className="text-sm capitalize text-muted-foreground">{order.status}</p></div>
                        </Link>
                      ))}
                    </div>
                  ) : <div className="p-8 text-center"><p className="text-muted-foreground mb-4">Your order history will appear here.</p><Link to="/shop"><Button>Browse eyewear</Button></Link></div>}
                </section>
                <div className="rounded-lg bg-muted/60 p-5 flex items-start gap-3">
                  <CalendarDays className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">Manage your profile, shipping addresses, orders, and saved frames from one place.</p>
                </div>
              </TabsContent>

              <TabsContent value="orders">
                {ordersLoading ? <p className="py-12 text-center text-muted-foreground">Loading orders…</p> : orders.length ? (
                  <div className="rounded-lg border border-border divide-y divide-border">
                    {orders.map((order) => (
                      <Link key={order.id} to={`/orders/${order.id}`} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/50">
                        <div><p className="font-semibold">{order.orderNumber}</p><p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()} · {order.itemCount} item{order.itemCount === 1 ? "" : "s"}</p></div>
                        <div className="flex items-center gap-4"><span className="text-sm capitalize">{order.status}</span><span className="font-semibold">${order.total.toFixed(2)}</span></div>
                      </Link>
                    ))}
                  </div>
                ) : <div className="py-16 text-center"><p className="text-muted-foreground mb-4">No orders yet.</p><Link to="/shop"><Button>Start shopping</Button></Link></div>}
              </TabsContent>

              <TabsContent value="addresses" className="space-y-5">
                <div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-bold">Shipping addresses</h2><p className="text-sm text-muted-foreground">Saved addresses for checkout.</p></div><Button onClick={() => openAddressForm()}><Plus className="w-4 h-4 mr-2" /> Add address</Button></div>
                {addressFormOpen && (
                  <form onSubmit={saveAddress} className="rounded-lg border border-border bg-card p-5 space-y-4">
                    <h3 className="font-semibold">{editingAddressId ? "Edit address" : "New shipping address"}</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {([ ["firstName", "First name"], ["lastName", "Last name"], ["address", "Street address"], ["city", "City"], ["state", "State"], ["zip", "ZIP code"], ["country", "Country"] ] as const).map(([field, label]) => (
                        <div key={field} className="space-y-1"><Label htmlFor={`address-${field}`}>{label}</Label><Input id={`address-${field}`} required value={addressDraft[field]} onChange={(event) => setAddressDraft((draft) => ({ ...draft, [field]: event.target.value }))} /></div>
                      ))}
                    </div>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={addressDraft.isDefault} onChange={(event) => setAddressDraft((draft) => ({ ...draft, isDefault: event.target.checked }))} /> Set as default address</label>
                    <div className="flex gap-2"><Button type="submit" disabled={addressSaving}>{addressSaving ? "Saving…" : "Save address"}</Button><Button type="button" variant="outline" onClick={() => { setAddressFormOpen(false); setEditingAddressId(null); }}>Cancel</Button></div>
                  </form>
                )}
                {addresses.length ? <div className="grid md:grid-cols-2 gap-4">{addresses.map((address) => (
                  <article key={address._id} className="rounded-lg border border-border bg-card p-5">
                    <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{address.firstName} {address.lastName}</p><p className="text-xs uppercase tracking-wide text-muted-foreground">{address.type} address</p></div>{address.isDefault && <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">Default</span>}</div>
                    <div className="text-sm text-muted-foreground mt-4 space-y-1"><p>{address.address}</p><p>{address.city}, {address.state} {address.zip}</p><p>{address.country}</p></div>
                    <div className="mt-4 flex gap-2"><Button type="button" variant="outline" size="sm" onClick={() => openAddressForm(address)}><Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit</Button><Button type="button" variant="outline" size="sm" className="text-danger" onClick={() => deleteAddress(address._id)}><Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete</Button></div>
                  </article>
                ))}</div> : !addressFormOpen && <div className="rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">No saved addresses yet.</div>}
              </TabsContent>

              <TabsContent value="wishlist">
                {wishlistLoading ? <p className="py-12 text-center text-muted-foreground">Loading saved frames…</p> : wishlistItems.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">{wishlistItems.map((item) => <div key={item.productId} className="space-y-2"><ProductCard id={item.productId} name={item.name} price={item.price} originalPrice={item.originalPrice} image={item.image} category={item.category} rating={item.rating} reviews={item.reviews} discount={item.discount} /><Button variant="outline" className="w-full" onClick={() => handleRemoveWishlistItem(item.productId)}><Heart className="w-4 h-4 mr-2" /> Remove saved frame</Button></div>)}</div> : <div className="py-16 text-center"><p className="text-muted-foreground mb-4">Your saved frames will appear here.</p><Link to="/shop"><Button>Explore the collection</Button></Link></div>}
              </TabsContent>

              <TabsContent value="settings">
                <form onSubmit={saveProfile} className="max-w-2xl rounded-lg border border-border bg-card p-6 space-y-5">
                  <div><h2 className="text-xl font-bold">Personal information</h2><p className="text-sm text-muted-foreground">Update the details associated with your account.</p></div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="profile-first-name">First name</Label><Input id="profile-first-name" required readOnly={!editingProfile} value={profileDraft.firstName} onChange={(event) => setProfileDraft((draft) => ({ ...draft, firstName: event.target.value }))} /></div>
                    <div className="space-y-2"><Label htmlFor="profile-last-name">Last name</Label><Input id="profile-last-name" required readOnly={!editingProfile} value={profileDraft.lastName} onChange={(event) => setProfileDraft((draft) => ({ ...draft, lastName: event.target.value }))} /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="profile-email">Email</Label><Input id="profile-email" type="email" value={user?.email || ""} readOnly /><p className="text-xs text-muted-foreground">Email is used to sign in and can’t be changed here.</p></div>
                  <div className="space-y-2"><Label htmlFor="profile-phone">Phone</Label><Input id="profile-phone" type="tel" readOnly={!editingProfile} value={profileDraft.phone} onChange={(event) => setProfileDraft((draft) => ({ ...draft, phone: event.target.value }))} /></div>
                  <div className="flex flex-wrap gap-2">{editingProfile ? <><Button type="submit">Save changes</Button><Button type="button" variant="outline" onClick={() => { setEditingProfile(false); setProfileDraft({ firstName: user?.firstName || "", lastName: user?.lastName || "", phone: user?.phone || "" }); }}>Cancel</Button></> : <Button type="button" variant="outline" onClick={() => setEditingProfile(true)}>Edit information</Button>}</div>
                  <div className="border-t border-border pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><p className="font-semibold">Password</p><p className="text-sm text-muted-foreground">Use the account recovery page if you can’t sign in.</p></div><Link to="/forgot-password"><Button type="button" variant="outline">Password help</Button></Link></div>
                  <div className="border-t border-border pt-5"><Button type="button" variant="outline" onClick={() => { logout(); navigate("/login", { replace: true }); }}>Sign out</Button></div>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
