import mongoose, { Document, Schema } from "mongoose";

interface Schedule {
  weekdays: string[];
  startTime: string;
  endTime: string;
}

export interface Campaign extends Document {
  campaignType: "Cost per Order" | "Cost per Click" | "Buy One Get One";
  startDate: Date;
  endDate: Date;
  schedule: Schedule[];
}

const campaignSchema: Schema = new Schema({
  campaignType: {
    type: String,
    enum: ["Cost per Order", "Cost per Click", "Buy One Get One"],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  schedule: [
    {
      weekdays: { type: [String], required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
  ],
});

export default mongoose.model<Campaign>("Campaign", campaignSchema);