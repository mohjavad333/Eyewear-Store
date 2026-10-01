import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand?: string;
  material?: string;
  color?: string;
  gender?: string;
  lensType?: string;
  frameSize?: string;
  rating?: number;
  reviews?: number;
  isNew: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    productId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    image: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    material: { type: String, trim: true },
    color: { type: String, trim: true },
    gender: { type: String, trim: true },
    lensType: { type: String, trim: true },
    frameSize: { type: String, trim: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, min: 0, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
