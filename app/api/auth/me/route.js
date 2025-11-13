import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user.toObject();
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { message: "Unable to get user" },
      { status: 500 }
    );
  }
}

