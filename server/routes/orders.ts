import { Router } from "express";
import Order from "../models/Order";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { Response } from "express";
import { orderCreationLimiter } from "../middleware/security";
import { adminMiddleware } from "../middleware/admin";
import {
  PromotionError,
  restorePromotionUsage,
  reservePromotionUsage,
  validatePromotion,
} from "../services/promotions";
import {
  decrementInventory,
  InventoryError,
  restoreInventory,
  validateCartInventory,
} from "../services/inventory";

const router = Router();

// Generate unique order number
function generateOrderNumber(): string {
  const prefix = "ORD";
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
}

// Get user's orders
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user?.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      orders: orders.map((order) => ({
        id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.orderStatus,
        createdAt: order.createdAt,
        itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
        estimatedDelivery: order.estimatedDelivery,
      })),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Get single order details
router.get("/:orderId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user?.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

const shippingCosts = {
  standard: 10,
  express: 25,
  overnight: 45,
} as const;

type ShippingMethod = keyof typeof shippingCosts;

function isShippingMethod(value: unknown): value is ShippingMethod {
  return typeof value === "string" && value in shippingCosts;
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

// Create new order (from checkout)
router.post("/", orderCreationLimiter, authMiddleware, async (req: AuthRequest, res: Response) => {
  let inventoryItems: { productId: string; quantity: number }[] = [];
  let inventoryDecremented = false;
  let promotionReserved = false;
  let reservedCoupon: string | undefined;
  let orderSaved = false;

  try {
    const { shippingAddress, paymentMethod } = req.body;
    const hasCompleteShippingAddress =
      shippingAddress &&
      ["firstName", "lastName", "email", "phone", "address", "city", "state", "zip", "country"].every(
        (field) => typeof shippingAddress[field] === "string" && shippingAddress[field].trim()
      );

    if (!hasCompleteShippingAddress) {
      return res.status(400).json({ message: "A complete shipping address is required" });
    }

    if (!["credit", "paypal", "apple", "google"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const cart = await Cart.findOne({ userId: req.user?.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    if (!isShippingMethod(cart.shippingMethod)) {
      return res.status(400).json({ message: "Choose a valid shipping method before checkout" });
    }

    const productIds = [...new Set(cart.items.map((item) => item.productId))];
    const products = await Product.find({
      productId: { $in: productIds },
      active: true,
    }).lean();
    const productsById = new Map(products.map((product) => [product.productId, product]));

    if (productsById.size !== productIds.length) {
      return res.status(409).json({ message: "One or more products are no longer available" });
    }

    const items = cart.items.map((cartItem) => {
      const product = productsById.get(cartItem.productId)!;

      return {
        productId: product.productId,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        variant: cartItem.variant,
        image: product.image,
        category: product.category,
      };
    });
    inventoryItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const subtotal = roundCurrency(
      items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );
    let coupon: string | undefined;
    let discount = 0;

    if (cart.coupon) {
      try {
        const promotion = await validatePromotion(cart.coupon, items, subtotal);
        coupon = promotion.code;
        discount = promotion.discount;
        await reservePromotionUsage(coupon);
        reservedCoupon = coupon;
        promotionReserved = true;
      } catch (error) {
        if (error instanceof PromotionError) {
          cart.coupon = undefined;
          cart.couponDiscount = 0;
          await cart.save();
        }
        throw error;
      }
    }

    const shippingMethod = cart.shippingMethod;
    const shippingCost = shippingCosts[shippingMethod];
    const giftWrap = cart.giftWrap || false;
    const giftWrapCost = giftWrap ? 5 : 0;
    const tax = roundCurrency((subtotal - discount) * 0.08);
    const total = roundCurrency(subtotal - discount + shippingCost + giftWrapCost + tax);

    await validateCartInventory(inventoryItems);
    await decrementInventory(inventoryItems);
    inventoryDecremented = true;

    const order = new Order({
      userId: req.user?.id,
      orderNumber: generateOrderNumber(),
      items,
      shippingAddress,
      shippingMethod,
      shippingCost,
      giftWrap,
      giftWrapCost,
      coupon,
      discount,
      subtotal,
      tax,
      total,
      paymentMethod,
      paymentStatus: "completed",
      orderStatus: "pending",
      estimatedDelivery: calculateEstimatedDelivery(shippingMethod),
    });

    await order.save();
    orderSaved = true;

    try {
      await Cart.updateOne(
        { userId: req.user?.id },
        {
          $set: {
            items: [],
            coupon: undefined,
            couponDiscount: 0,
            shippingMethod: undefined,
            giftWrap: false,
          },
        }
      );
    } catch (cartError) {
      console.error("Failed to clear cart after order creation:", cartError);
    }

    res.status(201).json({
      message: "Order created successfully",
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        subtotal: order.subtotal,
        discount: order.discount,
        coupon: order.coupon,
        shippingMethod: order.shippingMethod,
        shippingCost: order.shippingCost,
        giftWrapCost: order.giftWrapCost,
        tax: order.tax,
        total: order.total,
        status: order.orderStatus,
        estimatedDelivery: order.estimatedDelivery,
      },
    });
  } catch (error) {
    if (inventoryDecremented && !orderSaved) {
      try {
        await restoreInventory(inventoryItems);
      } catch (restoreError) {
        console.error("Failed to restore inventory after order error:", restoreError);
      }
    }

    if (promotionReserved && reservedCoupon && !orderSaved) {
      try {
        await restorePromotionUsage(reservedCoupon);
      } catch (restoreError) {
        console.error("Failed to restore promotion usage after order error:", restoreError);
      }
    }

    if (error instanceof PromotionError) {
      return res.status(400).json({ message: error.message, code: error.code });
    }

    if (error instanceof InventoryError) {
      return res.status(409).json({
        message: error.message,
        code: error.code,
        available: error.available,
      });
    }

    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// Update order status
router.put(
  "/:orderId/status",
  authMiddleware,
  adminMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { status, trackingNumber } = req.body;
      if (status && !["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid order status" });
      }

      const order = await Order.findById(req.params.orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const previousStatus = order.orderStatus;
      if (status) order.orderStatus = status;
      if (trackingNumber) order.trackingNumber = trackingNumber;

      await order.save();

      if (status === "cancelled" && previousStatus !== "cancelled") {
        await restoreInventory(
          order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          }))
        );
      }

      res.json({
        message: "Order updated",
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          status: order.orderStatus,
          trackingNumber: order.trackingNumber,
        },
      });
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  }
);

// Cancel order
router.put(
  "/:orderId/cancel",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const order = await Order.findOne({
        _id: req.params.orderId,
        userId: req.user?.id,
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Only allow cancellation of pending/processing orders
      if (!["pending", "processing"].includes(order.orderStatus)) {
        return res.status(400).json({
          message: `Cannot cancel ${order.orderStatus} order`,
        });
      }

      order.orderStatus = "cancelled";
      await order.save();

      try {
        await restoreInventory(
          order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          }))
        );
      } catch (restoreError) {
        console.error("Failed to restore inventory after cancellation:", restoreError);
      }

      res.json({
        message: "Order cancelled",
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          status: order.orderStatus,
        },
      });
    } catch (error) {
      console.error("Error cancelling order:", error);
      res.status(500).json({ message: "Failed to cancel order" });
    }
  }
);

// Helper function to calculate estimated delivery
function calculateEstimatedDelivery(shippingMethod: ShippingMethod): Date {
  const now = new Date();
  const days =
    shippingMethod === "standard"
      ? 5 + Math.random() * 3
      : shippingMethod === "express"
      ? 2 + Math.random() * 1
      : 1;

  const estimatedDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return estimatedDate;
}

export default router;
