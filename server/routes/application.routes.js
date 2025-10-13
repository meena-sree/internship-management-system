const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/application.controller");
const { verifyToken, isStudent, isCompany } = require("../middleware/auth.middleware");

// Student applies
router.post("/", verifyToken, isStudent, applicationController.apply);

// Student views own applications
router.get("/student", verifyToken, isStudent, applicationController.getStudentApplications);

// Company views applications for their internships
router.get("/company", verifyToken, isCompany, applicationController.getCompanyApplications);

// Company updates status
router.put("/:id", verifyToken, isCompany, applicationController.updateStatus);

module.exports = router;
