const express = require("express");
const router = express.Router();
const {
  applyToDrive,
  getMyApplications,
  updateRoundStatus,
  withdrawApplication,
} = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, authorize("student"), applyToDrive);
router.get("/my", protect, authorize("student"), getMyApplications);
router.put("/:id/round", protect, authorize("admin", "recruiter"), updateRoundStatus);
router.put("/:id/withdraw", protect, authorize("student"), withdrawApplication);

module.exports = router;
