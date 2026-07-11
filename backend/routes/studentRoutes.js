const express = require("express");
const router = express.Router();
const {
  updateStudentProfile,
  checkEligibility,
  getAllStudents,
} = require("../controllers/studentController");
const { protect, authorize } = require("../middleware/auth");

router.put("/profile", protect, authorize("student"), updateStudentProfile);
router.get("/eligibility/:driveId", protect, authorize("student"), checkEligibility);
router.get("/", protect, authorize("admin", "recruiter"), getAllStudents);

module.exports = router;
