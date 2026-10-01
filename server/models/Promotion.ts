import mongoose, { Document, Schema } from "mongoose";

export type PromotionType = "percentage" | "fixed";

export interface IPromotion extends Document {
  code: string;
  name: string;
  type: PromotionType;
  value: number;
  startsAt?: Date;
  endsAt?: Date;
  active: boolean;
  usageLimit?: number;
  usageCount: number;
  categories: string[];
  productIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const promotionSchema = new Schema<IPromotion>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 },
    startsAt: Date,
    endsAt: Date,
    active: { type: Boolean, default: true },
    usageLimit: { type: Number, min: 1 },
    usageCount: { type: Number, default: 0, min: 0 },
    categories: { type: [String], default: [] },
    productIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IPromotion>("Promotion", promotionSchema);
