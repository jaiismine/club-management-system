export const MOCK_EVENTS = [
  {
    id: "1",
    title: "Tech Hackathon 2026",
    description: "24-hour coding competition for all branches.",
    date: "Sep 5, 2026",
    time: "9:00 AM",
    venue: "Main Auditorium",
    clubName: "Tech Club",
    status: "published",
    requirements: "Laptops, extension cords",
  },
  {
    id: "2",
    title: "Photography Workshop",
    description: "Basics of composition and lighting.",
    date: "Sep 12, 2026",
    time: "2:00 PM",
    venue: "Room 204",
    clubName: "Media Club",
    status: "published",
    requirements: "Camera optional",
  },
  {
    id: "3",
    title: "Debate Championship",
    description: "Inter-club debate rounds.",
    date: "Sep 20, 2026",
    time: "10:00 AM",
    venue: "Seminar Hall",
    clubName: "Literary Club",
    status: "pending",
    requirements: "Mic, podium",
  },
  {
    id: "4",
    title: "Robotics Demo Day",
    description: "Showcase of student-built robots.",
    date: "Sep 8, 2026",
    time: "11:00 AM",
    venue: "Lab Block A",
    clubName: "Tech Club",
    status: "approved",
    requirements: "Tables, power supply",
  },
  {
    id: "5",
    title: "Open Mic Night",
    description: "Music and poetry performances.",
    date: "Aug 30, 2026",
    time: "6:00 PM",
    venue: "Open Ground",
    clubName: "Cultural Club",
    status: "rejected",
    requirements: "Stage, sound system",
  },
];

export const MOCK_VENUES = [
  { name: "Main Auditorium", available: true, capacity: 500 },
  { name: "Seminar Hall", available: true, capacity: 150 },
  { name: "Room 204", available: false, capacity: 40 },
  { name: "Lab Block A", available: true, capacity: 80 },
];

export const MOCK_POINTERS = [
  "Submit proposals at least 2 weeks before the event date.",
  "Venue bookings must include setup and teardown time.",
  "All events require a faculty advisor sign-off.",
  "Weekly draft is published every Monday by Super Admin.",
];

export const MOCK_REGISTRATIONS = [
  { event: "Tech Hackathon 2026", count: 48 },
  { event: "Photography Workshop", count: 22 },
];

export const MOCK_APPROVAL_LOG = [
  {
    event: "Tech Hackathon 2026",
    admin: "Dr. Sharma",
    action: "Approved",
    date: "Aug 18, 2026",
  },
  {
    event: "Robotics Demo Day",
    admin: "Prof. Mehta",
    action: "Approved",
    date: "Aug 19, 2026",
  },
  {
    event: "Open Mic Night",
    admin: "Dr. Sharma",
    action: "Rejected",
    date: "Aug 17, 2026",
  },
];

export const MOCK_WEEKLY_DRAFT = {
  week: "Aug 25 – Aug 31, 2026",
  events: ["Tech Hackathon 2026", "Robotics Demo Day", "Photography Workshop"],
  status: "pending",
};

export const MOCK_ANNOUNCEMENTS = [
  {
    title: "Weekly draft review due Friday",
    date: "Aug 20, 2026",
    audience: "Admins, Club Leaders",
  },
  {
    title: "New venue booking guidelines",
    date: "Aug 15, 2026",
    audience: "Club Leaders",
  },
];
