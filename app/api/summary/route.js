import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Crop from "@/lib/models/Crop";
import Expense from "@/lib/models/Expense";
import YieldModel from "@/lib/models/Yield";
import { computeFinancials } from "@/lib/analytics";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userId = currentUser._id.toString();

    const [user, crops, expenses, yields] = await Promise.all([
      User.findById(userId),
      Crop.find({ userId }).sort({ createdAt: -1 }),
      Expense.find({ userId }).sort({ date: -1 }),
      YieldModel.find({ userId }).sort({ date: -1 }),
    ]);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { cropSummaries, totals } = computeFinancials(crops, expenses, yields);

    const response = {
      user,
      crops,
      expenses,
      yields,
      cropSummaries,
      totals,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/summary error", error);
    return NextResponse.json({ message: "Unable to get summary" }, { status: 500 });
  }
}

