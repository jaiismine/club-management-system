import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
    },
    endTime: {
      type: String,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: [true, "Venue is required"],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer is required"],
    },
    clubName: {
      type: String,
      required: [true, "Club name is required"],
      trim: true,
    },
    requirements: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "published",
        "deleted",
        "cancelled",
      ],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    adminApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    adminApprovedAt: {
      type: Date,
    },
    publishedInDraft: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WeeklyDraft",
    },
    superAdminApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    superAdminApprovedAt: {
      type: Date,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

eventSchema.index({ status: 1, date: 1 });
eventSchema.index({ clubName: 1, status: 1 });
eventSchema.index({ venue: 1, date: 1, time: 1 });

const Event = mongoose.model("Event", eventSchema);

export default Event;
