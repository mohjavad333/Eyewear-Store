import { Router } from "express";
import Wishlist from "../models/Wishlist";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { Response } from "express";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user?.id });
    res.json({ items: wishlist?.items || [] });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
});

router.post("/items", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      productId,
      name,
      price,
      originalPrice,
      image,
      category,
      rating,
      reviews,
      discount,
      inStock,
      stockCount,
      isNew,
    } = req.body;

    if (!productId || !name || price === undefined || !image || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user?.id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user?.id, items: [] });
    }

    const alreadySaved = wishlist.items.some((item) => item.productId === productId);
    if (!alreadySaved) {
      wishlist.items.push({
        productId,
        name,
        price,
        originalPrice,
        image,
        category,
        rating,
        reviews,
        discount,
        inStock: inStock ?? true,
        stockCount: stockCount ?? 0,
        isNew,
        addedDate: new Date(),
      });
      await wishlist.save();
    }

    res.status(201).json({
      message: alreadySaved ? "Item already in wishlist" : "Item added to wishlist",
      items: wishlist.items,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Failed to add item to wishlist" });
  }
});

router.delete("/items/:productId", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user?.id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter((item) => item.productId !== req.params.productId);
    await wishlist.save();

    res.json({ message: "Item removed from wishlist", items: wishlist.items });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Failed to remove item from wishlist" });
  }
});

router.delete("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user?.id });
    if (!wishlist) {
      return res.json({ message: "Wishlist cleared", items: [] });
    }

    wishlist.items = [];
    await wishlist.save();
    res.json({ message: "Wishlist cleared", items: [] });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    res.status(500).json({ message: "Failed to clear wishlist" });
  }
});

export default router;
