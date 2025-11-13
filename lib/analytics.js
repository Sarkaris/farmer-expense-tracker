import { aggregateSharedExpenses } from "@/lib/distribution";

export function computeFinancials(crops, expenses, yields) {
  const cropExpenseMap = {};
  const cropYieldMap = {};

  expenses.forEach((exp) => {
    if (exp.cropId) {
      const id = exp.cropId.toString();
      cropExpenseMap[id] = (cropExpenseMap[id] || 0) + Number(exp.amount || 0);
    }
  });

  const sharedAgg = aggregateSharedExpenses(expenses);
  Object.entries(sharedAgg).forEach(([cropId, share]) => {
    cropExpenseMap[cropId] = (cropExpenseMap[cropId] || 0) + share;
  });

  yields.forEach((yieldEntry) => {
    const id = yieldEntry.cropId.toString();
    const revenue = Number(yieldEntry.totalYield || 0) * Number(yieldEntry.pricePerUnit || 0);
    cropYieldMap[id] = (cropYieldMap[id] || 0) + revenue;
  });

  const cropSummaries = crops.map((crop) => {
    const id = crop._id.toString();
    const expense = cropExpenseMap[id] || 0;
    const revenue = cropYieldMap[id] || 0;
    return {
      cropId: id,
      name: crop.name,
      expense,
      revenue,
      profit: revenue - expense,
      area: crop.area,
    };
  });

  const totals = cropSummaries.reduce(
    (acc, cs) => {
      acc.expense += cs.expense;
      acc.revenue += cs.revenue;
      acc.profit += cs.profit;
      return acc;
    },
    { expense: 0, revenue: 0, profit: 0 }
  );

  return { cropSummaries, totals };
}

export function buildInsightPrompt({ user, cropSummaries, totals, weather, forecast }) {
  const cropLines = cropSummaries
    .map(
      (c) =>
        `${c.name}: area ${c.area} acres, expense ₹${c.expense.toFixed(
          2
        )}, revenue ₹${c.revenue.toFixed(2)}, profit ₹${c.profit.toFixed(2)}`
    )
    .join("\n");

  const weatherLine = weather
    ? `Current weather in ${weather.location || "farm area"}: ${weather.description}, temperature ${weather.temperature}°C, humidity ${weather.humidity}%.`
    : "Weather data unavailable.";

  const rainfallForecast = forecast?.length
    ? `Upcoming rainfall (next ${forecast.length} days): ${forecast
        .map((f) => `${new Date(f.date).toLocaleDateString("en-IN")}: ${f.rainfall}mm`)
        .join("; ")}.`
    : "No rainfall forecast available.";

  return `You are an agronomy expert. Analyze the farm performance and recommend actions.
Farmer: ${user.name}, Farm size: ${user.farmSize} acres, Pincode: ${user.pincode}.
Financial summary: total expense ₹${totals.expense.toFixed(2)}, total revenue ₹${totals.revenue.toFixed(
    2
  )}, profit ₹${totals.profit.toFixed(2)}.
Crop details:
${cropLines}
${weatherLine}
${rainfallForecast}
Highlight best and worst performing crops, profitability, suggested improvements, and risk mitigation tips. Keep the response under 220 words.`;
}

