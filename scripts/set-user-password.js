// Script to set password for existing users
// Run with: node scripts/set-user-password.js <email> <password>

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in environment variables");
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pincode: { type: String, required: true },
  farmSize: { type: Number, required: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function setUserPassword(email, password) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to database");

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    if (password.length < 6) {
      console.error("Password must be at least 6 characters long");
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    console.log(`Password set successfully for ${email}`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: node scripts/set-user-password.js <email> <password>");
  process.exit(1);
}

setUserPassword(email, password);

