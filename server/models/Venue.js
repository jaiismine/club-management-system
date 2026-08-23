import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Venue name is required"],
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    capacity: {
      type: Number,
      min: 1,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    unavailableSlots: [
      {
        date: {
          type: Date,
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
        reason: {
          type: String,
          trim: true,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

const Venue = mongoose.model("Venue", venueSchema);

export default Venue;
