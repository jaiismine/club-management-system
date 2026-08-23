import { Router } from "express";
import Venue from "../models/Venue.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", async (req, res) => {
  try {
    const venues = await Venue.find().sort({ name: 1 });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/toggle", authorize("admin"), async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ message: "Venue not found" });

    venue.isActive = !venue.isActive;
    await venue.save();
    res.json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
