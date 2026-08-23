import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import Venue from "../models/Venue.js";
import Event from "../models/Event.js";
import MeetingPointer from "../models/MeetingPointer.js";

const users = [
  {
    name: "Test Student",
    email: "student@test.com",
    password: "password123",
    role: "student",
  },
  {
    name: "Tech Club Leader",
    email: "leader@test.com",
    password: "password123",
    role: "club_leader",
    clubName: "Tech Club",
  },
  {
    name: "Campus Admin",
    email: "admin@test.com",
    password: "password123",
    role: "admin",
  },
  {
    name: "Super Admin",
    email: "superadmin@test.com",
    password: "password123",
    role: "super_admin",
  },
];

const venues = [
  { name: "Main Auditorium", location: "Block A", capacity: 500 },
  { name: "Seminar Hall", location: "Block B", capacity: 150 },
  { name: "Room 204", location: "Block C", capacity: 40, isActive: false },
  { name: "Lab Block A", location: "Block D", capacity: 80 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await Promise.all([
    User.deleteMany({}),
    Venue.deleteMany({}),
    Event.deleteMany({}),
    MeetingPointer.deleteMany({}),
  ]);

  const createdUsers = await User.create(users);
  const createdVenues = await Venue.create(venues);

  const leader = createdUsers.find((u) => u.role === "club_leader");
  const admin = createdUsers.find((u) => u.role === "admin");
  const auditorium = createdVenues.find((v) => v.name === "Main Auditorium");
  const lab = createdVenues.find((v) => v.name === "Lab Block A");

  await Event.create([
    {
      title: "Tech Hackathon 2026",
      description: "24-hour coding competition for all branches.",
      date: new Date("2026-09-05"),
      time: "09:00",
      venue: auditorium._id,
      organizer: leader._id,
      clubName: "Tech Club",
      requirements: "Laptops, extension cords",
      status: "published",
      adminApprovedBy: admin._id,
      adminApprovedAt: new Date(),
    },
    {
      title: "Robotics Demo Day",
      description: "Showcase of student-built robots.",
      date: new Date("2026-09-08"),
      time: "11:00",
      venue: lab._id,
      organizer: leader._id,
      clubName: "Tech Club",
      requirements: "Tables, power supply",
      status: "approved",
      adminApprovedBy: admin._id,
      adminApprovedAt: new Date(),
    },
    {
      title: "Debate Championship",
      description: "Inter-club debate rounds.",
      date: new Date("2026-09-20"),
      time: "10:00",
      venue: auditorium._id,
      organizer: leader._id,
      clubName: "Tech Club",
      requirements: "Mic, podium",
      status: "pending",
    },
  ]);

  await MeetingPointer.create({
    clubName: "Tech Club",
    meetingDate: new Date(),
    pointers: [
      "Submit proposals at least 2 weeks before the event date.",
      "Venue bookings must include setup and teardown time.",
      "All events require a faculty advisor sign-off.",
      "Weekly draft is published every Monday by Super Admin.",
    ],
    documentedBy: admin._id,
    isLatest: true,
  });

  console.log("Seed complete. Test logins:");
  users.forEach((u) => console.log(`  ${u.email} / password123 (${u.role})`));

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
