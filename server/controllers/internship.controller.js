const Internship = require("../models/internship.model");

// Create internship (Company only)
exports.createInternship = async (req, res) => {
  try {
    const { title, description, duration, skills_required } = req.body;
    const company_id = req.user.id; // from JWT payload

    if (!title || !description || !duration || !skills_required) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const result = await Internship.create(title, description, duration, skills_required, company_id);
    const internship_id = result.insertId;

    res.status(201).json({
      message: "Internship created successfully",
      internship_id, //  return this
    });
    } catch (err) {
    res.status(500).json({ message: "Error creating internship", error: err.message });
  }
};

// Get all internships (Public)
exports.getInternships = async (req, res) => {
  try {
    const internships = await Internship.findAll();
    res.json(internships);
  } catch (err) {
    res.status(500).json({ message: "Error fetching internships", error: err.message });
  }
};

// Update internship (Company only + ownership check)
exports.updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, skills_required } = req.body;
    const internship = await Internship.findById(id);

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }
    if (internship.company_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this internship" });
    }

    await Internship.update(id, title, description, duration, skills_required);
    res.json({ message: "Internship updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating internship", error: err.message });
  }
};

// Delete internship (Company only + ownership check)
exports.deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const internship = await Internship.findById(id);

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }
    if (internship.company_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this internship" });
    }

    await Internship.delete(id);
    res.json({ message: "Internship deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting internship", error: err.message });
  }
};
