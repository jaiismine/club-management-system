import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import venueRoutes from "./routes/venueRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import meetingPointerRoutes from "./routes/meetingPointerRoutes.js";
import weeklyDraftRoutes from "./routes/weeklyDraftRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import approvalLogRoutes from "./routes/approvalLogRoutes.js";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/meeting-pointers", meetingPointerRoutes);
app.use("/api/weekly-drafts", weeklyDraftRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/approval-logs", approvalLogRoutes);

app.use((err, _req, res, _next) => {
  res.status(500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
