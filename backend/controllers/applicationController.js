const Application = require("../models/Application");
const Drive = require("../models/Drive");
const User = require("../models/User");

// @desc    Student applies to a drive (with eligibility + deadline enforcement)
// @route   POST /api/applications
// @access  Private (student)
const applyToDrive = async (req, res) => {
  try {
    const { driveId } = req.body;
    const drive = await Drive.findById(driveId);
    if (!drive) return res.status(404).json({ message: "Drive not found" });

    if (new Date() > new Date(drive.applicationDeadline)) {
      return res.status(400).json({ message: "Application deadline has passed" });
    }

    const alreadyApplied = await Application.findOne({ student: req.user._id, drive: driveId });
    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied to this drive" });
    }

    // Server-side eligibility enforcement
    const { eligibility } = drive;
    const profile = req.user.studentProfile || {};
    const reasons = [];

    if (profile.cgpa < eligibility.minCgpa) reasons.push("CGPA below requirement");
    if (profile.backlogs > eligibility.maxBacklogs) reasons.push("Too many backlogs");
    if (
      eligibility.allowedBranches?.length > 0 &&
      !eligibility.allowedBranches.includes(profile.branch)
    ) {
      reasons.push("Branch not eligible");
    }

    if (reasons.length > 0) {
      return res.status(403).json({ message: "You are not eligible for this drive", reasons });
    }

    const roundResults = drive.rounds
      .sort((a, b) => a.order - b.order)
      .map((r) => ({ roundId: r._id, roundName: r.name, status: "pending" }));

    const application = await Application.create({
      student: req.user._id,
      drive: driveId,
      roundResults,
    });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already applied to this drive" });
    }
    res.status(500).json({ message: "Failed to submit application", error: error.message });
  }
};

// @desc    Get logged-in student's own applications
// @route   GET /api/applications/my
// @access  Private (student)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate("drive")
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications", error: error.message });
  }
};

// @desc    Update a specific round's result for an application (admin/recruiter moves candidate forward)
// @route   PUT /api/applications/:id/round
// @access  Private (admin, recruiter)
const updateRoundStatus = async (req, res) => {
  try {
    const { roundId, status, remarks } = req.body; // status: cleared | rejected | pending
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    const round = application.roundResults.find((r) => r.roundId.toString() === roundId);
    if (!round) return res.status(404).json({ message: "Round not found on this application" });

    round.status = status;
    round.remarks = remarks || "";
    round.updatedAt = new Date();

    // Derive overall status
    if (status === "rejected") {
      application.overallStatus = "rejected";
    } else if (application.roundResults.every((r) => r.status === "cleared")) {
      application.overallStatus = "selected";
      await User.findByIdAndUpdate(application.student, {
        "studentProfile.isPlaced": true,
      });
    } else if (application.roundResults.some((r) => r.status === "cleared")) {
      application.overallStatus = "in-progress";
    }

    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Failed to update round status", error: error.message });
  }
};

// @desc    Student withdraws their application
// @route   PUT /api/applications/:id/withdraw
// @access  Private (student)
const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, student: req.user._id });
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.overallStatus = "withdrawn";
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Failed to withdraw application", error: error.message });
  }
};

module.exports = { applyToDrive, getMyApplications, updateRoundStatus, withdrawApplication };
