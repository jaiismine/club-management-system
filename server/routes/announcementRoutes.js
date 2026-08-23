import { Router } from "express";
import Announcement from "../models/Announcement.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "student") return res.json([]);

    const query = { isActive: true };
    if (role !== "super_admin") {
      query.targetAudience = role;
    }

    const announcements = await Announcement.find(query)
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authorize("super_admin"), async (req, res) => {
  try {
    const { title, content, targetAudience } = req.body;

    let audience = ["admin", "club_leader"];
    if (targetAudience === "admin") audience = ["admin"];
    if (targetAudience === "club_leader") audience = ["club_leader"];

    const announcement = await Announcement.create({
      title,
      content,
      postedBy: req.user._id,
      targetAudience: audience,
    });

    const populated = await Announcement.findById(announcement._id).populate(
      "postedBy",
      "name"
    );
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
