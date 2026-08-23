import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Announcement title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Announcement content is required"],
      trim: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetAudience: {
      type: [String],
      enum: ["admin", "club_leader"],
      default: ["admin", "club_leader"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

announcementSchema.index({ targetAudience: 1, isActive: 1, createdAt: -1 });

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
