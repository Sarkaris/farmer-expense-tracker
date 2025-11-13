// Gamification system for farmer achievements

export function calculateAchievements({ totals, cropSummaries, expenses, crops, yields }) {
  const achievements = [];
  const progress = [];

  // Calculate profit margin
  const profitMargin = totals.revenue > 0 
    ? (totals.profit / totals.revenue) * 100 
    : 0;

  // Calculate cost efficiency (lower is better, but we want to track reduction)
  const avgCostPerAcre = crops.length > 0 && totals.expense > 0
    ? totals.expense / crops.reduce((sum, c) => sum + (c.area || 0), 0)
    : 0;

  // Check for Efficient Planner badge (multiple crops planned)
  if (crops.length >= 3) {
    achievements.push({
      id: 'efficient-planner',
      name: 'Efficient Planner',
      description: `Planned ${crops.length} different crops`,
      icon: '📋',
      color: 'emerald',
      unlocked: true,
    });
  }

  // Check for Cost Cutter badge (profit margin > 20%)
  if (profitMargin >= 20 && totals.expense > 0) {
    achievements.push({
      id: 'cost-cutter',
      name: 'Cost Cutter',
      description: `Maintained ${profitMargin.toFixed(1)}% profit margin`,
      icon: '✂️',
      color: 'blue',
      unlocked: true,
    });
  }

  // Check for Top Profit Farmer badge (high profit)
  if (totals.profit > 50000) {
    achievements.push({
      id: 'top-profit',
      name: 'Top Profit Farmer',
      description: `Generated ₹${(totals.profit / 1000).toFixed(0)}K in profit`,
      icon: '🏆',
      color: 'amber',
      unlocked: true,
    });
  }

  // Check for Diversified Farmer (multiple profitable crops)
  const profitableCrops = cropSummaries.filter(c => c.profit > 0).length;
  if (profitableCrops >= 2) {
    achievements.push({
      id: 'diversified',
      name: 'Diversified Farmer',
      description: `${profitableCrops} crops generating profit`,
      icon: '🌾',
      color: 'purple',
      unlocked: true,
    });
  }

  // Check for Record Keeper (tracking expenses and yields)
  if (expenses.length >= 5 && yields.length >= 2) {
    achievements.push({
      id: 'record-keeper',
      name: 'Record Keeper',
      description: 'Consistently tracking expenses and yields',
      icon: '📊',
      color: 'indigo',
      unlocked: true,
    });
  }

  // Progress indicators
  if (totals.revenue > 0 && totals.expense > 0) {
    const costReduction = Math.max(0, 100 - (totals.expense / totals.revenue) * 100);
    if (costReduction > 0) {
      progress.push({
        id: 'cost-reduction',
        label: 'Cost Efficiency',
        value: Math.min(100, costReduction),
        message: `You're maintaining ${costReduction.toFixed(1)}% cost efficiency`,
        color: 'emerald',
      });
    }
  }

  if (profitMargin > 0) {
    progress.push({
      id: 'profit-margin',
      label: 'Profit Margin',
      value: Math.min(100, profitMargin),
      message: `Your profit margin is ${profitMargin.toFixed(1)}%`,
      color: 'blue',
    });
  }

  // Crop diversity progress
  const diversityProgress = Math.min(100, (crops.length / 5) * 100);
  if (crops.length > 0) {
    progress.push({
      id: 'diversity',
      label: 'Crop Diversity',
      value: diversityProgress,
      message: `Growing ${crops.length} different crop${crops.length > 1 ? 's' : ''}`,
      color: 'purple',
    });
  }

  // Data tracking progress
  const trackingScore = Math.min(100, ((expenses.length * 2 + yields.length * 3) / 20) * 100);
  if (trackingScore > 0) {
    progress.push({
      id: 'tracking',
      label: 'Data Tracking',
      value: trackingScore,
      message: `Tracking ${expenses.length} expenses and ${yields.length} yields`,
      color: 'indigo',
    });
  }

  return { achievements, progress };
}

