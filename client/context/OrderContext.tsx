import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

export interface OrderSummary {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  itemCount: number;
  estimatedDelivery?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  image: string;
  category: string;
}

export interface ShippingAddress {
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

export interface OrderDetail {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  shippingCost: number;
  giftWrap: boolean;
  giftWrapCost: number;
  coupon?: string;
  discount: number;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
}

export interface OrderCreationResult {
  id: string;
  orderNumber: string;
  subtotal: number;
  discount: number;
  coupon?: string;
  shippingMethod: string;
  shippingCost: number;
  giftWrapCost: number;
  tax: number;
  total: number;
  status: string;
  estimatedDelivery?: string;
}

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

interface OrderContextType {
  orders: OrderSummary[];
  currentOrder: OrderDetail | null;
  loading: boolean;
  createOrder: (orderData: CreateOrderRequest) => Promise<OrderCreationResult>;
  loadOrders: () => Promise<void>;
  loadOrderDetail: (orderId: string) => Promise<OrderDetail>;
  cancelOrder: (orderId: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [currentOrder, setCurrentOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetail = async (orderId: string): Promise<OrderDetail> => {
    if (!token) throw new Error("Not authenticated");

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load order");
      }

      const data = await response.json();
      setCurrentOrder(data.order);
      return data.order;
    } catch (error) {
      console.error("Error loading order:", error);
      throw error;
    }
  };

  const createOrder = async (orderData: CreateOrderRequest): Promise<OrderCreationResult> => {
    if (!token) throw new Error("Not authenticated");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create order");
      }

      const data = await response.json();

      // Reload orders list
      await loadOrders();

      return data.order;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!token) throw new Error("Not authenticated");

    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      // Reload orders
      await loadOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        loading,
        createOrder,
        loadOrders,
        loadOrderDetail,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
