import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { hashPassword, validatePassword } from "@/lib/auth";

// This endpoint allows setting password for existing users without password
// Can be called without authentication for initial password setup
export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Validate password requirements
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { message: passwordValidation.message },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Only allow setting password if user doesn't have one
    if (user.password && user.password.trim() !== '') {
      return NextResponse.json(
        { message: "User already has a password. Use forgot password to reset." },
        { status: 400 }
      );
    }

    // Set password
    user.password = await hashPassword(password);
    await user.save();

    return NextResponse.json({ message: "Password set successfully. You can now login." });
  } catch (error) {
    console.error("Set password error:", error);
    return NextResponse.json(
      { message: "Unable to set password" },
      { status: 500 }
    );
  }
}

