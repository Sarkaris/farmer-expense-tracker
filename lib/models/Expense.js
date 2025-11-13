import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cropId: { type: mongoose.Schema.Types.ObjectId, ref: "Crop" },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    shared: { type: Boolean, default: false },
    sharedBetween: [{ type: mongoose.Schema.Types.ObjectId, ref: "Crop" }],
    description: { type: String },
    date: { type: Date, required: true },
    distributedShares: [
      {
        cropId: { type: mongoose.Schema.Types.ObjectId, ref: "Crop" },
        share: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);

