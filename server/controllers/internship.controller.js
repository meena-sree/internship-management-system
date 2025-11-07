const Internship = require("../models/internship.model");
const db = require("../config/db.config");

// Create internship (Company only)
exports.createInternship = async (req, res) => {
  try {
    const { title, description, duration, skills_required } = req.body;
    const company_id = req.user.id; // from JWT payload

    if (!title || !description || !duration || !skills_required) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save internship with "pending" status for admin approval
    const sql = `
      INSERT INTO Internships (title, description, duration, skills_required, company_id, is_approved)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;
    const [result] = await db.query(sql, [
      title,
      description,
      duration,
      skills_required,
      company_id,
    ]);

    res.status(201).json({
      message: "Internship submitted for admin approval.",
      internship_id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating internship",
      error: err.message,
    });
  }
};

// Get all approved internships (for students/public)
exports.getInternships = async (req, res) => {
  try {
    const sql = `
      SELECT i.*, u.name AS company_name
      FROM Internships i
      JOIN Users u ON i.company_id = u.user_id
      WHERE i.is_approved = 'approved'
      ORDER BY i.posted_at DESC
    `;
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching internships:", err.message); // 👈 add this for debugging

    res.status(500).json({
      message: "Error fetching internships",
      error: err.message,
    });
  }
};

// Get all internships posted by the logged-in company
exports.getCompanyInternships = async (req, res) => {
  try {
    const company_id = req.user.id;
    const sql = `
      SELECT internship_id, title, description, duration, skills_required, is_approved, created_at
      FROM Internships
      WHERE company_id = ?
      ORDER BY created_at DESC
    `;
    const [rows] = await db.query(sql, [company_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching company internships",
      error: err.message,
    });
  }
};

// Update internship (Company only + ownership check)
exports.updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, skills_required } = req.body;

    const [rows] = await db.query(`SELECT * FROM Internships WHERE internship_id = ?`, [id]);
    const internship = rows[0];

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    if (internship.company_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this internship" });
    }

    // Reset approval to pending when company edits
    const sql = `
      UPDATE Internships
      SET title = ?, description = ?, duration = ?, skills_required = ?, is_approved = 'pending'
      WHERE internship_id = ?
    `;
    await db.query(sql, [title, description, duration, skills_required, id]);

    res.json({
      message: "Internship updated successfully (awaiting admin re-approval)",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating internship",
      error: err.message,
    });
  }
};

// Delete internship (Company only + ownership check)
exports.deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`SELECT * FROM Internships WHERE internship_id = ?`, [id]);
    const internship = rows[0];

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    if (internship.company_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this internship" });
    }

    await db.query(`DELETE FROM Internships WHERE internship_id = ?`, [id]);
    res.json({ message: "Internship deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting internship",
      error: err.message,
    });
  }
};