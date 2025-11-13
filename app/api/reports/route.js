import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Crop from "@/lib/models/Crop";
import Expense from "@/lib/models/Expense";
import YieldModel from "@/lib/models/Yield";
import { computeFinancials, buildInsightPrompt } from "@/lib/analytics";
import { getGeminiInsights } from "@/lib/ai";
import { getWeatherByPincode, getForecastByPincode } from "@/lib/weather";
import { getAuthenticatedUser } from "@/lib/auth";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import JSZip from "jszip";

export const runtime = "nodejs";

const formatCurrency = (value) => `INR ${Number(value || 0).toFixed(2)}`;

function ensureNodeCanvas() {
  if (typeof global.window === "undefined") {
    global.window = {
      document: {
        createElementNS: () => ({ style: {} }),
        createElement: () => ({ style: {} }),
      },
      location: {
        protocol: "file:",
        host: "localhost",
        hostname: "localhost",
        port: "",
        pathname: "/",
        search: "",
        hash: "",
        href: "file://localhost/",
      },
    };
  }
  if (typeof global.document === "undefined") {
    global.document = global.window.document;
  }
  if (typeof global.navigator === "undefined") {
    global.navigator = { userAgent: "node.js" };
  }
  if (typeof global.location === "undefined") {
    global.location = global.window.location;
  }
}

function buildExpenseRow(expense, crops) {
  const cropName = (id) => {
    if (!id) return "N/A";
    const crop = crops.find((c) => c._id?.toString() === id?.toString());
    return crop?.name || "N/A";
  };
  
  const sharedDetails = expense.distributedShares?.length
    ? expense.distributedShares
        .map((share) => `${cropName(share.cropId)}: ${formatCurrency(share.share)}`)
        .join("; ")
    : "-";
  
  // Ensure all values are strings and properly formatted
  return [
    expense.date ? new Date(expense.date).toLocaleDateString("en-IN") : "-",
    String(expense.type || "-"),
    formatCurrency(expense.amount),
    expense.shared ? "Yes" : "No",
    expense.shared ? String(sharedDetails) : String(cropName(expense.cropId)),
    String(expense.description || "-"),
  ];
}

async function buildPdf({ user, crops, cropSummaries, totals, expenses, yields, insights, weather }) {
  ensureNodeCanvas();
  
  try {
    const doc = new jsPDF();
    const topMargin = 16;

    doc.setFontSize(16);
    doc.text("Farm Expense & Yield Report", 14, topMargin);
    doc.setFontSize(11);
    doc.text(`Farmer: ${user.name}`, 14, topMargin + 10);
    doc.text(`Email: ${user.email}`, 14, topMargin + 16);
    doc.text(`Pincode: ${user.pincode}`, 14, topMargin + 22);
    doc.text(`Farm Size: ${user.farmSize} acres`, 14, topMargin + 28);

    autoTable(doc, {
      startY: topMargin + 36,
      head: [["Metric", "Amount (INR)"]],
      body: [
        ["Total Expense", formatCurrency(totals.expense)],
        ["Total Revenue", formatCurrency(totals.revenue)],
        ["Net Profit", formatCurrency(totals.profit)],
      ],
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [26, 40, 65] },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Crop", "Area (acres)", "Expense (INR)", "Revenue (INR)", "Profit (INR)"]],
      body: cropSummaries.map((crop) => [
        crop.name,
        crop.area,
        formatCurrency(crop.expense),
        formatCurrency(crop.revenue),
        formatCurrency(crop.profit),
      ]),
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 101, 52] },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Date", "Type", "Amount", "Shared", "Details", "Notes"]],
      body: expenses.map((expense) => buildExpenseRow(expense, crops)),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [14, 116, 144] },
      theme: "striped",
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Date", "Crop", "Yield", "Price/Unit", "Revenue"]],
      body: yields.map((entry) => [
        new Date(entry.date).toLocaleDateString("en-IN"),
        crops.find((c) => c._id.toString() === entry.cropId.toString())?.name ||
          cropSummaries.find((c) => c.cropId === entry.cropId.toString())?.name ||
          "N/A",
        entry.totalYield,
        entry.pricePerUnit,
        formatCurrency(Number(entry.totalYield || 0) * Number(entry.pricePerUnit || 0)),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
      theme: "grid",
    });

    const insightStart = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 12 : topMargin + 42;
    doc.setFontSize(12);
    doc.text("Gemini AI Insights", 14, insightStart);
    doc.setFontSize(10);
    doc.text(insights || "No AI insights available.", 14, insightStart + 8, {
      maxWidth: 180,
    });

    const weatherLine = weather
      ? `Weather in ${weather.location || "farm region"}: ${weather.description}, ${weather.temperature}°C, humidity ${weather.humidity}%`
      : "Weather data unavailable.";
    doc.text(weatherLine, 14, doc.lastAutoTable.finalY + 30, {
      maxWidth: 180,
    });

    return doc.output("arraybuffer");
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
}

function buildWorkbook({ user, crops, cropSummaries, totals, expenses, yields, insights, weather, forecast }) {
  const workbook = XLSX.utils.book_new();

  const summarySheet = XLSX.utils.aoa_to_sheet([
    ["Farmer", user.name],
    ["Email", user.email],
    ["Pincode", user.pincode],
    ["Farm Size (acres)", user.farmSize],
    [],
    ["Metric", "Amount (INR)"],
    ["Total Expense", formatCurrency(totals.expense)],
    ["Total Revenue", formatCurrency(totals.revenue)],
    ["Net Profit", formatCurrency(totals.profit)],
  ]);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  const cropSheet = XLSX.utils.aoa_to_sheet([
    ["Crop", "Area (acres)", "Expense (INR)", "Revenue (INR)", "Profit (INR)"],
    ...cropSummaries.map((crop) => [
      crop.name,
      crop.area,
      formatCurrency(crop.expense),
      formatCurrency(crop.revenue),
      formatCurrency(crop.profit),
    ]),
  ]);
  XLSX.utils.book_append_sheet(workbook, cropSheet, "Crops");

  const expenseSheet = XLSX.utils.aoa_to_sheet([
    ["Date", "Type", "Amount (INR)", "Shared", "Details", "Notes"],
    ...expenses.map((expense) => buildExpenseRow(expense, crops)),
  ]);
  XLSX.utils.book_append_sheet(workbook, expenseSheet, "Expenses");

  const yieldSheet = XLSX.utils.aoa_to_sheet([
    ["Date", "Crop", "Yield", "Price/Unit (INR)", "Revenue (INR)"],
    ...yields.map((entry) => [
      new Date(entry.date).toLocaleDateString("en-IN"),
      crops.find((c) => c._id.toString() === entry.cropId.toString())?.name ||
        cropSummaries.find((c) => c.cropId === entry.cropId.toString())?.name ||
        "N/A",
      entry.totalYield,
      entry.pricePerUnit,
      formatCurrency(Number(entry.totalYield || 0) * Number(entry.pricePerUnit || 0)),
    ]),
  ]);
  XLSX.utils.book_append_sheet(workbook, yieldSheet, "Yields");

  const weatherSheet = XLSX.utils.aoa_to_sheet([
    ["Current Weather", weather ? `${weather.description} at ${weather.temperature}°C` : "Unavailable"],
    ["Humidity", weather?.humidity ?? "N/A"],
    [],
    ["Forecast Date", "Rainfall (mm)", "Day Temp (°C)", "Night Temp (°C)", "Description"],
    ...(forecast || []).map((item) => [
      new Date(item.date).toLocaleDateString("en-IN"),
      item.rainfall ?? 0,
      item.tempDay ?? "-",
      item.tempNight ?? "-",
      item.description ?? "-",
    ]),
  ]);
  XLSX.utils.book_append_sheet(workbook, weatherSheet, "Weather");

  const insightSheet = XLSX.utils.aoa_to_sheet([["Gemini AI Insights"], [insights || "No insights available."]]);
  XLSX.utils.book_append_sheet(workbook, insightSheet, "AI Insights");

  return XLSX.write(workbook, { bookType: "xlsx", type: "array" });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const demoMode = searchParams.get("demo") === "true";
    
    let user, crops, expenses, yields;
    
    if (demoMode) {
      // Use demo data
      const { DEMO_USER, DEMO_CROPS, DEMO_EXPENSES, DEMO_YIELDS } = await import("@/lib/demoData");
      user = DEMO_USER;
      crops = DEMO_CROPS;
      expenses = DEMO_EXPENSES;
      yields = DEMO_YIELDS;
    } else {
      const currentUser = await getAuthenticatedUser();
      if (!currentUser) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      await connectDB();
      const userId = currentUser._id.toString();
      [user, crops, expenses, yields] = await Promise.all([
        User.findById(userId),
        Crop.find({ userId }),
        Expense.find({ userId }),
        YieldModel.find({ userId }),
      ]);

      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
    }

    const { cropSummaries, totals } = computeFinancials(crops, expenses, yields);
    
    // Fetch weather data (non-blocking, can fail gracefully)
    let weather = null;
    let forecast = [];
    if (demoMode) {
      const { DEMO_WEATHER, DEMO_FORECAST } = await import("@/lib/demoData");
      weather = DEMO_WEATHER;
      forecast = DEMO_FORECAST;
    } else {
      try {
        [weather, forecast] = await Promise.all([
          getWeatherByPincode(user.pincode),
          getForecastByPincode(user.pincode),
        ]);
      } catch (weatherError) {
        console.warn("Weather fetch failed:", weatherError);
      }
    }

    // Fetch AI insights (non-blocking, can fail gracefully)
    let insights = "AI insights unavailable at this time.";
    if (demoMode) {
      const { DEMO_INSIGHTS } = await import("@/lib/demoData");
      insights = DEMO_INSIGHTS;
    } else {
      try {
        const prompt = buildInsightPrompt({ user, cropSummaries, totals, weather, forecast });
        insights = await getGeminiInsights(prompt);
      } catch (insightError) {
        // Silently fail - already set default message
      }
    }

    const pdfBuffer = await buildPdf({
      user,
      crops,
      cropSummaries,
      totals,
      expenses,
      yields,
      insights,
      weather,
    });
    const excelBuffer = buildWorkbook({
      user,
      crops,
      cropSummaries,
      totals,
      expenses,
      yields,
      insights,
      weather,
      forecast,
    });

    const zip = new JSZip();
    zip.file("FarmReport.pdf", pdfBuffer);
    zip.file("FarmReport.xlsx", excelBuffer);
    zip.file("AI-Insights.txt", insights || "No insights available.");

    const archive = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(archive, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=farm-report-${Date.now()}.zip`,
      },
    });
  } catch (error) {
    console.error("GET /api/reports error", error);
    return NextResponse.json({ message: "Unable to generate report" }, { status: 500 });
  }
}

