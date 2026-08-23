import { Router } from "express";
import WeeklyDraft from "../models/WeeklyDraft.js";
import Event from "../models/Event.js";
import { protect, authorize } from "../middleware/auth.js";
import { logApproval } from "../utils/logApproval.js";

const router = Router();

router.use(protect);

function getWeekBounds() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(now.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return { weekStart, weekEnd };
}

router.get("/current", authorize("super_admin"), async (req, res) => {
  try {
    const { weekStart, weekEnd } = getWeekBounds();

    let draft = await WeeklyDraft.findOne({
      weekStart,
      weekEnd,
      status: "pending",
    }).populate({ path: "events", populate: { path: "venue", select: "name" } });

    if (!draft) {
      const approvedEvents = await Event.find({ status: "approved" });
      draft = await WeeklyDraft.create({
        weekStart,
        weekEnd,
        events: approvedEvents.map((e) => e._id),
        status: "pending",
      });
      draft = await WeeklyDraft.findById(draft._id).populate({
        path: "events",
        populate: { path: "venue", select: "name" },
      });
    }

    res.json(draft);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/approve", authorize("super_admin"), async (req, res) => {
  try {
    const draft = await WeeklyDraft.findById(req.params.id).populate("events");
    if (!draft) return res.status(404).json({ message: "Draft not found" });
    if (draft.status === "approved") {
      return res.status(400).json({ message: "Draft already approved" });
    }

    draft.status = "approved";
    draft.approvedBy = req.user._id;
    draft.approvedAt = new Date();
    await draft.save();

    for (const event of draft.events) {
      await Event.findByIdAndUpdate(event._id, {
        status: "published",
        superAdminApprovedBy: req.user._id,
        superAdminApprovedAt: new Date(),
        publishedInDraft: draft._id,
      });
      await logApproval({
        event: event._id,
        action: "published",
        performedBy: req.user._id,
        performerRole: "super_admin",
      });
    }

    const updated = await WeeklyDraft.findById(draft._id)
      .populate("events")
      .populate("approvedBy", "name");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
