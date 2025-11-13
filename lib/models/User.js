import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: true },
    pincode: { type: String, required: true },
    farmSize: { type: Number, required: true },
  },
  { timestamps: true }
);

// Ensure only the correct indexes exist
UserSchema.index({ email: 1 }, { unique: true });

// Drop any old username index if it exists (handled at connection time)
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;

