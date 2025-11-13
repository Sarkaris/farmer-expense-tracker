import mongoose from "mongoose";

const YieldSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cropId: { type: mongoose.Schema.Types.ObjectId, ref: "Crop", required: true },
    totalYield: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Yield || mongoose.model("Yield", YieldSchema);

