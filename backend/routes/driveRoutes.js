const express = require("express");
const router = express.Router();
const {
  createDrive,
  getDrives,
  getDriveById,
  updateDrive,
  deleteDrive,
  getDriveApplicants,
} = require("../controllers/driveController");
const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, authorize("admin", "recruiter"), createDrive);
router.get("/", protect, getDrives);
router.get("/:id", protect, getDriveById);
router.put("/:id", protect, authorize("admin", "recruiter"), updateDrive);
router.delete("/:id", protect, authorize("admin"), deleteDrive);
router.get("/:id/applicants", protect, authorize("admin", "recruiter"), getDriveApplicants);

module.exports = router;
