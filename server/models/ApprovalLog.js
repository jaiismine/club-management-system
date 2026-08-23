import mongoose from "mongoose";

const approvalLogSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    action: {
      type: String,
      enum: ["approved", "rejected", "deleted", "published", "restored"],
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    performerRole: {
      type: String,
      enum: ["admin", "super_admin"],
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

approvalLogSchema.index({ event: 1, createdAt: -1 });
approvalLogSchema.index({ performedBy: 1, createdAt: -1 });
approvalLogSchema.index({ action: 1, createdAt: -1 });

const ApprovalLog = mongoose.model("ApprovalLog", approvalLogSchema);

export default ApprovalLog;
