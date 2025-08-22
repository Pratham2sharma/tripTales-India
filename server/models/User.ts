import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserModel extends Model<IUser> {
  // Add any static methods here if needed
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("error in hashing password" , error);
  }
});

const User = (mongoose.models.User || mongoose.model<IUser, UserModel>("User", userSchema)) as UserModel;

export default User;