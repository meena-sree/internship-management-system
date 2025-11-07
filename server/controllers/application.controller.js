const path = require("path");
const fs = require("fs");
const multer = require("multer");

const Application = require("../models/application.model");
const Internship = require("../models/internship.model");
const Notification = require("../models/notification.model");
const Offer = require("../models/offer.model");

// Multer setup for resume uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/resumes");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
    }
    cb(null, true);
  },
}).single("resume"); // field name from frontend

// Student applies for internship
exports.apply = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { internship_id } = req.body;
      const student_id = req.user.id;

      if (!internship_id || !req.file) {
        return res
          .status(400)
          .json({ message: "Internship ID and resume file are required" });
      }

      const resumePath = `/uploads/resumes/${req.file.filename}`;

      // Check for existing application
      const existing = await Application.findExisting(student_id, internship_id);
      if (existing) {
        return res
          .status(400)
          .json({ message: "You cannot reapply or apply multiple times." });
      }

      // Save new application
      await Application.create(student_id, internship_id, resumePath);

      res.status(201).json({
        message: "Application submitted successfully",
        resume: resumePath,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error applying for internship",
        error: error.message,
      });
    }
  });
};

// Get all applications of logged-in student
exports.getStudentApplications = async (req, res) => {
  try {
    const student_id = req.user.id;
    const apps = await Application.findByStudent(student_id);
    res.json(apps);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching applications",
      error: err.message,
    });
  }
};

// Get all applications for company internships
exports.getCompanyApplications = async (req, res) => {
  try {
    const company_id = req.user.id;
    const apps = await Application.findByCompany(company_id);
    res.json(apps);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching applications",
      error: err.message,
    });
  }
};

// Update application status (Company only)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const company_id = req.user.id;

    const app = await Application.findById(id);
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check ownership
    const internship = await Internship.findById(app.internship_id);
    if (internship.company_id !== company_id) {
      return res.status(403).json({ message: "Unauthorized to update this application" });
    }

    await Application.updateStatus(id, status);

    // If "offered" → create offer record
    if (status === "offered") {
      await Offer.create(id);
    }

    // Add notification
    await Notification.create(
      app.student_id,
      `Your application status changed to ${status}`
    );

    res.json({ message: `Application status updated to ${status}` });
  } catch (err) {
    res.status(500).json({
      message: "Error updating application",
      error: err.message,
    });
  }
};
