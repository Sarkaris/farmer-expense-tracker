import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Expense from "@/lib/models/Expense";
import Crop from "@/lib/models/Crop";
import { distributeExpense } from "@/lib/distribution";
import { getAuthenticatedUser } from "@/lib/auth";

function parseSearchParams(request) {
  const { searchParams } = new URL(request.url);
  const params = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

async function buildDistribution(expenseData) {
  if (!expenseData.shared) {
    return [];
  }

  let crops = [];
  if (expenseData.sharedBetween?.length) {
    crops = await Crop.find({ _id: { $in: expenseData.sharedBetween } });
  } else if (expenseData.userId) {
    crops = await Crop.find({ userId: expenseData.userId });
    expenseData.sharedBetween = crops.map((c) => c._id);
  }

  if (!crops.length) {
    return [];
  }

  return distributeExpense(Number(expenseData.amount) || 0, crops);
}

export async function GET(request) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const params = parseSearchParams(request);
    const query = { userId: currentUser._id.toString() };
    if (params.cropId) {
      query.$or = [{ cropId: params.cropId }, { "distributedShares.cropId": params.cropId }];
    }
    const expenses = await Expense.find(query).sort({ date: -1 });
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("GET /api/expenses error", error);
    return NextResponse.json({ message: "Unable to fetch expenses" }, { status: 500 });
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
    const distributedShares = await buildDistribution(body);
    const payload = { ...body, distributedShares };
    const created = await Expense.create(payload);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/expenses error", error);
    return NextResponse.json({ message: "Unable to create expense" }, { status: 500 });
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
      return NextResponse.json({ message: "Expense ID is required" }, { status: 400 });
    }

    // Verify expense belongs to user
    const expense = await Expense.findById(data._id);
    if (!expense || expense.userId !== currentUser._id.toString()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    data.userId = currentUser._id.toString();
    const distributedShares = await buildDistribution(data);
    const updated = await Expense.findByIdAndUpdate(
      data._id,
      { ...data, distributedShares },
      { new: true }
    );
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/expenses error", error);
    return NextResponse.json({ message: "Unable to update expense" }, { status: 500 });
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
      return NextResponse.json({ message: "Expense ID is required" }, { status: 400 });
    }

    // Verify expense belongs to user
    const expense = await Expense.findById(id);
    if (!expense || expense.userId !== currentUser._id.toString()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await Expense.findByIdAndDelete(id);
    return NextResponse.json({ message: "Expense deleted" });
  } catch (error) {
    console.error("DELETE /api/expenses error", error);
    return NextResponse.json({ message: "Unable to delete expense" }, { status: 500 });
  }
}

