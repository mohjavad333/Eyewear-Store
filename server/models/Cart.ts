import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  quantity: number;
  variant?: string;
  addedAt: Date;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  shippingMethod?: string;
  giftWrap?: boolean;
  coupon?: string;
  couponDiscount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: Number,
  image: String,
  category: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  variant: String,
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    shippingMethod: String,
    giftWrap: {
      type: Boolean,
      default: false,
    },
    coupon: String,
    couponDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICart>("Cart", cartSchema);
