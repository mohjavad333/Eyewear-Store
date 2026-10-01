import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  quantity: number;
  variant?: string;
  addedAt?: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  loading: boolean;
  shippingMethod?: string;
  giftWrap: boolean;
  coupon?: string;
  couponDiscount: number;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: string, variant?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, variant?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  updateShipping: (
    shippingMethod?: string,
    giftWrap?: boolean,
    coupon?: string
  ) => Promise<void>;
  loadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<string | undefined>();
  const [giftWrap, setGiftWrap] = useState(false);
  const [coupon, setCoupon] = useState<string | undefined>();
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Load cart when authentication changes
  useEffect(() => {
    if (isAuthenticated && token) {
      loadCart();
    } else {
      // Clear cart when logged out
      setItems([]);
      setShippingMethod(undefined);
      setGiftWrap(false);
      setCoupon(undefined);
      setCouponDiscount(0);
    }
  }, [isAuthenticated, token]);

  const loadCart = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.cart.items || []);
        setShippingMethod(data.cart.shippingMethod);
        setGiftWrap(data.cart.giftWrap || false);
        setCoupon(data.cart.coupon);
        setCouponDiscount(data.cart.couponDiscount || 0);
      } else if (response.status === 401) {
        // Token invalid
        setItems([]);
        setShippingMethod(undefined);
        setGiftWrap(false);
        setCoupon(undefined);
        setCouponDiscount(0);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (newItem: CartItem) => {
    if (!token) {
      console.error("Not authenticated");
      return;
    }

    try {
      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: newItem.productId,
          name: newItem.name,
          price: newItem.price,
          originalPrice: newItem.originalPrice,
          image: newItem.image,
          category: newItem.category,
          quantity: newItem.quantity,
          variant: newItem.variant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const data = await response.json();
      setItems(data.cart.items);
      setCoupon(undefined);
      setCouponDiscount(0);
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const removeItem = async (productId: string, variant?: string) => {
    if (!token) return;

    try {
      const response = await fetch(`/api/cart/items/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ variant }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      const data = await response.json();
      setItems(data.cart.items);
      setCoupon(undefined);
      setCouponDiscount(0);
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const updateQuantity = async (
    productId: string,
    quantity: number,
    variant?: string
  ) => {
    if (!token) return;

    try {
      const response = await fetch(`/api/cart/items/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity, variant }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const data = await response.json();
      setItems(data.cart.items);
      setCoupon(undefined);
      setCouponDiscount(0);
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!token) return;

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      setItems([]);
      setShippingMethod(undefined);
      setGiftWrap(false);
      setCoupon(undefined);
      setCouponDiscount(0);
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  const updateShipping = async (
    shippingMethod?: string,
    giftWrap?: boolean,
    coupon?: string
  ) => {
    if (!token) return;

    try {
      const response = await fetch("/api/cart/shipping", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingMethod,
          giftWrap,
          coupon,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Failed to update shipping");
      }

      setShippingMethod(data.cart.shippingMethod);
      setGiftWrap(data.cart.giftWrap || false);
      setCoupon(data.cart.coupon);
      setCouponDiscount(data.cart.couponDiscount || 0);
    } catch (error) {
      console.error("Error updating shipping:", error);
      throw error;
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        loading,
        shippingMethod,
        giftWrap,
        coupon,
        couponDiscount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        updateShipping,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
