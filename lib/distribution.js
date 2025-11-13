export function distributeExpense(totalAmount, crops) {
  if (!Array.isArray(crops) || crops.length === 0) {
    return [];
  }

  const totalArea = crops.reduce((sum, c) => sum + (Number(c.area) || 0), 0);
  if (totalArea === 0) {
    const evenShare = parseFloat((totalAmount / crops.length).toFixed(2));
    return crops.map((c) => ({
      cropId: c._id,
      share: evenShare,
    }));
  }

  return crops.map((c) => ({
    cropId: c._id,
    share: parseFloat(((Number(c.area) || 0) / totalArea * totalAmount).toFixed(2)),
  }));
}

export function aggregateSharedExpenses(expenses) {
  return expenses.reduce((acc, expense) => {
    if (expense.distributedShares?.length) {
      expense.distributedShares.forEach((item) => {
        acc[item.cropId.toString()] = (acc[item.cropId.toString()] || 0) + item.share;
      });
    }
    return acc;
  }, {});
}

