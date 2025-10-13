const express = require("express");
const router = express.Router();
const testController = require("../controllers/test.controller");
const { verifyToken, isCompany, isStudent } = require("../middleware/auth.middleware");

// Company creates a test
router.post("/", verifyToken, isCompany, testController.createTest);

// Student fetches test for internship
router.get("/:internship_id", verifyToken, isStudent, testController.getTestByInternship);

// Student submits answers
router.post("/submit", verifyToken, isStudent, testController.submitTest);

// Student view results
router.get("/results/student", verifyToken, isStudent, testController.getStudentResults);

// Company view results
router.get("/results/company", verifyToken, isCompany, testController.getCompanyResults);

module.exports = router;
