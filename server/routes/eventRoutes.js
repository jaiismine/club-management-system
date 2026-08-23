import { Router } from "express";
import Event from "../models/Event.js";
import Venue from "../models/Venue.js";
import { protect, authorize } from "../middleware/auth.js";
import { logApproval } from "../utils/logApproval.js";

const router = Router();

router.use(protect);

router.get("/", async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "student") {
      filter.status = "published";
    } else if (req.user.role === "club_leader") {
      filter = {
        clubName: req.user.clubName,
        status: { $ne: "deleted" },
      };
    } else if (req.user.role === "admin") {
      filter.status = { $nin: ["deleted", "published"] };
    } else if (req.user.role === "super_admin") {
      filter = {};
    }

    const events = await Event.find(filter)
      .populate("venue", "name location capacity isActive")
      .populate("organizer", "name email")
      .populate("adminApprovedBy", "name")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/published", async (req, res) => {
  try {
    const events = await Event.find({ status: "published" })
      .populate("venue", "name location")
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authorize("club_leader"), async (req, res) => {
  try {
    const { title, description, date, time, endTime, venue, requirements } =
      req.body;

    const venueDoc = await Venue.findById(venue);
    if (!venueDoc || !venueDoc.isActive) {
      return res.status(400).json({ message: "Venue unavailable" });
    }

    const conflict = await Event.findOne({
      venue,
      date: new Date(date),
      time,
      status: { $in: ["pending", "approved", "published"] },
    });
    if (conflict) {
      return res
        .status(400)
        .json({ message: "Venue already booked for this date and time" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      endTime,
      venue,
      requirements,
      organizer: req.user._id,
      clubName: req.user.clubName,
      status: "pending",
    });

    const populated = await Event.findById(event._id).populate(
      "venue",
      "name location capacity isActive"
    );
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id/approve", authorize("admin"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.status !== "pending") {
      return res.status(400).json({ message: "Event is not pending" });
    }

    event.status = "approved";
    event.adminApprovedBy = req.user._id;
    event.adminApprovedAt = new Date();
    await event.save();

    await logApproval({
      event: event._id,
      action: "approved",
      performedBy: req.user._id,
      performerRole: "admin",
    });

    const populated = await Event.findById(event._id)
      .populate("venue", "name")
      .populate("adminApprovedBy", "name");
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/reject", authorize("admin"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.status !== "pending") {
      return res.status(400).json({ message: "Event is not pending" });
    }

    event.status = "rejected";
    event.rejectionReason = req.body.reason || "Rejected by admin";
    await event.save();

    await logApproval({
      event: event._id,
      action: "rejected",
      performedBy: req.user._id,
      performerRole: "admin",
      reason: event.rejectionReason,
    });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/delete", authorize("admin"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.status = "deleted";
    event.deletedBy = req.user._id;
    event.deletedAt = new Date();
    await event.save();

    await logApproval({
      event: event._id,
      action: "deleted",
      performedBy: req.user._id,
      performerRole: "admin",
    });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
