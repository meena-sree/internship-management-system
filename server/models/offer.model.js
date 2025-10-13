// server/models/offer.model.js
const db = require("../config/db.config");

const Offer = {
  create: async (application_id) => {
    const sql = `INSERT INTO InternshipOffers (application_id, status, offered_at) VALUES (?, 'pending', NOW())`;
    const [result] = await db.query(sql, [application_id]);
    return result; // result.insertId available
  },

  findByStudent: async (student_id) => {
    const sql = `
      SELECT o.offer_id, o.status, o.offered_at, i.title AS internship_title, c.name AS company_name
      FROM InternshipOffers o
      JOIN Applications a ON o.application_id = a.application_id
      JOIN Internships i ON a.internship_id = i.internship_id
      JOIN Users c ON i.company_id = c.user_id
      WHERE a.student_id = ?
      ORDER BY o.offered_at DESC
    `;
    const [rows] = await db.query(sql, [student_id]);
    return rows;
  },

  findByCompany: async (company_id) => {
    const sql = `
      SELECT o.offer_id, o.status, o.offered_at, u.name AS student_name, i.title AS internship_title
      FROM InternshipOffers o
      JOIN Applications a ON o.application_id = a.application_id
      JOIN Internships i ON a.internship_id = i.internship_id
      JOIN Users u ON a.student_id = u.user_id
      WHERE i.company_id = ?
      ORDER BY o.offered_at DESC
    `;
    const [rows] = await db.query(sql, [company_id]);
    return rows;
  },

  updateStatus: async (id, status) => {
    const sql = `UPDATE InternshipOffers SET status = ? WHERE offer_id = ?`;
    const [result] = await db.query(sql, [status, id]);
    return result;
  }
};

module.exports = Offer;
