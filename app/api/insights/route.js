import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Crop from "@/lib/models/Crop";
import Expense from "@/lib/models/Expense";
import Yield from "@/lib/models/Yield";
import { getGeminiInsights } from "@/lib/ai";
import { distributeExpense } from "@/lib/distribution";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userId = currentUser._id.toString();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const crops = await Crop.find({ userId }).lean();
    const expenses = await Expense.find({ userId }).lean();
    const yields = await Yield.find({ userId }).lean();

    // Calculate totals
    let totalExpense = 0;
    const expenseMap = new Map();

    expenses.forEach((exp) => {
      if (exp.shared && exp.sharedBetween?.length) {
        const sharedCrops = crops.filter((c) => exp.sharedBetween.includes(c._id.toString()));
        const distribution = distributeExpense(exp.amount, sharedCrops);
        distribution.forEach((d) => {
          const current = expenseMap.get(d.cropId.toString()) || 0;
          expenseMap.set(d.cropId.toString(), current + d.share);
        });
      } else if (exp.cropId) {
        const current = expenseMap.get(exp.cropId.toString()) || 0;
        expenseMap.set(exp.cropId.toString(), current + exp.amount);
      }
      totalExpense += exp.amount;
    });

    let totalRevenue = 0;
    const revenueMap = new Map();
    yields.forEach((y) => {
      const revenue = (y.totalYield || 0) * (y.pricePerUnit || 0);
      if (y.cropId) {
        const current = revenueMap.get(y.cropId.toString()) || 0;
        revenueMap.set(y.cropId.toString(), current + revenue);
      }
      totalRevenue += revenue;
    });

    const cropSummaries = crops.map((crop) => ({
      name: crop.name,
      area: crop.area,
      expense: expenseMap.get(crop._id.toString()) || 0,
      revenue: revenueMap.get(crop._id.toString()) || 0,
      profit: (revenueMap.get(crop._id.toString()) || 0) - (expenseMap.get(crop._id.toString()) || 0),
    }));

    const totals = {
      expense: totalExpense,
      revenue: totalRevenue,
      profit: totalRevenue - totalExpense,
    };

    // Build prompt for Gemini
    const prompt = `You are an agricultural advisor analyzing a farm's financial performance. 

Farm Details:
- Location: Pincode ${user.pincode}
- Farm Size: ${user.farmSize} acres
- Farmer: ${user.name}

Crops Summary:
${cropSummaries.length > 0 ? cropSummaries.map((c) => `- ${c.name}: ${c.area} acres, Expenses: ₹${c.expense.toFixed(2)}, Revenue: ₹${c.revenue.toFixed(2)}, Profit: ₹${c.profit.toFixed(2)}`).join("\n") : "No crops recorded yet."}

Overall Performance:
- Total Expenses: ₹${totals.expense.toFixed(2)}
- Total Revenue: ₹${totals.revenue.toFixed(2)}
- Net Profit: ₹${totals.profit.toFixed(2)}

Provide concise, actionable insights (3-4 paragraphs) focusing on:
1. Which crops are most/least profitable
2. Cost optimization opportunities
3. Recommendations for improving profitability
4. Seasonal planning suggestions based on the data

Keep the tone professional but accessible for farmers.`;

    const insights = await getGeminiInsights(prompt);

    return NextResponse.json({
      insights,
      cropSummaries,
      totals,
    });
  } catch (error) {
    console.error("POST /api/insights error", error);
    return NextResponse.json(
      { message: error.message || "Unable to generate insights" },
      { status: 500 }
    );
  }
}

