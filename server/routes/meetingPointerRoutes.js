import { Router } from "express";
import MeetingPointer from "../models/MeetingPointer.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/latest/:clubName", authorize("club_leader"), async (req, res) => {
  try {
    const pointer = await MeetingPointer.findOne({
      clubName: req.params.clubName,
      isLatest: true,
    }).populate("documentedBy", "name");

    res.json(pointer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authorize("admin"), async (req, res) => {
  try {
    const { clubName, meetingDate, pointers, notes } = req.body;
    const pointerList = Array.isArray(pointers)
      ? pointers
      : pointers.split("\n").filter(Boolean);

    await MeetingPointer.updateMany(
      { clubName, isLatest: true },
      { isLatest: false }
    );

    const doc = await MeetingPointer.create({
      clubName,
      meetingDate,
      pointers: pointerList,
      notes,
      documentedBy: req.user._id,
      isLatest: true,
    });

    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
