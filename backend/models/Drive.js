const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Online Test", "Technical Interview"
    order: { type: Number, required: true },
    description: { type: String, default: "" },
    scheduledDate: { type: Date },
  },
  { _id: true }
);

const driveSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    jobRole: { type: String, required: true, trim: true },
    jobDescription: { type: String, default: "" },
    package: { type: String, default: "" }, // CTC, e.g. "6.5 LPA"
    jobType: {
      type: String,
      enum: ["Full-Time", "Internship", "Internship + PPO"],
      default: "Full-Time",
    },
    location: { type: String, default: "" },

    // Eligibility criteria
    eligibility: {
      minCgpa: { type: Number, default: 0 },
      maxBacklogs: { type: Number, default: 0 },
      allowedBranches: [{ type: String }], // empty array = all branches
      minTenthPercentage: { type: Number, default: 0 },
      minTwelfthPercentage: { type: Number, default: 0 },
      eligibleBatch: { type: String, default: "" },
    },

    rounds: [roundSchema],

    driveDate: { type: Date, required: true },
    applicationDeadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drive", driveSchema);
