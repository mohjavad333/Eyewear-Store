import mongoose, { Document, Schema } from "mongoose";

export interface INewsletter extends Document {
  email: string;
  subscribedAt: Date;
}

const newsletterSchema = new Schema<INewsletter>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<INewsletter>("Newsletter", newsletterSchema);
