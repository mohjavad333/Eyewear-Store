import mongoose, { Document, Schema } from "mongoose";

export interface IInventory extends Document {
  productId: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Stock must be a whole number",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IInventory>("Inventory", inventorySchema);
