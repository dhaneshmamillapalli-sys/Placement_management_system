// Populates the database with demo data so you can showcase the app immediately.
// Run with: npm run seed  (make sure MONGO_URI in .env is set and reachable first)

const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");
const Drive = require("../models/Drive");
const Application = require("../models/Application");

dotenv.config();

const seed = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([User.deleteMany({}), Drive.deleteMany({}), Application.deleteMany({})]);

  console.log("Creating users...");
  const admin = await User.create({
    name: "Placement Officer",
    email: "admin@college.edu",
    password: "admin123",
    role: "admin",
  });

  const recruiter = await User.create({
    name: "Priya Sharma",
    email: "recruiter@techcorp.com",
    password: "recruiter123",
    role: "recruiter",
    recruiterProfile: { companyName: "TechCorp Solutions", designation: "HR Manager" },
  });

  const students = await User.insertMany([
    {
      name: "Aarav Mehta",
      email: "aarav@college.edu",
      password: "student123",
      role: "student",
      studentProfile: {
        rollNumber: "CSE2201",
        branch: "CSE",
        batch: "2022-2026",
        cgpa: 8.7,
        tenthPercentage: 92,
        twelfthPercentage: 88,
        backlogs: 0,
        skills: ["React", "Node.js", "MongoDB"],
        phone: "9876543210",
      },
    },
    {
      name: "Sneha Reddy",
      email: "sneha@college.edu",
      password: "student123",
      role: "student",
      studentProfile: {
        rollNumber: "ECE2214",
        branch: "ECE",
        batch: "2022-2026",
        cgpa: 7.9,
        tenthPercentage: 85,
        twelfthPercentage: 82,
        backlogs: 1,
        skills: ["Embedded C", "Python"],
        phone: "9876500011",
      },
    },
    {
      name: "Rohan Verma",
      email: "rohan@college.edu",
      password: "student123",
      role: "student",
      studentProfile: {
        rollNumber: "CSE2245",
        branch: "CSE",
        batch: "2022-2026",
        cgpa: 6.5,
        tenthPercentage: 78,
        twelfthPercentage: 75,
        backlogs: 2,
        skills: ["Java", "SQL"],
        phone: "9876500022",
      },
    },
  ]);

  console.log("Creating drives...");
  const drive1 = await Drive.create({
    companyName: "TechCorp Solutions",
    jobRole: "Software Development Engineer",
    jobDescription: "Work on scalable backend systems and cloud infrastructure.",
    package: "12 LPA",
    jobType: "Full-Time",
    location: "Bangalore",
    eligibility: {
      minCgpa: 7,
      maxBacklogs: 0,
      allowedBranches: ["CSE", "IT"],
      minTenthPercentage: 60,
      minTwelfthPercentage: 60,
      eligibleBatch: "2022-2026",
    },
    rounds: [
      { name: "Online Aptitude Test", order: 1 },
      { name: "Technical Interview", order: 2 },
      { name: "HR Interview", order: 3 },
    ],
    driveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: "upcoming",
    createdBy: recruiter._id,
  });

  const drive2 = await Drive.create({
    companyName: "DataWave Analytics",
    jobRole: "Data Analyst Intern",
    jobDescription: "Analyze large datasets and build dashboards for business insights.",
    package: "35,000/month",
    jobType: "Internship + PPO",
    location: "Hyderabad",
    eligibility: {
      minCgpa: 6,
      maxBacklogs: 1,
      allowedBranches: [],
      minTenthPercentage: 55,
      minTwelfthPercentage: 55,
      eligibleBatch: "2022-2026",
    },
    rounds: [
      { name: "Resume Shortlisting", order: 1 },
      { name: "Technical Interview", order: 2 },
    ],
    driveDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    status: "upcoming",
    createdBy: admin._id,
  });

  console.log("Creating a sample application...");
  await Application.create({
    student: students[0]._id,
    drive: drive1._id,
    roundResults: drive1.rounds.map((r) => ({
      roundId: r._id,
      roundName: r.name,
      status: "pending",
    })),
  });

  console.log("\nSeed complete! Demo login credentials:");
  console.log("  Admin      -> admin@college.edu / admin123");
  console.log("  Recruiter  -> recruiter@techcorp.com / recruiter123");
  console.log("  Student 1  -> aarav@college.edu / student123 (eligible for TechCorp)");
  console.log("  Student 2  -> sneha@college.edu / student123");
  console.log("  Student 3  -> rohan@college.edu / student123 (not eligible for TechCorp)");

  process.exit(0);
};

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
