const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ["student", "admin", "recruiter"],
      default: "student",
    },

    // ---- Student-specific placement data ----
    studentProfile: {
      rollNumber: { type: String, trim: true },
      branch: { type: String, trim: true },
      batch: { type: String, trim: true }, // e.g. "2022-2026"
      cgpa: { type: Number, min: 0, max: 10 },
      tenthPercentage: { type: Number, min: 0, max: 100 },
      twelfthPercentage: { type: Number, min: 0, max: 100 },
      backlogs: { type: Number, default: 0 },
      resumeUrl: { type: String, default: "" },
      skills: [{ type: String }],
      phone: { type: String, trim: true },
      isPlaced: { type: Boolean, default: false },
      placedCompany: { type: String, default: "" },
    },

    // ---- Recruiter-specific data ----
    recruiterProfile: {
      companyName: { type: String, trim: true },
      designation: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
