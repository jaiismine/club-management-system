import { Router } from "express";
import ApprovalLog from "../models/ApprovalLog.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorize("super_admin"));

router.get("/", async (req, res) => {
  try {
    const logs = await ApprovalLog.find()
      .populate("event", "title")
      .populate("performedBy", "name")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
