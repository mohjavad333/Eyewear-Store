import { Router } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { Response } from "express";
import { InventoryError, validateCartInventory } from "../services/inventory";
import { PromotionError, validatePromotion } from "../services/promotions";

const router = Router();

// Get user's cart
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    let cart = await Cart.findOne({ userId: req.user?.id });

    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = new Cart({
        userId: req.user?.id,
        items: [],
      });
      await cart.save();
    }

    res.json({
      cart: {
        items: cart.items,
        shippingMethod: cart.shippingMethod,
        giftWrap: cart.giftWrap,
        coupon: cart.coupon,
        couponDiscount: cart.couponDiscount || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

// Add item to cart
router.post("/items", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity, variant } = req.body;

    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Missing or invalid required fields" });
    }

    const product = await Product.findOne({ productId, active: true }).lean();
    if (!product) {
      return res.status(404).json({ message: "Product is no longer available" });
    }

    let cart = await Cart.findOne({ userId: req.user?.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user?.id,
        items: [],
      });
    }

    // Check if item already in cart
    const existingItem = cart.items.find(
      (item) => item.productId === productId && item.variant === variant
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.name = product.name;
      existingItem.price = product.price;
      existingItem.originalPrice = product.originalPrice;
      existingItem.image = product.image;
      existingItem.category = product.category;
    } else {
      cart.items.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        quantity,
        variant,
        addedAt: new Date(),
      });
    }

    cart.coupon = undefined;
    cart.couponDiscount = 0;

    try {
      await validateCartInventory(
        cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      );
    } catch (error) {
      if (error instanceof InventoryError) {
        return res.status(409).json({
          message: error.message,
          code: error.code,
          available: error.available,
        });
      }
      throw error;
    }

    await cart.save();

    res.status(201).json({
      message: "Item added to cart",
      cart: {
        items: cart.items,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
});

// Update cart item quantity
router.put(
  "/items/:productId",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { productId } = req.params;
      const { quantity, variant } = req.body;

      if (!Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const cart = await Cart.findOne({ userId: req.user?.id });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.productId === productId && item.variant === variant
      );

      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart" });
      }

      if (quantity === 0) {
        // Remove item if quantity is 0
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = quantity;

        try {
          await validateCartInventory(
            cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            }))
          );
        } catch (error) {
          if (error instanceof InventoryError) {
            return res.status(409).json({
              message: error.message,
              code: error.code,
              available: error.available,
            });
          }
          throw error;
        }
      }

      cart.coupon = undefined;
      cart.couponDiscount = 0;
      await cart.save();

      res.json({
        message: "Cart updated",
        cart: {
          items: cart.items,
          itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        },
      });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ message: "Failed to update cart" });
    }
  }
);

// Remove item from cart
router.delete(
  "/items/:productId",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { productId } = req.params;
      const { variant } = req.body;

      const cart = await Cart.findOne({ userId: req.user?.id });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      cart.items = cart.items.filter(
        (item) => !(item.productId === productId && item.variant === variant)
      );
      cart.coupon = undefined;
      cart.couponDiscount = 0;

      await cart.save();

      res.json({
        message: "Item removed from cart",
        cart: {
          items: cart.items,
          itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        },
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove item" });
    }
  }
);

// Clear entire cart
router.delete("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ userId: req.user?.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.coupon = undefined;
    cart.couponDiscount = 0;
    cart.shippingMethod = undefined;
    cart.giftWrap = false;

    await cart.save();

    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

// Update shipping and options
router.put(
  "/shipping",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { shippingMethod, giftWrap, coupon } = req.body;

      const cart = await Cart.findOne({ userId: req.user?.id });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      if (shippingMethod !== undefined) {
        if (!["standard", "express", "overnight"].includes(shippingMethod)) {
          return res.status(400).json({ message: "Invalid shipping method" });
        }
        cart.shippingMethod = shippingMethod;
      }
      if (giftWrap !== undefined) {
        if (typeof giftWrap !== "boolean") {
          return res.status(400).json({ message: "Invalid gift wrap option" });
        }
        cart.giftWrap = giftWrap;
      }

      if (coupon !== undefined) {
        if (typeof coupon !== "string") {
          return res.status(400).json({ message: "Invalid promotion code" });
        }
        if (!coupon.trim()) {
          cart.coupon = undefined;
          cart.couponDiscount = 0;
        } else {
          try {
            const productIds = [...new Set(cart.items.map((item) => item.productId))];
            const products = await Product.find({
              productId: { $in: productIds },
              active: true,
            }).lean();
            const productsById = new Map(products.map((product) => [product.productId, product]));

            if (productsById.size !== productIds.length) {
              return res.status(409).json({ message: "One or more products are no longer available" });
            }

            const promotionItems = cart.items.map((item) => {
              const product = productsById.get(item.productId)!;
              item.name = product.name;
              item.price = product.price;
              item.originalPrice = product.originalPrice;
              item.image = product.image;
              item.category = product.category;

              return {
                productId: product.productId,
                category: product.category,
                price: product.price,
                quantity: item.quantity,
              };
            });
            const subtotal = promotionItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            const result = await validatePromotion(coupon, promotionItems, subtotal);
            cart.coupon = result.code;
            cart.couponDiscount = result.discount;
          } catch (error) {
            if (error instanceof PromotionError) {
              return res.status(400).json({ message: error.message, code: error.code });
            }
            throw error;
          }
        }
      }

      await cart.save();

      res.json({
        message: "Cart updated",
        cart: {
          items: cart.items,
          shippingMethod: cart.shippingMethod,
          giftWrap: cart.giftWrap,
          coupon: cart.coupon,
          couponDiscount: cart.couponDiscount || 0,
        },
      });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ message: "Failed to update cart" });
    }
  }
);

export default router;
