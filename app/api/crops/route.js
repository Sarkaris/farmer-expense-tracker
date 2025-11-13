import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Crop from "@/lib/models/Crop";
import Expense from "@/lib/models/Expense";
import YieldModel from "@/lib/models/Yield";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    // Only return crops for the authenticated user
    const crops = await Crop.find({ userId: currentUser._id.toString() }).sort({ createdAt: -1 });
    return NextResponse.json(crops);
  } catch (error) {
    console.error("GET /api/crops error", error);
    return NextResponse.json({ message: "Unable to fetch crops" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    // Ensure userId matches authenticated user
    body.userId = currentUser._id.toString();
    const created = await Crop.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/crops error", error);
    return NextResponse.json({ message: "Unable to create crop" }, { status: 500 });
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
      return NextResponse.json({ message: "Crop ID is required" }, { status: 400 });
    }

    // Verify crop belongs to user
    const crop = await Crop.findById(data._id);
    if (!crop || crop.userId !== currentUser._id.toString()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Ensure userId cannot be changed
    data.userId = currentUser._id.toString();
    const updated = await Crop.findByIdAndUpdate(data._id, data, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/crops error", error);
    return NextResponse.json({ message: "Unable to update crop" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Crop ID is required" }, { status: 400 });
    }

    // Verify crop belongs to user
    const crop = await Crop.findById(id);
    if (!crop || crop.userId !== currentUser._id.toString()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await Crop.findByIdAndDelete(id);
    await Expense.deleteMany({ cropId: id, userId: currentUser._id.toString() });
    await YieldModel.deleteMany({ cropId: id, userId: currentUser._id.toString() });
    return NextResponse.json({ message: "Crop deleted" });
  } catch (error) {
    console.error("DELETE /api/crops error", error);
    return NextResponse.json({ message: "Unable to delete crop" }, { status: 500 });
  }
}

