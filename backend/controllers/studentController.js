const User = require("../models/User");
const Drive = require("../models/Drive");

// @desc    Update logged-in student's placement profile
// @route   PUT /api/students/profile
// @access  Private (student)
const updateStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    if (!student || student.role !== "student") {
      return res.status(403).json({ message: "Only students can update a student profile" });
    }

    student.studentProfile = {
      ...student.studentProfile.toObject(),
      ...req.body,
    };

    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

// @desc    Check whether the logged-in student is eligible for a specific drive
// @route   GET /api/students/eligibility/:driveId
// @access  Private (student)
const checkEligibility = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.driveId);
    if (!drive) return res.status(404).json({ message: "Drive not found" });

    const { eligibility } = drive;
    const profile = req.user.studentProfile || {};
    const reasons = [];

    if (profile.cgpa < eligibility.minCgpa) {
      reasons.push(`CGPA ${profile.cgpa || 0} is below the required ${eligibility.minCgpa}`);
    }
    if (profile.backlogs > eligibility.maxBacklogs) {
      reasons.push(`Backlogs (${profile.backlogs || 0}) exceed the allowed limit (${eligibility.maxBacklogs})`);
    }
    if (
      eligibility.allowedBranches?.length > 0 &&
      !eligibility.allowedBranches.includes(profile.branch)
    ) {
      reasons.push(`Branch '${profile.branch}' is not eligible for this drive`);
    }
    if (profile.tenthPercentage < eligibility.minTenthPercentage) {
      reasons.push(`10th percentage below required ${eligibility.minTenthPercentage}%`);
    }
    if (profile.twelfthPercentage < eligibility.minTwelfthPercentage) {
      reasons.push(`12th percentage below required ${eligibility.minTwelfthPercentage}%`);
    }
    if (eligibility.eligibleBatch && eligibility.eligibleBatch !== profile.batch) {
      reasons.push(`Batch '${profile.batch}' does not match eligible batch '${eligibility.eligibleBatch}'`);
    }

    res.json({ eligible: reasons.length === 0, reasons });
  } catch (error) {
    res.status(500).json({ message: "Failed to check eligibility", error: error.message });
  }
};

// @desc    Get all students (admin/recruiter view, with optional filters)
// @route   GET /api/students
// @access  Private (admin, recruiter)
const getAllStudents = async (req, res) => {
  try {
    const { branch, minCgpa, isPlaced } = req.query;
    const filter = { role: "student" };

    if (branch) filter["studentProfile.branch"] = branch;
    if (minCgpa) filter["studentProfile.cgpa"] = { $gte: Number(minCgpa) };
    if (isPlaced !== undefined) filter["studentProfile.isPlaced"] = isPlaced === "true";

    const students = await User.find(filter).select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students", error: error.message });
  }
};

module.exports = { updateStudentProfile, checkEligibility, getAllStudents };
