const db = require("../config/db.config");
const Notification = require("../models/notification.model"); // Import Notification model

// Fetch all internships for admin
exports.getAllInternshipsForAdmin = async (req, res) => {
  try {
    const sql = `
      SELECT 
        i.*, 
        u.name AS company_name, 
        u.email AS company_email
      FROM Internships i
      LEFT JOIN Users u ON i.company_id = u.user_id
      ORDER BY 
        FIELD(i.is_approved, 'pending', 'approved', 'rejected'), 
        i.posted_at DESC;
    `;
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching internships for admin",
      error: error.message,
    });
  }
};

// Approve or reject an internship (and notify company)
exports.updateInternshipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" or "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Update internship status
    const sql = `UPDATE Internships SET is_approved = ? WHERE internship_id = ?`;
    await db.query(sql, [status, id]);

    // Fetch company details for notification
    const [rows] = await db.query(
      `SELECT i.title, u.user_id AS company_id, u.name AS company_name 
       FROM Internships i
       JOIN Users u ON i.company_id = u.user_id
       WHERE i.internship_id = ?`,
      [id]
    );

    if (rows.length > 0) {
      const { company_id, title, company_name } = rows[0];
      const message =
        status === "approved"
          ? `✅ Hi ${company_name}, your internship "${title}" has been approved by Admin.`
          : `❌ Hi ${company_name}, your internship "${title}" has been rejected by Admin.`;

      // Create notification for the company
      await Notification.create(company_id, message);
    }

    res.json({ message: `Internship ${status} successfully and company notified.` });
  } catch (error) {
    console.error("Error updating internship status:", error);
    res.status(500).json({
      message: "Error updating internship status",
      error: error.message,
    });
  }
};
