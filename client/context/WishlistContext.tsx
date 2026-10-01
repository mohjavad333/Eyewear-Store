import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  discount?: number;
  addedDate: string;
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
}

interface WishlistContextType {
  items: WishlistItem[];
  loading: boolean;
  addItem: (item: Omit<WishlistItem, "addedDate">) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isSaved: (productId: string) => boolean;
  loadWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadWishlist();
    } else {
      setItems([]);
    }
  }, [isAuthenticated, token]);

  const loadWishlist = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch("/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<WishlistItem, "addedDate">) => {
    if (!token) return;

    const response = await fetch("/api/wishlist/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error("Failed to add item to wishlist");
    }

    const data = await response.json();
    setItems(data.items || []);
  };

  const removeItem = async (productId: string) => {
    if (!token) return;

    const response = await fetch(`/api/wishlist/items/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to remove item from wishlist");
    }

    const data = await response.json();
    setItems(data.items || []);
  };

  const clearWishlist = async () => {
    if (!token) return;

    const response = await fetch("/api/wishlist", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to clear wishlist");
    }

    setItems([]);
  };

  const isSaved = (productId: string) => items.some((item) => item.productId === productId);

  return (
    <WishlistContext.Provider
      value={{ items, loading, addItem, removeItem, clearWishlist, isSaved, loadWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
