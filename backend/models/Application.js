const mongoose = require("mongoose");

const roundResultSchema = new mongoose.Schema(
  {
    roundId: { type: mongoose.Schema.Types.ObjectId, required: true },
    roundName: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "cleared", "rejected"],
      default: "pending",
    },
    remarks: { type: String, default: "" },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    drive: { type: mongoose.Schema.Types.ObjectId, ref: "Drive", required: true },

    overallStatus: {
      type: String,
      enum: ["applied", "in-progress", "selected", "rejected", "withdrawn"],
      default: "applied",
    },

    roundResults: [roundResultSchema],
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent a student from applying twice to the same drive
applicationSchema.index({ student: 1, drive: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
