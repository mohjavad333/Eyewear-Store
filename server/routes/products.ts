import { Router, Response } from "express";
import Product from "../models/Product";
import Inventory from "../models/Inventory";

const router = Router();

router.get("/", async (_req, res: Response) => {
  try {
    const products = await Product.find({ active: true }).sort({ createdAt: -1 }).lean();
    const inventory = await Inventory.find({
      productId: { $in: products.map((product) => product.productId) },
    }).lean();
    const stockByProduct = new Map(inventory.map((item) => [item.productId, item.stock]));

    res.json({
      products: products.map((product) => ({
        ...product,
        stock: stockByProduct.get(product.productId) || 0,
        inStock: (stockByProduct.get(product.productId) || 0) > 0,
      })),
    });
  } catch (error) {
    console.error("Product catalog error:", error);
    res.status(500).json({ message: "Failed to load product catalog" });
  }
});

router.get("/:productId", async (req, res: Response) => {
  try {
    const product = await Product.findOne({
      productId: req.params.productId,
      active: true,
    }).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const inventory = await Inventory.findOne({ productId: product.productId }).lean();
    const stock = inventory?.stock || 0;

    res.json({ product: { ...product, stock, inStock: stock > 0 } });
  } catch (error) {
    console.error("Product detail error:", error);
    res.status(500).json({ message: "Failed to load product" });
  }
});

export default router;
