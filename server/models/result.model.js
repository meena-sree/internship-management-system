const db = require("../config/db.config");

const Result = {
  create: async (test_id, student_id, score) => {
    const sql = `INSERT INTO TestResults (test_id, student_id, score) 
                 VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [test_id, student_id, score]);
    return result;
  },

  findByStudent: async (student_id) => {
    const sql = `
      SELECT r.result_id, r.score, r.submitted_at, t.title
      FROM TestResults r
      JOIN Tests t ON r.test_id = t.test_id
      WHERE r.student_id = ?
      ORDER BY r.submitted_at DESC
    `;
    const [rows] = await db.query(sql, [student_id]);
    return rows;
  },

  findByCompany: async (company_id) => {
    const sql = `
      SELECT r.result_id, r.score, r.submitted_at, u.name AS student_name, t.title AS test_title
      FROM TestResults r
      JOIN Tests t ON r.test_id = t.test_id
      JOIN Internships i ON t.internship_id = i.internship_id
      JOIN Users u ON r.student_id = u.user_id
      WHERE i.company_id = ?
      ORDER BY r.submitted_at DESC
    `;
    const [rows] = await db.query(sql, [company_id]);
    return rows;
  }
};

module.exports = Result;
