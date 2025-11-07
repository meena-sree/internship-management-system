const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

// Get all pending internships
router.get("/internships", verifyToken, isAdmin, adminController.getAllInternshipsForAdmin);

// Approve or reject internship
router.put("/internships/:id/status", verifyToken, isAdmin, adminController.updateInternshipStatus);

module.exports = router;
