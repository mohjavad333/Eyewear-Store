import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "admin";
  phone?: string;
  avatar?: string;
  addresses: {
    _id?: mongoose.Types.ObjectId;
    type: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    addresses: [
      {
        type: {
          type: String,
          enum: ["shipping", "billing"],
          required: true,
        },
        firstName: {
          type: String,
        },
        lastName: {
          type: String,
        },
        address: {
          type: String,
        },
        city: {
          type: String,
        },
        state: {
          type: String,
        },
        zip: {
          type: String,
        },
        country: {
          type: String,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
