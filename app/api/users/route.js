import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { hashPassword, validatePassword, getAuthenticatedUser } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    if (email) {
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.toObject();
      return NextResponse.json(userWithoutPassword);
    }
    const users = await User.find().sort({ createdAt: -1 }).select("-password");
    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/users error", error);
    return NextResponse.json({ message: "Unable to fetch users" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Check if password is provided
    if (!body.password || body.password.trim() === '') {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email: body.email });
    if (existing) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
    }
    
    // Validate password requirements
    const passwordValidation = validatePassword(body.password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { message: passwordValidation.message },
        { status: 400 }
      );
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(body.password);
    
    // Create user using mongoose directly - ensure password is included
    const newUser = new User();
    newUser.name = body.name;
    newUser.email = body.email;
    newUser.password = hashedPassword;
    newUser.pincode = body.pincode;
    newUser.farmSize = body.farmSize;
    
    // Mark password as modified to ensure it's saved
    newUser.markModified('password');
    
    // Save user
    const created = await newUser.save();
    
    // Double-check: Update password explicitly using findByIdAndUpdate
    await User.findByIdAndUpdate(
      created._id,
      { $set: { password: hashedPassword } },
      { new: false }
    );
    
    // Verify password was saved
    const verifyUser = await User.findById(created._id);
    if (!verifyUser || !verifyUser.password) {
      console.error("Password verification failed! User ID:", created._id);
      await User.findByIdAndDelete(created._id);
      return NextResponse.json(
        { message: "Error: Password was not saved. Please try again." },
        { status: 500 }
      );
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = created.toObject();
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error", error);
    
    // Handle duplicate key errors more gracefully
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      if (field === 'username') {
        return NextResponse.json(
          { message: "Database configuration error. Please contact support or run the fix script." },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { message: `User with this ${field} already exists` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: error.message || "Unable to create user" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    if (!data._id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Ensure user can only update their own profile
    if (data._id !== currentUser._id.toString()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    
    // Hash password if it's being updated
    if (data.password) {
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.valid) {
        return NextResponse.json(
          { message: passwordValidation.message },
          { status: 400 }
        );
      }
      data.password = await hashPassword(data.password);
    }
    
    const updated = await User.findByIdAndUpdate(data._id, data, { new: true });
    // Remove password from response
    const { password: _, ...userWithoutPassword } = updated.toObject();
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("PUT /api/users error", error);
    return NextResponse.json({ message: "Unable to update user" }, { status: 500 });
  }
}

