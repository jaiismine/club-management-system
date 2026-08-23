import mongoose from "mongoose";

const weeklyDraftSchema = new mongoose.Schema(
  {
    weekStart: {
      type: Date,
      required: [true, "Week start date is required"],
    },
    weekEnd: {
      type: Date,
      required: [true, "Week end date is required"],
    },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

weeklyDraftSchema.index({ weekStart: 1, weekEnd: 1 }, { unique: true });
weeklyDraftSchema.index({ status: 1 });

const WeeklyDraft = mongoose.model("WeeklyDraft", weeklyDraftSchema);

export default WeeklyDraft;
