import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { verifyPassword, createSession, hashPassword, validatePassword } from "@/lib/auth";

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
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user has a password set
    if (!user.password || user.password.trim() === '') {
      return NextResponse.json(
        { message: "Please set a password for your account. Use the registration page or contact support." },
        { status: 401 }
      );
    }

    // Always verify password - no exceptions
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    await createSession(user._id.toString());

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user.toObject();
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Unable to login. Please try again." },
      { status: 500 }
    );
  }
}

