import mongoose from "mongoose";

const meetingPointerSchema = new mongoose.Schema(
  {
    clubName: {
      type: String,
      required: [true, "Club name is required"],
      trim: true,
    },
    meetingDate: {
      type: Date,
      required: [true, "Meeting date is required"],
    },
    title: {
      type: String,
      trim: true,
      default: "Meeting Notes",
    },
    pointers: [
      {
        type: String,
        trim: true,
        required: true,
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    documentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isLatest: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

meetingPointerSchema.index({ clubName: 1, isLatest: 1 });
meetingPointerSchema.index({ clubName: 1, meetingDate: -1 });

const MeetingPointer = mongoose.model("MeetingPointer", meetingPointerSchema);

export default MeetingPointer;
