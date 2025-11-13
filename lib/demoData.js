// Demo data for prototyping
export const DEMO_USER = {
  _id: "demo-user-001",
  name: "Rajesh Kumar",
  email: "rajesh.kumar@farmdemo.com",
  pincode: "560001",
  farmSize: 5.5,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-11-12"),
};

export const DEMO_CROPS = [
  {
    _id: "demo-crop-001",
    userId: "demo-user-001",
    name: "Wheat",
    area: 2.5,
    startDate: "2024-10-01",
    endDate: "2024-12-15",
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-01"),
  },
  {
    _id: "demo-crop-002",
    userId: "demo-user-001",
    name: "Rice",
    area: 2.0,
    startDate: "2024-09-15",
    endDate: "2024-11-30",
    createdAt: new Date("2024-09-15"),
    updatedAt: new Date("2024-09-15"),
  },
  {
    _id: "demo-crop-003",
    userId: "demo-user-001",
    name: "Sugarcane",
    area: 1.0,
    startDate: "2024-08-01",
    endDate: null,
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-08-01"),
  },
];

export const DEMO_EXPENSES = [
  {
    _id: "demo-expense-001",
    userId: "demo-user-001",
    cropId: "demo-crop-001",
    type: "Seeds",
    amount: 5000,
    shared: false,
    sharedBetween: [],
    description: "Premium wheat seeds",
    date: "2024-10-05",
    distributedShares: [],
    createdAt: new Date("2024-10-05"),
  },
  {
    _id: "demo-expense-002",
    userId: "demo-user-001",
    cropId: "demo-crop-002",
    type: "Fertilizers",
    amount: 8000,
    shared: false,
    sharedBetween: [],
    description: "NPK fertilizer",
    date: "2024-09-20",
    distributedShares: [],
    createdAt: new Date("2024-09-20"),
  },
  {
    _id: "demo-expense-003",
    userId: "demo-user-001",
    cropId: "demo-crop-001",
    type: "Labor",
    amount: 12000,
    shared: true,
    sharedBetween: ["demo-crop-001", "demo-crop-002"],
    description: "Harvesting labor",
    date: "2024-11-10",
    distributedShares: [
      { cropId: "demo-crop-001", share: 6666.67 },
      { cropId: "demo-crop-002", share: 5333.33 },
    ],
    createdAt: new Date("2024-11-10"),
  },
  {
    _id: "demo-expense-004",
    userId: "demo-user-001",
    cropId: "demo-crop-003",
    type: "Irrigation",
    amount: 3500,
    shared: false,
    sharedBetween: [],
    description: "Water pump maintenance",
    date: "2024-10-15",
    distributedShares: [],
    createdAt: new Date("2024-10-15"),
  },
];

export const DEMO_YIELDS = [
  {
    _id: "demo-yield-001",
    userId: "demo-user-001",
    cropId: "demo-crop-001",
    totalYield: 2500,
    pricePerUnit: 22.5,
    date: "2024-11-05",
    createdAt: new Date("2024-11-05"),
  },
  {
    _id: "demo-yield-002",
    userId: "demo-user-001",
    cropId: "demo-crop-002",
    totalYield: 1800,
    pricePerUnit: 28.0,
    date: "2024-11-08",
    createdAt: new Date("2024-11-08"),
  },
];

export const DEMO_WEATHER = {
  location: "Bangalore",
  temperature: 28,
  humidity: 65,
  description: "clear sky",
};

export const DEMO_FORECAST = [
  { date: "2024-11-13", rainfall: 0, tempDay: 29, tempNight: 20, description: "clear sky" },
  { date: "2024-11-14", rainfall: 2.5, tempDay: 27, tempNight: 19, description: "light rain" },
  { date: "2024-11-15", rainfall: 0, tempDay: 28, tempNight: 21, description: "partly cloudy" },
  { date: "2024-11-16", rainfall: 0, tempDay: 30, tempNight: 22, description: "clear sky" },
  { date: "2024-11-17", rainfall: 5.2, tempDay: 26, tempNight: 18, description: "moderate rain" },
  { date: "2024-11-18", rainfall: 0, tempDay: 28, tempNight: 20, description: "clear sky" },
  { date: "2024-11-19", rainfall: 1.8, tempDay: 27, tempNight: 19, description: "light rain" },
];

export const DEMO_TOTALS = {
  expense: 28500,
  revenue: 112050,
  profit: 83550,
};

export const DEMO_CROP_SUMMARIES = [
  {
    name: "Wheat",
    area: 2.5,
    expense: 18666.67,
    revenue: 56250,
    profit: 37583.33,
  },
  {
    name: "Rice",
    area: 2.0,
    expense: 13333.33,
    revenue: 50400,
    profit: 37066.67,
  },
  {
    name: "Sugarcane",
    area: 1.0,
    expense: 3500,
    revenue: 0,
    profit: -3500,
  },
];

export const DEMO_INSIGHTS = `Based on your farm data analysis:

**Top Performing Crop:**
Wheat is your most profitable crop with ₹37,583 profit from 2.5 acres. The revenue of ₹56,250 shows strong market performance.

**Cost Optimization:**
Your shared labor expense of ₹12,000 was well-distributed across Wheat and Rice. Consider applying this shared expense model to irrigation and machinery costs to reduce per-crop overhead.

**Revenue Opportunities:**
Sugarcane (1 acre) has no recorded yields yet. With proper irrigation already in place, focus on timely harvesting to maximize returns. Current expenses are ₹3,500 with potential for high revenue.

**Weather Planning:**
Light to moderate rainfall is forecasted for Nov 14, 17, and 19. Plan irrigation schedules accordingly and protect harvested crops from moisture.

**Recommendations:**
1. Expand Wheat cultivation next season given its strong profitability
2. Complete Sugarcane harvest cycle to realize revenue
3. Use shared expense model for fertilizers across all crops
4. Monitor weather forecasts closely for the next week`;

