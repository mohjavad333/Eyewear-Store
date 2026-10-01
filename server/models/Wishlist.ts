import mongoose, { Document, Schema } from "mongoose";

export interface IWishlistItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  discount?: number;
  addedDate: Date;
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
}

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  image: { type: String, required: true },
  category: { type: String, required: true },
  rating: Number,
  reviews: Number,
  discount: Number,
  addedDate: { type: Date, default: Date.now },
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 0 },
  isNew: Boolean,
});

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [wishlistItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IWishlist>("Wishlist", wishlistSchema);
