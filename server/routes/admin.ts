import { Router, Response } from "express";
import { randomUUID } from "node:crypto";
import Order from "../models/Order";
import Product from "../models/Product";
import Promotion from "../models/Promotion";
import Inventory from "../models/Inventory";
import User from "../models/User";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { adminMiddleware } from "../middleware/admin";
import { restoreInventory } from "../services/inventory";

const router = Router();
const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

router.use(authMiddleware, adminMiddleware);

router.get("/stats", async (_req: AuthRequest, res: Response) => {
  try {
    const [orders, products, activeProducts, promotions, users, lowStock] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      Product.countDocuments({ active: true }),
      Promotion.countDocuments({ active: true }),
      User.countDocuments(),
      Inventory.countDocuments({ stock: { $lte: 5 } }),
    ]);

    res.json({ stats: { orders, products, activeProducts, promotions, users, lowStock } });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: "Failed to load admin stats" });
  }
});

router.get("/orders", async (_req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("userId", "firstName lastName email")
      .lean();

    res.json({ orders });
  } catch (error) {
    console.error("Admin orders error:", error);
    res.status(500).json({ message: "Failed to load orders" });
  }
});

router.put("/orders/:orderId", async (req: AuthRequest, res: Response) => {
  try {
    const { status, trackingNumber, estimatedDelivery } = req.body;
    if (status !== undefined && !orderStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const previousStatus = order.orderStatus;
    if (status !== undefined) order.orderStatus = status;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber.trim() || undefined;
    if (estimatedDelivery !== undefined) {
      const parsedDate = new Date(estimatedDelivery);
      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid estimated delivery date" });
      }
      order.estimatedDelivery = parsedDate;
    }

    await order.save();

    if (status === "cancelled" && previousStatus !== "cancelled") {
      try {
        await restoreInventory(
          order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          }))
        );
      } catch (restoreError) {
        console.error("Failed to restore inventory after admin cancellation:", restoreError);
      }
    }

    res.json({ message: "Order updated", order });
  } catch (error) {
    console.error("Admin order update error:", error);
    res.status(500).json({ message: "Failed to update order" });
  }
});

router.get("/products", async (_req: AuthRequest, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    const productIds = products.map((product) => product.productId);
    const inventory = await Inventory.find({ productId: { $in: productIds } }).lean();
    const stockByProduct = new Map(inventory.map((item) => [item.productId, item.stock]));

    res.json({
      products: products.map((product) => ({
        ...product,
        stock: stockByProduct.get(product.productId) || 0,
      })),
    });
  } catch (error) {
    console.error("Admin products error:", error);
    res.status(500).json({ message: "Failed to load products" });
  }
});

router.post("/products", async (req: AuthRequest, res: Response) => {
  try {
    const { name, price, originalPrice, image, category, stock, ...details } = req.body;
    if (!name || !image || !category || !Number.isFinite(Number(price))) {
      return res.status(400).json({ message: "Name, price, image, and category are required" });
    }
    if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({ message: "Stock must be a non-negative whole number" });
    }

    const product = await Product.create({
      productId: randomUUID(),
      name,
      price: Number(price),
      originalPrice: originalPrice === "" ? undefined : Number(originalPrice),
      image,
      category,
      ...details,
    });
    await Inventory.create({ productId: product.productId, stock: Number(stock) });

    res.status(201).json({ message: "Product created", product: { ...product.toObject(), stock: Number(stock) } });
  } catch (error: any) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "A product with this identifier already exists" });
    }
    console.error("Admin product creation error:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
});

router.put("/products/:productId", async (req: AuthRequest, res: Response) => {
  try {
    const { stock, productId: ignoredProductId, ...updates } = req.body;
    const product = await Product.findOneAndUpdate(
      { productId: req.params.productId },
      updates,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (stock !== undefined) {
      if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
        return res.status(400).json({ message: "Stock must be a non-negative whole number" });
      }
      await Inventory.updateOne(
        { productId: product.productId },
        { $set: { stock: Number(stock) } },
        { upsert: true }
      );
    }

    const inventory = await Inventory.findOne({ productId: product.productId }).lean();
    res.json({ message: "Product updated", product: { ...product.toObject(), stock: inventory?.stock || 0 } });
  } catch (error) {
    console.error("Admin product update error:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
});

router.delete("/products/:productId", async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findOneAndUpdate(
      { productId: req.params.productId },
      { $set: { active: false } },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product archived", product });
  } catch (error) {
    console.error("Admin product archive error:", error);
    res.status(500).json({ message: "Failed to archive product" });
  }
});

router.get("/promotions", async (_req: AuthRequest, res: Response) => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 }).lean();
    res.json({ promotions });
  } catch (error) {
    console.error("Admin promotions error:", error);
    res.status(500).json({ message: "Failed to load promotions" });
  }
});

router.post("/promotions", async (req: AuthRequest, res: Response) => {
  try {
    const { code, name, type, value, startsAt, endsAt, active, usageLimit, categories, productIds } = req.body;
    if (!code || !name || !["percentage", "fixed"].includes(type) || !Number.isFinite(Number(value))) {
      return res.status(400).json({ message: "Code, name, type, and value are required" });
    }
    if (type === "percentage" && (Number(value) <= 0 || Number(value) > 100)) {
      return res.status(400).json({ message: "Percentage promotions must be between 1 and 100" });
    }
    if (type === "fixed" && Number(value) <= 0) {
      return res.status(400).json({ message: "Fixed promotions must be greater than zero" });
    }

    const promotion = await Promotion.create({
      code: code.trim().toUpperCase(),
      name,
      type,
      value: Number(value),
      startsAt: startsAt || undefined,
      endsAt: endsAt || undefined,
      active: active !== false,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      categories: Array.isArray(categories) ? categories : [],
      productIds: Array.isArray(productIds) ? productIds : [],
    });
    res.status(201).json({ message: "Promotion created", promotion });
  } catch (error: any) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Promotion code already exists" });
    }
    console.error("Admin promotion creation error:", error);
    res.status(500).json({ message: "Failed to create promotion" });
  }
});

router.put("/promotions/:promotionId", async (req: AuthRequest, res: Response) => {
  try {
    const { code, type, value, usageCount, ...updates } = req.body;
    if (type !== undefined && !["percentage", "fixed"].includes(type)) {
      return res.status(400).json({ message: "Invalid promotion type" });
    }
    if (value !== undefined && (!Number.isFinite(Number(value)) || Number(value) < 0)) {
      return res.status(400).json({ message: "Invalid promotion value" });
    }

    const promotion = await Promotion.findByIdAndUpdate(
      req.params.promotionId,
      {
        ...updates,
        ...(code !== undefined ? { code: code.trim().toUpperCase() } : {}),
        ...(type !== undefined ? { type } : {}),
        ...(value !== undefined ? { value: Number(value) } : {}),
        ...(usageCount !== undefined ? { usageCount: Number(usageCount) } : {}),
      },
      { new: true, runValidators: true }
    );
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.json({ message: "Promotion updated", promotion });
  } catch (error: any) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Promotion code already exists" });
    }
    console.error("Admin promotion update error:", error);
    res.status(500).json({ message: "Failed to update promotion" });
  }
});

router.delete("/promotions/:promotionId", async (req: AuthRequest, res: Response) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.promotionId);
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }
    res.json({ message: "Promotion deleted" });
  } catch (error) {
    console.error("Admin promotion deletion error:", error);
    res.status(500).json({ message: "Failed to delete promotion" });
  }
});

export default router;
