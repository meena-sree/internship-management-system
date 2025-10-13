const express = require("express");
const router = express.Router();
const internshipController = require("../controllers/internship.controller");
const { verifyToken, isCompany } = require("../middleware/auth.middleware");

// Public
router.get("/", internshipController.getInternships);

// Company-only
router.post("/", verifyToken, isCompany, internshipController.createInternship);
router.put("/:id", verifyToken, isCompany, internshipController.updateInternship);
router.delete("/:id", verifyToken, isCompany, internshipController.deleteInternship);

module.exports = router;
