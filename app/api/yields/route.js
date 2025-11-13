import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import YieldModel from "@/lib/models/Yield";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = { userId: currentUser._id.toString() };
    if (searchParams.get("cropId")) {
      query.cropId = searchParams.get("cropId");
    }
    const yields = await YieldModel.find(query).sort({ date: -1 });
    return NextResponse.json(yields);
  } catch (error) {
    console.error("GET /api/yields error", error);
    return NextResponse.json({ message: "Unable to fetch yields" }, { status: 500 });
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
    body.userId = currentUser._id.toString();
    const created = await YieldModel.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/yields error", error);
    return NextResponse.json({ message: "Unable to create yield" }, { status: 500 });
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
      return NextResponse.json({ message: "Yield ID is required" }, { status: 400 });
    }

    // Verify yield belongs to user
    const yieldRecord = await YieldModel.findById(data._id);
    if (!yieldRecord || yieldRecord.userId !== currentUser._id.toString()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    data.userId = currentUser._id.toString();
    const updated = await YieldModel.findByIdAndUpdate(data._id, data, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/yields error", error);
    return NextResponse.json({ message: "Unable to update yield" }, { status: 500 });
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
      return NextResponse.json({ message: "Yield ID is required" }, { status: 400 });
    }

    // Verify yield belongs to user
    const yieldRecord = await YieldModel.findById(id);
    if (!yieldRecord || yieldRecord.userId !== currentUser._id.toString()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await YieldModel.findByIdAndDelete(id);
    return NextResponse.json({ message: "Yield deleted" });
  } catch (error) {
    console.error("DELETE /api/yields error", error);
    return NextResponse.json({ message: "Unable to delete yield" }, { status: 500 });
  }
}

