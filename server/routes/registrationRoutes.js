import { Router } from "express";
import EventRegistration from "../models/EventRegistration.js";
import Event from "../models/Event.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.post("/", authorize("student"), async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);
    if (!event || event.status !== "published") {
      return res.status(400).json({ message: "Event not available for registration" });
    }

    const existing = await EventRegistration.findOne({
      event: eventId,
      student: req.user._id,
      status: "registered",
    });
    if (existing) {
      return res.status(400).json({ message: "Already registered" });
    }

    const registration = await EventRegistration.create({
      event: eventId,
      student: req.user._id,
    });

    res.status(201).json(registration);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already registered" });
    }
    res.status(500).json({ message: error.message });
  }
});

router.get("/stats", authorize("admin", "super_admin"), async (req, res) => {
  try {
    const stats = await EventRegistration.aggregate([
      { $match: { status: "registered" } },
      {
        $group: {
          _id: "$event",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $project: {
          eventId: "$_id",
          title: "$event.title",
          count: 1,
        },
      },
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
