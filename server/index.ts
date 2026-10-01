import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { connectDB } from "./db";
import authRoutes from "./routes/auth";
import cartRoutes from "./routes/cart";
import ordersRoutes from "./routes/orders";
import wishlistRoutes from "./routes/wishlist";
import adminRoutes from "./routes/admin";
import productRoutes from "./routes/products";
import { handleNewsletterSubscribe } from "./routes/newsletter";
import { apiLimiter } from "./middleware/security";
import { getJwtSecret } from "./middleware/auth";
import { initializeInventory } from "./services/inventory";
import { initializeProducts } from "./services/catalog";

dotenv.config();

export function createServer(): Express {
  const app: Express = express();
  getJwtSecret();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:8080",
    })
  );
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: false, limit: "100kb" }));
  app.use("/api", apiLimiter);

  // Request logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // Health check
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Newsletter subscription (works without auth)
  app.post("/api/newsletter/subscribe", handleNewsletterSubscribe);

  // Connect to database (non-blocking)
  connectDB().then(async (connected) => {
    if (connected) {
      try {
        await initializeProducts();
        await initializeInventory();
      } catch (error) {
        console.error("Failed to initialize inventory:", error);
        return;
      }

      // Routes only available if DB is connected
      app.use("/api/auth", authRoutes);
      app.use("/api/cart", cartRoutes);
      app.use("/api/orders", ordersRoutes);
      app.use("/api/wishlist", wishlistRoutes);
      app.use("/api/admin", adminRoutes);
      app.use("/api/products", productRoutes);
    } else {
      // Provide stub endpoints that return helpful error
      app.use("/api/auth", (req, res) => {
        res.status(503).json({
          message: "Authentication service unavailable. MongoDB is not connected.",
          hint: "Start MongoDB and the auth endpoints will become available.",
          error: "DB_NOT_CONNECTED"
        });
      });
      app.use("/api/cart", (req, res) => {
        res.status(503).json({
          message: "Cart service unavailable. MongoDB is not connected.",
          error: "DB_NOT_CONNECTED"
        });
      });
      app.use("/api/orders", (req, res) => {
        res.status(503).json({
          message: "Order service unavailable. MongoDB is not connected.",
          error: "DB_NOT_CONNECTED"
        });
      });
      app.use("/api/wishlist", (req, res) => {
        res.status(503).json({
          message: "Wishlist service unavailable. MongoDB is not connected.",
          error: "DB_NOT_CONNECTED"
        });
      });
      app.use("/api/admin", (req, res) => {
        res.status(503).json({
          message: "Admin service unavailable. MongoDB is not connected.",
          error: "DB_NOT_CONNECTED"
        });
      });
      app.use("/api/products", (req, res) => {
        res.status(503).json({
          message: "Product catalog unavailable. MongoDB is not connected.",
          error: "DB_NOT_CONNECTED"
        });
      });
    }
  });

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Server error:", err);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}

// Start server
const app = createServer();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📱 Frontend: http://localhost:8080`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
});

export default app;
