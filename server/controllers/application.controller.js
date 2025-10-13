const Application = require("../models/application.model");
const Internship = require("../models/internship.model");
const Notification = require("../models/notification.model");
const Offer = require("../models/offer.model"); // ✅ import Offer model

// Student applies for internship
exports.apply = async (req, res) => {
  try {
    const { internship_id, resume } = req.body;
    const student_id = req.user.id; // from JWT

    if (!internship_id || !resume) {
      return res
        .status(400)
        .json({ message: "Internship ID and resume are required" });
    }

    // ✅ Check for existing application
    const existing = await Application.findExisting(student_id, internship_id);

    if (existing) {
      // ❌ Prevent reapply if already rejected or already applied
      return res
        .status(400)
        .json({ message: "You cannot reapply or apply multiple times." });
    }

    // ✅ First-time apply
    await Application.create(student_id, internship_id, resume);
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error applying for internship", error: err.message });
  }
};

// Get all applications of logged-in student
exports.getStudentApplications = async (req, res) => {
  try {
    const student_id = req.user.id;
    const apps = await Application.findByStudent(student_id);
    res.json(apps);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching applications", error: err.message });
  }
};

// Get all applications for company internships
exports.getCompanyApplications = async (req, res) => {
  try {
    const company_id = req.user.id;
    const apps = await Application.findByCompany(company_id);
    res.json(apps);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching applications", error: err.message });
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

    // Check ownership: does this company own the internship?
    const internship = await Internship.findById(app.internship_id);
    if (internship.company_id !== company_id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this application" });
    }

    // ✅ Update status in Applications table
    await Application.updateStatus(id, status);

    // ✅ If status is "offered", also insert into InternshipOffers table
    if (status === "offered") {
      await Offer.create(id); // create a row in InternshipOffers
    }

    // ✅ Add notification for student
    await Notification.create(
      app.student_id,
      `Your application status changed to ${status}`
    );

    res.json({ message: `Application status updated to ${status}` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating application", error: err.message });
  }
};
