const Drive = require("../models/Drive");
const Application = require("../models/Application");

// @desc    Create a new recruitment drive
// @route   POST /api/drives
// @access  Private (admin, recruiter)
const createDrive = async (req, res) => {
  try {
    const drive = await Drive.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(drive);
  } catch (error) {
    res.status(500).json({ message: "Failed to create drive", error: error.message });
  }
};

// @desc    Get all drives (with optional status filter)
// @route   GET /api/drives
// @access  Private
const getDrives = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const drives = await Drive.find(filter).sort({ driveDate: 1 });
    res.json(drives);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch drives", error: error.message });
  }
};

// @desc    Get a single drive by ID
// @route   GET /api/drives/:id
// @access  Private
const getDriveById = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) return res.status(404).json({ message: "Drive not found" });
    res.json(drive);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch drive", error: error.message });
  }
};

// @desc    Update a drive
// @route   PUT /api/drives/:id
// @access  Private (admin, recruiter)
const updateDrive = async (req, res) => {
  try {
    const drive = await Drive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!drive) return res.status(404).json({ message: "Drive not found" });
    res.json(drive);
  } catch (error) {
    res.status(500).json({ message: "Failed to update drive", error: error.message });
  }
};

// @desc    Delete a drive
// @route   DELETE /api/drives/:id
// @access  Private (admin)
const deleteDrive = async (req, res) => {
  try {
    const drive = await Drive.findByIdAndDelete(req.params.id);
    if (!drive) return res.status(404).json({ message: "Drive not found" });
    await Application.deleteMany({ drive: req.params.id });
    res.json({ message: "Drive removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete drive", error: error.message });
  }
};

// @desc    Get all applicants for a specific drive, grouped with round progress
// @route   GET /api/drives/:id/applicants
// @access  Private (admin, recruiter)
const getDriveApplicants = async (req, res) => {
  try {
    const applications = await Application.find({ drive: req.params.id })
      .populate("student", "name email studentProfile")
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applicants", error: error.message });
  }
};

module.exports = {
  createDrive,
  getDrives,
  getDriveById,
  updateDrive,
  deleteDrive,
  getDriveApplicants,
};
