import mongoose from "mongoose";

const CropSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    area: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Crop || mongoose.model("Crop", CropSchema);

