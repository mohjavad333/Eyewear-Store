import { Router } from "express";
import User from "../models/User";
import { generateToken, authMiddleware, AuthRequest } from "../middleware/auth";
import { Response } from "express";
import { authLimiter } from "../middleware/security";

const router = Router();

// Register
router.post("/register", authLimiter, async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Get current user
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update profile
router.put("/profile", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;
    const updates: Record<string, string> = {};

    for (const [field, value] of Object.entries({ firstName, lastName })) {
      if (value !== undefined) {
        if (typeof value !== "string" || !value.trim()) {
          return res.status(400).json({ message: `${field} is required` });
        }
        updates[field] = value.trim();
      }
    }

    if (phone !== undefined) {
      if (typeof phone !== "string") {
        return res.status(400).json({ message: "Phone must be text" });
      }
      updates.phone = phone.trim();
    }
    if (avatar !== undefined) {
      if (typeof avatar !== "string") {
        return res.status(400).json({ message: "Avatar must be a URL string" });
      }
      updates.avatar = avatar.trim();
    }

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error updating profile" });
  }
});

// Add address
router.post("/addresses", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { type, firstName, lastName, address, city, state, zip, country, isDefault } =
      req.body;

    if (
      !["shipping", "billing"].includes(type) ||
      ![firstName, lastName, address, city, state, zip, country].every(
        (value) => typeof value === "string" && value.trim()
      )
    ) {
      return res.status(400).json({ message: "Complete address details are required" });
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push({
      type,
      firstName,
      lastName,
      address,
      city,
      state,
      zip,
      country,
      isDefault: isDefault || false,
    });

    await user.save();

    res.status(201).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error adding address" });
  }
});

// Update address
router.put("/addresses/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { type, firstName, lastName, address, city, state, zip, country, isDefault } =
      req.body;

    if (
      !["shipping", "billing"].includes(type) ||
      ![firstName, lastName, address, city, state, zip, country].every(
        (value) => typeof value === "string" && value.trim()
      ) ||
      typeof isDefault !== "boolean"
    ) {
      return res.status(400).json({ message: "Complete address details are required" });
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const savedAddress = user.addresses.find(
      (item) => item._id?.toString() === req.params.id
    );
    if (!savedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (isDefault) {
      user.addresses.forEach((item) => {
        item.isDefault = item._id?.toString() === req.params.id;
      });
    }

    Object.assign(savedAddress, {
      type,
      firstName,
      lastName,
      address,
      city,
      state,
      zip,
      country,
      isDefault,
    });
    await user.save();

    res.json({ message: "Address updated successfully", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: "Server error updating address" });
  }
});

// Delete address
router.delete("/addresses/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses = user.addresses.filter((addr) => addr._id?.toString() !== req.params.id);
    await user.save();

    res.json({
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting address" });
  }
});

// Logout (client-side only, but provided for completeness)
router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

export default router;
