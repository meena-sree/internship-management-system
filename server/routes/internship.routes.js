const express = require("express");
const router = express.Router();
const internshipController = require("../controllers/internship.controller");
const { verifyToken, isCompany } = require("../middleware/auth.middleware");

// Public/Student - Get only approved internships
router.get("/", internshipController.getInternships);

// Company - Create a new internship (auto-marked pending)
router.post("/", verifyToken, isCompany, internshipController.createInternship);

// Company - View all own internships (with approval status)
router.get("/company", verifyToken, isCompany, internshipController.getCompanyInternships);

// Company - Update internship (resets to pending)
router.put("/:id", verifyToken, isCompany, internshipController.updateInternship);

// Company - Delete internship
router.delete("/:id", verifyToken, isCompany, internshipController.deleteInternship);

module.exports = router;
