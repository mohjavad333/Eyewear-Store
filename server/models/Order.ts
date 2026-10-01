import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  image: string;
  category: string;
}

export interface IShippingAddress {
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

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
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
  paymentStatus: "pending" | "completed" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema({
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
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  variant: String,
  image: String,
  category: String,
});

const shippingAddressSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    shippingMethod: {
      type: String,
      enum: ["standard", "express", "overnight"],
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    giftWrap: {
      type: Boolean,
      default: false,
    },
    giftWrapCost: {
      type: Number,
      default: 0,
    },
    coupon: String,
    discount: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["credit", "paypal", "apple", "google"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>("Order", orderSchema);
