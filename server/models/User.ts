import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// ++ UPDATE THE INTERFACE ++
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;

  // Fields for tracking plan usage and subscription status
  planGeneratedCount: number;
  subscription: {
    plan: "free" | "premium";
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    expiresAt?: Date;
  };
}

interface UserModel extends Model<IUser> {
  // Add any static methods here if needed
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false, // Make optional for OAuth users
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ++ ADD THESE NEW FIELDS ++
    planGeneratedCount: {
      type: Number,
      default: 0,
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "premium"],
        default: "free",
      },
      razorpayPaymentId: {
        type: String,
      },
      razorpayOrderId: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving (no changes here)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    // It's better to pass the error to next()
    next(error as Error);
  }
});

const User = (mongoose.models.User ||
  mongoose.model<IUser, UserModel>("User", userSchema)) as UserModel;

export default User;
