import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import User from "./models/User";

const SESSION_COOKIE_NAME = "farm-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export async function createSession(userId) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || null;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Get authenticated user - use this in API routes
export async function getAuthenticatedUser() {
  try {
    const userId = await getSession();
    if (!userId) {
      return null;
    }
    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return null;
    }
    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  } catch (error) {
    console.error("getAuthenticatedUser error:", error);
    return null;
  }
}

// Validate password requirements
export function validatePassword(password) {
  if (!password || password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters long" };
  }
  return { valid: true };
}
